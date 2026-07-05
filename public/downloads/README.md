# macOS direct download asset

Place the **notarized** disk image here before building/deploying the landing site:

```
public/downloads/Jokuh.dmg
```

Build the dmg from `jokuh-live`:

```bash
cd ../jokuh-live
./scripts/release-macos-direct.sh
JOKUH_LANDING_PUBLIC_DIR="$(pwd)/../landing/public/downloads" ./scripts/release-macos-direct.sh
```

The `.dmg` is gitignored (large binary). Railway `www` serves it from `dist/downloads/Jokuh.dmg` after `pnpm build:landing`.

Override URL without copying into the repo: set `VITE_MACOS_DOWNLOAD_URL` on Railway.
