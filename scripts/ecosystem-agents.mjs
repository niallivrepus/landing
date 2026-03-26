#!/usr/bin/env node
/** Parallel probes; list kept in sync with src/data/ecosystem-framework.ts `ECOSYSTEM_AGENT_URLS`. */

const list = [
  { url: "https://openai.com", label: "openai-marketing" },
  { url: "https://developers.openai.com", label: "openai-developers" },
  { url: "https://status.openai.com", label: "openai-status" },
  { url: "https://www.apple.com/legal/", label: "apple-legal" },
  { url: "https://chatgpt.com", label: "chatgpt-product" },
  { url: "https://help.openai.com/en/", label: "openai-help" },
  { url: "https://community.openai.com/", label: "openai-forum" },
];

async function probe(entry) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(entry.url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "JokuhEcosystemAgents/1.0" },
    });
    clearTimeout(t);
    return {
      label: entry.label,
      url: entry.url,
      ok: res.ok,
      status: res.status,
      finalUrl: res.url,
    };
  } catch (e) {
    clearTimeout(t);
    return {
      label: entry.label,
      url: entry.url,
      ok: false,
      error: String(e?.message ?? e),
    };
  }
}

const results = await Promise.all(list.map((x) => probe(x)));
console.log(JSON.stringify({ probedAt: new Date().toISOString(), results }, null, 2));
