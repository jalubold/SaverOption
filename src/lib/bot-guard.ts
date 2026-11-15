/**
 * Recognizes requests from automation rather than people: crawlers, headless browsers, scraping
 * libraries and HTTP clients. Used to keep them off routes that cost real work on every request
 * (the filtered /stats views and their breakdown API) and out of click counts.
 *
 * It only reads the User-Agent, which a determined scraper can fake; the rate limits in
 * rate-limit.ts and Vercel's Bot Protection firewall rule cover those. Real browsers never match:
 * their User-Agent names the browser (Chrome, Safari, Firefox, Edge…) and none of these words.
 */
// "bot" only as a name ending ("Googlebot/2.1", "Slackbot-LinkExpanding", "TelegramBot (…"), and not
// the Cubot phone brand that appears in some Android User-Agents.
const AUTOMATED_AGENT =
  /(?<!cu)bot(?:[/\-_;)\s]|$)|crawl|spider|slurp|scrap|headless|phantomjs|selenium|webdriver|puppeteer|playwright|python|curl\/|wget|httpclient|http-client|okhttp|go-http|java\/|axios|node-fetch|undici|libwww|httpx|aiohttp|feedfetcher|lighthouse|preview|monitor|uptime|pingdom|zgrab|masscan|nmap/i;

export function isAutomatedAgent(userAgent: string | null | undefined): boolean {
  return !userAgent || userAgent.length < 10 || AUTOMATED_AGENT.test(userAgent);
}
