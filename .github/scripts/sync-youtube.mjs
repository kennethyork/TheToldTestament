// Fetches the channel's public YouTube feed and writes youtube.js for the site.
// Run by .github/workflows/sync-youtube.yml; no API key or dependencies needed.
import { readFile, writeFile } from "node:fs/promises";

const CHANNEL_ID = "UCKJ9LH-IV7vbEclaivsVSSQ";
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const OUTPUT = new URL("../../youtube.js", import.meta.url);
const HEADER =
  "// Generated automatically from the YouTube channel. Don't edit by hand; edit videos.js instead.\n";

function decode(text) {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function tag(xml, name) {
  const match = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return match ? decode(match[1]).trim() : "";
}

// Splits a YouTube description into its summary text and "0:00 Chapter name" lines.
function parseDescription(text) {
  const lines = text.split(/\r?\n/);
  const chapters = [];
  const summary = [];
  for (const line of lines) {
    const chapter = line.trim().match(/^((?:\d+:)?\d{1,2}:\d{2})\s*[-–—:]?\s+(.+)$/);
    if (chapter) chapters.push([chapter[1], chapter[2].trim()]);
    else if (!chapters.length && !/^chapters:?$/i.test(line.trim())) summary.push(line);
  }
  return {
    description: summary.join("\n").trim().split(/\n\s*\n/)[0]?.replace(/\s+/g, " ") ?? "",
    chapters,
  };
}

function parseFeed(xml) {
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, entry]) => ({
    youtubeId: tag(entry, "yt:videoId"),
    title: tag(entry, "title"),
    published: tag(entry, "published"),
    ...parseDescription(tag(entry, "media:description")),
  }));
}

async function readExisting() {
  try {
    const text = await readFile(OUTPUT, "utf8");
    return JSON.parse(text.slice(text.indexOf("["), text.lastIndexOf("]") + 1));
  } catch {
    return [];
  }
}

const response = await fetch(FEED_URL);
if (!response.ok) throw new Error(`Feed request failed: ${response.status}`);
const latest = parseFeed(await response.text());

// The feed only lists the 15 newest uploads, so keep older videos from the last run.
const byId = new Map((await readExisting()).map((video) => [video.youtubeId, video]));
for (const video of latest) byId.set(video.youtubeId, video);
const videos = [...byId.values()].sort((a, b) => b.published.localeCompare(a.published));

const output = `${HEADER}const YOUTUBE_VIDEOS = ${JSON.stringify(videos, null, 2)};\n`;
await writeFile(OUTPUT, output);
console.log(`Wrote ${videos.length} video(s) to youtube.js`);
