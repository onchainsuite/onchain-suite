"use client";

import {
  ArrowRightIcon,
  ArrowTopRightOnSquareIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  CheckIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import "./landing-v2.css";
import { submitEarlyAccess } from "./early-access.service";
import { Reveal } from "./primitives";
import { PageShell } from "./shared";

const CALENDLY_URL = "https://calendly.com/onchainsuite/30min";

const REASONS = [
  "Churn win-back",
  "Lifecycle automations",
  "On-chain campaigns",
  "Audience & intelligence",
  "Email + on-chain combined",
  "In-app push notifications",
  "Something else",
];

type Step = 1 | 2 | 3 | 4;

function StepHeader({
  n,
  label,
  active,
  done,
}: {
  n: number;
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold transition-colors"
        style={{
          background: done || active ? "var(--acc)" : "var(--line-2)",
          color: done || active ? "#fff" : "var(--muted)",
        }}
      >
        {done ? <CheckIcon className="h-4 w-4" aria-hidden="true" /> : n}
      </span>
      <span
        className="text-[14px] font-semibold"
        style={{ color: active || done ? "var(--ink)" : "var(--muted-2)" }}
      >
        {label}
      </span>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border bg-white px-3.5 py-2.5 text-[14px] t-ink outline-none transition-colors focus:border-[color:var(--acc)] focus:ring-2 focus:ring-[color:color-mix(in_oklab,var(--acc)_20%,transparent)]";

function Form() {
  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState("");
  const [protocol, setProtocol] = useState("");
  const [email, setEmail] = useState("");
  const [reasons, setReasons] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // prefill the email passed from the hero form (?email=)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const e = params.get("email");
    if (e) setEmail(e);
  }, []);

  const toggleReason = (r: string) =>
    setReasons((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );

  const step1Valid =
    name.trim().length > 0 && protocol.trim().length > 0 && email.includes("@");

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    await submitEarlyAccess({
      email: email.trim(),
      name: name.trim(),
      protocol: protocol.trim(),
      reasons,
      notes: notes.trim() || undefined,
      source: "early-access",
    });
    setSubmitting(false);
    setStep(4);
  };

  if (step === 4) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card flex flex-col items-center p-8 text-center md:p-10"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 340, damping: 18 }}
        >
          <CheckCircleIcon className="h-14 w-14 t-ok" aria-hidden="true" />
        </motion.span>
        <h3 className="mt-4 text-[22px] font-semibold t-ink">
          You&apos;re in, {name ? name.split(" ")[0] : "welcome"} 🎉
        </h3>
        <p className="mt-2 max-w-md text-[14px] leading-relaxed t-muted">
          We&apos;ve registered{" "}
          <span className="font-medium t-ink2">{email || "your email"}</span>
          {protocol ? (
            <>
              {" "}
              for <span className="font-medium t-ink2">{protocol}</span>
            </>
          ) : null}
          . Founding rates are locked in for your team. Pick a 20-minute slot
          and we&apos;ll show you the platform on{" "}
          <span className="font-medium t-ink2">
            {protocol || "your protocol"}
          </span>
          &apos;s own on-chain data.
        </p>
        {reasons.length > 0 ? (
          <div className="mt-4 flex flex-wrap justify-center gap-1.5">
            {reasons.map((r) => (
              <span
                key={r}
                className="rounded-full border px-2.5 py-1 text-[11.5px] font-medium t-acc"
                style={{
                  borderColor:
                    "color-mix(in oklab, var(--acc) 30%, var(--line))",
                  background: "var(--acc-soft)",
                }}
              >
                {r}
              </span>
            ))}
          </div>
        ) : null}
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <CalendarDaysIcon className="h-4 w-4" aria-hidden="true" />
            Book your call
          </a>
          <a href="/" className="btn btn-ghost">
            Back to home
          </a>
        </div>
        <p className="mt-4 text-[11.5px] t-muted2">
          We onboard a handful of teams each week. No spam, ever.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Step 1 */}
      <div
        className="card overflow-hidden"
        style={{
          borderColor:
            step === 1
              ? "color-mix(in oklab, var(--acc) 35%, var(--line))"
              : "var(--line)",
        }}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <StepHeader
            n={1}
            label="About you"
            active={step === 1}
            done={step > 1}
          />
        </div>
        <AnimatePresence initial={false}>
          {step === 1 ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-3 px-5 pb-5">
                <label className="block">
                  <span className="mb-1 block text-[12px] font-medium t-muted">
                    Full name
                  </span>
                  <input
                    className={inputCls}
                    style={{ borderColor: "var(--line)" }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ada Lovelace"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[12px] font-medium t-muted">
                    Protocol name
                  </span>
                  <input
                    className={inputCls}
                    style={{ borderColor: "var(--line)" }}
                    value={protocol}
                    onChange={(e) => setProtocol(e.target.value)}
                    placeholder="Acme Protocol"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[12px] font-medium t-muted">
                    Work email
                  </span>
                  <input
                    type="email"
                    className={inputCls}
                    style={{ borderColor: "var(--line)" }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@protocol.xyz"
                  />
                </label>
                <button
                  type="button"
                  disabled={!step1Valid}
                  onClick={() => setStep(2)}
                  className="btn btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue
                  <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Step 2 */}
      <div
        className="card overflow-hidden"
        style={{
          borderColor:
            step === 2
              ? "color-mix(in oklab, var(--acc) 35%, var(--line))"
              : "var(--line)",
        }}
      >
        <button
          type="button"
          onClick={() => step > 1 && setStep(2)}
          className="flex w-full items-center justify-between px-5 py-4 text-left"
        >
          <StepHeader
            n={2}
            label="Your use case"
            active={step === 2}
            done={step > 2}
          />
        </button>
        <AnimatePresence initial={false}>
          {step === 2 ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-3 px-5 pb-5">
                <span className="block text-[12px] font-medium t-muted">
                  What do you want to use OnchainSuite for?{" "}
                  <span className="t-muted2">(choose all that apply)</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {REASONS.map((u) => {
                    const on = reasons.includes(u);
                    return (
                      <button
                        key={u}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggleReason(u)}
                        className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors"
                        style={
                          on
                            ? {
                                borderColor: "var(--acc)",
                                background: "var(--acc-soft)",
                                color: "var(--acc)",
                              }
                            : {
                                borderColor: "var(--line)",
                                color: "var(--muted)",
                                background: "#fff",
                              }
                        }
                      >
                        {on ? (
                          <CheckIcon
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        ) : null}
                        {u}
                      </button>
                    );
                  })}
                </div>
                <label className="block">
                  <span className="mb-1 block text-[12px] font-medium t-muted">
                    Anything else? (optional)
                  </span>
                  <textarea
                    className={`${inputCls} min-h-[84px] resize-y`}
                    style={{ borderColor: "var(--line)" }}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Tell us about your protocol and goals…"
                  />
                </label>
                <button
                  type="button"
                  disabled={reasons.length === 0}
                  onClick={() => setStep(3)}
                  className="btn btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue
                  {reasons.length > 0 ? ` · ${reasons.length} selected` : ""}
                  <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Step 3 */}
      <div
        className="card overflow-hidden"
        style={{
          borderColor:
            step === 3
              ? "color-mix(in oklab, var(--acc) 35%, var(--line))"
              : "var(--line)",
        }}
      >
        <button
          type="button"
          onClick={() => step > 2 && setStep(3)}
          className="flex w-full items-center justify-between px-5 py-4 text-left"
        >
          <StepHeader
            n={3}
            label="Book a call"
            active={step === 3}
            done={false}
          />
        </button>
        <AnimatePresence initial={false}>
          {step === 3 ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-3 px-5 pb-5">
                <div
                  className="flex items-center gap-3 rounded-xl border px-4 py-5"
                  style={{
                    borderColor: "var(--line-2)",
                    background: "var(--acc-soft)",
                  }}
                >
                  <CalendarDaysIcon
                    className="h-9 w-9 shrink-0 t-acc"
                    aria-hidden="true"
                  />
                  <div>
                    <div className="text-[14px] font-semibold t-ink">
                      Pick a 20-minute slot
                    </div>
                    <div className="text-[12.5px] t-muted">
                      We&apos;ll show you the platform on your own on-chain
                      data. Scheduling opens after you submit.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={submit}
                  disabled={submitting}
                  className="btn btn-primary w-full disabled:opacity-70"
                >
                  {submitting ? "Submitting…" : "Submit & book my call"}
                  {!submitting ? (
                    <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                  ) : null}
                </button>
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-1.5 text-[12.5px] font-medium t-muted transition-colors hover:t-acc"
                >
                  Prefer Calendly? Book a slot directly
                  <ArrowTopRightOnSquareIcon
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  />
                </a>
                <p className="text-center text-[12px] t-muted2">
                  We onboard a handful of teams each week. No spam, ever.
                </p>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function EarlyAccessPage() {
  return (
    <PageShell>
      <section className="relative overflow-hidden pb-16 pt-16 md:pt-20">
        <div className="grid-bg" />
        <div
          className="orb"
          style={{
            width: 420,
            height: 420,
            left: -90,
            top: -60,
            background: "color-mix(in oklab, var(--acc) 26%, transparent)",
          }}
        />
        <div className="wrap relative grid items-start gap-12 lg:grid-cols-[1fr_1fr]">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <span className="eyebrow">Early access</span>
            </Reveal>
            <Reveal delay={0.06} as="h1">
              <h1
                className="mt-5 font-semibold tracking-tight"
                style={{
                  fontSize: "clamp(2.1rem, 4.4vw, 3.1rem)",
                  lineHeight: 1.06,
                }}
              >
                Get early access to <span className="grad">OnchainSuite.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-5 max-w-md text-[16px] leading-relaxed t-muted">
                Tell us about your protocol and book a 20-minute call.
                We&apos;ll show you the platform on your own on-chain data.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="card mt-8 flex items-center gap-4 p-4">
                <PlayCircleIcon
                  className="h-10 w-10 shrink-0 t-acc"
                  aria-hidden="true"
                />
                <div>
                  <div className="text-[14px] font-semibold t-ink">
                    Watch the product demo
                    <span className="ml-2 align-middle text-[11px] font-normal t-muted2">
                      demo coming soon
                    </span>
                  </div>
                  <p className="mt-0.5 text-[12.5px] leading-snug t-muted">
                    A 2-minute tour: live on-chain triggers, the Plays library,
                    and the Intelligence layer.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <Form />
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}

export default EarlyAccessPage;
