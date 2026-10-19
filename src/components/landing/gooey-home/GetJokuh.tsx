import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  APP_STORE_URL,
  resolveIphoneInstallUrl,
  resolveMacDownloadUrl,
  resolveWebStartUrl,
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

/** Opens the Get Jokuh sheet (mounted once by `GooeyHome`), optionally on one device's tab. */
export function openGetJokuh(device?: GetDevice) {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: device }));
}

/** The primary CTA everywhere on the page: opens the Get Jokuh sheet. */
export function GetJokuhButton({ size = "md" }: { size?: "md" | "sm" }) {
  return (
    <button type="button" className={`gh-go gh-go--${size}`} onClick={() => openGetJokuh()} aria-haspopup="dialog">
      Get Jokuh
    </button>
  );
}

/** One quiet line under the CTA: the no-install path, said plainly. */
export function PlatformLinks() {
  return (
    <p className="gh-platforms">
      Free in early access.{" "}
      <a href={resolveWebStartUrl()} target="_blank" rel="noopener noreferrer">
        Start on the web
      </a>
      , nothing to install.
    </p>
  );
}

function IphonePanel({ onPhone }: { onPhone: boolean }) {
  const appStore = Boolean(APP_STORE_URL);
  return (
    <div className="gh-get__panel">
      <a className="gh-get__pill gh-get__pill--dark" href={resolveIphoneInstallUrl()} target="_blank" rel="noopener noreferrer">
        {appStore ? "Get it on the App Store" : "Get it on iPhone"}
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

function DevicePanel({ device, here }: { device: GetDevice; here: GetDevice }) {
  if (device === "mac") {
    return (
      <div className="gh-get__panel">
        <a className="gh-get__pill gh-get__pill--dark" href={resolveMacDownloadUrl()}>
          Download for Mac
        </a>
        <p className="gh-get__note">Open the file, then drag Jokuh into Applications. Needs macOS 14 or newer.</p>
      </div>
    );
  }
  if (device === "iphone") return <IphonePanel onPhone={here === "iphone"} />;
  return (
    <div className="gh-get__panel">
      <p className="gh-get__note gh-get__note--lead">
        {device === "android" ? "On Android, Jokuh runs right in your browser for now." : "On Windows and Linux, Jokuh runs right in your browser."}{" "}
        Tap <b>Start on the web</b> above.
      </p>
    </div>
  );
}

const TABS: { id: GetDevice; label: string }[] = [
  { id: "iphone", label: "iPhone & iPad" },
  { id: "mac", label: "Mac" },
  { id: "android", label: "Android" },
  { id: "other", label: "Windows & Linux" },
];

/**
 * **Purpose:** The Get Jokuh sheet: a goo sheet that leads with the no-install path ("Start on the web" →
 * app.jokuh.com), then the one right download for this device (Mac file, iPhone via TestFlight in two plain steps
 * with a QR on desktop, web for Android / Windows / Linux), and a small row to pick another device.
 * Links come from `config/download-links.ts` (`APP_STORE_URL` switches iPhone to the App Store when set).
 * **Connects to:** `GetJokuhButton` / `openGetJokuh`, `GooeyHome` (mounts it once), `JokuhOO`.
 */
export function GetJokuhSheet() {
  const ref = useRef<HTMLDialogElement>(null);
  const [here, setHere] = useState<GetDevice>("other");
  const [device, setDevice] = useState<GetDevice>("other");

  useEffect(() => {
    const d = detectDevice();
    setHere(d);
    setDevice(d);
    const onOpen = (e: Event) => {
      const want = (e as CustomEvent<GetDevice | undefined>).detail;
      setDevice(want ?? detectDevice());
      const dlg = ref.current;
      if (dlg && !dlg.open) dlg.showModal();
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
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
          Get Jokuh
        </h2>
        <p className="gh-get__sub">Free while we&apos;re in early access.</p>

        <a className="gh-get__pill gh-get__pill--go" href={resolveWebStartUrl()} target="_blank" rel="noopener noreferrer">
          Start on the web
        </a>
        <p className="gh-get__note">Works in your browser on any computer or phone. Nothing to install.</p>

        <div className="gh-get__divider" role="presentation">
          <span>{device === here && here !== "other" ? "Or get the app for this device" : "Or get the app"}</span>
        </div>

        <DevicePanel device={device} here={here} />

        <nav className="gh-get__devices" aria-label="Other devices">
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
      </div>
    </dialog>
  );
}
