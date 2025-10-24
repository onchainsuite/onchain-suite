import { toast } from "sonner";

interface ValidationIssue<TField extends string> {
  path: TField;
  message: string;
}

interface ServerResponse<TData = unknown, TField extends string = string> {
  isSuccessful: boolean;
  message: string;
  statusCode: number;
  data?: TData;
  meta?: {
    issues?: ValidationIssue<TField>[];
    [key: string]: unknown;
  };
}

/**
 * Handles a server response returned by safeExecute.
 * - Shows toast notifications
 * - Optionally maps validation errors to form state
 */
export function handleServerResponse<TData, TField extends string = string>(
  response: ServerResponse<TData, TField>,
  options?: {
    onSuccess?: (data: TData) => void;
    setFieldError?: (field: TField, message: string) => void;
    successToast?: boolean;
    errorToast?: boolean;
    focusFirstError?: boolean;
  }
): void {
  const {
    onSuccess,
    setFieldError,
    successToast = true,
    errorToast = true,
    focusFirstError = true,
  } = options ?? {};

  if (!response.isSuccessful) {
    if (errorToast) toast.error(response.message);

    if (setFieldError && response.meta?.issues?.length) {
      response.meta.issues.forEach((issue, index) => {
        setFieldError(issue.path, issue.message);

        // Optional: Focus on first invalid field for better UX
        if (focusFirstError && index === 0) {
          const element = document.querySelector<HTMLInputElement>(
            `[name="${issue.path}"]`
          );
          element?.focus();
        }
      });
    }

    return;
  }

  if (successToast) toast.success(response.message || "Success!");
  onSuccess?.(response.data as TData);
}
