import type {
  City,
  Country,
  State,
} from "react-country-state-city/dist/esm/types";

export const getCountryFlag = (country: Country): string => {
  if (country.emoji) {
    return country.emoji;
  }
  const codePoints = country.iso2
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

// Create maps for O(1) lookups
export const createCountryMap = (countries: Country[]) => {
  return new Map(countries.map((country) => [country.name, country]));
};

export const createStateMap = (states: State[]) => {
  return new Map(states.map((state) => [state.name, state]));
};

export const createCityMap = (cities: City[]) => {
  return new Map(cities.map((city) => [city.name, city]));
};
