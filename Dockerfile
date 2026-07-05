# Railway production image for `jokuh.com` / `www.jokuh.com`.
# **Purpose:** Build this Vite landing app with vendored `@jokuh/gooey`, serve via Node on Railway `www`.
# **Connects to:** `server/railway.ts` (static + `/api/*` + app handoff redirects); product app on `app.jokuh.com` (jokuh-live / Railway `live`).

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
ARG VITE_MACOS_DOWNLOAD_URL=
ENV VITE_ORIGIN_APP=$VITE_ORIGIN_APP \
    VITE_ORIGIN_HELP=$VITE_ORIGIN_HELP \
    VITE_ORIGIN_STATUS=$VITE_ORIGIN_STATUS \
    VITE_ORIGIN_DEVELOPERS=$VITE_ORIGIN_DEVELOPERS \
    VITE_COOKIE_DOMAIN=$VITE_COOKIE_DOMAIN \
    VITE_MACOS_DOWNLOAD_URL=$VITE_MACOS_DOWNLOAD_URL \
    NODE_OPTIONS=--max-old-space-size=4096

RUN corepack enable pnpm \
  && pnpm install --ignore-workspace --no-frozen-lockfile \
  && pnpm run build:landing \
  && pnpm run build:server \
  && mkdir -p /build/out/.well-known \
  && cp -R dist/* /build/out/ \
  && if [ -f public/.well-known/apple-app-site-association ]; then \
       cp public/.well-known/apple-app-site-association /build/out/.well-known/; \
     fi

FROM node:22-alpine AS runtime
WORKDIR /srv

ENV NODE_ENV=production \
    STATIC_ROOT=/srv/static \
    PORT=3000

COPY --from=build /build/out /srv/static
COPY --from=build /build/landing/server-dist/railway.mjs /srv/server.mjs
COPY --from=build /build/landing/public /srv/public

EXPOSE 3000
CMD ["node", "/srv/server.mjs"]
