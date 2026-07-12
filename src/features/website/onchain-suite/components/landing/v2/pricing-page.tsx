"use client";

import {
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";

import "./landing-v2.css";
import { Counter, Reveal, Stagger, StaggerItem } from "./primitives";
import { Heading, PageShell, SIGNUP } from "./shared";
import {
  type BillingPlan,
  billingService,
} from "@/features/billing/billing.service";

/* Indicative usage model (matches the reference's order-of-magnitude). */
const BASE_FEE = 19;
const PER_WALLET = 0.012; // $ per tracked wallet / mo
const PER_SUB = 0.05; // $ per email subscriber / mo

function estimate(wallets: number, subs: number) {
  // No usage at all costs nothing — the base fee only kicks in with usage.
  if (wallets === 0 && subs === 0) return 0;
  return Math.round(BASE_FEE + wallets * PER_WALLET + subs * PER_SUB);
}

function Calculator() {
  const [wallets, setWallets] = useState(10000);
  const [subs, setSubs] = useState(2000);
  const price = useMemo(() => estimate(wallets, subs), [wallets, subs]);

  return (
    <Reveal delay={0.12}>
      <div className="card mx-auto mt-12 max-w-3xl overflow-hidden p-6 md:p-8">
        <div className="grid gap-8 md:grid-cols-[1fr_auto]">
          <div className="space-y-7">
            <Slider
              label="Tracked wallets"
              hint="On-chain wallets you monitor"
              min={0}
              max={50000}
              step={500}
              value={wallets}
              onChange={setWallets}
            />
            <Slider
              label="Email subscribers"
              hint="10 monthly sends bundled each"
              min={0}
              max={50000}
              step={500}
              value={subs}
              onChange={setSubs}
            />
          </div>
          <div
            className="flex flex-col items-center justify-center rounded-2xl px-7 py-6 text-center"
            style={{ background: "var(--acc-soft)", minWidth: 200 }}
          >
            <span className="mono text-[11px] uppercase tracking-[0.16em] t-muted2">
              Estimated
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span
                className="font-semibold tracking-tight t-ink"
                style={{ fontSize: "clamp(2rem,5vw,2.8rem)" }}
              >
                $<Counter to={price} duration={0.5} />
              </span>
              <span className="text-[14px] t-muted">/mo</span>
            </div>
            <span className="mt-1 text-[11px] t-muted2">
              indicative, usage-based
            </span>
          </div>
        </div>
        <p
          className="mt-6 border-t pt-5 text-[13px] leading-relaxed t-muted"
          style={{ borderColor: "var(--line-2)" }}
        >
          A small base fee plus your tracked wallets and email subscribers.
          In-app push to every connected wallet is included, and email is
          optional, so wallets with no linked email cost nothing extra.
          Estimates are indicative; founding rates are locked in for
          early-access teams.
        </p>
      </div>
    </Reveal>
  );
}

function Slider({
  label,
  hint,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (n: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-[14px] font-semibold t-ink">{label}</span>
        <span className="mono text-[14px] font-semibold t-acc">
          {value.toLocaleString()}
        </span>
      </div>
      <p className="mb-2 text-[12px] t-muted2">{hint}</p>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="ocs2-range w-full"
        style={{
          background: `linear-gradient(90deg, var(--acc) ${pct}%, var(--line) ${pct}%)`,
        }}
      />
    </div>
  );
}

const PROFILES = [
  {
    name: "Small",
    price: "~$45",
    who: "A protocol getting started",
    w: "500",
    s: "500",
    cta: "Get early access",
    href: SIGNUP,
    popular: false,
  },
  {
    name: "Growing",
    price: "~$140",
    who: "Scaling retention",
    w: "2,000",
    s: "1,000",
    cta: "Get early access",
    href: SIGNUP,
    popular: true,
  },
  {
    name: "Mid",
    price: "~$660",
    who: "An established protocol",
    w: "10,000",
    s: "10,000",
    cta: "Get early access",
    href: SIGNUP,
    popular: false,
  },
  {
    name: "Large",
    price: "~$3,300",
    who: "High-volume & ecosystems",
    w: "50,000",
    s: "50,000",
    cta: "Talk to us",
    href: "mailto:info@onchainsuite.com",
    popular: false,
  },
];

const planPriceLabel = (price: BillingPlan["price"]) => {
  if (typeof price === "number") return `$${price.toLocaleString()}`;
  if (typeof price === "string" && price.trim().length > 0) return price;
  return "—";
};

/** Live plan catalog cards (GET /billing/plans), same visual language as the
 * illustrative profiles they replace when the backend answers. */
function CatalogPlans({ plans }: { plans: BillingPlan[] }) {
  return (
    <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {plans.map((plan, idx) => {
        const name = plan.name ?? `Plan ${idx + 1}`;
        const popular = plan.slug === "pro" || idx === 2;
        const isCustom =
          typeof plan.price === "string" &&
          plan.price.toLowerCase().includes("custom");
        const features = Array.isArray(plan.features)
          ? plan.features.filter((f): f is string => typeof f === "string")
          : [];
        return (
          <StaggerItem key={name}>
            <div
              className="card relative flex h-full flex-col p-5 transition-transform duration-200 hover:-translate-y-1"
              style={
                popular
                  ? {
                      borderColor:
                        "color-mix(in oklab, var(--acc) 45%, var(--line))",
                      boxShadow: "var(--shadow-acc)",
                    }
                  : undefined
              }
            >
              {popular ? (
                <span
                  className="mono absolute -top-2.5 left-5 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white"
                  style={{ background: "var(--acc)" }}
                >
                  POPULAR
                </span>
              ) : null}
              <span className="text-[13px] font-semibold t-ink">{name}</span>
              <div className="mt-2 flex items-baseline gap-1">
                <span
                  className="font-semibold tracking-tight t-ink"
                  style={{ fontSize: "1.8rem" }}
                >
                  {planPriceLabel(plan.price)}
                </span>
                {!isCustom ? (
                  <span className="text-[13px] t-muted">
                    /{plan.interval ?? "mo"}
                  </span>
                ) : null}
              </div>
              {plan.description ? (
                <p className="mt-1 text-[12.5px] t-muted">{plan.description}</p>
              ) : null}
              {features.length > 0 ? (
                <div
                  className="my-4 space-y-1.5 border-y py-3 text-[12.5px]"
                  style={{ borderColor: "var(--line-2)" }}
                >
                  {features.slice(0, 4).map((feature) => (
                    <div key={feature} className="flex items-start gap-1.5">
                      <CheckIcon
                        aria-hidden="true"
                        className="mt-0.5 h-3.5 w-3.5 shrink-0"
                        style={{ color: "var(--acc)" }}
                      />
                      <span className="t-muted">{feature}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="my-4 flex-1" />
              )}
              <Link
                href={isCustom ? "mailto:info@onchainsuite.com" : SIGNUP}
                className={`mt-auto btn ${popular ? "btn-primary" : "btn-ghost"} w-full`}
              >
                {isCustom ? "Talk to us" : "Get early access"}
              </Link>
            </div>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}

function Profiles() {
  // Live catalog prices when the API is reachable (it may require a session
  // — anonymous visitors then keep the illustrative fallback below).
  const plansQuery = useQuery({
    queryKey: ["billing", "plans", "public-pricing"],
    queryFn: () => billingService.getPlans(),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000,
  });
  const catalogPlans = plansQuery.data?.plans ?? [];
  const hasCatalog = catalogPlans.length > 0;

  return (
    <section className="py-16">
      <div className="wrap">
        <Heading
          eyebrow={hasCatalog ? "Plans" : "Reference profiles"}
          title={
            <>
              Where teams typically <span className="grad">land.</span>
            </>
          }
          sub={
            hasCatalog
              ? "Live prices from our plan catalog — pay in USDC via crypto checkout, upgrade or downgrade anytime."
              : "Illustrative points on a continuous curve, not fixed packages. Your exact price comes from your own wallet and subscriber counts."
          }
        />
        {hasCatalog ? (
          <CatalogPlans plans={catalogPlans} />
        ) : (
          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PROFILES.map((p) => (
              <StaggerItem key={p.name}>
                <div
                  className="card relative flex h-full flex-col p-5 transition-transform duration-200 hover:-translate-y-1"
                  style={
                    p.popular
                      ? {
                          borderColor:
                            "color-mix(in oklab, var(--acc) 45%, var(--line))",
                          boxShadow: "var(--shadow-acc)",
                        }
                      : undefined
                  }
                >
                  {p.popular ? (
                    <span
                      className="mono absolute -top-2.5 left-5 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white"
                      style={{ background: "var(--acc)" }}
                    >
                      POPULAR
                    </span>
                  ) : null}
                  <span className="text-[13px] font-semibold t-ink">
                    {p.name}
                  </span>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span
                      className="font-semibold tracking-tight t-ink"
                      style={{ fontSize: "1.8rem" }}
                    >
                      {p.price}
                    </span>
                    <span className="text-[13px] t-muted">/mo</span>
                  </div>
                  <p className="mt-1 text-[12.5px] t-muted">{p.who}</p>
                  <div
                    className="my-4 space-y-1.5 border-y py-3 text-[12.5px]"
                    style={{ borderColor: "var(--line-2)" }}
                  >
                    <div className="flex justify-between">
                      <span className="t-muted">tracked wallets</span>
                      <span className="mono font-medium t-ink2">{p.w}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="t-muted">subscribers</span>
                      <span className="mono font-medium t-ink2">{p.s}</span>
                    </div>
                  </div>
                  <Link
                    href={p.href}
                    className={`mt-auto btn ${p.popular ? "btn-primary" : "btn-ghost"} w-full`}
                  >
                    {p.cta}
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}

const INCLUDED = [
  "In-app push to 100% of connected wallets, via a drop-in SDK",
  "Email with 10 monthly sends bundled per subscriber",
  "Protocol Plays library: fork-and-edit retention automations",
  "Behavior-triggered automations and on-demand campaigns",
  "Intelligence: MCP plus a SQL engine over normalized on-chain data",
  "Protocol Normalization across Ethereum, Solana, Base, and Polygon",
  "Wallet-first identity with a zero-knowledge privacy bridge",
  "Sub-10-minute first-mile cohort report",
];

function Included() {
  return (
    <section className="py-16">
      <div className="wrap">
        <Heading
          eyebrow="Every plan"
          title={
            <>
              Everything included,{" "}
              <span className="grad">whatever your size.</span>
            </>
          }
          sub="Pricing scales with usage, not features. Every protocol gets the full platform from day one."
        />
        <Stagger className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
          {INCLUDED.map((f) => (
            <StaggerItem key={f}>
              <div className="card flex items-start gap-3 p-4">
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white"
                  style={{ background: "var(--ok)" }}
                >
                  <CheckIcon className="h-3 w-3" aria-hidden="true" />
                </span>
                <span className="text-[13.5px] leading-snug t-ink2">{f}</span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

const PRICING_FAQ = [
  [
    "How does pricing work?",
    "Usage-based, with no rigid tiers. You pay a small base fee plus two usage drivers: the email subscribers you reach and the on-chain wallets you track. The price scales smoothly from the smallest project to the largest, so you only pay for what you actually use.",
  ],
  [
    "What is a tracked wallet?",
    "An on-chain wallet your protocol monitors for behavior. Tracked wallets are the platform's core value, independent of email, so they are billed separately. In-app push reaches every connected wallet with no extra identifier.",
  ],
  [
    "What is an email subscriber?",
    "An emailable contact a wallet has linked privately through the zero-knowledge identity bridge. Each subscriber bundles 10 sends per month, so your sending capacity scales automatically with your list.",
  ],
  [
    "Is there a free plan?",
    "There is no separate free tier, but pricing starts low: a small protocol runs around $45 a month, and you only pay for the wallets and subscribers you use. Early-access teams lock in founding rates.",
  ],
  [
    "Which channels are included, and is there SMS?",
    "In-app push and email are live today, included on every plan. Telegram and Discord are on the roadmap. There is no SMS; in-app push is the lowest-cost, highest-reach channel and leads the set.",
  ],
  [
    "What about larger protocols?",
    "Pricing is continuous, so it keeps scaling past the reference profiles. Larger protocols and ecosystems move to a custom agreement; talk to us for an exact quote from your wallet and subscriber counts.",
  ],
];

function PricingFaq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-16">
      <div className="wrap">
        <Heading eyebrow="Pricing FAQ" title="Pricing, explained." />
        <div className="mx-auto mt-10 max-w-2xl space-y-3">
          {PRICING_FAQ.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <Reveal key={q} delay={i * 0.04}>
                <div
                  className="card overflow-hidden"
                  style={{
                    borderColor: isOpen
                      ? "color-mix(in oklab, var(--acc) 35%, var(--line))"
                      : "var(--line)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-[15px] font-semibold t-ink">{q}</span>
                    <ChevronDownIcon
                      className="h-5 w-5 shrink-0 t-muted transition-transform duration-300"
                      style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
                      aria-hidden="true"
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
                      >
                        <p className="px-5 pb-5 text-[14px] leading-relaxed t-muted">
                          {a}
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PricingCta() {
  return (
    <section className="py-16">
      <div className="wrap">
        <Reveal>
          <div
            className="relative overflow-hidden rounded-3xl px-8 py-14 text-center"
            style={{
              background: "linear-gradient(135deg, var(--acc), var(--acc-h))",
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 20%, rgba(255,255,255,.4), transparent 40%), radial-gradient(circle at 80% 80%, rgba(47,148,255,.5), transparent 45%)",
              }}
            />
            <div className="relative mx-auto max-w-2xl">
              <h2
                className="font-semibold tracking-tight text-white"
                style={{
                  fontSize: "clamp(1.8rem,3.4vw,2.6rem)",
                  lineHeight: 1.1,
                }}
              >
                Start acting on what your users do on-chain.
              </h2>
              <p className="mt-4 text-[16px] text-white/85">
                Write your first rule today. It fires the moment a wallet acts,
                until you pause it.
              </p>
              <div className="mt-7 flex justify-center">
                <Link
                  href={SIGNUP}
                  className="btn"
                  style={{ background: "#fff", color: "var(--acc)" }}
                >
                  Get early access
                  <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              <p className="mt-5 text-[12.5px] text-white/70">
                Usage-based pricing · in-app push + email · founding rates for
                early teams
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function PricingPage() {
  return (
    <PageShell>
      <section className="relative overflow-hidden pb-6 pt-16 md:pt-20">
        <div className="grid-bg" />
        <div
          className="orb"
          style={{
            width: 420,
            height: 420,
            right: -80,
            top: -80,
            background: "color-mix(in oklab, var(--acc) 28%, transparent)",
          }}
        />
        <div className="wrap relative">
          <Heading
            eyebrow="Founding rates for early teams"
            title={
              <>
                Usage-based pricing, priced by{" "}
                <span className="grad">wallets and reach.</span>
              </>
            }
            sub="A small base fee plus two usage drivers: the on-chain wallets you track and the email subscribers you reach. No rigid tiers, no SMS, no per-message fees on in-app push."
          />
          <Calculator />
        </div>
      </section>
      <Profiles />
      <Included />
      <PricingFaq />
      <PricingCta />
    </PageShell>
  );
}

export default PricingPage;
