// Unit tests for recognizing automated requests and the request limits. Run: npm test
import assert from "node:assert/strict";
import { test } from "node:test";
import { isAutomatedAgent } from "./bot-guard.ts";

const people = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0",
  "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 11; CUBOT X30 Build/RP1A.200720.011) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
  // The Mac app's own User-Agent (desktop/src-tauri/src/lib.rs).
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) SaverOptionBusinessDesktop/0.2.2",
];

const automated = [
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
  "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)",
  "Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)",
  "Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)",
  "TelegramBot (like TwitterBot)",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/130.0.0.0 Safari/537.36",
  "python-requests/2.32.3",
  "curl/8.7.1",
  "Go-http-client/2.0",
  "axios/1.7.7",
  "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)",
  "Scrapy/2.11.2 (+https://scrapy.org)",
  "",
];

test("real browsers (desktop, phones, the Mac app) are not treated as automation", () => {
  for (const ua of people) assert.equal(isAutomatedAgent(ua), false, ua);
});

test("crawlers, headless browsers, scraping libraries and empty User-Agents are", () => {
  for (const ua of automated) assert.equal(isAutomatedAgent(ua), true, ua);
  assert.equal(isAutomatedAgent(null), true);
  assert.equal(isAutomatedAgent(undefined), true);
});
