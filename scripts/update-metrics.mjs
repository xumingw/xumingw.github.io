import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const metricsPath = path.join(root, "shared", "metrics.json");
const scholarUserId = process.env.SCHOLAR_USER_ID || "j4xiRjIAAAAJ";

globalThis.window = globalThis;
await import(pathToFileURL(path.join(root, "shared", "data.js")).href + `?t=${Date.now()}`);

const siteData = globalThis.SITE_DATA;
if (!siteData || !Array.isArray(siteData.publications)) {
  throw new Error("Could not load SITE_DATA.publications");
}

const previous = await readPreviousMetrics();
const papers = {};
const scholarRows = await fetchScholarRows();

for (const pub of siteData.publications) {
  if (!pub.id) continue;
  const prior = previous.papers?.[pub.id] || {};
  const entry = { ...prior };

  const citation = findCitationCount(pub, scholarRows);
  if (typeof citation === "number") entry.citations = citation;

  const repo = pub.githubRepo || githubRepoFromLinks(pub.links);
  if (repo) {
    entry.githubRepo = repo;
    const stars = await fetchGithubStars(repo);
    if (typeof stars === "number") entry.stars = stars;
  }

  papers[pub.id] = entry;
}

const next = {
  updatedAt: new Date().toISOString(),
  sources: {
    googleScholarProfile: `https://scholar.google.com/citations?user=${scholarUserId}&hl=en`,
    github: "https://api.github.com/repos/{owner}/{repo}"
  },
  papers
};

await fs.writeFile(metricsPath, `${JSON.stringify(next, null, 2)}\n`);
console.log(`Wrote ${path.relative(root, metricsPath)}`);

async function readPreviousMetrics() {
  try {
    return JSON.parse(await fs.readFile(metricsPath, "utf8"));
  } catch {
    return { papers: {} };
  }
}

async function fetchGithubStars(repo) {
  const headers = {
    "Accept": "application/vnd.github+json",
    "User-Agent": "xumingw-homepage-metrics"
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, { headers });
    if (!res.ok) {
      console.warn(`GitHub ${repo}: ${res.status} ${res.statusText}`);
      return undefined;
    }
    const data = await res.json();
    return typeof data.stargazers_count === "number" ? data.stargazers_count : undefined;
  } catch (error) {
    console.warn(`GitHub ${repo}: ${error.message}`);
    return undefined;
  }
}

async function fetchScholarRows() {
  const url = `https://scholar.google.com/citations?user=${encodeURIComponent(scholarUserId)}&hl=en&pagesize=100`;
  try {
    const res = await fetch(url, {
      headers: {
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent": "Mozilla/5.0 (compatible; xumingw-homepage-metrics/1.0)"
      }
    });
    if (!res.ok) {
      console.warn(`Google Scholar: ${res.status} ${res.statusText}`);
      return [];
    }
    return parseScholarRows(await res.text());
  } catch (error) {
    console.warn(`Google Scholar: ${error.message}`);
    return [];
  }
}

function parseScholarRows(html) {
  const rows = [];
  const rowRe = /<tr class="gsc_a_tr">([\s\S]*?)<\/tr>/g;
  let rowMatch;
  while ((rowMatch = rowRe.exec(html))) {
    const row = rowMatch[1];
    const titleMatch = row.match(/<a[^>]*class="gsc_a_at"[^>]*>([\s\S]*?)<\/a>/);
    if (!titleMatch) continue;

    const citationMatch = row.match(/<td[^>]*class="gsc_a_c"[^>]*>([\s\S]*?)<\/td>/);
    const title = decodeHtml(stripTags(titleMatch[1])).trim();
    const citationText = citationMatch ? decodeHtml(stripTags(citationMatch[1])).replace(/[^\d]/g, "") : "";
    rows.push({
      title,
      normalizedTitle: normalizeTitle(title),
      citations: citationText ? Number(citationText) : 0
    });
  }
  console.log(`Google Scholar rows parsed: ${rows.length}`);
  return rows;
}

function findCitationCount(pub, rows) {
  if (!rows.length) return undefined;
  const targets = [pub.scholarTitle || pub.title, ...(pub.scholarAliases || [])]
    .map(normalizeTitle)
    .filter(Boolean);
  const matched = new Map();

  for (const row of rows) {
    if (targets.some(target => row.normalizedTitle === target)) {
      matched.set(row.normalizedTitle, row);
    }
  }

  for (const row of rows) {
    if (targets.some(target => row.normalizedTitle.includes(target) || target.includes(row.normalizedTitle))) {
      matched.set(row.normalizedTitle, row);
    }
  }

  if (!matched.size) {
    for (const row of rows) {
      if (targets.some(target => titleOverlap(row.normalizedTitle, target) >= 0.72)) {
        matched.set(row.normalizedTitle, row);
      }
    }
  }

  if (!matched.size) {
    console.warn(`Google Scholar title not matched: ${pub.id} - ${pub.title}`);
    return undefined;
  }

  const matches = [...matched.values()];
  if (matches.length > 1) {
    console.log(`Google Scholar merged ${matches.length} rows for ${pub.id}: ${matches.map(row => `${row.citations} "${row.title}"`).join("; ")}`);
  }
  return matches.reduce((sum, row) => sum + row.citations, 0);
}

function titleOverlap(a, b) {
  const aw = new Set(a.split(" ").filter(w => w.length > 2));
  const bw = new Set(b.split(" ").filter(w => w.length > 2));
  if (!aw.size || !bw.size) return 0;
  let common = 0;
  for (const w of aw) if (bw.has(w)) common++;
  return common / Math.max(aw.size, bw.size);
}

function githubRepoFromLinks(links = {}) {
  const urls = Object.values(links).filter(value => typeof value === "string");
  for (const url of urls) {
    const match = url.match(/^https:\/\/github\.com\/([^/]+\/[^/#?]+)/i);
    if (match) return match[1].replace(/\.git$/i, "");
  }
  return undefined;
}

function normalizeTitle(value) {
  return decodeHtml(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function stripTags(value) {
  return value.replace(/<[^>]*>/g, " ");
}

function decodeHtml(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}
