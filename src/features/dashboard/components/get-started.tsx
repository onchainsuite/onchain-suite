"use client";

import {
  Bell,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Database,
  FileText,
  Mail,
  Settings,
  Sparkles,
  Target,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useOnboardingTracking } from "@/features/onboarding-flow/hooks";

const tasks = [
  {
    title: "Connect email",
    description: "Sync your emails for fast follow-ups and a single inbox.",
    completed: true,
    icon: Mail,
    href: "/inbox",
    cta: "Open inbox",
  },
  {
    title: "Connect calendar",
    description: "Connect your calendar to track meetings and stay organized.",
    completed: true,
    icon: Calendar,
    href: "/settings",
    cta: "Open settings",
  },
  {
    title: "Personalize workspace",
    description:
      "Tell us how your team sells and your brand's tone. Get smarter suggestions and a setup that fits your style.",
    completed: false,
    icon: Sparkles,
    href: "/onboarding",
    cta: "Personalize",
  },
  {
    title: "Invite team members",
    description: "Add your team to collaborate on deals and share insights.",
    completed: false,
    icon: Users,
    href: "/settings",
    cta: "Invite",
  },
  {
    title: "Import contacts",
    description: "Bring in your existing contacts to get started faster.",
    completed: false,
    icon: FileText,
    href: "/audience/import-export",
    cta: "Import",
  },
  {
    title: "Set up billing",
    description: "Configure payment methods and billing preferences.",
    completed: false,
    icon: CreditCard,
    href: "/settings",
    cta: "Set up",
  },
  {
    title: "Configure integrations",
    description: "Connect your favorite tools and automate workflows.",
    completed: false,
    icon: Settings,
    href: "/settings",
    cta: "Configure",
  },
  {
    title: "Set up database",
    description: "Organize your data with custom fields and pipelines.",
    completed: false,
    icon: Database,
    href: "/audience",
    cta: "Open audience",
  },
  {
    title: "Enable automations",
    description: "Automate repetitive tasks and save time.",
    completed: false,
    icon: Zap,
    href: "/automations",
    cta: "Open automations",
  },
  {
    title: "Configure notifications",
    description: "Stay updated with customized alert preferences.",
    completed: false,
    icon: Bell,
    href: "/settings",
    cta: "Configure",
  },
  {
    title: "Set sales goals",
    description: "Define targets and track your team's performance.",
    completed: false,
    icon: Target,
    href: "/intelligence/analytics",
    cta: "Open analytics",
  },
  {
    title: "Create workflows",
    description: "Build custom processes to streamline your sales pipeline.",
    completed: false,
    icon: Workflow,
    href: "/automations",
    cta: "Create",
  },
];

export function GetStartedSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const completedCount = tasks.filter((t) => t.completed).length;
  const { progress, isLoading } = useOnboardingTracking();
  const [onboardingCompleteCookie, setOnboardingCompleteCookie] =
    useState(false);

  useEffect(() => {
    const cookieHeader =
      typeof document !== "undefined" ? (document.cookie ?? "") : "";
    const pairs = cookieHeader
      .split(";")
      .map((p) => p.trim())
      .filter((p) => p.length > 0)
      .map((p) => {
        const idx = p.indexOf("=");
        if (idx === -1) return [p, ""] as const;
        return [p.slice(0, idx), p.slice(idx + 1)] as const;
      });
    const map = new Map(pairs);
    setOnboardingCompleteCookie(map.get("onchain.onboardingComplete") === "1");
  }, []);

  const cardsPerPage = 3;
  const totalPages = Math.ceil(tasks.length / cardsPerPage);

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(totalPages - 1, prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="my-6 md:my-8">
      {!isLoading && !onboardingCompleteCookie && !progress?.is_completed && (
        <div className="mb-4 rounded-xl border border-border bg-background p-4 md:mb-6 md:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-semibold text-foreground">
                Finish onboarding to unlock your dashboard
              </div>
              <div className="text-sm text-muted-foreground">
                {typeof progress?.completion_percentage === "number"
                  ? `${progress.completion_percentage}% complete. Continue where you left off.`
                  : "Continue where you left off to personalize your workspace and set up your organization."}
              </div>
            </div>
            <Link
              href="/onboarding"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
            >
              Continue onboarding
            </Link>
          </div>
        </div>
      )}
      <div className="mb-4 flex items-center justify-between md:mb-6">
        <div className="flex items-center gap-2 md:gap-3">
          <h2 className="text-lg font-semibold text-foreground md:text-xl">
            Get started
          </h2>
          <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground md:px-2.5">
            {completedCount} of {tasks.length} done
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="flex h-8 w-8 items-center cursor-pointer justify-center rounded-lg bg-transparent text-muted-foreground transition-all hover:bg-accent/10 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
            aria-label="Previous step"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={goToNext}
            disabled={currentIndex === totalPages - 1}
            className="flex h-8 w-8 items-center cursor-pointer justify-center rounded-lg bg-transparent text-muted-foreground transition-all hover:bg-accent/10 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
            aria-label="Next step"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm md:rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {Array.from({ length: totalPages }).map((_, pageIndex) => {
            const pageTasks = tasks.slice(
              pageIndex * cardsPerPage,
              (pageIndex + 1) * cardsPerPage
            );
            return (
              // eslint-disable-next-line react/no-array-index-key
              <div key={pageIndex} className="min-w-full p-4 md:p-8">
                <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
                  {pageTasks.map((task) => {
                    const Icon = task.icon;
                    return (
                      <Link
                        key={task.title}
                        href={task.href}
                        className="group flex flex-col rounded-xl border border-border bg-background p-5 text-left transition-all hover:shadow-md md:p-6"
                      >
                        <div
                          className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
                            task.completed
                              ? "bg-primary text-primary-foreground"
                              : "bg-accent text-accent-foreground"
                          }`}
                        >
                          {task.completed ? (
                            <Check className="h-6 w-6" />
                          ) : (
                            <Icon className="h-6 w-6" />
                          )}
                        </div>
                        <h3 className="mb-2 text-base font-semibold text-foreground">
                          {task.title}
                        </h3>
                        <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                          {task.description}
                        </p>
                        <div className="self-start rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all group-hover:bg-primary/90">
                          {task.cta}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all cursor-pointer duration-300 ${
              index === currentIndex
                ? "w-6 bg-primary"
                : "w-2 bg-muted/70 hover:bg-muted-foreground/90"
            }`}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
