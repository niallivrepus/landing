#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, "..");
const TOKEN_CSS = path.join(ROOT, "packages/gooey/src/styles/design-tokens.css");
const SWIFT_TOKENS = path.join(ROOT, "swift/GooeySwift/Sources/GooeyTokens/GooeyTokens.swift");
const SWIFT_PKG = path.join(ROOT, "swift/GooeySwift");
const MANIFEST = path.join(SWIFT_PKG, "platform-manifest.json");
const REPORT = path.join(SWIFT_PKG, "swift-conversion-report.json");
const CONVERTER = path.join(ROOT, "scripts/convert-gooey-swift.mjs");

function fail(message) {
  console.error(`check-gooey-swift: ${message}`);
  process.exit(1);
}

function parseColorTokenCount(css, selector) {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) return 0;
  let depth = 0;
  let bodyStart = -1;
  for (let i = start; i < css.length; i += 1) {
    if (css[i] === "{") {
      depth += 1;
      if (bodyStart === -1) bodyStart = i + 1;
    } else if (css[i] === "}") {
      depth -= 1;
      if (depth === 0) {
        const block = css.slice(bodyStart, i);
        const matches = block.match(/--color-[a-z0-9-]+:\s*(#[0-9a-fA-F]{6,8}|rgba?\([^;]+);/g);
        return matches?.length ?? 0;
      }
    }
  }
  return 0;
}

function readSwiftTokenCounts(swiftSource) {
  const darkMatch = swiftSource.match(/darkColors: \[String: GooeyTokenColor\] = \[/);
  const lightMatch = swiftSource.match(/lightColors: \[String: GooeyTokenColor\] = \[/);
  if (!darkMatch || !lightMatch) fail("Could not parse GooeyTokens.swift dictionaries.");

  const countEntries = (fromIndex) => {
    const slice = swiftSource.slice(fromIndex);
    const end = slice.indexOf("\n  ]");
    const body = slice.slice(0, end);
    return (body.match(/"[^"]+":/g) ?? []).length;
  };

  return {
    dark: countEntries(darkMatch.index),
    light: countEntries(lightMatch.index),
  };
}

function assertSwiftComponentFiles(manifest) {
  const fileMap = {
      button: "GooeyButton.swift",
      "icon-only-button": "GooeyIconButton.swift",
      badge: "GooeyBadge.swift",
      switch: "GooeySwitch.swift",
      checkbox: "GooeyCheckbox.swift",
      radio: "GooeyRadio.swift",
      input: "GooeyInput.swift",
      card: "GooeyCard.swift",
      skeleton: "GooeySkeleton.swift",
    };

  for (const entry of manifest.swiftSupportedComponents) {
    const fileName = fileMap[entry];
    if (!fileName) fail(`Unknown swiftSupportedComponents entry: ${entry}`);
    const resolved = path.join(
      SWIFT_PKG,
      "Sources",
      entry === "card" || entry === "skeleton" ? "GooeyPatterns" : "GooeyControls",
      fileName,
    );
    if (!existsSync(resolved)) {
      fail(`Missing Swift component file for "${entry}": ${path.relative(ROOT, resolved)}`);
    }
  }
}

function main() {
  for (const required of [TOKEN_CSS, SWIFT_TOKENS, CONVERTER]) {
    if (!existsSync(required)) fail(`Missing ${path.relative(ROOT, required)}`);
  }

  const css = readFileSync(TOKEN_CSS, "utf8");
  const swift = readFileSync(SWIFT_TOKENS, "utf8");
  const expected = {
    dark: parseColorTokenCount(css, ":root"),
    light: parseColorTokenCount(css, ":root.light"),
  };
  const actual = readSwiftTokenCounts(swift);

  if (expected.dark !== actual.dark || expected.light !== actual.light) {
    fail(
      `Swift tokens are out of sync with design-tokens.css (css dark=${expected.dark}, light=${expected.light}; swift dark=${actual.dark}, light=${actual.light}). Run: pnpm swift:sync`,
    );
  }

  if (!existsSync(MANIFEST) || !existsSync(REPORT)) {
    fail("Swift platform manifest missing. Run: pnpm swift:sync");
  }

  const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
  assertSwiftComponentFiles(manifest);

  const sync = spawnSync(process.execPath, [CONVERTER, "--all-supported", "--dry-run"], {
    cwd: ROOT,
    encoding: "utf8",
  });
  if (sync.status !== 0) {
    console.error(sync.stdout);
    console.error(sync.stderr);
    fail("Swift converter dry-run failed.");
  }

  const build = spawnSync("swift", ["build"], {
    cwd: SWIFT_PKG,
    encoding: "utf8",
  });
  if (build.status !== 0) {
    console.error(build.stdout);
    console.error(build.stderr);
    fail("swift build failed.");
  }

  console.log("Gooey Swift check passed.");
  console.log(`  tokens: dark=${actual.dark}, light=${actual.light}`);
  console.log(`  swift components: ${manifest.swiftSupportedComponents.length}`);
}

main();
