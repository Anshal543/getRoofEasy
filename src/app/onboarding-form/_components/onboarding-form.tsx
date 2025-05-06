"use client";

import Input from "@/components/Input";
import { Button } from "@/components/ui/button";
import type { OnboardingForm } from "@/lib/types";
import { GeneralPosition } from "@/lib/types";
import { onboardingFormSchema } from "@/utils/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

type OnboardingFormData = z.infer<typeof onboardingFormSchema>;

type Props = {
  onFormChange?: (isValid: boolean) => void;
  formData: OnboardingForm;
  setFormData: (onboard: OnboardingForm) => void;
};

function OnboardingForm({ onFormChange, formData, setFormData }: Props) {
  const [siteName, setSiteName] = useState(formData.site_name);

  const isValidSiteName = /^(?!.*getroofquotenow)(?!.*[A-Z])[\w\s-]+$/.test(
    siteName,
  );
  const formattedDomain = isValidSiteName
    ? siteName.trim().toLowerCase().replace(/\s+/g, "-") +
      ".getroofquotenow.com"
    : "";

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingFormSchema),
    mode: "onChange",
    defaultValues: {
      snippets: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "snippets",
  });

  const watchedSnippets = watch("snippets");

  const isLastSnippetComplete = () => {
    if (watchedSnippets.length === 0) return true;
    const last = watchedSnippets[watchedSnippets.length - 1];
    return last.snippet_title && last.general_position && last.general_code;
  };

  useEffect(() => {
    if (onFormChange) onFormChange(isValid);
  }, [isValid, onFormChange]);

  const handleSiteNameChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setSiteName(e.target.value);
    setFormData({ ...formData, site_name: e.target.value });
  };

  const handleSnippetChange = (
    index: number,
    field: keyof OnboardingFormData["snippets"][0],
    value: string,
  ) => {
    const updated = [...formData.snippets];
    updated[index][field] = value;
    setFormData({ ...formData, snippets: updated });
    setValue(`snippets.${index}.${field}`, value);
  };

  const handleAddSnippet = () => {
    const newSnippet = {
      snippet_title: "",
      general_position: "head" as const,
      general_code: "",
    };
    append(newSnippet);
    setFormData({
      ...formData,
      snippets: [...formData.snippets, newSnippet],
    });
  };

  const handleRemoveSnippet = (index: number) => {
    remove(index);
    const updated = [...formData.snippets];
    updated.splice(index, 1);
    setFormData({ ...formData, snippets: updated });
  };

  useEffect(() => {
    if (formData.snippets && formData.snippets.length > 0) {
      const hasValidSnippet = formData.snippets.some(
        (s) => s.snippet_title || s.general_code || s.general_position,
      );
      if (hasValidSnippet) {
        setValue("snippets", formData.snippets);
      }
    }
  }, [setValue]);

  return (
    <form className="space-y-6 p-6">
      <div className="space-y-1">
        <div className="relative">
          <Input
            label="Site Name"
            name="site_name"
            placeholder="Site Name..."
            register={register}
            value={formData.site_name}
            onChange={handleSiteNameChange}
            error={errors.site_name}
            className="w-full"
          />
        </div>
        {siteName && (
          <p className="text-right text-xs text-[var(--gray-500)] dark:text-[var(--gray-400)]">
            Domain:{" "}
            <span className="font-mono text-[var(--blue-600)] dark:text-[var(--blue-400)]">
              {formattedDomain}
            </span>
          </p>
        )}
      </div>

      {fields.length === 0 && (
        <div className="mb-4 text-start text-[var(--gray-500)] dark:text-[var(--gray-400)]">
          Add snippets if you want to add script to your website
        </div>
      )}
      {fields.map((field, index) => (
        <fieldset
          key={field.id}
          className="relative space-y-4 rounded-lg border border-[var(--gray-300)] p-4 dark:border-[var(--gray-700)]"
        >
          <legend className="text-sm font-semibold text-[var(--gray-600)] dark:text-[var(--gray-300)]">
            Snippet #{index + 1}
          </legend>

          <button
            type="button"
            onClick={() => handleRemoveSnippet(index)}
            className="absolute top-2 right-2 text-[var(--red-500)] hover:text-[var(--red-700)]"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <Input
            label="Snippet Title"
            name={`snippets.${index}.snippet_title`}
            placeholder="Snippet Title..."
            register={register}
            value={formData.snippets[index].snippet_title}
            onChange={(e) =>
              handleSnippetChange(index, "snippet_title", e.target.value)
            }
            error={errors?.snippets?.[index]?.snippet_title}
          />

          <Input
            label="General Position"
            name={`snippets.${index}.general_position`}
            type="select"
            register={register}
            value={formData.snippets[index].general_position}
            onChange={(e) =>
              handleSnippetChange(
                index,
                "general_position",
                e.target.value as GeneralPosition,
              )
            }
            error={errors?.snippets?.[index]?.general_position}
            options={[
              { value: "After <head>", label: "After <head>" },
              { value: "Before </head>", label: "Before </head>" },
              { value: "After <body>", label: "After <body>" },
              { value: "Before </body>", label: "Before </body>" },
            ]}
          />

          <Input
            label="General Code"
            name={`snippets.${index}.general_code`}
            type="textarea"
            placeholder="General Code..."
            register={register}
            value={formData.snippets[index].general_code}
            onChange={(e) =>
              handleSnippetChange(index, "general_code", e.target.value)
            }
            error={errors?.snippets?.[index]?.general_code}
          />
        </fieldset>
      ))}

      <div className="flex justify-start">
        <Button
          type="button"
          className="cursor-pointer"
          variant={"outline"}
          onClick={handleAddSnippet}
          disabled={!isLastSnippetComplete()}
        >
          Add Snippet
        </Button>
      </div>
    </form>
  );
}

export default OnboardingForm;
