import { z } from "zod";

export const customerFormSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(255),
    email: z.string().email("Invalid email").max(255),
    webhook_url: z.string().url("Invalid URL").optional().or(z.literal("")),
    inbound_phone: z.string().max(255).optional().or(z.literal("")),
    booking_link: z.string().max(255).optional().or(z.literal("")),
    company_name: z.string().min(3, "Company name is required").max(255),
    company_website: z.string().url("Invalid URL").optional().or(z.literal("")),
    sharing_preference: z
      .enum(["private", "public", "pre_existing", "templated", "custom"])
      .optional()
      .or(z.literal("")),
    roof_materials: z.array(z.enum(["shingle", "metal", "tile", "cedar"])),
    waste_factor: z
      .string()
      .regex(
        /^\d+(\.\d{1,2})?$/,
        "Please enter a valid percentage (e.g., 7.00)",
      )
      .optional()
      .refine((val) => (val ? parseFloat(val) > 0 : true)),
    prices: z
      .record(
        z.enum(["shingle", "metal", "tile", "cedar"]),
        z.object({
          low: z
            .string()
            .regex(
              /^\d+(\.\d{1,2})?$/,
              "Please enter a valid price (e.g., 100.00)",
            )
            .refine((val) => parseFloat(val) > 0, {
              message: "Low price must be greater than 0",
            }),
          high: z
            .string()
            .regex(
              /^\d+(\.\d{1,2})?$/,
              "Please enter a valid price (e.g., 200.00)",
            )
            .refine((val) => parseFloat(val) > 0, {
              message: "High price must be greater than 0",
            }),
        }),
      )
      .optional(),
  })
  .refine(
    (data) => {
      return data.roof_materials.every((material) => {
        const price = data.prices?.[material];
        return (
          price &&
          price.low &&
          price.high &&
          parseFloat(price.high) >= parseFloat(price.low)
        );
      });
    },
    {
      message:
        "For each selected material, high price must be greater than or equal to low price",
      path: ["prices"],
    },
  );

export const onboardingFormSchema = z.object({
  site_name: z
    .string()
    .min(1, "Site name is required")
    .refine((value) => !/[A-Z]/.test(value), {
      message: "Site name must not contain capital letters.",
    })
    .refine((value) => !/getroofquotenow/i.test(value), {
      message: 'Site name must not contain "getroofquotenow".',
    }),
  snippets: z.array(
    z.object({
      snippet_title: z.string(),
      general_position: z.string(),
      general_code: z.string(),
    }),
  ),
});
