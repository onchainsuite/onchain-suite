import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const STORAGE_KEY = "onboarding-progress";

interface UseOnboardingPersistence<T> {
  step: number;
  data: Partial<T>;
  setStep: (step: number) => void;
  setData: (data: Partial<T>) => void;
  reset: () => void;
}

export function useOnboardingPersistence<T>(): UseOnboardingPersistence<T> {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialStep = parseInt(searchParams.get("step") ?? "1", 10);

  const [step, setStepState] = useState<number>(initialStep);
  const [data, setDataState] = useState<Partial<T>>({});

  // Load from localStorage once on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.step) setStepState(parsed.step);
        if (parsed?.data) setDataState(parsed.data);
        router.replace(`/onboarding?step=${parsed.step ?? 1}`);
      } catch {
        console.warn("Invalid onboarding localStorage data");
      }
    }
  }, [router]);

  // Save to localStorage on any change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, data }));
  }, [step, data]);

  // Reflect step in URL
  useEffect(() => {
    router.replace(`/onboarding?step=${step}`);
  }, [router, step]);

  const setStep = (newStep: number) => {
    setStepState(newStep);
  };

  const setData = (newData: Partial<T>) => {
    setDataState((prev) => ({ ...prev, ...newData }));
  };

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setStepState(1);
    setDataState({});
  };

  return {
    step,
    data,
    setStep,
    setData,
    reset,
  };
}
