/**
 * **Purpose:** Writes `public/gooey-home/qr-iphone.svg`, the QR the Get Jokuh sheet shows on desktop so people can
 * open the iPhone link on their phone. Re-run when `APP_STORE_URL` / `TESTFLIGHT_JOIN_URL` changes
 * (`src/config/download-links.ts`). Needs the `qrcode` package (not a landing dependency; run with
 * `NODE_PATH=<dir with qrcode>/node_modules node scripts/generate-iphone-qr.mjs <url>`).
 */
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const QR = require("qrcode");
const url = process.argv[2];
if (!url) throw new Error("usage: node scripts/generate-iphone-qr.mjs <url>");
const svg = await QR.toString(url, { type: "svg", errorCorrectionLevel: "M", margin: 1, color: { dark: "#111111", light: "#ffffff" } });
writeFileSync(new URL("../public/gooey-home/qr-iphone.svg", import.meta.url), svg);
console.log("wrote qr-iphone.svg for", url);
