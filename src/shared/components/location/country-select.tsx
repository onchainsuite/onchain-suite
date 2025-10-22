"use client";

import { Check, ChevronsUpDown, Globe, RefreshCw } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import type { Country } from "react-country-state-city/dist/esm/types";

import { Button } from "@/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";

import { cn } from "@/lib/utils";

import { useCountries } from "./hooks";
import { ErrorDisplay, LoadingSpinner } from "./shared";
import type { BaseSelectProps } from "./types";
import { createCountryMap, getCountryFlag } from "./utils";

export function CountrySelect({
  value,
  onValueChange,
  placeholder = "Select country...",
  disabled = false,
  className,
}: BaseSelectProps) {
  const [open, setOpen] = useState(false);

  const {
    data: countries = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useCountries();

  // Memoize country map for O(1) lookups
  const countryMap = useMemo(() => createCountryMap(countries), [countries]);

  // Memoize selected country lookup
  const selectedCountry = useMemo(() => {
    return value ? countryMap.get(value) : undefined;
  }, [value, countryMap]);

  // Memoize countries with flags and search values
  const countriesWithFlags = useMemo(() => {
    return countries.map((country) => ({
      ...country,
      flag: getCountryFlag(country),
      searchValue: `${country.name} ${country.iso2}`.toLowerCase(),
    }));
  }, [countries]);

  // Memoize handlers
  const handleSelect = useCallback(
    (country: Country) => {
      onValueChange(country.name);
      setOpen(false);
    },
    [onValueChange]
  );

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  // Memoize display content
  const buttonContent = useMemo(() => {
    if (isLoading || isFetching) {
      return <LoadingSpinner text="Loading countries..." />;
    }
    if (isError) {
      return <ErrorDisplay onRetry={handleRetry} isFetching={isFetching} />;
    }
    if (selectedCountry) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-lg">{getCountryFlag(selectedCountry)}</span>
          <span className="truncate">{selectedCountry.name}</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4" />
        <span>{placeholder}</span>
      </div>
    );
  }, [
    isLoading,
    isFetching,
    isError,
    selectedCountry,
    placeholder,
    handleRetry,
  ]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || isLoading}
          className={cn(
            "w-full justify-between",
            !value && "text-muted-foreground",
            isError && "border-destructive",
            className
          )}
        >
          {buttonContent}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0"
        align="start"
        style={{ minWidth: "var(--radix-popover-trigger-width)" }}
      >
        <Command>
          <CommandInput placeholder="Search countries..." />
          <CommandList>
            {isError ? (
              <div className="p-4 text-center">
                <p className="text-muted-foreground mb-2 text-sm">
                  Failed to load countries
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  disabled={isFetching}
                >
                  {isFetching ? (
                    <>
                      <div className="mr-2 h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                      Retrying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-3 w-3" />
                      Retry
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <>
                <CommandEmpty>No country found.</CommandEmpty>
                <CommandGroup>
                  {countriesWithFlags.map((country) => (
                    <CommandItem
                      key={country.id}
                      value={country.searchValue}
                      onSelect={() => handleSelect(country)}
                      className="flex items-center gap-2"
                    >
                      <span className="text-lg">{country.flag}</span>
                      <span className="truncate">{country.name}</span>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4 shrink-0",
                          value === country.name ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
