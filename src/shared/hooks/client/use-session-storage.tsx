"use client";

import { useCallback, useEffect, useState } from "react";

export function useSessionStorage<T>(key: string, initialValue: T) {
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState<T>(initialValue);

  // Initialize from sessionStorage
  useEffect(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      if (item) {
        setValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error loading sessionStorage key "${key}":`, error);
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  // Update sessionStorage when value changes
  const setStoredValue = useCallback(
    (newValue: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          newValue instanceof Function ? newValue(value) : newValue;
        setValue(valueToStore);
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key, value]
  );

  const removeValue = useCallback(() => {
    try {
      window.sessionStorage.removeItem(key);
      setValue(initialValue);
    } catch (error) {
      console.error(`Error removing sessionStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  const getValue = useCallback(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error getting sessionStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const clearAll = useCallback(() => {
    try {
      window.sessionStorage.clear();
    } catch (error) {
      console.error("Error clearing sessionStorage:", error);
    }
  }, []);

  return {
    value,
    setValue: setStoredValue,
    getValue,
    removeValue,
    clearAll,
    isLoading,
  };
}
