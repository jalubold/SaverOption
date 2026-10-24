import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { can } from "@/lib/business/permissions";
import type { Role } from "@/lib/business/constants";
import type { Db } from "@/lib/server/business/context";
import { db } from "@/lib/server/db";

/**
 * The OAuth 2.1 authorization server behind the remote MCP endpoint
 * (MCP authorization spec, 2025-06-18 / 2025-11-25):
 *
 * - discovery: protected resource metadata (RFC 9728) and authorization
 *   server metadata (RFC 8414);
 * - clients register themselves (RFC 7591); most are public clients;
 * - authorization code flow with PKCE S256 only; the person signs in with the
 *   site's existing Google sign-in, picks one workspace and the access level;
 * - opaque access tokens (1 hour) and rotating refresh tokens (30 days), stored
 *   only as SHA-256 hashes; reusing a spent refresh token revokes the
 *   connection; revocation (RFC 7009) and disconnecting from Settings end
 *   every token at once.
 */

export const SCOPE_READ = "business.read";
export const SCOPE_WRITE = "business.write";
export const OFFLINE = "offline_access";
export const SUPPORTED_SCOPES = [SCOPE_READ, SCOPE_WRITE] as const;
export const ACCESS_TOKEN_TTL = 60 * 60;
export const REFRESH_TOKEN_TTL = 30 * 24 * 60 * 60;
const CODE_TTL = 10 * 60;

export class OAuthError extends Error {
  constructor(
    readonly error: "invalid_request" | "invalid_client" | "invalid_grant" | "unauthorized_client" | "unsupported_grant_type" | "invalid_scope" | "invalid_client_metadata" | "invalid_redirect_uri" | "access_denied" | "server_error" | "temporarily_unavailable",
    readonly description: string,
    readonly status = 400,
  ) {
    super(description);
  }
}

export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function token(prefix: string): string {
  return `${prefix}_${randomBytes(32).toString("base64url")}`;
}

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

// ─── URLs and discovery ──────────────────────────────────────────────────────

export interface ServerUrls {
  origin: string;
  issuer: string;
  mcp: string;
  resourceMetadata: string;
}

/** URLs for the host the request came in on (production, preview or local). */
export function serverUrls(requestUrl: string): ServerUrls {
  const u = new URL(requestUrl);
  const local = u.hostname === "localhost" || u.hostname === "127.0.0.1";
  const origin = `${local ? u.protocol : "https:"}//${u.host}`;
  return { origin, issuer: origin, mcp: `${origin}/mcp`, resourceMetadata: `${origin}/.well-known/oauth-protected-resource/mcp` };
}

export function protectedResourceMetadata(urls: ServerUrls) {
  return {
    resource: urls.mcp,
    authorization_servers: [urls.issuer],
    scopes_supported: [...SUPPORTED_SCOPES],
    bearer_methods_supported: ["header"],
    resource_name: "Saver Option Business",
    resource_documentation: `${urls.origin}/business/docs/mcp`,
  };
}

export function authorizationServerMetadata(urls: ServerUrls) {
  return {
    issuer: urls.issuer,
    authorization_endpoint: `${urls.origin}/business/oauth/authorize`,
    token_endpoint: `${urls.origin}/oauth/token`,
    registration_endpoint: `${urls.origin}/oauth/register`,
    revocation_endpoint: `${urls.origin}/oauth/revoke`,
    scopes_supported: [...SUPPORTED_SCOPES, OFFLINE],
    response_types_supported: ["code"],
    response_modes_supported: ["query"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    token_endpoint_auth_methods_supported: ["none", "client_secret_post", "client_secret_basic"],
    revocation_endpoint_auth_methods_supported: ["none", "client_secret_post", "client_secret_basic"],
    code_challenge_methods_supported: ["S256"],
    authorization_response_iss_parameter_supported: true,
    service_documentation: `${urls.origin}/business/docs/mcp`,
  };
}

// ─── Clients (RFC 7591) ──────────────────────────────────────────────────────

export interface OAuthClient {
  id: string;
  name: string | null;
  clientUri: string | null;
  redirectUris: string[];
  authMethod: "none" | "client_secret_post" | "client_secret_basic";
  secretHash: string | null;
}

const LOOPBACK = new Set(["localhost", "127.0.0.1", "[::1]"]);

function cleanText(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const s = v.replace(/[\u0000-\u001f\u007f]/g, "").trim();
  return s ? s.slice(0, max) : null;
}

/** Redirect URIs must be HTTPS, or HTTP on a loopback address (native apps, RFC 8252). */
export function validRedirectUri(raw: unknown): string | null {
  if (typeof raw !== "string" || raw.length > 500) return null;
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  if (u.hash || u.username || u.password) return null;
  if (u.protocol === "https:" || (u.protocol === "http:" && LOOPBACK.has(u.hostname))) return raw;
  return null;
}

export function isLoopback(uri: string): boolean {
  try {
    return LOOPBACK.has(new URL(uri).hostname);
  } catch {
    return false;
  }
}

/** Exact match, except that loopback redirects match on any port (RFC 8252 §7.3), with localhost and 127.0.0.1 treated alike. */
export function redirectMatches(registered: string[], requested: string): boolean {
  if (registered.includes(requested)) return true;
  let r: URL;
  try {
    r = new URL(requested);
  } catch {
    return false;
  }
  if (r.protocol !== "http:" || !LOOPBACK.has(r.hostname)) return false;
  const loop = (h: string) => (h === "localhost" || h === "127.0.0.1" ? "loopback" : h);
  return registered.some((reg) => {
    try {
      const g = new URL(reg);
      return g.protocol === "http:" && loop(g.hostname) === loop(r.hostname) && g.pathname === r.pathname && g.search === r.search;
    } catch {
      return false;
    }
  });
}

export async function registerClient(body: unknown): Promise<Record<string, unknown>> {
  if (typeof body !== "object" || body === null || Array.isArray(body)) throw new OAuthError("invalid_client_metadata", "The registration request must be a JSON object.");
  const b = body as Record<string, unknown>;
  const uris = Array.isArray(b.redirect_uris) ? b.redirect_uris : [];
  if (uris.length === 0 || uris.length > 10) throw new OAuthError("invalid_redirect_uri", "Provide between 1 and 10 redirect_uris.");
  const redirectUris = uris.map(validRedirectUri);
  if (redirectUris.some((u) => !u)) throw new OAuthError("invalid_redirect_uri", "Redirect URIs must use HTTPS, or HTTP on localhost/127.0.0.1, and have no fragment.");
  const grantTypes = Array.isArray(b.grant_types) ? b.grant_types : ["authorization_code", "refresh_token"];
  if (!grantTypes.includes("authorization_code") || grantTypes.some((g) => g !== "authorization_code" && g !== "refresh_token"))
    throw new OAuthError("invalid_client_metadata", "Only the authorization_code and refresh_token grant types are supported.");
  const responseTypes = Array.isArray(b.response_types) ? b.response_types : ["code"];
  if (responseTypes.length !== 1 || responseTypes[0] !== "code") throw new OAuthError("invalid_client_metadata", 'Only response_type "code" is supported.');
  const method = (b.token_endpoint_auth_method ?? "none") as string;
  if (method !== "none" && method !== "client_secret_post" && method !== "client_secret_basic")
    throw new OAuthError("invalid_client_metadata", "token_endpoint_auth_method must be none, client_secret_post or client_secret_basic.");
  const clientUri = typeof b.client_uri === "string" && /^https:\/\//.test(b.client_uri) ? cleanText(b.client_uri, 500) : null;
  const id = token("soc").slice(0, 60);
  const secret = method === "none" ? null : token("socs");
  await db()`
    insert into biz_oauth_clients (id, client_name, client_uri, redirect_uris, token_endpoint_auth_method, client_secret_hash, software_id, software_version)
    values (${id}, ${cleanText(b.client_name, 200)}, ${clientUri}, ${redirectUris as string[]}, ${method}, ${secret ? sha256(secret) : null},
      ${cleanText(b.software_id, 200)}, ${cleanText(b.software_version, 100)})`;
  return {
    client_id: id,
    client_id_issued_at: Math.floor(Date.now() / 1000),
    ...(secret ? { client_secret: secret, client_secret_expires_at: 0 } : {}),
    client_name: cleanText(b.client_name, 200) ?? undefined,
    redirect_uris: redirectUris,
    grant_types: ["authorization_code", "refresh_token"],
    response_types: ["code"],
    token_endpoint_auth_method: method,
  };
}

export async function getClient(id: unknown): Promise<OAuthClient | null> {
  if (typeof id !== "string" || id.length < 16 || id.length > 80) return null;
  const [r] = await db()`select * from biz_oauth_clients where id = ${id}`;
  return r
    ? { id: r.id, name: r.client_name, clientUri: r.client_uri, redirectUris: r.redirect_uris, authMethod: r.token_endpoint_auth_method, secretHash: r.client_secret_hash }
    : null;
}

/** Client authentication at the token and revocation endpoints. */
export async function authenticateClient(form: URLSearchParams, authorization: string | null): Promise<OAuthClient> {
  let id = form.get("client_id");
  let secret = form.get("client_secret");
  if (authorization?.startsWith("Basic ")) {
    const [u, p] = Buffer.from(authorization.slice(6), "base64").toString().split(":");
    id = decodeURIComponent(u ?? "");
    secret = decodeURIComponent(p ?? "");
  }
  const client = await getClient(id);
  if (!client) throw new OAuthError("invalid_client", "Unknown client. Register again.", 401);
  if (client.authMethod !== "none") {
    if (!secret || !client.secretHash || !safeEqual(sha256(secret), client.secretHash)) throw new OAuthError("invalid_client", "Client authentication failed.", 401);
  }
  return client;
}

// ─── Authorization requests ──────────────────────────────────────────────────

export interface AuthRequest {
  clientId: string;
  redirectUri: string;
  state: string | null;
  codeChallenge: string;
  scopes: string[];
  resource: string | null;
}

export type ParsedAuthRequest =
  | { ok: true; req: AuthRequest; client: OAuthClient }
  // Errors before the redirect URI is trusted are shown on our page, never redirected.
  | { ok: false; redirect: null; message: string }
  | { ok: false; redirect: string; message: string };

export function withParams(uri: string, params: Record<string, string | null | undefined>): string {
  const u = new URL(uri);
  for (const [k, v] of Object.entries(params)) if (v) u.searchParams.set(k, v);
  return u.toString();
}

export async function parseAuthRequest(p: URLSearchParams | Record<string, string | null>, urls: ServerUrls): Promise<ParsedAuthRequest> {
  const get = (k: string) => (p instanceof URLSearchParams ? p.get(k) : (p[k] ?? null));
  const client = await getClient(get("client_id"));
  if (!client) return { ok: false, redirect: null, message: "This app isn't registered with Saver Option, or its registration has been removed. Try connecting again from the app." };
  const redirectUri = get("redirect_uri") ?? (client.redirectUris.length === 1 ? client.redirectUris[0] : null);
  if (!redirectUri || !redirectMatches(client.redirectUris, redirectUri)) return { ok: false, redirect: null, message: "The app asked to return to an address it didn't register, so the request was stopped." };
  const state = get("state");
  const fail = (error: string, description: string) => ({ ok: false as const, redirect: withParams(redirectUri, { error, error_description: description, state, iss: urls.issuer }), message: description });
  if (get("response_type") !== "code") return fail("unsupported_response_type", 'Only response_type "code" is supported.');
  const challenge = get("code_challenge");
  if (!challenge || get("code_challenge_method") !== "S256" || !/^[A-Za-z0-9\-._~]{43,128}$/.test(challenge)) return fail("invalid_request", "PKCE with code_challenge_method S256 is required.");
  const resource = get("resource");
  if (resource && resource.replace(/\/$/, "") !== urls.mcp) return fail("invalid_target", `This server only issues tokens for ${urls.mcp}.`);
  const requested = (get("scope") ?? "").split(/\s+/).filter(Boolean);
  const unknown = requested.filter((s) => s !== OFFLINE && !(SUPPORTED_SCOPES as readonly string[]).includes(s));
  if (unknown.length) return fail("invalid_scope", `Unknown scope: ${unknown.join(" ")}.`);
  const scopes = requested.filter((s) => s !== OFFLINE);
  return { ok: true, client, req: { clientId: client.id, redirectUri, state, codeChallenge: challenge, scopes: scopes.length ? scopes : [SCOPE_READ], resource } };
}

/**
 * The person approved: records the connection (one per person, workspace and
 * client — reconnecting updates it) and returns the redirect with a one-time code.
 */
export async function approveAuthRequest(user: { id: string }, workspaceId: string, role: Role, req: AuthRequest, allowWrite: boolean, urls: ServerUrls): Promise<string> {
  const scopes = [SCOPE_READ, ...(allowWrite && req.scopes.includes(SCOPE_WRITE) && can(role, "records.manage") ? [SCOPE_WRITE] : [])];
  const code = token("soac");
  await db().begin(async (sql) => {
    const [existing] = await sql`
      select id from biz_oauth_grants where user_id = ${user.id} and workspace_id = ${workspaceId} and client_id = ${req.clientId} and revoked_at is null`;
    let grantId: string;
    if (existing) {
      grantId = existing.id;
      await sql`update biz_oauth_grants set scopes = ${scopes} where id = ${grantId}`;
    } else {
      const [created] = await sql`insert into biz_oauth_grants (workspace_id, user_id, client_id, scopes) values (${workspaceId}, ${user.id}, ${req.clientId}, ${scopes}) returning id`;
      grantId = created.id;
    }
    await sql`
      insert into biz_oauth_codes (code_hash, grant_id, redirect_uri, code_challenge, resource, expires_at)
      values (${sha256(code)}, ${grantId}, ${req.redirectUri}, ${req.codeChallenge}, ${req.resource}, now() + make_interval(secs => ${CODE_TTL}))`;
  });
  return withParams(req.redirectUri, { code, state: req.state, iss: urls.issuer });
}

// ─── Tokens ──────────────────────────────────────────────────────────────────

export interface TokenResponse {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
  refresh_token: string;
  scope: string;
}

async function issueTokens(sql: Db, grantId: string, scopes: string[]): Promise<TokenResponse> {
  const access = token("soat");
  const refresh = token("sort");
  await sql`
    insert into biz_oauth_tokens (token_hash, grant_id, kind, expires_at) values
      (${sha256(access)}, ${grantId}, 'access', now() + make_interval(secs => ${ACCESS_TOKEN_TTL})),
      (${sha256(refresh)}, ${grantId}, 'refresh', now() + make_interval(secs => ${REFRESH_TOKEN_TTL}))`;
  return { access_token: access, token_type: "Bearer", expires_in: ACCESS_TOKEN_TTL, refresh_token: refresh, scope: scopes.join(" ") };
}

function pkceMatches(verifier: string, challenge: string): boolean {
  if (!/^[A-Za-z0-9\-._~]{43,128}$/.test(verifier)) return false;
  return safeEqual(createHash("sha256").update(verifier).digest("base64url"), challenge);
}

export async function exchangeCode(client: OAuthClient, form: URLSearchParams, urls: ServerUrls): Promise<TokenResponse> {
  const code = form.get("code");
  const verifier = form.get("code_verifier");
  if (!code || !verifier) throw new OAuthError("invalid_request", "code and code_verifier are required.");
  let replayedGrant: string | null = null;
  const result = await db().begin(async (sql) => {
    const [row] = await sql`
      select c.*, g.client_id, g.scopes, g.revoked_at as grant_revoked
      from biz_oauth_codes c join biz_oauth_grants g on g.id = c.grant_id
      where c.code_hash = ${sha256(code)} for update of c`;
    if (!row) throw new OAuthError("invalid_grant", "The authorization code is invalid.");
    if (row.used_at) {
      replayedGrant = row.grant_id;
      return null;
    }
    if (row.client_id !== client.id) throw new OAuthError("invalid_grant", "The code was issued to another client.");
    if (new Date(row.expires_at).getTime() < Date.now()) throw new OAuthError("invalid_grant", "The authorization code has expired.");
    if (row.grant_revoked) throw new OAuthError("invalid_grant", "This connection was revoked.");
    const redirectUri = form.get("redirect_uri");
    if (redirectUri && redirectUri !== row.redirect_uri) throw new OAuthError("invalid_grant", "redirect_uri doesn't match the authorization request.");
    if (!pkceMatches(verifier, row.code_challenge)) throw new OAuthError("invalid_grant", "PKCE verification failed.");
    const resource = form.get("resource");
    if (resource && resource.replace(/\/$/, "") !== urls.mcp) throw new OAuthError("invalid_grant", `Tokens are only issued for ${urls.mcp}.`);
    await sql`update biz_oauth_codes set used_at = now() where code_hash = ${row.code_hash}`;
    await sql`update biz_oauth_clients set last_used_at = now() where id = ${client.id}`;
    return issueTokens(sql, row.grant_id, row.scopes);
  });
  if (replayedGrant) {
    // A replayed code: revoke everything issued from this connection (outside the
    // transaction above, so the revocation isn't rolled back with the error).
    await revokeGrantById(replayedGrant);
    throw new OAuthError("invalid_grant", "The authorization code was already used.");
  }
  return result!;
}

export async function refreshTokens(client: OAuthClient, form: URLSearchParams): Promise<TokenResponse> {
  const refresh = form.get("refresh_token");
  if (!refresh) throw new OAuthError("invalid_request", "refresh_token is required.");
  let reusedGrant: string | null = null;
  const result = await db().begin(async (sql) => {
    const [row] = await sql`
      select t.*, g.client_id, g.scopes, g.revoked_at as grant_revoked
      from biz_oauth_tokens t join biz_oauth_grants g on g.id = t.grant_id
      where t.token_hash = ${sha256(refresh)} and t.kind = 'refresh' for update of t`;
    if (!row || row.client_id !== client.id) throw new OAuthError("invalid_grant", "The refresh token is invalid.");
    if (row.used_at) {
      reusedGrant = row.grant_id;
      return null;
    }
    if (row.revoked_at || row.grant_revoked) throw new OAuthError("invalid_grant", "This connection was revoked.");
    if (new Date(row.expires_at).getTime() < Date.now()) throw new OAuthError("invalid_grant", "The refresh token has expired.");
    const requested = (form.get("scope") ?? "").split(/\s+/).filter((s) => s && s !== OFFLINE);
    if (requested.some((s) => !row.scopes.includes(s))) throw new OAuthError("invalid_scope", "A refresh can't add scopes the connection doesn't have.");
    await sql`update biz_oauth_tokens set used_at = now() where token_hash = ${row.token_hash}`;
    return issueTokens(sql, row.grant_id, requested.length ? requested : row.scopes);
  });
  if (reusedGrant) {
    // Refresh tokens rotate; presenting a spent one means it may have leaked.
    await revokeGrantById(reusedGrant);
    throw new OAuthError("invalid_grant", "The refresh token was already used. The connection has been revoked; connect again.");
  }
  return result!;
}

/** RFC 7009: revoking either token ends the whole connection. Unknown tokens are not an error. */
export async function revokeToken(client: OAuthClient, value: string): Promise<void> {
  const [row] = await db()`
    select t.grant_id from biz_oauth_tokens t join biz_oauth_grants g on g.id = t.grant_id
    where t.token_hash = ${sha256(value)} and g.client_id = ${client.id}`;
  if (row) await revokeGrantById(row.grant_id);
}

export async function revokeGrantById(grantId: string): Promise<void> {
  await db().begin(async (sql) => {
    await sql`update biz_oauth_grants set revoked_at = now() where id = ${grantId} and revoked_at is null`;
    await sql`update biz_oauth_tokens set revoked_at = now() where grant_id = ${grantId} and revoked_at is null`;
  });
}

export interface VerifiedToken {
  grantId: string;
  workspaceId: string;
  userId: string;
  clientId: string;
  clientName: string | null;
  scopes: string[];
  lastUsedAt: Date | null;
}

export async function verifyAccessToken(value: string): Promise<VerifiedToken | null> {
  if (!/^soat_[A-Za-z0-9_-]{43}$/.test(value)) return null;
  const [r] = await db()`
    select g.id, g.workspace_id, g.user_id, g.client_id, g.scopes, g.last_used_at, c.client_name
    from biz_oauth_tokens t
    join biz_oauth_grants g on g.id = t.grant_id
    join biz_oauth_clients c on c.id = g.client_id
    where t.token_hash = ${sha256(value)} and t.kind = 'access' and t.revoked_at is null and t.expires_at > now() and g.revoked_at is null`;
  return r ? { grantId: r.id, workspaceId: r.workspace_id, userId: r.user_id, clientId: r.client_id, clientName: r.client_name, scopes: r.scopes, lastUsedAt: r.last_used_at } : null;
}

/** Records use at most every few minutes, so busy connections don't write on every call. */
export async function touchGrant(t: VerifiedToken): Promise<void> {
  if (t.lastUsedAt && Date.now() - new Date(t.lastUsedAt).getTime() < 5 * 60_000) return;
  await db()`update biz_oauth_grants set last_used_at = now() where id = ${t.grantId}`;
}
