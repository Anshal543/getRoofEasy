import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const protectedRoutes = [
  "/dashboard(.*)",
  "/forum(.*)",
  "/admin-panel(.*)",
  "/leads(.*)",
  "/chat(.*)",
  "/onboarding-form(.*)",
  "/secure-payment(.*)",
  "/roofing-prices(.*)",
];

const isProtectedRoute = createRouteMatcher(protectedRoutes);
export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
