"use client";

import {
  LockClosedIcon,
  ScaleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

import "./landing-v2.css";
import { Reveal } from "./primitives";
import { PageShell } from "./shared";

const SECTIONS = [
  {
    id: "privacy",
    icon: LockClosedIcon,
    title: "Privacy",
    body: "OnchainSuite monitors on-chain activity read-only and is non-custodial. Personal channels such as email are linked only when a wallet opts in through a zero-knowledge identity bridge, so we never hold data a wallet has not chosen to share. The full privacy policy is being finalised ahead of launch.",
  },
  {
    id: "terms",
    icon: ScaleIcon,
    title: "Terms of Service",
    body: "These terms will govern access to the OnchainSuite early-access program and platform. Early-access participation is offered as-is while the product is in development, and founding rates apply to wallets brought during the early-access period. The full terms are being finalised ahead of launch.",
  },
  {
    id: "compliance",
    icon: ShieldCheckIcon,
    title: "Compliance",
    body: "OnchainSuite is built privacy-first, with zero-knowledge identity linking and read-only, non-custodial on-chain monitoring. SOC 2 and data-processing documentation are in progress and will be published ahead of general availability.",
  },
];

export function LegalPage() {
  return (
    <PageShell>
      <section className="relative overflow-hidden pb-8 pt-16 md:pt-20">
        <div className="grid-bg" />
        <div className="wrap relative max-w-3xl">
          <Reveal>
            <span className="eyebrow">Legal</span>
          </Reveal>
          <Reveal delay={0.06}>
            <h1
              className="mt-5 font-semibold tracking-tight"
              style={{
                fontSize: "clamp(2.1rem, 4.4vw, 3rem)",
                lineHeight: 1.08,
              }}
            >
              Legal &amp; <span className="grad">compliance.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed t-muted">
              OnchainSuite is pre-launch. These policies are being finalised
              ahead of general availability. Questions in the meantime? Email{" "}
              <a
                href="mailto:info@onchainsuite.com"
                className="font-medium t-acc hover:underline"
              >
                info@onchainsuite.com
              </a>
              .
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-20">
        <div className="wrap max-w-3xl space-y-5">
          {SECTIONS.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.id} delay={i * 0.08}>
                <article id={s.id} className="card scroll-mt-28 p-6 md:p-7">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{
                        background: "var(--acc-soft)",
                        color: "var(--acc)",
                      }}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h2 className="text-[19px] font-semibold t-ink">
                      {s.title}
                    </h2>
                  </div>
                  <p className="mt-4 text-[14.5px] leading-relaxed t-muted">
                    {s.body}
                  </p>
                </article>
              </Reveal>
            );
          })}
          <Reveal delay={0.1}>
            <p className="pt-2 text-center text-[12.5px] t-muted2">
              Last updated ahead of general availability · ©{" "}
              {new Date().getFullYear()} OnchainSuite Incorporated
            </p>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}

export default LegalPage;
