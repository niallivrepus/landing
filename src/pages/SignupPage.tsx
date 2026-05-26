import { Logo } from "@jokuh/gooey";
import { Link } from "react-router-dom";
import { PhoneSignupPrompt } from "../components/signup/PhoneSignupPrompt";
import { SiteLink } from "../components/SiteLink";
import { MARKETING_ROOT_CLASS } from "../components/system/shells";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const year = new Date().getFullYear();

export function SignupPage() {
  useDocumentTitle("Sign up — Jokuh");

  return (
    <div className={`${MARKETING_ROOT_CLASS} flex min-h-[100svh] flex-col`}>
      <header className="flex justify-center px-3 pt-8 md:pt-10">
        <Link to="/" className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 light:focus-visible:ring-black/25" aria-label="Jokuh home">
          <Logo width={40} height={24} />
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-3">
        <div className="w-full max-w-[min(calc(100vw-1.5rem),400px)] sm:max-w-[min(calc(100vw-3rem),520px)]">
          <PhoneSignupPrompt />
          <p className="pt-3 text-center font-sans text-[12px] font-medium leading-relaxed text-light-space/55 light:text-zinc-500">
            Paste your number, press send, then copy it when prompted.
          </p>
        </div>
      </main>

      <footer className="px-3 pb-6 pt-4 text-center">
        <p className="font-sans text-[12px] font-medium leading-relaxed text-light-space/50 light:text-zinc-500">
          <SiteLink href="/privacy" className="text-light-space/70 underline-offset-2 hover:underline light:text-zinc-700">
            Privacy Policy
          </SiteLink>
          <span className="mx-1.5 text-light-space/25 light:text-zinc-300" aria-hidden>
            ·
          </span>
          <span className="text-light-space/45 light:text-zinc-500">© {year} Jokuh. All rights reserved.</span>
        </p>
      </footer>
    </div>
  );
}
