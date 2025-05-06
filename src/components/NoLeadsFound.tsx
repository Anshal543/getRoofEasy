"use client";

import dynamic from "next/dynamic";

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false },
);

export default function NoLeads() {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <Player
        autoplay
        loop
        src="/noleadfound.json"
        style={{ height: "200px", width: "200px" }}
      />
      <p className="text-muted-foreground mt-4 text-sm">
        Create your first lead to get started
      </p>
    </div>
  );
}
