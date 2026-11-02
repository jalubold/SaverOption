/** A personal invite link: it tells the person which workspace and which Google account to use. */
export function inviteLink(origin: string, invitationId: string): string {
  return `${origin}/business/invite/${invitationId}`;
}

/** The ready-to-send message for an invite (the inviter sends it; Saver Option emails nothing). */
export function inviteMessage(workspace: string, email: string, url: string): string {
  return `Hi! I've given you access to ${workspace} on Saver Option Business.\n\n1. Open this link: ${url}\n2. Continue with Google using ${email}\n3. Choose "Join ${workspace}"`;
}
