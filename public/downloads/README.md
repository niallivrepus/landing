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

The `.dmg` is gitignored (large binary). Railway `www` Docker build curls the `macos-1.0.1` GitHub Release into `dist/downloads/Jokuh.dmg`. If that fetch fails, `GET /downloads/Jokuh.dmg` 302s to the same release so the marketing href never points at GitHub.

Override the client href: set `VITE_MACOS_DOWNLOAD_URL` on Railway `www`.
