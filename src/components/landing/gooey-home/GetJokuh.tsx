import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  APP_STORE_URL,
  resolveIphoneInstallUrl,
  resolveMacDownloadUrl,
  resolveWebAppOrigin,
} from "../../../config/download-links";
import { JokuhOO } from "../../brand/JokuhOO";

export type GetDevice = "mac" | "iphone" | "android" | "other";

const OPEN_EVENT = "gh-get-jokuh";

function detectDevice(): GetDevice {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  const touchMac = /Macintosh/.test(ua) && (navigator.maxTouchPoints ?? 0) > 1;
  if (/iPhone|iPad|iPod/.test(ua) || touchMac) return "iphone";
  if (/Android/i.test(ua)) return "android";
  if (/Macintosh|Mac OS X/.test(ua)) return "mac";
  return "other";
}

/** Where "Download" / "Get Jokuh" goes on a page with no sheet: the homepage opens the sheet on `?get=1`. */
export const GET_JOKUH_HREF = "/?get=1";

/** How many `GetJokuhSheet`s are mounted (the homepage and the Jokuh Docs pages each mount one). */
let mountedSheets = 0;

/**
 * Opens the Get Jokuh sheet, optionally on one device's tab. With no sheet on this page it goes to the homepage,
 * which opens the sheet (`GET_JOKUH_HREF`). The old `/download` page is gone; `/download` redirects there too.
 */
export function openGetJokuh(device?: GetDevice) {
  if (mountedSheets === 0) {
    window.location.assign(GET_JOKUH_HREF);
    return;
  }
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: device }));
}

/** The primary CTA everywhere on the page: opens the Download Jokuh sheet. */
export function GetJokuhButton({ size = "md" }: { size?: "md" | "sm" }) {
  return (
    <button type="button" className={`gh-go gh-go--${size}`} onClick={() => openGetJokuh()} aria-haspopup="dialog">
      Download Jokuh
    </button>
  );
}

/** One quiet line under the CTA: the no-install path, said plainly. */
export function PlatformLinks() {
  return (
    <p className="gh-platforms">
      Free in early access. Or{" "}
      <a href={resolveWebAppOrigin()} target="_blank" rel="noopener noreferrer">
        use Jokuh in your browser
      </a>
      , nothing to install.
    </p>
  );
}

function IphonePanel({ onPhone }: { onPhone: boolean }) {
  const appStore = Boolean(APP_STORE_URL);
  return (
    <div className="gh-get__panel">
      <a className="gh-get__pill gh-get__pill--go" href={resolveIphoneInstallUrl()} target="_blank" rel="noopener noreferrer">
        {appStore ? "Get it on the App Store" : "Download for iPhone and iPad"}
      </a>
      {appStore ? null : (
        <>
          <ol className="gh-get__steps">
            <li>
              <span className="gh-get__num">1</span>
              <span>
                Tap <b>Install TestFlight</b>. It&apos;s Apple&apos;s free app for trying apps early.
              </span>
            </li>
            <li>
              <span className="gh-get__num">2</span>
              <span>
                Tap <b>Accept</b>, then <b>Install</b>. Jokuh lands on your home screen.
              </span>
            </li>
          </ol>
          <p className="gh-get__note">Jokuh is in early access. It&apos;s coming to the App Store.</p>
        </>
      )}
      {onPhone ? null : (
        <div className="gh-get__qr">
          <img src="/gooey-home/qr-iphone.svg" alt="QR code that opens the Jokuh iPhone link" width={132} height={132} />
          <p>Point your iPhone camera here to open it on your phone.</p>
        </div>
      )}
    </div>
  );
}

function MacPanel() {
  return (
    <div className="gh-get__panel">
      <a className="gh-get__pill gh-get__pill--go" href={resolveMacDownloadUrl()} download>
        Download for Mac
      </a>
      <p className="gh-get__note">Open the file, then drag Jokuh into Applications. Needs macOS 14 or newer.</p>
    </div>
  );
}

/** Only platforms that ship today, each with a real link. Android has no app yet, so it isn't listed. */
const TABS: { id: AppDevice; label: string }[] = [
  { id: "iphone", label: "iPhone & iPad" },
  { id: "mac", label: "Mac" },
];

type AppDevice = "iphone" | "mac";

/** The app tab to open first: this device's when it has an app, else Mac on a computer, iPhone on a phone. */
function appTabFor(device: GetDevice): AppDevice {
  if (device === "iphone" || device === "mac") return device;
  return device === "android" ? "iphone" : "mac";
}

/**
 * **Purpose:** The Download Jokuh sheet (it replaced the old `/download` page): the app for this device first (Mac
 * DMG from `/downloads/Jokuh.dmg`; iPhone and iPad through TestFlight in two plain steps with a QR on desktop, or the
 * App Store once `APP_STORE_URL` is set), a switch between the two shipping platforms, then "Use Jokuh in your
 * browser" (app.jokuh.com) as the no-install option. Android isn't listed: there is no Android app to get today.
 * Links come from `config/download-links.ts`.
 * **Connects to:** `GetJokuhButton` / `openGetJokuh`, `GooeyHome` and `DocAppShell` (each mounts one), `JokuhOO`.
 */
export function GetJokuhSheet() {
  const ref = useRef<HTMLDialogElement>(null);
  const [here, setHere] = useState<GetDevice>("other");
  const [device, setDevice] = useState<AppDevice>("mac");

  useEffect(() => {
    const d = detectDevice();
    setHere(d);
    setDevice(appTabFor(d));
    const onOpen = (e: Event) => {
      const want = (e as CustomEvent<GetDevice | undefined>).detail;
      setDevice(appTabFor(want ?? detectDevice()));
      const dlg = ref.current;
      if (dlg && !dlg.open) dlg.showModal();
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    mountedSheets += 1;
    return () => {
      mountedSheets -= 1;
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  const close = () => ref.current?.close();

  return (
    <dialog
      ref={ref}
      className="gh-get"
      aria-labelledby="gh-get-title"
      onClick={(e) => {
        if (e.target === ref.current) close();
      }}
    >
      <div className="gh-get__sheet gh-slab">
        <button type="button" className="gh-get__close gh-bead gh-bead--sm" aria-label="Close" onClick={close}>
          <X size={16} strokeWidth={2} aria-hidden />
        </button>
        <JokuhOO size={52} label="OO" />
        <h2 id="gh-get-title" className="gh-get__title">
          Download Jokuh
        </h2>
        <p className="gh-get__sub">Free while we&apos;re in early access.</p>

        <nav className="gh-get__devices" aria-label="Choose your device">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`gh-get__device gh-slab gh-slab--pill ${device === t.id ? "is-on" : ""}`}
              aria-pressed={device === t.id}
              onClick={() => setDevice(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {device === "mac" ? <MacPanel /> : <IphonePanel onPhone={here === "iphone"} />}

        <div className="gh-get__divider" role="presentation">
          <span>Or skip the download</span>
        </div>

        <a className="gh-get__pill gh-get__pill--dark" href={resolveWebAppOrigin()} target="_blank" rel="noopener noreferrer">
          Use Jokuh in your browser
        </a>
        <p className="gh-get__note">Works on any computer or phone. Nothing to install.</p>
      </div>
    </dialog>
  );
}
