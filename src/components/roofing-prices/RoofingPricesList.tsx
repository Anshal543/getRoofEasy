"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/context/Sidebar";
import { api } from "@/utils/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const validatePriceRange = (low: string, high: string, enabled: boolean) => {
  if (!enabled) return true;
  const lowNum = parseFloat(low || "0");
  const highNum = parseFloat(high || "0");
  return highNum > lowNum || "High price must be greater than low price";
};

const formSchema = z
  .object({
    id: z.number().optional(),
    shingle_enabled: z.boolean().optional(),
    shingle_low_cost_per_square: z.string().min(1, "Required"),
    shingle_high_cost_per_square: z.string().min(1, "Required"),

    metal_enabled: z.boolean().optional(),
    metal_low_cost_per_square: z.string().min(1, "Required"),
    metal_high_cost_per_square: z.string().min(1, "Required"),

    cedar_enabled: z.boolean().optional(),
    cedar_low_cost_per_square: z.string().min(1, "Required"),
    cedar_high_cost_per_square: z.string().min(1, "Required"),

    tile_enabled: z.boolean().optional(),
    tile_low_cost_per_square: z.string().min(1, "Required"),
    tile_high_cost_per_square: z.string().min(1, "Required"),

    waste_factor: z.string().min(1, "Required"),
  })
  .superRefine((data, ctx) => {
    const types = ["shingle", "metal", "cedar", "tile"];

    types.forEach((type) => {
      const enabled = data[`${type}_enabled` as keyof RoofingPriceFormValues];
      const low = data[
        `${type}_low_cost_per_square` as keyof RoofingPriceFormValues
      ] as string;
      const high =
        data[`${type}_high_cost_per_square` as keyof RoofingPriceFormValues];

      if (enabled) {
        const isValid = validatePriceRange(
          low,
          high as string,
          enabled as boolean,
        );
        if (isValid !== true) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: isValid,
            path: [`${type}_high_cost_per_square`],
          });
        }
      }
    });
  });

type RoofingPriceFormValues = z.infer<typeof formSchema>;

interface RoofingPriceFormProps {
  defaultValues: Partial<RoofingPriceFormValues>;
}

export function RoofingPriceForm({
  defaultValues = {},
}: RoofingPriceFormProps) {
  const router = useRouter();
  const { sidebarOpen } = useSidebar();
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const form = useForm<RoofingPriceFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      shingle_enabled: defaultValues.shingle_low_cost_per_square !== "0.00",
      shingle_low_cost_per_square:
        defaultValues.shingle_low_cost_per_square || "",
      shingle_high_cost_per_square:
        defaultValues.shingle_high_cost_per_square || "",

      metal_enabled: defaultValues.metal_low_cost_per_square !== "0.00",
      metal_low_cost_per_square: defaultValues.metal_low_cost_per_square || "",
      metal_high_cost_per_square:
        defaultValues.metal_high_cost_per_square || "",

      cedar_enabled: defaultValues.cedar_low_cost_per_square !== "0.00",
      cedar_low_cost_per_square: defaultValues.cedar_low_cost_per_square || "",
      cedar_high_cost_per_square:
        defaultValues.cedar_high_cost_per_square || "",

      tile_enabled: defaultValues.tile_low_cost_per_square !== "0.00",
      tile_low_cost_per_square: defaultValues.tile_low_cost_per_square || "",
      tile_high_cost_per_square: defaultValues.tile_high_cost_per_square || "",

      waste_factor: defaultValues.waste_factor || "",
    },
  });

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      setIsDirty(form.formState.isDirty);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, form.formState.isDirty]);

  const onSubmit = async (data: RoofingPriceFormValues) => {
    setIsLoading(true);

    const submitData = {
      ...data,
      shingle_low_cost_per_square: data.shingle_enabled
        ? data.shingle_low_cost_per_square
        : "0.00",
      shingle_high_cost_per_square: data.shingle_enabled
        ? data.shingle_high_cost_per_square
        : "0.00",

      metal_low_cost_per_square: data.metal_enabled
        ? data.metal_low_cost_per_square
        : "0.00",
      metal_high_cost_per_square: data.metal_enabled
        ? data.metal_high_cost_per_square
        : "0.00",

      cedar_low_cost_per_square: data.cedar_enabled
        ? data.cedar_low_cost_per_square
        : "0.00",
      cedar_high_cost_per_square: data.cedar_enabled
        ? data.cedar_high_cost_per_square
        : "0.00",

      tile_low_cost_per_square: data.tile_enabled
        ? data.tile_low_cost_per_square
        : "0.00",
      tile_high_cost_per_square: data.tile_enabled
        ? data.tile_high_cost_per_square
        : "0.00",

      waste_factor: data.waste_factor,
    };

    try {
      const updatedRoofingPrice = await api.patch(
        `roofing-prices/update/${defaultValues.id}/`,
        {
          ...submitData,
        },
      );
      toast.success("Roofing price updated successfully");
      console.log("Updated roofing price:", updatedRoofingPrice.data);
      form.reset(submitData);
    } catch (error) {
      console.error("Failed to submit form:", error);
      toast.error("Failed to update roofing price", {
        style: {
          backgroundColor: "#ffebee",
          color: "#d32f2f",
          border: "1px solid #ef9a9a",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative space-y-4 px-4 sm:px-6">
      <div className="radial--blur pointer-events-none absolute inset-0 top-1/2 left-1/2 z-0 mx-10 h-4/6 w-3/6 -translate-x-1/2 -translate-y-1/2 transform rounded-[50%] opacity-40" />

      <div
        className={`bg-card border-border overflow-hidden rounded-lg border shadow-lg transition-all duration-200 hover:shadow-xl ${
          sidebarOpen ? "md:ml-64" : "md:ml-20"
        }`}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={`mx-auto p-4 transition-all sm:p-6 xl:pl-10 ${
              sidebarOpen ? "max-w-4xl lg:max-w-screen" : "max-w-screen"
            }`}
          >
            <h2 className="text-muted-foreground mb-4 text-lg font-medium tracking-wider uppercase sm:mb-6">
              Edit Roofing Price
            </h2>

            <div className="mb-6 space-y-4">
              <FormField
                control={form.control}
                name="shingle_enabled"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <Checkbox
                        id="shingle_enabled"
                        checked={Boolean(field.value)}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel
                      htmlFor="shingle_enabled"
                      className="text-muted-foreground text-sm font-medium uppercase"
                    >
                      Shingle
                    </FormLabel>
                  </FormItem>
                )}
              />

              {form.watch("shingle_enabled") && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                  <FormField
                    control={form.control}
                    name="shingle_low_cost_per_square"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground text-sm font-medium uppercase">
                          Low Cost Per Square
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={"0"}
                            step="0.01"
                            className="bg-background border-border focus:ring-primary/50 mt-1 w-full rounded-md border shadow-sm transition-all focus:ring-2 sm:h-10"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shingle_high_cost_per_square"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground text-sm font-medium uppercase">
                          High Cost Per Square
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={"0"}
                            step="0.01"
                            className="bg-background border-border focus:ring-primary/50 mt-1 w-full rounded-md border shadow-sm transition-all focus:ring-2 sm:h-10"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <div className="mb-6 space-y-4">
              <FormField
                control={form.control}
                name="metal_enabled"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <Checkbox
                        id="metal_enabled"
                        checked={Boolean(field.value)}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel
                      htmlFor="metal_enabled"
                      className="text-muted-foreground text-sm font-medium uppercase"
                    >
                      Metal
                    </FormLabel>
                  </FormItem>
                )}
              />

              {form.watch("metal_enabled") && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                  <FormField
                    control={form.control}
                    name="metal_low_cost_per_square"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground text-sm font-medium uppercase">
                          Low Cost Per Square
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={"0"}
                            step="0.01"
                            className="bg-background border-border focus:ring-primary/50 mt-1 w-full rounded-md border shadow-sm transition-all focus:ring-2 sm:h-10"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="metal_high_cost_per_square"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground text-sm font-medium uppercase">
                          High Cost Per Square
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={"0"}
                            step="0.01"
                            className="bg-background border-border focus:ring-primary/50 mt-1 w-full rounded-md border shadow-sm transition-all focus:ring-2 sm:h-10"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <div className="mb-6 space-y-4">
              <FormField
                control={form.control}
                name="cedar_enabled"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <Checkbox
                        id="cedar_enabled"
                        checked={Boolean(field.value)}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel
                      htmlFor="cedar_enabled"
                      className="text-muted-foreground text-sm font-medium uppercase"
                    >
                      Cedar
                    </FormLabel>
                  </FormItem>
                )}
              />

              {form.watch("cedar_enabled") && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                  <FormField
                    control={form.control}
                    name="cedar_low_cost_per_square"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground text-sm font-medium uppercase">
                          Low Cost Per Square
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={"0"}
                            step="0.01"
                            className="bg-background border-border focus:ring-primary/50 mt-1 w-full rounded-md border shadow-sm transition-all focus:ring-2 sm:h-10"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cedar_high_cost_per_square"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground text-sm font-medium uppercase">
                          High Cost Per Square
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={"0"}
                            step="0.01"
                            className="bg-background border-border focus:ring-primary/50 mt-1 w-full rounded-md border shadow-sm transition-all focus:ring-2 sm:h-10"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <div className="mb-6 space-y-4">
              <FormField
                control={form.control}
                name="tile_enabled"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <Checkbox
                        id="tile_enabled"
                        checked={Boolean(field.value)}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel
                      htmlFor="tile_enabled"
                      className="text-muted-foreground text-sm font-medium uppercase"
                    >
                      Tile
                    </FormLabel>
                  </FormItem>
                )}
              />

              {form.watch("tile_enabled") && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                  <FormField
                    control={form.control}
                    name="tile_low_cost_per_square"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground text-sm font-medium uppercase">
                          Low Cost Per Square
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={"0"}
                            step="0.01"
                            className="bg-background border-border focus:ring-primary/50 mt-1 w-full rounded-md border shadow-sm transition-all focus:ring-2 sm:h-10"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tile_high_cost_per_square"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground text-sm font-medium uppercase">
                          High Cost Per Square
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={"0"}
                            step="0.01"
                            className="bg-background border-border focus:ring-primary/50 mt-1 w-full rounded-md border shadow-sm transition-all focus:ring-2 sm:h-10"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <div className="mb-6 space-y-4">
              <FormField
                control={form.control}
                name="waste_factor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-sm font-medium uppercase">
                      Waste Factor
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="bg-background border-border focus:ring-primary/50 mt-1 w-full rounded-md border shadow-sm transition-all focus:ring-2 sm:h-10"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:mt-8 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/roofing-prices")}
                className="border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring w-full cursor-pointer rounded-md border px-4 py-2 text-sm font-medium shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring w-full cursor-pointer rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
                disabled={isLoading || !isDirty || !form.formState.isDirty}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Pricing"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
