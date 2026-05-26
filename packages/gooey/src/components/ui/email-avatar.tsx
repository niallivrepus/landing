import React, { useEffect, useRef, useState } from "react";

interface EmailAvatarProps {
  email: string;
  name?: string;
  size?: "small" | "medium" | "large";
  className?: string;
  style?: React.CSSProperties;
}

// Simple MD5 implementation for Gravatar hash (no external dependencies)
function md5(string: string): string {
  function rotateLeft(value: number, shift: number) {
    return (value << shift) | (value >>> (32 - shift));
  }

  function addUnsigned(x: number, y: number) {
    const x4 = x & 0x40000000;
    const y4 = y & 0x40000000;
    const x8 = x & 0x80000000;
    const y8 = y & 0x80000000;
    const result = (x & 0x3fffffff) + (y & 0x3fffffff);
    if (x4 & y4) return result ^ 0x80000000 ^ x8 ^ y8;
    if (x4 | y4) {
      if (result & 0x40000000) return result ^ 0xc0000000 ^ x8 ^ y8;
      return result ^ 0x40000000 ^ x8 ^ y8;
    }
    return result ^ x8 ^ y8;
  }

  function f(x: number, y: number, z: number) {
    return (x & y) | (~x & z);
  }
  function g(x: number, y: number, z: number) {
    return (x & z) | (y & ~z);
  }
  function h(x: number, y: number, z: number) {
    return x ^ y ^ z;
  }
  function i(x: number, y: number, z: number) {
    return y ^ (x | ~z);
  }

  function ff(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    ac: number
  ) {
    a = addUnsigned(a, addUnsigned(addUnsigned(f(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function gg(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    ac: number
  ) {
    a = addUnsigned(a, addUnsigned(addUnsigned(g(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function hh(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    ac: number
  ) {
    a = addUnsigned(a, addUnsigned(addUnsigned(h(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function ii(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    ac: number
  ) {
    a = addUnsigned(a, addUnsigned(addUnsigned(i(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function convertToWordArray(str: string) {
    let wordCount: number;
    const msgLength = str.length;
    const temp1 = msgLength + 8;
    const temp2 = (temp1 - (temp1 % 64)) / 64;
    const numWords = (temp2 + 1) * 16;
    const wordArray: number[] = new Array<number>(numWords - 1).fill(0);
    let bytePosition = 0;
    let byteCount = 0;
    while (byteCount < msgLength) {
      wordCount = (byteCount - (byteCount % 4)) / 4;
      bytePosition = (byteCount % 4) * 8;
      wordArray[wordCount] =
        wordArray[wordCount] | (str.charCodeAt(byteCount) << bytePosition);
      byteCount++;
    }
    wordCount = (byteCount - (byteCount % 4)) / 4;
    bytePosition = (byteCount % 4) * 8;
    wordArray[wordCount] = wordArray[wordCount] | (0x80 << bytePosition);
    wordArray[numWords - 2] = msgLength << 3;
    wordArray[numWords - 1] = msgLength >>> 29;
    return wordArray;
  }

  function wordToHex(value: number) {
    let hex = "";
    for (let i = 0; i <= 3; i++) {
      const byte = (value >>> (i * 8)) & 255;
      const hexByte = "0" + byte.toString(16);
      hex = hex + hexByte.substr(hexByte.length - 2, 2);
    }
    return hex;
  }

  const x = convertToWordArray(string) as number[];
  let a = 0x67452301,
    b = 0xefcdab89,
    c = 0x98badcfe,
    d = 0x10325476;

  const S11 = 7,
    S12 = 12,
    S13 = 17,
    S14 = 22;
  const S21 = 5,
    S22 = 9,
    S23 = 14,
    S24 = 20;
  const S31 = 4,
    S32 = 11,
    S33 = 16,
    S34 = 23;
  const S41 = 6,
    S42 = 10,
    S43 = 15,
    S44 = 21;

  for (let k = 0; k < x.length; k += 16) {
    const AA = a,
      BB = b,
      CC = c,
      DD = d;
    a = ff(a, b, c, d, x[k], S11, 0xd76aa478);
    d = ff(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
    c = ff(c, d, a, b, x[k + 2], S13, 0x242070db);
    b = ff(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
    a = ff(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
    d = ff(d, a, b, c, x[k + 5], S12, 0x4787c62a);
    c = ff(c, d, a, b, x[k + 6], S13, 0xa8304613);
    b = ff(b, c, d, a, x[k + 7], S14, 0xfd469501);
    a = ff(a, b, c, d, x[k + 8], S11, 0x698098d8);
    d = ff(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
    c = ff(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
    b = ff(b, c, d, a, x[k + 11], S14, 0x895cd7be);
    a = ff(a, b, c, d, x[k + 12], S11, 0x6b901122);
    d = ff(d, a, b, c, x[k + 13], S12, 0xfd987193);
    c = ff(c, d, a, b, x[k + 14], S13, 0xa679438e);
    b = ff(b, c, d, a, x[k + 15], S14, 0x49b40821);
    a = gg(a, b, c, d, x[k + 1], S21, 0xf61e2562);
    d = gg(d, a, b, c, x[k + 6], S22, 0xc040b340);
    c = gg(c, d, a, b, x[k + 11], S23, 0x265e5a51);
    b = gg(b, c, d, a, x[k], S24, 0xe9b6c7aa);
    a = gg(a, b, c, d, x[k + 5], S21, 0xd62f105d);
    d = gg(d, a, b, c, x[k + 10], S22, 0x2441453);
    c = gg(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
    b = gg(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
    a = gg(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
    d = gg(d, a, b, c, x[k + 14], S22, 0xc33707d6);
    c = gg(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
    b = gg(b, c, d, a, x[k + 8], S24, 0x455a14ed);
    a = gg(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
    d = gg(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
    c = gg(c, d, a, b, x[k + 7], S23, 0x676f02d9);
    b = gg(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);
    a = hh(a, b, c, d, x[k + 5], S31, 0xfffa3942);
    d = hh(d, a, b, c, x[k + 8], S32, 0x8771f681);
    c = hh(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
    b = hh(b, c, d, a, x[k + 14], S34, 0xfde5380c);
    a = hh(a, b, c, d, x[k + 1], S31, 0xa4beea44);
    d = hh(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
    c = hh(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
    b = hh(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
    a = hh(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
    d = hh(d, a, b, c, x[k], S32, 0xeaa127fa);
    c = hh(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
    b = hh(b, c, d, a, x[k + 6], S34, 0x4881d05);
    a = hh(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
    d = hh(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
    c = hh(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
    b = hh(b, c, d, a, x[k + 2], S34, 0xc4ac5665);
    a = ii(a, b, c, d, x[k], S41, 0xf4292244);
    d = ii(d, a, b, c, x[k + 7], S42, 0x432aff97);
    c = ii(c, d, a, b, x[k + 14], S43, 0xab9423a7);
    b = ii(b, c, d, a, x[k + 5], S44, 0xfc93a039);
    a = ii(a, b, c, d, x[k + 12], S41, 0x655b59c3);
    d = ii(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
    c = ii(c, d, a, b, x[k + 10], S43, 0xffeff47d);
    b = ii(b, c, d, a, x[k + 1], S44, 0x85845dd1);
    a = ii(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
    d = ii(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
    c = ii(c, d, a, b, x[k + 6], S43, 0xa3014314);
    b = ii(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
    a = ii(a, b, c, d, x[k + 4], S41, 0xf7537e82);
    d = ii(d, a, b, c, x[k + 11], S42, 0xbd3af235);
    c = ii(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
    b = ii(b, c, d, a, x[k + 9], S44, 0xeb86d391);
    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }
  return (
    wordToHex(a) +
    wordToHex(b) +
    wordToHex(c) +
    wordToHex(d)
  ).toLowerCase();
}

// Extracts the domain from an email address
function getDomainFromEmail(email: string): string | null {
  const match = email.match(/@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/);
  return match ? match[1]!.toLowerCase() : null;
}

// Returns the root domain (e.g., "mail.google.com" -> "google.com")
function getRootDomain(domain: string): string {
  const parts = domain.split(".");
  if (parts.length <= 2) return domain;
  return parts.slice(-2).join(".");
}

// Personal email domains where we should try Gravatar first (users might have profile pics)
const PERSONAL_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoomail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "protonmail.com",
  "proton.me",
  "zoho.com",
  "yandex.com",
  "mail.com",
  "gmx.com",
  "gmx.net",
  "fastmail.com",
  "tutanota.com",
  "hey.com",
  "pm.me",
]);

// Comprehensive brand domains with logos - 200+ companies
const KNOWN_BRANDS: Record<string, string> = {
  // Dev Tools & Platforms
  "vercel.com":
    "https://assets.vercel.com/image/upload/front/favicon/vercel/favicon.ico",
  "github.com": "https://github.githubassets.com/favicons/favicon.svg",
  "gitlab.com": "https://icon.horse/icon/gitlab.com",
  "bitbucket.org": "https://icon.horse/icon/bitbucket.org",
  "netlify.com": "https://icon.horse/icon/netlify.com",
  "railway.app": "https://icon.horse/icon/railway.app",
  "render.com": "https://icon.horse/icon/render.com",
  "fly.io": "https://icon.horse/icon/fly.io",
  "heroku.com": "https://icon.horse/icon/heroku.com",
  "digitalocean.com": "https://icon.horse/icon/digitalocean.com",
  "linode.com": "https://icon.horse/icon/linode.com",
  "vultr.com": "https://icon.horse/icon/vultr.com",
  "cloudflare.com": "https://icon.horse/icon/cloudflare.com",
  "fastly.com": "https://icon.horse/icon/fastly.com",
  "akamai.com": "https://icon.horse/icon/akamai.com",
  "docker.com": "https://icon.horse/icon/docker.com",
  "kubernetes.io": "https://icon.horse/icon/kubernetes.io",
  "terraform.io": "https://icon.horse/icon/hashicorp.com",
  "hashicorp.com": "https://icon.horse/icon/hashicorp.com",

  // Databases
  "supabase.com": "https://icon.horse/icon/supabase.com",
  "firebase.google.com": "https://icon.horse/icon/firebase.google.com",
  "neon.tech": "https://icon.horse/icon/neon.tech",
  "planetscale.com": "https://icon.horse/icon/planetscale.com",
  "mongodb.com": "https://icon.horse/icon/mongodb.com",
  "redis.com": "https://icon.horse/icon/redis.com",
  "cockroachlabs.com": "https://icon.horse/icon/cockroachlabs.com",
  "fauna.com": "https://icon.horse/icon/fauna.com",
  "upstash.com": "https://icon.horse/icon/upstash.com",
  "convex.dev": "https://icon.horse/icon/convex.dev",
  "turso.tech": "https://icon.horse/icon/turso.tech",
  "xata.io": "https://icon.horse/icon/xata.io",

  // Cloud Providers
  "aws.amazon.com": "https://icon.horse/icon/aws.amazon.com",
  "amazon.com": "https://icon.horse/icon/amazon.com",
  "cloud.google.com": "https://icon.horse/icon/cloud.google.com",
  "azure.microsoft.com": "https://icon.horse/icon/azure.microsoft.com",
  "oracle.com": "https://icon.horse/icon/oracle.com",
  "ibm.com": "https://icon.horse/icon/ibm.com",
  "alibaba.com": "https://icon.horse/icon/alibaba.com",

  // Big Tech
  "google.com": "https://icon.horse/icon/google.com",
  "microsoft.com": "https://icon.horse/icon/microsoft.com",
  "apple.com": "https://icon.horse/icon/apple.com",
  "meta.com": "https://icon.horse/icon/meta.com",
  "facebook.com": "https://icon.horse/icon/facebook.com",

  // AI Companies
  "openai.com": "https://icon.horse/icon/openai.com",
  "anthropic.com": "https://icon.horse/icon/anthropic.com",
  "cursor.com": "https://icon.horse/icon/cursor.com",
  "midjourney.com": "https://icon.horse/icon/midjourney.com",
  "stability.ai": "https://icon.horse/icon/stability.ai",
  "huggingface.co": "https://icon.horse/icon/huggingface.co",
  "cohere.com": "https://icon.horse/icon/cohere.com",
  "replicate.com": "https://icon.horse/icon/replicate.com",
  "perplexity.ai": "https://icon.horse/icon/perplexity.ai",
  "mistral.ai": "https://icon.horse/icon/mistral.ai",

  // Payments & Finance
  "stripe.com": "https://icon.horse/icon/stripe.com",
  "paypal.com": "https://icon.horse/icon/paypal.com",
  "square.com": "https://icon.horse/icon/square.com",
  "brex.com": "https://icon.horse/icon/brex.com",
  "plaid.com": "https://icon.horse/icon/plaid.com",
  "wise.com": "https://icon.horse/icon/wise.com",
  "revolut.com": "https://icon.horse/icon/revolut.com",
  "venmo.com": "https://icon.horse/icon/venmo.com",
  "cashapp.com": "https://icon.horse/icon/cashapp.com",
  "coinbase.com": "https://icon.horse/icon/coinbase.com",
  "binance.com": "https://icon.horse/icon/binance.com",
  "kraken.com": "https://icon.horse/icon/kraken.com",
  "robinhood.com": "https://icon.horse/icon/robinhood.com",
  "mercury.com": "https://icon.horse/icon/mercury.com",
  "ramp.com": "https://icon.horse/icon/ramp.com",
  "bill.com": "https://icon.horse/icon/bill.com",
  "gusto.com": "https://icon.horse/icon/gusto.com",
  "rippling.com": "https://icon.horse/icon/rippling.com",
  "adyen.com": "https://icon.horse/icon/adyen.com",
  "klarna.com": "https://icon.horse/icon/klarna.com",
  "affirm.com": "https://icon.horse/icon/affirm.com",
  "afterpay.com": "https://icon.horse/icon/afterpay.com",

  // Communication
  "slack.com": "https://icon.horse/icon/slack.com",
  "discord.com": "https://icon.horse/icon/discord.com",
  "zoom.us": "https://icon.horse/icon/zoom.us",
  "teams.microsoft.com": "https://icon.horse/icon/microsoft.com",
  "webex.com": "https://icon.horse/icon/webex.com",
  "twilio.com": "https://icon.horse/icon/twilio.com",
  "sendbird.com": "https://icon.horse/icon/sendbird.com",
  "vonage.com": "https://icon.horse/icon/vonage.com",
  "messagebird.com": "https://icon.horse/icon/messagebird.com",

  // Email Services
  "resend.com": "https://icon.horse/icon/resend.com",
  "sendgrid.com": "https://icon.horse/icon/sendgrid.com",
  "mailgun.com": "https://icon.horse/icon/mailgun.com",
  "postmark.com": "https://icon.horse/icon/postmark.com",
  "mailchimp.com": "https://icon.horse/icon/mailchimp.com",
  "constantcontact.com": "https://icon.horse/icon/constantcontact.com",
  "convertkit.com": "https://icon.horse/icon/convertkit.com",
  "klaviyo.com": "https://icon.horse/icon/klaviyo.com",
  "brevo.com": "https://icon.horse/icon/brevo.com",
  "sendinblue.com": "https://icon.horse/icon/sendinblue.com",
  "customer.io": "https://icon.horse/icon/customer.io",
  "beehiiv.com": "https://icon.horse/icon/beehiiv.com",
  "substack.com": "https://icon.horse/icon/substack.com",

  // Project Management
  "notion.so": "https://icon.horse/icon/notion.so",
  "linear.app": "https://icon.horse/icon/linear.app",
  "asana.com": "https://icon.horse/icon/asana.com",
  "trello.com": "https://icon.horse/icon/trello.com",
  "monday.com": "https://icon.horse/icon/monday.com",
  "clickup.com": "https://icon.horse/icon/clickup.com",
  "basecamp.com": "https://icon.horse/icon/basecamp.com",
  "airtable.com": "https://icon.horse/icon/airtable.com",
  "coda.io": "https://icon.horse/icon/coda.io",
  "atlassian.com": "https://icon.horse/icon/atlassian.com",
  "jira.com": "https://icon.horse/icon/atlassian.com",
  "confluence.atlassian.com": "https://icon.horse/icon/atlassian.com",
  "height.app": "https://icon.horse/icon/height.app",
  "shortcut.com": "https://icon.horse/icon/shortcut.com",

  // Design Tools
  "figma.com": "https://icon.horse/icon/figma.com",
  "sketch.com": "https://icon.horse/icon/sketch.com",
  "canva.com": "https://icon.horse/icon/canva.com",
  "adobe.com": "https://icon.horse/icon/adobe.com",
  "invisionapp.com": "https://icon.horse/icon/invisionapp.com",
  "framer.com": "https://icon.horse/icon/framer.com",
  "webflow.com": "https://icon.horse/icon/webflow.com",
  "dribbble.com": "https://icon.horse/icon/dribbble.com",
  "behance.net": "https://icon.horse/icon/behance.net",
  "miro.com": "https://icon.horse/icon/miro.com",
  "figjam.com": "https://icon.horse/icon/figma.com",
  "loom.com": "https://icon.horse/icon/loom.com",
  "pitch.com": "https://icon.horse/icon/pitch.com",

  // CRM & Sales
  "salesforce.com": "https://icon.horse/icon/salesforce.com",
  "hubspot.com": "https://icon.horse/icon/hubspot.com",
  "pipedrive.com": "https://icon.horse/icon/pipedrive.com",
  "close.com": "https://icon.horse/icon/close.com",
  "apollo.io": "https://icon.horse/icon/apollo.io",
  "outreach.io": "https://icon.horse/icon/outreach.io",
  "gong.io": "https://icon.horse/icon/gong.io",
  "chorus.ai": "https://icon.horse/icon/chorus.ai",
  "clearbit.com": "https://icon.horse/icon/clearbit.com",
  "zoominfo.com": "https://icon.horse/icon/zoominfo.com",

  // Support & Customer Service
  "zendesk.com": "https://icon.horse/icon/zendesk.com",
  "intercom.com": "https://icon.horse/icon/intercom.com",
  "freshdesk.com": "https://icon.horse/icon/freshdesk.com",
  "helpscout.com": "https://icon.horse/icon/helpscout.com",
  "crisp.chat": "https://icon.horse/icon/crisp.chat",
  "drift.com": "https://icon.horse/icon/drift.com",
  "front.com": "https://icon.horse/icon/front.com",

  // Analytics & Monitoring
  "sentry.io": "https://icon.horse/icon/sentry.io",
  "datadog.com": "https://icon.horse/icon/datadog.com",
  "newrelic.com": "https://icon.horse/icon/newrelic.com",
  "mixpanel.com": "https://icon.horse/icon/mixpanel.com",
  "amplitude.com": "https://icon.horse/icon/amplitude.com",
  "segment.com": "https://icon.horse/icon/segment.com",
  "heap.io": "https://icon.horse/icon/heap.io",
  "posthog.com": "https://icon.horse/icon/posthog.com",
  "logrocket.com": "https://icon.horse/icon/logrocket.com",
  "splunk.com": "https://icon.horse/icon/splunk.com",
  "grafana.com": "https://icon.horse/icon/grafana.com",
  "elastic.co": "https://icon.horse/icon/elastic.co",
  "pagerduty.com": "https://icon.horse/icon/pagerduty.com",
  "opsgenie.com": "https://icon.horse/icon/opsgenie.com",
  "statuspage.io": "https://icon.horse/icon/statuspage.io",
  "betterstack.com": "https://icon.horse/icon/betterstack.com",
  "honeycomb.io": "https://icon.horse/icon/honeycomb.io",
  "lightstep.com": "https://icon.horse/icon/lightstep.com",
  "hotjar.com": "https://icon.horse/icon/hotjar.com",
  "fullstory.com": "https://icon.horse/icon/fullstory.com",
  "mouseflow.com": "https://icon.horse/icon/mouseflow.com",

  // Auth & Security
  "auth0.com": "https://icon.horse/icon/auth0.com",
  "okta.com": "https://icon.horse/icon/okta.com",
  "clerk.com": "https://icon.horse/icon/clerk.com",
  "stytch.com": "https://icon.horse/icon/stytch.com",
  "workos.com": "https://icon.horse/icon/workos.com",
  "onelogin.com": "https://icon.horse/icon/onelogin.com",
  "duo.com": "https://icon.horse/icon/duo.com",
  "1password.com": "https://icon.horse/icon/1password.com",
  "lastpass.com": "https://icon.horse/icon/lastpass.com",
  "bitwarden.com": "https://icon.horse/icon/bitwarden.com",
  "snyk.io": "https://icon.horse/icon/snyk.io",
  "sonarqube.org": "https://icon.horse/icon/sonarsource.com",
  "crowdstrike.com": "https://icon.horse/icon/crowdstrike.com",

  // Social Media
  "twitter.com": "https://icon.horse/icon/twitter.com",
  "x.com": "https://icon.horse/icon/x.com",
  "linkedin.com": "https://icon.horse/icon/linkedin.com",
  "instagram.com": "https://icon.horse/icon/instagram.com",
  "tiktok.com": "https://icon.horse/icon/tiktok.com",
  "snapchat.com": "https://icon.horse/icon/snapchat.com",
  "pinterest.com": "https://icon.horse/icon/pinterest.com",
  "reddit.com": "https://icon.horse/icon/reddit.com",
  "threads.net": "https://icon.horse/icon/threads.net",
  "mastodon.social": "https://icon.horse/icon/mastodon.social",
  "bluesky.social": "https://icon.horse/icon/bsky.app",

  // Entertainment & Media
  "spotify.com": "https://icon.horse/icon/spotify.com",
  "netflix.com": "https://icon.horse/icon/netflix.com",
  "youtube.com": "https://icon.horse/icon/youtube.com",
  "twitch.tv": "https://icon.horse/icon/twitch.tv",
  "hulu.com": "https://icon.horse/icon/hulu.com",
  "disneyplus.com": "https://icon.horse/icon/disneyplus.com",
  "hbomax.com": "https://icon.horse/icon/hbomax.com",
  "primevideo.com": "https://icon.horse/icon/primevideo.com",
  "peacocktv.com": "https://icon.horse/icon/peacocktv.com",
  "paramount.com": "https://icon.horse/icon/paramount.com",

  // E-commerce
  "shopify.com": "https://icon.horse/icon/shopify.com",
  "woocommerce.com": "https://icon.horse/icon/woocommerce.com",
  "bigcommerce.com": "https://icon.horse/icon/bigcommerce.com",
  "squarespace.com": "https://icon.horse/icon/squarespace.com",
  "wix.com": "https://icon.horse/icon/wix.com",
  "etsy.com": "https://icon.horse/icon/etsy.com",
  "ebay.com": "https://icon.horse/icon/ebay.com",
  "walmart.com": "https://icon.horse/icon/walmart.com",
  "target.com": "https://icon.horse/icon/target.com",
  "bestbuy.com": "https://icon.horse/icon/bestbuy.com",
  "sephora.com": "https://icon.horse/icon/sephora.com",
  "nike.com": "https://icon.horse/icon/nike.com",
  "adidas.com": "https://icon.horse/icon/adidas.com",

  // Food & Delivery
  "doordash.com": "https://icon.horse/icon/doordash.com",
  "ubereats.com": "https://icon.horse/icon/ubereats.com",
  "grubhub.com": "https://icon.horse/icon/grubhub.com",
  "instacart.com": "https://icon.horse/icon/instacart.com",
  "postmates.com": "https://icon.horse/icon/postmates.com",
  "seamless.com": "https://icon.horse/icon/seamless.com",

  // Travel & Transport
  "airbnb.com": "https://icon.horse/icon/airbnb.com",
  "uber.com": "https://icon.horse/icon/uber.com",
  "lyft.com": "https://icon.horse/icon/lyft.com",
  "booking.com": "https://icon.horse/icon/booking.com",
  "expedia.com": "https://icon.horse/icon/expedia.com",
  "tripadvisor.com": "https://icon.horse/icon/tripadvisor.com",
  "kayak.com": "https://icon.horse/icon/kayak.com",
  "hopper.com": "https://icon.horse/icon/hopper.com",

  // Package Registries & Dev
  "npmjs.com": "https://icon.horse/icon/npmjs.com",
  "npm.com": "https://icon.horse/icon/npmjs.com",
  "pypi.org": "https://icon.horse/icon/pypi.org",
  "rubygems.org": "https://icon.horse/icon/rubygems.org",
  "crates.io": "https://icon.horse/icon/crates.io",
  "packagist.org": "https://icon.horse/icon/packagist.org",
  "nuget.org": "https://icon.horse/icon/nuget.org",
  "maven.apache.org": "https://icon.horse/icon/apache.org",
  "stackoverflow.com": "https://icon.horse/icon/stackoverflow.com",
  "producthunt.com": "https://icon.horse/icon/producthunt.com",
  "hackernews.com": "https://icon.horse/icon/ycombinator.com",

  // Storage & CDN
  "dropbox.com": "https://icon.horse/icon/dropbox.com",
  "box.com": "https://icon.horse/icon/box.com",
  "drive.google.com": "https://icon.horse/icon/google.com",
  "onedrive.live.com": "https://icon.horse/icon/microsoft.com",
  "wetransfer.com": "https://icon.horse/icon/wetransfer.com",
  "uploadcare.com": "https://icon.horse/icon/uploadcare.com",
  "cloudinary.com": "https://icon.horse/icon/cloudinary.com",
  "imgix.com": "https://icon.horse/icon/imgix.com",
  "bunny.net": "https://icon.horse/icon/bunny.net",
  "backblaze.com": "https://icon.horse/icon/backblaze.com",
  "wasabi.com": "https://icon.horse/icon/wasabi.com",

  // Misc Tools
  "calendly.com": "https://icon.horse/icon/calendly.com",
  "cal.com": "https://icon.horse/icon/cal.com",
  "doodle.com": "https://icon.horse/icon/doodle.com",
  "typeform.com": "https://icon.horse/icon/typeform.com",
  "surveymonkey.com": "https://icon.horse/icon/surveymonkey.com",
  "docusign.com": "https://icon.horse/icon/docusign.com",
  "hellosign.com": "https://icon.horse/icon/hellosign.com",
  "pandadoc.com": "https://icon.horse/icon/pandadoc.com",
  "grammarly.com": "https://icon.horse/icon/grammarly.com",
  "zapier.com": "https://icon.horse/icon/zapier.com",
  "make.com": "https://icon.horse/icon/make.com",
  "n8n.io": "https://icon.horse/icon/n8n.io",
  "ifttt.com": "https://icon.horse/icon/ifttt.com",
  "retool.com": "https://icon.horse/icon/retool.com",
  "internal.io": "https://icon.horse/icon/internal.io",
  "appsmith.com": "https://icon.horse/icon/appsmith.com",
  "budibase.com": "https://icon.horse/icon/budibase.com",
  "tooljet.com": "https://icon.horse/icon/tooljet.com",
};

// Domain aliases that map to their parent company (for transactional emails)
const DOMAIN_ALIASES: Record<string, string> = {
  // Google
  "googlemail.com": "google.com",
  "gmail.com": "google.com",
  "google.co.uk": "google.com",
  "youtube.com": "youtube.com",

  // Microsoft
  "outlook.com": "microsoft.com",
  "hotmail.com": "microsoft.com",
  "live.com": "microsoft.com",
  "msn.com": "microsoft.com",
  "office365.com": "microsoft.com",
  "office.com": "microsoft.com",

  // Apple
  "icloud.com": "apple.com",
  "me.com": "apple.com",
  "mac.com": "apple.com",

  // Yahoo
  "yahoo.com": "yahoo.com",
  "yahoomail.com": "yahoo.com",
  "ymail.com": "yahoo.com",

  // Amazon
  "amazonses.com": "amazon.com",
  "email.amazon.com": "amazon.com",
  "amazon.co.uk": "amazon.com",
  "amazon.de": "amazon.com",
  "amazon.ca": "amazon.com",
  "amazon.fr": "amazon.com",
  "amazon.es": "amazon.com",
  "amazon.it": "amazon.com",
  "amazon.co.jp": "amazon.com",
  "amazon.in": "amazon.com",
  "amazon.com.au": "amazon.com",

  // GitHub
  "github.io": "github.com",
  "noreply.github.com": "github.com",

  // Atlassian
  "jira.com": "atlassian.com",
  "trello.com": "trello.com",
  "bitbucket.org": "bitbucket.org",

  // Stripe
  "stripe.network": "stripe.com",
  "e.stripe.com": "stripe.com",

  // Vercel
  "vercel.email": "vercel.com",
  "vercel.app": "vercel.com",

  // Shopify
  "myshopify.com": "shopify.com",
  "shopifyemail.com": "shopify.com",

  // Notion
  "makenotion.com": "notion.so",

  // Linear
  "linear.email": "linear.app",

  // Discord
  "discordapp.com": "discord.com",

  // Slack
  "slack-mail.com": "slack.com",

  // PayPal
  "paypal.co.uk": "paypal.com",
  "paypal.de": "paypal.com",
  "e.paypal.com": "paypal.com",

  // Netflix
  "mailer.netflix.com": "netflix.com",

  // Spotify
  "email.spotify.com": "spotify.com",

  // Uber
  "uber.com": "uber.com",
  "ubereats.com": "uber.com",

  // Airbnb
  "airbnbmail.com": "airbnb.com",

  // LinkedIn
  "linkedin.email": "linkedin.com",
  "e.linkedin.com": "linkedin.com",

  // Twitter/X
  "twitter.email": "twitter.com",
  "e.twitter.com": "twitter.com",
  "x.email": "x.com",

  // Facebook/Meta
  "facebookmail.com": "facebook.com",
  "fb.com": "facebook.com",
  "meta.com": "meta.com",

  // Instagram
  "mail.instagram.com": "instagram.com",
};

const AVATAR_SIZES = {
  small: 32,
  medium: 40,
  large: 48,
};

// Cache for avatar URLs to avoid repeated failed requests
const avatarCache = new Map<
  string,
  { url: string | null; type: "gravatar" | "brand" | "clearbit" | "favicon" }
>();

// Generates Gravatar URL from email
function getGravatarUrl(email: string, size: number): string {
  const hash = md5(email.toLowerCase().trim());
  return `https://www.gravatar.com/avatar/${hash}?s=${size * 2}&d=404`;
}

function getIconHorseUrl(domain: string): string {
  return `https://icon.horse/icon/${domain}`;
}

// Generates Clearbit Logo URL (legacy function, now uses icon.horse as fallback)
function getClearbitUrl(domain: string): string {
  // Clearbit Logo API often fails, so we use icon.horse as primary
  return `https://icon.horse/icon/${domain}`;
}

// Generates favicon URL (using icon.horse which has proper CORS headers)
// Note: Google Favicons blocked by CORS on localhost, so we use icon.horse
function getGoogleFaviconUrl(domain: string, _size: number): string {
  // icon.horse works better than Google Favicons for CORS
  return `https://icon.horse/icon/${domain}`;
}

export function EmailAvatar({
  email,
  name,
  size = "medium",
  className = "",
  style = {},
}: EmailAvatarProps) {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [fallbackStage, setFallbackStage] = useState(0);
  const attemptedRef = useRef(false);
  const emailRef = useRef(email);

  const dimension = AVATAR_SIZES[size];
  const initial = (name?.[0] || email[0] || "?").toUpperCase();
  const domain = getDomainFromEmail(email);
  const rootDomain = domain ? getRootDomain(domain) : null;
  const isPersonalEmail = domain ? PERSONAL_EMAIL_DOMAINS.has(domain) : false;
  const isJokuhEmail = email.toLowerCase().endsWith("@jokuh.com");

  // Reset when email changes
  useEffect(() => {
    if (emailRef.current !== email) {
      emailRef.current = email;
      attemptedRef.current = false;
      setCurrentUrl(null);
      setAvatarLoaded(false);
      setFallbackStage(0);
    }
  }, [email]);

  // Main effect to try loading avatars in order
  useEffect(() => {
    if (attemptedRef.current || !domain) return;

    attemptedRef.current = true;

    // Check cache first
    const cacheKey = email.toLowerCase();
    if (avatarCache.has(cacheKey)) {
      const cached = avatarCache.get(cacheKey)!;
      if (cached.url) {
        setCurrentUrl(cached.url);
        setAvatarLoaded(true);
      }
      return;
    }

    const aliasedDomain = DOMAIN_ALIASES[domain] || DOMAIN_ALIASES[rootDomain!];
    const lookupDomain = aliasedDomain || rootDomain!;

    // For personal emails, try Gravatar first (users might have profile pics)
    if (isPersonalEmail) {
      setCurrentUrl(getGravatarUrl(email, dimension));
      setFallbackStage(1);
    } else {
      const knownLogoUrl = KNOWN_BRANDS[lookupDomain] || KNOWN_BRANDS[domain];
      if (knownLogoUrl) {
        setCurrentUrl(knownLogoUrl);
        setFallbackStage(3);
      } else {
        setCurrentUrl(getIconHorseUrl(lookupDomain));
        setFallbackStage(2);
      }
    }
  }, [
    email,
    domain,
    rootDomain,
    isPersonalEmail,
    isJokuhEmail,
    dimension,
  ]);

  const handleImageLoad = () => {
    // Cache successful URL
    avatarCache.set(email.toLowerCase(), {
      url: currentUrl,
      type:
        fallbackStage === 1
          ? "gravatar"
          : fallbackStage === 2
            ? "clearbit"
            : fallbackStage === 3
              ? "brand"
              : "favicon",
    });
    setAvatarLoaded(true);
  };

  const handleImageError = () => {
    // Try next fallback
    const aliasedDomain = domain
      ? DOMAIN_ALIASES[domain] || DOMAIN_ALIASES[rootDomain!]
      : null;
    const lookupDomain = aliasedDomain || rootDomain;

    if (fallbackStage === 1 && isPersonalEmail) {
      // Gravatar failed for personal email, try brand logo (e.g., Gmail logo)
      const knownLogoUrl = lookupDomain
        ? KNOWN_BRANDS[lookupDomain] || KNOWN_BRANDS[domain!]
        : null;
      if (knownLogoUrl) {
        setCurrentUrl(knownLogoUrl);
        setFallbackStage(3);
      } else if (lookupDomain) {
        // Try Clearbit
        setCurrentUrl(getClearbitUrl(lookupDomain));
        setFallbackStage(2);
      } else {
        // No more fallbacks
        setAvatarLoaded(false);
        avatarCache.set(email.toLowerCase(), { url: null, type: "gravatar" });
      }
    } else if (fallbackStage === 2) {
      if (lookupDomain) {
        setCurrentUrl(getGoogleFaviconUrl(lookupDomain, dimension));
        setFallbackStage(4);
      } else {
        setAvatarLoaded(false);
        avatarCache.set(email.toLowerCase(), { url: null, type: "clearbit" });
      }
    } else if (fallbackStage === 3) {
      if (lookupDomain) {
        setCurrentUrl(getIconHorseUrl(lookupDomain));
        setFallbackStage(2);
      } else {
        setAvatarLoaded(false);
        avatarCache.set(email.toLowerCase(), { url: null, type: "brand" });
      }
    } else if (fallbackStage === 4) {
      // Google Favicon failed, give up
      setAvatarLoaded(false);
      avatarCache.set(email.toLowerCase(), { url: null, type: "favicon" });
    } else {
      // No more fallbacks
      setAvatarLoaded(false);
    }
  };

  const shouldAllowOverflow = false;

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-sm shrink-0 relative ${shouldAllowOverflow ? "overflow-visible" : "overflow-hidden"} ${className}`}
      style={{
        width: dimension,
        height: dimension,
        background: avatarLoaded ? "#fff" : "rgba(0, 117, 255, 0.1)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: avatarLoaded
          ? "1px solid rgba(0, 0, 0, 0.1)"
          : "1px solid rgba(0, 117, 255, 0.15)",
        boxShadow: avatarLoaded
          ? "0 2px 8px rgba(0, 0, 0, 0.1)"
          : "inset 0 1px 0.5px rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(0, 117, 255, 0.1)",
        color: "#0075ff",
        textShadow: "0 1px 0 rgba(255,255,255,0.2)",
        overflow: shouldAllowOverflow ? "visible" : "hidden",
        ...style,
      }}
    >
      {/* Hidden image to preload and check if avatar exists */}
      {currentUrl && !avatarLoaded && (
        <img
          src={currentUrl}
          alt=""
          aria-hidden="true"
          role="presentation"
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ display: "none" }}
          crossOrigin="anonymous"
        />
      )}

      {avatarLoaded && currentUrl ? (
        // Show regular avatar if loaded successfully (for all non-Jokuh emails or Jokuh emails without user avatar)
        <img
          src={currentUrl}
          alt={name || email}
          className="w-full h-full object-cover"
          style={{
            position: "relative",
            zIndex: 1,
            borderRadius: "50%",
          }}
        />
      ) : (
        // Fallback to initial letter
        <span style={{ position: "relative", zIndex: 1 }}>{initial}</span>
      )}
    </div>
  );
}

export default EmailAvatar;
