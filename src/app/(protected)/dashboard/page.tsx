"use client";

import dynamic from "next/dynamic";

const LottieAnimation = dynamic(
  () => import("@/app/(protected)/dashboard/LottiePlayer"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] w-[300px] animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
    ),
  },
);

export default function Dashboard() {
  const comingSoonAnimation =
    "https://assets1.lottiefiles.com/packages/lf20_vybwn7df.json";

  return (
    <div className="bg-background text-foreground flex max-h-screen w-full flex-col items-center justify-center">
      <div className="max-w-md px-4 text-center">
        <LottieAnimation
          src={comingSoonAnimation}
          className="h-[300px] w-[300px]"
        />
        <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
          Coming Soon
        </h1>
        <p className="text-muted-foreground mt-4 text-lg">
          We're working on something awesome!
        </p>
        <div className="mt-8 flex justify-center">
          <button
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring rounded-md px-4 py-2 text-sm font-medium shadow transition-colors focus-visible:ring-2 focus-visible:outline-none"
            onClick={() => window.location.reload()}
          >
            Check Again
          </button>
        </div>
      </div>
    </div>
  );
}
