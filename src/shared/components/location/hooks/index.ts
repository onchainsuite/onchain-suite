import { useQuery } from "@tanstack/react-query";
import { GetCity, GetCountries, GetState } from "react-country-state-city";
import type {
  City,
  Country,
  State,
} from "react-country-state-city/dist/esm/types";

export const useCountries = () => {
  return useQuery<Country[]>({
    queryKey: ["countries"],
    queryFn: () => GetCountries(),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days cache time
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// Custom hook for states data
export const useStates = (countryName?: string) => {
  const { data: countries = [] } = useCountries();

  return useQuery<State[]>({
    queryKey: ["states", countryName],
    queryFn: async () => {
      if (!countryName) return [];
      const country = countries.find((c) => c.name === countryName);
      if (!country) return [];
      return GetState(country.id);
    },
    enabled: !!countryName && countries.length > 0,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 2,
  });
};

// Custom hook for cities data
export const useCities = (countryName?: string, stateName?: string) => {
  const { data: countries = [] } = useCountries();
  const { data: states = [] } = useStates(countryName);

  return useQuery<City[]>({
    queryKey: ["cities", countryName, stateName],
    queryFn: async () => {
      if (!countryName || !stateName) return [];
      const country = countries.find((c) => c.name === countryName);
      const state = states.find((s) => s.name === stateName);
      if (!country || !state) return [];
      return GetCity(country.id, state.id);
    },
    enabled:
      !!countryName && !!stateName && countries.length > 0 && states.length > 0,
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60 * 12, // 12 hours
    retry: 2,
  });
};
