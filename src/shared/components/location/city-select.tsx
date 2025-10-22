"use client";

import {
  Building2,
  Check,
  ChevronsUpDown,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { City } from "react-country-state-city/dist/esm/types";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";

import { useCities } from "./hooks";
import { LoadingSpinner } from "./shared";
import type { BaseSelectProps } from "./types";

interface CitySelectProps extends BaseSelectProps {
  countryName?: string;
  stateName?: string;
  allowCustomInput?: boolean;
}

export function CitySelect({
  countryName,
  stateName,
  value,
  onValueChange,
  placeholder = "Select city...",
  disabled = false,
  className,
  allowCustomInput = true,
}: CitySelectProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const {
    data: cities = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useCities(countryName, stateName);

  // Reset value when location changes or city doesn't exist in predefined list
  useEffect(() => {
    if (value && (countryName || stateName) && cities.length > 0) {
      const cityExists = cities.some((city) => city.name === value);
      // Only reset if the value doesn't exist in the predefined list AND it's not a custom input
      // We'll keep custom inputs even if they're not in the predefined list
      if (!cityExists && !allowCustomInput) {
        onValueChange("");
      }
    }
  }, [countryName, stateName, cities, value, onValueChange, allowCustomInput]);

  // Memoize handlers
  const handleSelect = useCallback(
    (city: City | string) => {
      const cityName = typeof city === "string" ? city : city.name;
      onValueChange(cityName);
      setOpen(false);
      setSearchValue("");
    },
    [onValueChange]
  );

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  // Handle custom input
  const handleCustomInput = useCallback(() => {
    if (searchValue.trim()) {
      handleSelect(searchValue.trim());
    }
  }, [searchValue, handleSelect]);

  // Check if search value matches any existing city
  const searchMatchesExistingCity = useMemo(() => {
    return cities.some(
      (city) => city.name.toLowerCase() === searchValue.toLowerCase()
    );
  }, [cities, searchValue]);

  // Determine if we should show the custom input option
  const shouldShowCustomInput = useMemo(() => {
    return (
      allowCustomInput &&
      searchValue.trim() &&
      !searchMatchesExistingCity &&
      !isLoading
    );
  }, [allowCustomInput, searchValue, searchMatchesExistingCity, isLoading]);

  // Determine states
  const isDisabled = disabled || !countryName || !stateName || isLoading;

  // Check if current value is a custom city
  const isCustomCity = useMemo(() => {
    return (
      value && cities.length > 0 && !cities.some((city) => city.name === value)
    );
  }, [value, cities]);

  const getPlaceholderText = useMemo(() => {
    if (!countryName) return "Select country first";
    if (!stateName) return "Select state first";
    if (isLoading) return "Loading cities...";
    if (cities.length === 0) return "No cities available";
    return placeholder;
  }, [countryName, stateName, isLoading, placeholder, cities.length]);

  // Memoize display content
  const getDisplayValue = useMemo(() => {
    if (!value) return null;

    return (
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4" />
        <span className="truncate">{value}</span>
        {isCustomCity && (
          <span className="text-muted-foreground text-xs">(Custom)</span>
        )}
      </div>
    );
  }, [value, isCustomCity]);

  const buttonContent = useMemo(() => {
    if (isLoading) {
      return <LoadingSpinner text="Loading cities..." />;
    }
    if (value) {
      return getDisplayValue;
    }
    return (
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4" />
        <span>{getPlaceholderText}</span>
      </div>
    );
  }, [isLoading, value, getDisplayValue, getPlaceholderText]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={isDisabled}
          className={cn(
            "w-full justify-between",
            !value && "text-muted-foreground",
            isDisabled && "cursor-not-allowed opacity-50",
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
          <CommandInput
            placeholder="Search cities..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            {isError ? (
              <div className="p-4 text-center">
                <p className="text-muted-foreground mb-2 text-sm">
                  Failed to load cities
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
                <CommandEmpty>
                  {cities.length === 0
                    ? "No cities available for this location."
                    : "No city found."}
                </CommandEmpty>

                {/* Custom input option */}
                {shouldShowCustomInput && (
                  <CommandGroup heading="Custom">
                    <CommandItem
                      value={`custom-${searchValue}`}
                      onSelect={handleCustomInput}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="truncate">
                        Add &quot;{searchValue}&quot;
                      </span>
                    </CommandItem>
                  </CommandGroup>
                )}

                {/* Predefined cities */}
                {cities.length > 0 && (
                  <CommandGroup
                    heading={
                      shouldShowCustomInput ? "Predefined Cities" : undefined
                    }
                  >
                    {cities.map((city) => (
                      <CommandItem
                        key={city.id}
                        value={city.name}
                        onSelect={() => handleSelect(city)}
                        className="flex items-center gap-2"
                      >
                        <Building2 className="h-4 w-4" />
                        <span className="truncate">{city.name}</span>
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4 shrink-0",
                            value === city.name ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
