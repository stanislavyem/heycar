import { FileDrop } from "@/app/blocks/file-drop";
import {
  MAX_FILE_BYTES,
  useContactForm,
  type ContactField,
  type ContactFormMessages,
} from "@/app/blocks/contact-form-submit";
import { Button } from "@/app/ui/button";
import { Checkbox } from "@/app/ui/checkbox";
import { DateField } from "@/app/ui/date-field";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/app/ui/field";
import { Input } from "@/app/ui/input";
import { Label } from "@/app/ui/label";
import { NativeSelect, NativeSelectOption } from "@/app/ui/native-select";
import { RadioGroup, RadioGroupItem } from "@/app/ui/radio-group";
import { Switch } from "@/app/ui/switch";
import { Textarea } from "@/app/ui/textarea";
import { cn } from "@/app/lib/cn";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import * as React from "react";

// Matches what the endpoint accepts, so nothing is refused after the visitor has picked it.
const FILE_ACCEPT =
  ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.rtf," +
  ".jpg,.jpeg,.png,.gif,.webp,.avif,.bmp,.ico,.tif,.tiff";

const DEFAULT_FIELDS: ContactField[] = [
  { name: "name", label: "Name", required: true, autoComplete: "name" },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    autoComplete: "email",
  },
  { name: "message", label: "Message", type: "textarea", required: true },
];

function normalizeOptions(options: ContactField["options"]) {
  return (options ?? []).map((option) =>
    typeof option === "string"
      ? { label: option, value: option }
      : option
  );
}

type ContactFormProps = Omit<React.ComponentProps<"form">, "onSubmit"> & {
  formId: string;
  onSubmit?: (values: Record<string, string>) => Promise<void> | void;
  fields?: ContactField[];
  submitLabel?: string;
  successMessage?: string;
  messages?: ContactFormMessages;
};

function ContactForm({
  formId,
  onSubmit,
  fields = DEFAULT_FIELDS,
  submitLabel = "Send message",
  successMessage = "Thanks — your message has been sent.",
  messages,
  className,
  children,
  ...props
}: ContactFormProps) {
  const id = React.useId();
  const { values, errors, status, failure, text, setField, setFileField, handleSubmit } =
    useContactForm({ formId, onSubmit, fields, messages });

  if (status === "success") {
    return (
      <div
        data-slot="contact-form-success"
        role="status"
        className={cn(
          "flex items-center gap-3 rounded-card border bg-surface p-6 text-sm",
          className
        )}
      >
        <CheckCircle2 className="size-5 shrink-0 text-success" />
        {successMessage}
      </div>
    );
  }

  return (
    <form
      data-slot="contact-form"
      data-vibe-form-id={formId}
      noValidate
      onSubmit={handleSubmit}
      className={cn("grid grid-cols-1 gap-5 sm:grid-cols-2", className)}
      {...props}
    >
      {fields.map((field) => {
        const fieldId = `${id}-${field.name}`;
        const error = errors[field.name];
        const invalid = error ? true : undefined;
        const fieldClass = cn(!field.half && "sm:col-span-2");
        const fieldErrors = error ? [{ message: error }] : undefined;

        if (field.type === "checkbox" || field.type === "switch") {
          const checked = values[field.name] === "true";
          const onCheckedChange = (next: boolean) =>
            setField(field.name, next ? "true" : "");
          return (
            <Field
              key={field.name}
              orientation="horizontal"
              data-invalid={invalid}
              className={fieldClass}
            >
              {field.type === "checkbox" ? (
                <Checkbox
                  id={fieldId}
                  checked={checked}
                  onCheckedChange={onCheckedChange}
                  aria-invalid={invalid}
                />
              ) : (
                <Switch
                  id={fieldId}
                  checked={checked}
                  onCheckedChange={onCheckedChange}
                  aria-invalid={invalid}
                />
              )}
              <FieldContent>
                <FieldLabel htmlFor={fieldId}>{field.label}</FieldLabel>
                <FieldError errors={fieldErrors} />
              </FieldContent>
            </Field>
          );
        }

        if (field.type === "file") {
          return (
            <Field
              key={field.name}
              data-invalid={invalid}
              className={fieldClass}
            >
              <FieldLabel id={`${fieldId}-label`} htmlFor={fieldId}>
                {field.label}
              </FieldLabel>
              <FileDrop
                id={fieldId}
                name={field.name}
                multiple={field.multiple}
                accept={field.accept ?? FILE_ACCEPT}
                maxSize={MAX_FILE_BYTES}
                aria-labelledby={`${fieldId}-label`}
                aria-invalid={invalid}
                title={field.placeholder ?? text.fileDrop}
                hint={text.fileHint}
                removeLabel={text.fileRemove}
                tooLargeLabel={text.fileTooLarge}
                wrongTypeLabel={text.fileWrongType}
                onFilesChange={(picked) => setFileField(field.name, picked)}
              />
              <FieldError errors={fieldErrors} />
            </Field>
          );
        }

        const shared = {
          id: fieldId,
          name: field.name,
          value: values[field.name] ?? "",
          "aria-invalid": invalid,
        };

        return (
          <Field key={field.name} data-invalid={invalid} className={fieldClass}>
            <FieldLabel id={`${fieldId}-label`} htmlFor={fieldId}>
              {field.label}
            </FieldLabel>
            {field.type === "date" ? (
              <DateField
                {...shared}
                onChange={(event) => setField(field.name, event.target.value)}
              />
            ) : field.type === "textarea" ? (
              <Textarea
                {...shared}
                rows={field.rows ?? 5}
                className="field-sizing-fixed"
                placeholder={field.placeholder}
                onChange={(event) => setField(field.name, event.target.value)}
              />
            ) : field.type === "select" ? (
              <NativeSelect
                {...shared}
                className={cn("w-full", !shared.value && "text-muted-foreground")}
                required={field.required}
                onChange={(event) => setField(field.name, event.target.value)}
              >
                <NativeSelectOption value="" disabled={field.required}>
                  {field.placeholder}
                </NativeSelectOption>
                {normalizeOptions(field.options).map((option) => (
                  <NativeSelectOption key={option.value} value={option.value}>
                    {option.label}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            ) : field.type === "radio" ? (
              <RadioGroup
                id={fieldId}
                name={field.name}
                value={shared.value}
                onValueChange={(value) => setField(field.name, String(value))}
                aria-labelledby={`${fieldId}-label`}
                aria-invalid={invalid}
              >
                {normalizeOptions(field.options).map((option, index) => {
                  const optionId = `${fieldId}-${index}`;
                  return (
                    <div key={option.value} className="flex items-center gap-2">
                      <RadioGroupItem id={optionId} value={option.value} aria-invalid={invalid} />
                      <Label htmlFor={optionId} className="font-normal">
                        {option.label}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            ) : (
              <Input
                {...shared}
                type={field.type ?? "text"}
                autoComplete={field.autoComplete}
                placeholder={field.placeholder}
                onChange={(event) => setField(field.name, event.target.value)}
              />
            )}
            <FieldError errors={fieldErrors} />
          </Field>
        );
      })}
      {children}
      {status === "error" && (
        <p role="alert" className="text-sm text-destructive sm:col-span-2">
          {failure}
        </p>
      )}
      <Button
        type="submit"
        disabled={status === "submitting"}
        className="sm:col-span-2"
      >
        {status === "submitting" && <LoaderCircle className="animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  );
}

export { ContactForm };
export type { ContactField, ContactFormMessages, ContactFormProps };
