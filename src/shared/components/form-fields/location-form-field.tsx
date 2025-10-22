"use client";

import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { useWatch } from "react-hook-form";

import { CitySelect, CountrySelect, StateSelect } from "@/components/location";

import { FormFieldWrapper } from "./form-field-wrapper";

// Base interface for shared props
interface BaseLocationFieldProps<T extends FieldValues> {
  control: Control<T>;
  disabled?: boolean;
  required?: boolean;
}

// Country Form Field Component
interface CountryFormFieldProps<T extends FieldValues>
  extends BaseLocationFieldProps<T> {
  name: FieldPath<T>;
  label?: string;
  description?: string;
  placeholder?: string;
}

export function CountryFormField<T extends FieldValues>({
  control,
  name,
  label = "Country",
  description,
  placeholder = "Select country...",
  disabled = false,
  required,
}: CountryFormFieldProps<T>) {
  return (
    <FormFieldWrapper
      control={control}
      name={name}
      label={label}
      description={description}
      required={required}
      renderChild={(field) => (
        <CountrySelect
          value={field.value}
          onValueChange={field.onChange}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}
    />
  );
}

// State Form Field Component
interface StateFormFieldProps<T extends FieldValues>
  extends BaseLocationFieldProps<T> {
  name: FieldPath<T>;
  countryName: FieldPath<T>;
  label?: string;
  description?: string;
  placeholder?: string;
}

export function StateFormField<T extends FieldValues>({
  control,
  name,
  countryName,
  label = "State/Province",
  description,
  placeholder = "Select state...",
  disabled = false,
  required,
}: StateFormFieldProps<T>) {
  // Use useWatch to properly watch for country changes and trigger re-renders
  const watchedCountry = useWatch({
    control,
    name: countryName,
  });

  return (
    <FormFieldWrapper
      control={control}
      name={name}
      label={label}
      description={description}
      required={required}
      renderChild={(field) => (
        <StateSelect
          countryName={watchedCountry}
          value={field.value}
          onValueChange={field.onChange}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}
    />
  );
}

// City Form Field Component
interface CityFormFieldProps<T extends FieldValues>
  extends BaseLocationFieldProps<T> {
  name: FieldPath<T>;
  countryName: FieldPath<T>;
  stateName: FieldPath<T>;
  label?: string;
  description?: string;
  placeholder?: string;
}

export function CityFormField<T extends FieldValues>({
  control,
  name,
  countryName,
  stateName,
  label = "City",
  description,
  placeholder = "Select city...",
  disabled = false,
  required,
}: CityFormFieldProps<T>) {
  // Use useWatch to properly watch for country and state changes
  const [watchedCountry, watchedState] = useWatch({
    control,
    name: [countryName, stateName],
  });

  return (
    <FormFieldWrapper
      control={control}
      name={name}
      label={label}
      description={description}
      required={required}
      renderChild={(field) => (
        <CitySelect
          countryName={watchedCountry}
          stateName={watchedState}
          value={field.value}
          onValueChange={field.onChange}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}
    />
  );
}

// Refactored main component using the separated components
interface LocationFormFieldsProps<T extends FieldValues> {
  control: Control<T>;
  countryName: FieldPath<T>;
  stateName: FieldPath<T>;
  cityName?: FieldPath<T>;
  countryLabel?: string;
  stateLabel?: string;
  cityLabel?: string;
  countryDescription?: string;
  stateDescription?: string;
  cityDescription?: string;
  countryPlaceholder?: string;
  statePlaceholder?: string;
  cityPlaceholder?: string;
  customCityPlaceholder?: string;
  disabled?: boolean;
  includeCity?: boolean;
  required?: boolean;
}

export function LocationFormFields<T extends FieldValues>({
  control,
  countryName,
  stateName,
  cityName,
  countryLabel,
  stateLabel,
  cityLabel,
  countryDescription,
  stateDescription,
  cityDescription,
  countryPlaceholder,
  statePlaceholder,
  cityPlaceholder,
  disabled = false,
  includeCity = false,
  required,
}: LocationFormFieldsProps<T>) {
  return (
    <>
      <CountryFormField
        control={control}
        name={countryName}
        label={countryLabel}
        description={countryDescription}
        placeholder={countryPlaceholder}
        disabled={disabled}
        required={required}
      />

      <StateFormField
        control={control}
        name={stateName}
        countryName={countryName}
        label={stateLabel}
        description={stateDescription}
        placeholder={statePlaceholder}
        disabled={disabled}
        required={required}
      />

      {includeCity && cityName && (
        <CityFormField
          control={control}
          name={cityName}
          countryName={countryName}
          stateName={stateName}
          label={cityLabel}
          description={cityDescription}
          placeholder={cityPlaceholder}
          disabled={disabled}
          required={required}
        />
      )}
    </>
  );
}
