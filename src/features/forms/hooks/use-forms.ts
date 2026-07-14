"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  type CaptureForm,
  type CreateFormInput,
  formsService,
  type UpdateFormInput,
} from "../forms.service";

export const FORMS_KEY = ["forms", "list"] as const;

/** Server state for capture forms — owned by React Query, inherits app caching defaults. */
export function useFormsList() {
  return useQuery({
    queryKey: FORMS_KEY,
    queryFn: () => formsService.listForms(),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useCreateForm(onSuccess?: (form: CaptureForm) => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateFormInput) => formsService.createForm(input),
    onSuccess: (form) => {
      toast.success("Form created");
      queryClient
        .invalidateQueries({ queryKey: FORMS_KEY })
        .catch(() => undefined);
      onSuccess?.(form);
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : "Failed to create form"),
  });
}

export function useUpdateForm(onSuccess?: (form: CaptureForm) => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateFormInput }) =>
      formsService.updateForm(id, input),
    onSuccess: (form) => {
      toast.success("Form updated");
      queryClient
        .invalidateQueries({ queryKey: FORMS_KEY })
        .catch(() => undefined);
      onSuccess?.(form);
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : "Failed to update form"),
  });
}

export function useConnectForm(onSuccess?: (form: CaptureForm) => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => formsService.connectForm(id),
    onSuccess: (form) => {
      toast.success("Connected to API — ZK encryption enabled");
      queryClient
        .invalidateQueries({ queryKey: FORMS_KEY })
        .catch(() => undefined);
      onSuccess?.(form);
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : "Failed to connect"),
  });
}

export function useDeleteForm(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => formsService.deleteForm(id),
    onSuccess: () => {
      toast.success("Form deleted");
      queryClient
        .invalidateQueries({ queryKey: FORMS_KEY })
        .catch(() => undefined);
      onSuccess?.();
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : "Failed to delete"),
  });
}
