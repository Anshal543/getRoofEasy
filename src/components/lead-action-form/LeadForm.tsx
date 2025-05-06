"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSidebar } from "@/context/Sidebar";
import { api } from "@/utils/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormSkeleton } from "./LeadFormSkeleton";
import { leadFormSchema, LeadFormValues } from "./schema";

type LeadFormProps = {
  mode?: "create" | "update";
  userId: number;
};

const defaultValues: LeadFormValues = {
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  rlink: "",
  address: "",
  material: "",
  roof_pitch: "",
  roof_area: 0,
  shingle_roof_cost_low: 0,
  shingle_roof_cost_high: 0,
};

export default function LeadForm({ mode = "create", userId }: LeadFormProps) {
  const { id } = useParams();
  const { sidebarOpen } = useSidebar();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(mode === "update");

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (mode === "update" && id) {
      const fetchLead = async () => {
        try {
          setIsFetching(true);
          const res = await api.get(`leads/${id}/`);

          const formData = {
            ...defaultValues,
            ...res.data.data,
            roof_area: res.data.data.roof_area ?? 0,
            shingle_roof_cost_low: res.data.data.shingle_roof_cost_low ?? 0,
            shingle_roof_cost_high: res.data.data.shingle_roof_cost_high ?? 0,
          };

          form.reset(formData);
        } catch (error) {
          console.error("Failed to fetch lead:", error);
          toast.error("Failed to load lead data");
        } finally {
          setIsFetching(false);
        }
      };

      fetchLead();
    }
  }, [id, mode, form]);

  const onSubmit = async (data: LeadFormValues) => {
    setIsLoading(true);
    try {
      if (mode === "create") {
        await api.post(`leads/create/`, {
          ...data,
          user: userId,
        });
        toast.success("Lead created successfully");
      } else {
        await api.patch(`leads/update/${id}/`, data);
        toast.success("Lead updated successfully");
      }
      router.push("/leads");
    } catch (error) {
      console.error("Error submitting form", error);
      toast.error("An error occurred while saving the lead");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative space-y-4 px-4 sm:px-6">
      <div className="radial--blur pointer-events-none absolute inset-0 top-1/2 left-1/2 z-0 mx-10 h-4/6 w-3/6 -translate-x-1/2 -translate-y-1/2 transform rounded-[50%] opacity-40" />

      <div
        className={`bg-card border-border overflow-hidden rounded-lg border shadow-lg transition-all duration-200 hover:shadow-xl ${sidebarOpen ? "md:ml-64" : "md:ml-20"} `}
      >
        {isFetching ? (
          <div
            className={`mx-auto p-4 transition-all sm:p-6 ${
              sidebarOpen ? "max-w-4xl lg:max-w-screen" : "max-w-screen"
            }`}
          >
            <FormSkeleton />
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={`mx-auto p-4 transition-all sm:p-6 xl:pl-10 ${
                sidebarOpen ? "max-w-4xl lg:max-w-screen" : "max-w-screen"
              }`}
            >
              <h2 className="text-muted-foreground mb-4 text-lg font-medium tracking-wider uppercase sm:mb-6">
                {mode === "create" ? "Create New Lead" : "Edit Lead"}
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                {Object.entries(defaultValues).map(([name]) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name as keyof LeadFormValues}
                    render={({ field }) => (
                      <FormItem className="group relative">
                        <FormLabel className="text-muted-foreground text-sm font-medium uppercase">
                          {name
                            .split("_")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1),
                            )
                            .join(" ")}
                        </FormLabel>
                        <FormControl>
                          <div className="glow-effect relative">
                            <Input
                              type={
                                name.includes("cost") || name.includes("area")
                                  ? "number"
                                  : "text"
                              }
                              className="bg-background border-border focus:ring-primary/50 mt-1 w-full rounded-md border shadow-sm transition-all focus:ring-2 sm:h-10"
                              {...field}
                              value={field.value ?? ""}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs text-[var(--red-500)]" />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:mt-8 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/leads")}
                  className="border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring w-full cursor-pointer rounded-md border px-4 py-2 text-sm font-medium shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none sm:w-auto"
                >
                  Cancel
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Button
                          type="submit"
                          className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring w-full cursor-pointer rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
                          disabled={
                            isLoading ||
                            (mode === "update" && !form.formState.isDirty)
                          }
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              {mode === "create"
                                ? "Creating..."
                                : "Updating..."}
                            </>
                          ) : (
                            <>
                              {mode === "create"
                                ? "Create Lead"
                                : "Update Lead"}
                            </>
                          )}
                        </Button>
                      </div>
                    </TooltipTrigger>
                    {mode === "update" && !form.formState.isDirty && (
                      <TooltipContent>
                        <p>Make changes to enable the update button</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}
