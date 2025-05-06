// export type Customer = {
//   name: string;
//   email: string;
//   company_name: string;
//   company_website: string;
//   webhook_url: string;
//   inbound_phone: string;
//   booking_link: string;
//   sharing_preference: string;
//   roof_material: string;
//   waste_factor: string;
//   low_price: string;
//   high_price: string;
// };

export type Customer = {
  name: string;
  email: string;
  company_name: string;
  company_website: string;
  webhook_url: string;
  inbound_phone: string;
  booking_link: string;
  sharing_preference: string;
  roof_materials: string[]; // Changed from roof_material to array
  waste_factor: string;
  prices: Record<string, { low: string; high: string }>; // New structure for prices
};

export type OnboardingForm = {
  site_name: string;
  snippets: {
    snippet_title: string;
    general_position: string;
    general_code: string;
  }[];
};

export type GeneralPosition =
  | "After <head>"
  | "Before </head>"
  | "After <body>"
  | "Before </body>";

export type AuthUser = {
  id: number;
  name?: string;
  email: string;
  api_key?: string | null;
  status?: string;
  stripe_customer_id?: string | null;
  webhook_url?: string | null;
  stripe_subscription_id?: string | null;
  inbound_phone?: string | null;
  booking_link?: string | null;
  stripe_monthly_subscription_id?: string | null;
  clerk_user_id?: string | null;
  company_name?: string;
  company_website?: string | null;
  sharing_preference?: string | null;
} | null;

export type ApiResponse<T> = {
  next: string | null;
  previous: string | null;
  count: number;
  results: T[];
  status: "success" | "error";
};

export type Lead = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  shingle_roof_cost_low: string;
  shingle_roof_cost_high: string;
  address: string;
  created_at: string;
};

export type PaginationState = {
  currentPage: number;
  page_size: number;
  totalItems: number;
};
