import { useCallback, useEffect, useState } from "react";

type SetValue<T> = (value: T | ((prevValue: T) => T)) => void;

interface UseLocalStorageReturn<T> {
  value: T;
  setValue: SetValue<T>;
  getValue: () => T | null;
  removeValue: () => void;
  clearAll: () => void;
  isLoading: boolean;
}

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> => {
  // State to store the value
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize the value from localStorage on mount
  useEffect(() => {
    try {
      // Check if we're on the client side
      if (typeof window !== "undefined") {
        const item = window.localStorage.getItem(key);
        if (item) {
          const parsedItem: T = JSON.parse(item);
          setStoredValue(parsedItem);
        }
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  // Function to set value in localStorage
  const setValue: SetValue<T> = useCallback(
    (value) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore: T =
          value instanceof Function ? value(storedValue) : value;

        // Save state
        setStoredValue(valueToStore);

        // Save to localStorage
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Function to get current value (useful for accessing outside of component)
  const getValue = useCallback((): T | null => {
    try {
      if (typeof window !== "undefined") {
        const item = window.localStorage.getItem(key);
        return item ? (JSON.parse(item) as T) : null;
      }
      return null;
    } catch (error) {
      console.error(`Error getting localStorage key "${key}":`, error);
      return null;
    }
  }, [key]);

  // Function to remove the key from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Function to clear all localStorage
  const clearAll = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.clear();
        setStoredValue(initialValue);
      }
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  }, [initialValue]);

  return {
    value: storedValue,
    setValue,
    getValue,
    removeValue,
    clearAll,
    isLoading,
  };
};
