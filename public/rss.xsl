<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:media="http://search.yahoo.com/mrss/">
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
            --nav: rgba(0, 0, 0, 0.55);
            --panel: rgba(255, 255, 255, 0.025);
            --text: #f5f5f3;
            --muted: rgba(245, 245, 243, 0.62);
            --faint: rgba(245, 245, 243, 0.38);
            --line: rgba(245, 245, 243, 0.1);
            --link: #f5f5f3;
            --thumb: rgba(255, 255, 255, 0.06);
          }

          @media (prefers-color-scheme: light) {
            :root {
              --bg: #ffffff;
              --nav: rgba(255, 255, 255, 0.75);
              --panel: rgba(17, 17, 17, 0.025);
              --text: #111111;
              --muted: rgba(17, 17, 17, 0.62);
              --faint: rgba(17, 17, 17, 0.38);
              --line: rgba(17, 17, 17, 0.1);
              --link: #111111;
              --thumb: rgba(17, 17, 17, 0.05);
            }
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            background: var(--bg);
            color: var(--text);
            font-family: Satoshi, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            -webkit-font-smoothing: antialiased;
            text-rendering: optimizeLegibility;
          }

          a {
            color: inherit;
          }

          .topbar {
            position: fixed;
            inset: 0 0 auto;
            z-index: 10;
            height: 3.5rem;
            background: var(--nav);
            backdrop-filter: saturate(180%) blur(24px);
            -webkit-backdrop-filter: saturate(180%) blur(24px);
          }

          .topbar-inner {
            display: grid;
            grid-template-columns: 5rem 1fr 5rem;
            align-items: center;
            width: min(100% - 1.5rem, 1120px);
            height: 100%;
            margin: 0 auto;
          }

          .home-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.4rem;
            width: fit-content;
            min-height: 2.25rem;
            border: 1px solid var(--line);
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.045);
            padding: 0 0.72rem 0 0.58rem;
            color: var(--text);
            font-size: 0.78rem;
            font-weight: 650;
            line-height: 1;
            text-decoration: none;
            transition: background-color 180ms ease, border-color 180ms ease, opacity 180ms ease, transform 180ms ease;
          }

          .home-button:hover {
            border-color: rgba(245, 245, 243, 0.18);
            background: rgba(255, 255, 255, 0.075);
          }

          .home-button:active {
            transform: translateY(1px);
          }

          .home-button:focus-visible,
          .logo-link:focus-visible,
          article a:focus-visible,
          .feed-link:focus-visible {
            outline: 2px solid rgba(245, 245, 243, 0.34);
            outline-offset: 3px;
          }

          .home-button svg {
            width: 0.88rem;
            height: 0.88rem;
          }

          .logo-link {
            display: inline-flex;
            justify-self: center;
            color: var(--text);
            line-height: 0;
            text-decoration: none;
          }

          .logo-link svg path {
            fill: currentColor;
          }

          main {
            width: min(100% - 1.5rem, 760px);
            margin: 0 auto;
            padding: 6.75rem 0 4rem;
          }

          .feed-header {
            padding-bottom: 1.25rem;
            border-bottom: 1px solid var(--line);
          }

          .eyebrow {
            margin: 0 0 0.5rem;
            color: var(--faint);
            font-size: 0.68rem;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
          }

          h1 {
            margin: 0;
            font-size: clamp(1.7rem, 8vw, 2.55rem);
            font-weight: 650;
            line-height: 1.04;
            letter-spacing: 0;
          }

          .description {
            max-width: 34rem;
            margin: 0.65rem 0 0;
            color: var(--muted);
            font-size: 0.92rem;
            line-height: 1.55;
          }

          .feed-link {
            display: inline-flex;
            margin-top: 0.95rem;
            color: var(--link);
            font-size: 0.8rem;
            font-weight: 650;
            text-decoration: none;
            border-bottom: 1px solid var(--line);
          }

          .items {
            display: grid;
            gap: 0.6rem;
            margin-top: 0.85rem;
          }

          article {
            border: 1px solid var(--line);
            border-radius: 8px;
            background: var(--panel);
            transition: background-color 180ms ease, border-color 180ms ease, opacity 180ms ease;
          }

          article a {
            display: grid;
            grid-template-columns: 4.75rem minmax(0, 1fr);
            gap: 0.85rem;
            min-height: 5.75rem;
            padding: 0.6rem;
            color: var(--link);
            text-decoration: none;
          }

          article:hover {
            border-color: rgba(245, 245, 243, 0.18);
            background: rgba(255, 255, 255, 0.04);
          }

          .thumb {
            position: relative;
            display: block;
            width: 4.75rem;
            height: 4.75rem;
            overflow: hidden;
            border: 1px solid var(--line);
            border-radius: 7px;
            background:
              radial-gradient(circle at 32% 20%, rgba(245, 245, 243, 0.12), transparent 34%),
              var(--thumb);
          }

          .thumb img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .thumb-fallback {
            display: grid;
            width: 100%;
            height: 100%;
            place-items: center;
            color: var(--faint);
          }

          .content {
            min-width: 0;
            padding: 0.1rem 0.1rem 0.1rem 0;
          }

          h2 {
            display: -webkit-box;
            overflow: hidden;
            margin: 0;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            font-size: clamp(0.95rem, 3.8vw, 1.05rem);
            font-weight: 650;
            line-height: 1.22;
            letter-spacing: 0;
          }

          .meta {
            margin: 0.45rem 0 0;
            color: var(--faint);
            font-size: 0.68rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }

          .summary {
            display: -webkit-box;
            overflow: hidden;
            margin: 0.35rem 0 0;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            color: var(--muted);
            font-size: 0.82rem;
            line-height: 1.45;
          }

          .help {
            margin-top: 1.25rem;
            color: var(--faint);
            font-size: 0.76rem;
            line-height: 1.5;
          }

          @media (min-width: 800px) {
            .topbar {
              height: 3.75rem;
            }

            .topbar-inner {
              grid-template-columns: 8rem 1fr 8rem;
            }

            article a {
              grid-template-columns: 5.5rem minmax(0, 1fr);
              min-height: 6.5rem;
              gap: 1rem;
              padding: 0.65rem;
            }

            .thumb {
              width: 5.5rem;
              height: 5.5rem;
            }
          }

          @media (max-width: 380px) {
            .topbar-inner {
              width: min(100% - 1rem, 1120px);
              grid-template-columns: 4.5rem 1fr 4.5rem;
            }

            .home-button {
              padding-inline: 0.58rem;
            }

            .home-button span {
              position: absolute;
              width: 1px;
              height: 1px;
              overflow: hidden;
              clip: rect(0 0 0 0);
              white-space: nowrap;
            }

            main {
              width: min(100% - 1rem, 760px);
            }

            article a {
              grid-template-columns: 4.25rem minmax(0, 1fr);
              gap: 0.7rem;
            }

            .thumb {
              width: 4.25rem;
              height: 4.25rem;
            }
          }
        </style>
      </head>
      <body>
        <nav class="topbar" aria-label="RSS navigation">
          <div class="topbar-inner">
            <a class="home-button" href="/" aria-label="Back to Jokuh home">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M12.5 4.5 7 10l5.5 5.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span>Home</span>
            </a>
            <a class="logo-link" href="/" aria-label="Jokuh home">
              <svg xmlns="http://www.w3.org/2000/svg" width="34" height="20" viewBox="0 0 38 22" fill="none" aria-hidden="true">
                <g>
                  <path d="M27.7824 5.14531C22.5874 6.36044 19.7007 9.48499 19.1325 9.48499C18.5643 9.48499 15.6776 6.36044 10.4827 5.14531C6.70459 4.26162 4.14221 7.69747 6.64694 12.1901C8.19379 15.678 9.77851 17 12.2418 17C14.1937 17 15.4004 15.9752 16.3073 15.3788C16.9965 14.9255 18.035 14.1105 19.1326 14.1105C20.2302 14.1105 21.2686 14.9255 21.958 15.3788C22.8648 15.9752 24.0714 17 26.0234 17C28.4866 17 30.0715 15.678 31.6183 12.1901C33.509 7.50321 31.5608 4.26176 27.7827 5.14546L27.7824 5.14531ZM16.9692 12.4816C16.4843 13.1956 12.9576 15.3082 11.0573 14.0865C9.15706 12.8649 7.37419 8.7448 8.59416 7.85859C9.81413 6.97238 18.1891 10.685 16.9692 12.4816ZM27.2076 14.0865C25.3073 15.3082 21.7807 13.1957 21.2958 12.4816C20.0758 10.685 28.451 6.97223 29.6708 7.85844C30.8906 8.74466 29.1077 12.8649 27.2076 14.0865Z" />
                </g>
              </svg>
            </a>
            <span aria-hidden="true"></span>
          </div>
        </nav>
        <main>
          <header class="feed-header">
            <p class="eyebrow">RSS Feed</p>
            <h1>Newsroom and stories</h1>
            <p class="description"><xsl:value-of select="/rss/channel/description" /></p>
            <a class="feed-link" href="/rss.xml">Subscribe at /rss.xml</a>
          </header>

          <section class="items" aria-label="Feed items">
            <xsl:for-each select="/rss/channel/item">
              <article>
                <a>
                  <xsl:attribute name="href"><xsl:value-of select="link" /></xsl:attribute>
                  <span class="thumb" aria-hidden="true">
                    <xsl:choose>
                      <xsl:when test="media:thumbnail/@url">
                        <img decoding="async" alt="">
                          <xsl:attribute name="loading"><xsl:choose><xsl:when test="position() &lt;= 6">eager</xsl:when><xsl:otherwise>lazy</xsl:otherwise></xsl:choose></xsl:attribute>
                          <xsl:attribute name="src"><xsl:choose><xsl:when test="starts-with(media:thumbnail/@url, /rss/channel/link)"><xsl:value-of select="substring-after(media:thumbnail/@url, /rss/channel/link)" /></xsl:when><xsl:otherwise><xsl:value-of select="media:thumbnail/@url" /></xsl:otherwise></xsl:choose></xsl:attribute>
                        </img>
                      </xsl:when>
                      <xsl:otherwise>
                        <span class="thumb-fallback">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="14" viewBox="0 0 38 22" fill="none" aria-hidden="true">
                            <path d="M27.7824 5.14531C22.5874 6.36044 19.7007 9.48499 19.1325 9.48499C18.5643 9.48499 15.6776 6.36044 10.4827 5.14531C6.70459 4.26162 4.14221 7.69747 6.64694 12.1901C8.19379 15.678 9.77851 17 12.2418 17C14.1937 17 15.4004 15.9752 16.3073 15.3788C16.9965 14.9255 18.035 14.1105 19.1326 14.1105C20.2302 14.1105 21.2686 14.9255 21.958 15.3788C22.8648 15.9752 24.0714 17 26.0234 17C28.4866 17 30.0715 15.678 31.6183 12.1901C33.509 7.50321 31.5608 4.26176 27.7827 5.14546L27.7824 5.14531ZM16.9692 12.4816C16.4843 13.1956 12.9576 15.3082 11.0573 14.0865C9.15706 12.8649 7.37419 8.7448 8.59416 7.85859C9.81413 6.97238 18.1891 10.685 16.9692 12.4816ZM27.2076 14.0865C25.3073 15.3082 21.7807 13.1957 21.2958 12.4816C20.0758 10.685 28.451 6.97223 29.6708 7.85844C30.8906 8.74466 29.1077 12.8649 27.2076 14.0865Z" fill="currentColor" />
                          </svg>
                        </span>
                      </xsl:otherwise>
                    </xsl:choose>
                  </span>
                  <span class="content">
                    <h2><xsl:value-of select="title" /></h2>
                    <p class="summary"><xsl:value-of select="description" /></p>
                    <p class="meta">
                      <xsl:value-of select="category" />
                      <xsl:text> · </xsl:text>
                      <xsl:value-of select="substring(pubDate, 1, 16)" />
                    </p>
                  </span>
                </a>
              </article>
            </xsl:for-each>
          </section>

          <p class="help">This is an RSS feed. Use the link above in your preferred feed reader.</p>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
