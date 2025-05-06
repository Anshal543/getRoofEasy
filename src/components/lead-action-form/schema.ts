import { z } from "zod";
export const leadFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^\d+$/, "Phone must contain only numbers"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  rlink: z.string().min(1, "RLINK is required"),
  address: z.string().min(1, "Address is required"),
  material: z.string().min(1, "Material is required"),
  roof_pitch: z.string().min(1, "Roof pitch is required"),
  roof_area: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Roof area must be positive").default(0),
  ),
  shingle_roof_cost_low: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Cost must be positive").default(0),
  ),
  shingle_roof_cost_high: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Cost must be positive").default(0),
  ),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;
