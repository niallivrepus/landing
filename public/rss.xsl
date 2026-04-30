<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" encoding="UTF-8" indent="yes" />

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="dark light" />
        <title><xsl:value-of select="/rss/channel/title" /></title>
        <style>
          :root {
            color-scheme: dark light;
            --bg: #070707;
            --panel: #111111;
            --text: #f5f5f3;
            --muted: rgba(245, 245, 243, 0.62);
            --faint: rgba(245, 245, 243, 0.38);
            --line: rgba(245, 245, 243, 0.1);
            --link: #f5f5f3;
          }

          @media (prefers-color-scheme: light) {
            :root {
              --bg: #ffffff;
              --panel: #f5f5f3;
              --text: #111111;
              --muted: rgba(17, 17, 17, 0.62);
              --faint: rgba(17, 17, 17, 0.38);
              --line: rgba(17, 17, 17, 0.1);
              --link: #111111;
            }
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            background: var(--bg);
            color: var(--text);
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            -webkit-font-smoothing: antialiased;
          }

          main {
            width: min(100% - 2rem, 860px);
            margin: 0 auto;
            padding: 4rem 0;
          }

          header {
            padding-bottom: 2rem;
            border-bottom: 1px solid var(--line);
          }

          .eyebrow {
            margin: 0 0 0.75rem;
            color: var(--faint);
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
          }

          h1 {
            margin: 0;
            font-size: clamp(2.25rem, 8vw, 4.75rem);
            line-height: 0.95;
            letter-spacing: -0.04em;
          }

          .description {
            max-width: 38rem;
            margin: 1rem 0 0;
            color: var(--muted);
            font-size: 1rem;
            line-height: 1.65;
          }

          .feed-link {
            display: inline-flex;
            margin-top: 1.5rem;
            color: var(--link);
            font-size: 0.875rem;
            font-weight: 650;
            text-decoration: none;
            border-bottom: 1px solid var(--line);
          }

          .items {
            display: grid;
            gap: 1rem;
            margin-top: 1.5rem;
          }

          article {
            border: 1px solid var(--line);
            border-radius: 14px;
            background: var(--panel);
            padding: 1.25rem;
          }

          article a {
            color: var(--link);
            text-decoration: none;
          }

          article a:hover {
            opacity: 0.72;
          }

          h2 {
            margin: 0.4rem 0 0;
            font-size: clamp(1.25rem, 3vw, 1.75rem);
            line-height: 1.08;
            letter-spacing: -0.03em;
          }

          .meta {
            margin: 0;
            color: var(--faint);
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
          }

          .summary {
            margin: 0.85rem 0 0;
            color: var(--muted);
            font-size: 0.95rem;
            line-height: 1.6;
          }

          .help {
            margin-top: 2rem;
            color: var(--faint);
            font-size: 0.8125rem;
            line-height: 1.5;
          }
        </style>
      </head>
      <body>
        <main>
          <header>
            <p class="eyebrow">RSS Feed</p>
            <h1><xsl:value-of select="/rss/channel/title" /></h1>
            <p class="description"><xsl:value-of select="/rss/channel/description" /></p>
            <a class="feed-link" href="/rss.xml">Subscribe at /rss.xml</a>
          </header>

          <section class="items" aria-label="Feed items">
            <xsl:for-each select="/rss/channel/item">
              <article>
                <p class="meta">
                  <xsl:value-of select="category" />
                  <xsl:text> · </xsl:text>
                  <xsl:value-of select="pubDate" />
                </p>
                <h2>
                  <a>
                    <xsl:attribute name="href"><xsl:value-of select="link" /></xsl:attribute>
                    <xsl:value-of select="title" />
                  </a>
                </h2>
                <p class="summary"><xsl:value-of select="description" /></p>
              </article>
            </xsl:for-each>
          </section>

          <p class="help">This is an RSS feed. Use the link above in your preferred feed reader.</p>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
