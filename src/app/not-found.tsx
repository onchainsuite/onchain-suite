import { ArrowLeftIcon, HomeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

/**
 * Terminal 404 — deep-navy canvas, blueprint grid, a "command not found"
 * terminal window, and two CLI-style actions. Matches the OnchainSuite terminal
 * design system (see design.md). Server component.
 */
export default function NotFound() {
  return (
    <div className="os-404">
      <div className="os-404-inner">
        <div className="os-404-glyph">404</div>

        <div className="os-404-term">
          <div className="os-404-term-bar">
            <i />
            <i />
            <i />
            <span>onchainsuite@node-01: ~</span>
          </div>
          <div className="os-404-term-body">
            <div>
              <span className="p">onchainsuite@node-01:~$</span> cd{" "}
              <span className="c">{"<this-page>"}</span>
            </div>
            <div className="e">✗ error: route not found (exit 404)</div>
            <div className="s">
              the page you&apos;re looking for doesn&apos;t exist or has moved.
            </div>
            <div>
              <span className="p">onchainsuite@node-01:~$</span>{" "}
              <span className="os-404-cursor" />
            </div>
          </div>
        </div>

        <div className="os-404-actions">
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-[#00e5ff] bg-[#00e5ff] px-6 py-3 font-mono text-sm text-[#00121a] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#80f2ff] hover:shadow-[6px_6px_0_rgba(0,229,255,0.3)]"
          >
            <HomeIcon className="h-4 w-4" aria-hidden="true" />
            cd ~ (home)
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 border border-[rgba(0,229,255,0.25)] px-6 py-3 font-mono text-sm text-[#e8edf5] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[#00e5ff] hover:text-[#00e5ff] hover:shadow-[4px_4px_0_rgba(0,229,255,0.15)]"
          >
            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
