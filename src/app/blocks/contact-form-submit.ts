import * as React from "react";

type ContactField = {
  name: string;
  label: string;
  type?:
    | "text"
    | "email"
    | "tel"
    | "date"
    | "textarea"
    | "select"
    | "radio"
    | "checkbox"
    | "switch"
    | "file";
  required?: boolean;
  placeholder?: string;
  options?: (string | { label: string; value: string })[];
  rows?: number;
  autoComplete?: string;
  half?: boolean;
  multiple?: boolean;
  accept?: string;
};

const MAX_FILE_BYTES = 10 * 1024 * 1024;

const DEFAULT_MESSAGES = {
  invalidEmail: "Enter a valid email address",
  fileDrop: "Drop files here, or click to browse",
  fileHint: "Documents or images, up to 10MB each",
  fileRemove: "Remove",
  fileWrongType: "This file type is not accepted",
  fileTooLarge: "Each file must be 10MB or smaller",
  fileRejected: "One of your files was refused. Each must be 10MB or smaller, and a document or image.",
  rateLimited: "Too many attempts just now. Please wait a moment and try again.",
  network: "That didn't reach us. Check your connection and try again.",
  previewUnavailable: "This preview can't send. Reload the page and try again.",
  failed: "Something went wrong. Please try again.",
};

// Without `required`, a missing field reads "<label> is required".
type Messages = typeof DEFAULT_MESSAGES & { required?: string };
type ContactFormMessages = Partial<Messages>;
type MessageKey = keyof typeof DEFAULT_MESSAGES;

// Nothing is sent when a submission fails, so each of these is something to fix and retry.
const FAILURES: Record<string, MessageKey> = {
  FILE_REJECTED: "fileRejected",
  RATE_LIMITED: "rateLimited",
  NETWORK: "network",
  PREVIEW_UNAVAILABLE: "previewUnavailable",
};

function isMalformedEmail(form: HTMLFormElement, name: string) {
  const input = form.elements.namedItem(name);
  return input instanceof HTMLInputElement && input.validity.typeMismatch;
}

function validationErrors(
  fields: ContactField[],
  values: Record<string, string>,
  form: HTMLFormElement,
  text: Messages
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of fields) {
    if (field.type === "file") continue;
    const value = values[field.name] ?? "";
    if (field.required && value === "") {
      errors[field.name] = text.required ?? `${field.label} is required`;
    } else if (field.type === "email" && isMalformedEmail(form, field.name)) {
      errors[field.name] = text.invalidEmail;
    }
  }
  return errors;
}

type ContactFormSending = {
  formId: string;
  onSubmit?: (values: Record<string, string>) => Promise<void> | void;
  fields: ContactField[];
  messages?: ContactFormMessages;
};

// ContactForm's state and sending, for a form that lays out its own fields.
function useContactForm({ formId, onSubmit, fields, messages }: ContactFormSending) {
  const text: Messages = { ...DEFAULT_MESSAGES, ...messages };
  const [values, setValues] = React.useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((field) => [field.name, ""]))
  );
  const [files, setFiles] = React.useState<Record<string, File[]>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [status, setStatus] = React.useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [failure, setFailure] = React.useState<MessageKey>("failed");

  const clearError = (name: string) => {
    setStatus((current) => (current === "error" ? "idle" : current));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const setField = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    clearError(name);
  };

  const setFileField = (name: string, picked: File[]) => {
    setFiles((prev) => ({ ...prev, [name]: picked }));
    clearError(name);
  };

  const fileErrors = (): Record<string, string> =>
    Object.fromEntries(
      fields
        .filter((field) => field.type === "file")
        .map((field): [string, string] => {
          const picked = files[field.name] ?? [];
          if (field.required && picked.length === 0) {
            return [field.name, text.required ?? `${field.label} is required`];
          }
          if (picked.some((file) => file.size > MAX_FILE_BYTES)) {
            return [field.name, text.fileTooLarge];
          }
          return [field.name, ""];
        })
        .filter(([, message]) => message !== "")
    );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const sentForm = event.currentTarget;
    const invalid = {
      ...validationErrors(fields, values, event.currentTarget, text),
      ...fileErrors(),
    };
    if (Object.keys(invalid).length > 0) {
      setErrors(invalid);
      return;
    }
    setStatus("submitting");
    try {
      const submitted = Object.fromEntries(
        fields
          .filter((field) => field.type !== "file")
          .map((field) => [field.name, values[field.name] ?? ""])
      );
      if (!onSubmit) {
        throw new Error(
          `No submission handler configured for form "${formId}".`
        )
      }
      
      await onSubmit(submitted)
      setStatus('success')
    } catch (error) {
      const code = (error as { code?: string } | null)?.code ?? "";
      setFailure(FAILURES[code] ?? "failed");
      setStatus("error");
    }
  };

  return { values, errors, status, failure: text[failure], text, setField, setFileField, handleSubmit };
}

export { MAX_FILE_BYTES, useContactForm };
export type { ContactField, ContactFormMessages, ContactFormSending };
