# Railway production image for `jokuh.com` / `www.jokuh.com`.
# **Purpose:** Build this Vite landing app with vendored `@jokuh/gooey`, serve via Caddy on Railway `www`.
# **Inputs:** `vendor/gooey/` beside this Dockerfile (mirrored by `scripts/sync-gooey-vendor.mjs` in jokuh-live).
# **Connects to:** `railway.toml`; product app on `app.jokuh.com` (jokuh-live / Railway `live`).

FROM node:22-alpine AS build
WORKDIR /build

COPY vendor/gooey /build/gooey
COPY . /build/landing

WORKDIR /build/gooey
RUN corepack enable pnpm && pnpm install --no-frozen-lockfile

WORKDIR /build/landing

ARG VITE_ORIGIN_APP=https://app.jokuh.com
ARG VITE_ORIGIN_HELP=https://help.jokuh.com
ARG VITE_ORIGIN_STATUS=https://status.jokuh.com
ARG VITE_ORIGIN_DEVELOPERS=
ARG VITE_COOKIE_DOMAIN=.jokuh.com
ENV VITE_ORIGIN_APP=$VITE_ORIGIN_APP \
    VITE_ORIGIN_HELP=$VITE_ORIGIN_HELP \
    VITE_ORIGIN_STATUS=$VITE_ORIGIN_STATUS \
    VITE_ORIGIN_DEVELOPERS=$VITE_ORIGIN_DEVELOPERS \
    VITE_COOKIE_DOMAIN=$VITE_COOKIE_DOMAIN \
    NODE_OPTIONS=--max-old-space-size=4096

RUN corepack enable pnpm \
  && pnpm install --ignore-workspace --no-frozen-lockfile \
  && pnpm run build:landing \
  && mkdir -p /build/out/.well-known \
  && cp -R dist/* /build/out/ \
  && if [ -f public/.well-known/apple-app-site-association ]; then \
       cp public/.well-known/apple-app-site-association /build/out/.well-known/; \
     fi

FROM caddy:2-alpine
WORKDIR /srv

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /build/out /srv
