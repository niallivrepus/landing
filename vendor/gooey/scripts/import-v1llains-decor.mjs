#!/usr/bin/env node

import { access, copyFile, mkdir, writeFile } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_SOURCE_ROOT = "/Users/sonadin/Documents/code/jokuh/V1llains";
const TARGET_ROOTS = [
  path.resolve(__dirname, "../apps/prototype/public/images/decor"),
  path.resolve(__dirname, "../apps/gooey/public/images/decor"),
];
const MANIFEST_FILE_NAME = "v1llains-manifest.json";

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function uniqueSlugMap(collectionNames) {
  const used = new Map();
  const slugs = new Map();

  for (const collectionName of [...collectionNames].sort((left, right) =>
    left.localeCompare(right),
  )) {
    const baseSlug = slugify(collectionName) || "uncategorized";
    const nextIndex = (used.get(baseSlug) ?? 0) + 1;
    used.set(baseSlug, nextIndex);
    slugs.set(
      collectionName,
      nextIndex === 1 ? baseSlug : `${baseSlug}-${nextIndex}`,
    );
  }

  return slugs;
}

async function pathExists(targetPath) {
  try {
    await access(targetPath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function loadStaticAnimations(sourceRoot) {
  const loaderPath = path.join(
    sourceRoot,
    "tools/export/load-static-animations.mjs",
  );
  const loaderUrl = pathToFileURL(loaderPath).href;
  const loader = await import(loaderUrl);
  return loader.loadStaticAnimations();
}

async function main() {
  const sourceRoot = path.resolve(process.argv[2] ?? DEFAULT_SOURCE_ROOT);
  const sourceGifsDir = path.join(sourceRoot, "artifacts/decor-gifs-400");
  const animations = await loadStaticAnimations(sourceRoot);
  const collectionNames = new Set(
    animations.map(
      (animation) => animation.collection?.trim() || "Uncategorized",
    ),
  );
  const collectionSlugs = uniqueSlugMap(collectionNames);

  const missingGifIds = [];
  const collections = new Map();
  let copiedFilesPerTarget = 0;

  for (const animation of animations) {
    const collectionName = animation.collection?.trim() || "Uncategorized";
    const collectionSlug = collectionSlugs.get(collectionName);
    const sourceFileName = `${animation.id}.gif`;
    const sourceFilePath = path.join(sourceGifsDir, sourceFileName);

    if (!(await pathExists(sourceFilePath))) {
      missingGifIds.push(animation.id);
      continue;
    }

    for (const targetRoot of TARGET_ROOTS) {
      const targetCollectionDir = path.join(targetRoot, collectionSlug);
      const targetFilePath = path.join(targetCollectionDir, sourceFileName);

      await mkdir(targetCollectionDir, { recursive: true });
      await copyFile(sourceFilePath, targetFilePath);
    }

    copiedFilesPerTarget += 1;

    const collectionEntry = collections.get(collectionName) ?? {
      name: collectionName,
      slug: collectionSlug,
      items: [],
    };

    collectionEntry.items.push({
      id: animation.id,
      name: animation.name,
      fileName: sourceFileName,
      publicPath: `/images/decor/${collectionSlug}/${sourceFileName}`,
    });

    collections.set(collectionName, collectionEntry);
  }

  const manifestBase = {
    sourceRoot,
    sourceGifsDir,
    targetRoots: TARGET_ROOTS,
    importedAt: new Date().toISOString(),
    totalAnimationEntries: animations.length,
    uniqueGifFiles: new Set(animations.map((animation) => animation.id)).size,
    copiedFiles: copiedFilesPerTarget,
    totalCollections: collections.size,
    missingGifIds,
    collections: [...collections.values()]
      .map((collection) => ({
        ...collection,
        itemCount: collection.items.length,
        items: collection.items.sort((left, right) =>
          left.name.localeCompare(right.name),
        ),
      }))
      .sort((left, right) => left.name.localeCompare(right.name)),
  };

  const manifestPaths = [];

  for (const targetRoot of TARGET_ROOTS) {
    const manifestPath = path.join(targetRoot, MANIFEST_FILE_NAME);
    await writeFile(
      manifestPath,
      `${JSON.stringify({ ...manifestBase, targetRoot }, null, 2)}\n`,
    );
    manifestPaths.push(manifestPath);
  }

  console.log(
    JSON.stringify(
      {
        sourceRoot,
        targetRoots: TARGET_ROOTS,
        copiedFilesPerTarget,
        totalCollections: collections.size,
        manifests: manifestPaths,
        missingGifIds,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
