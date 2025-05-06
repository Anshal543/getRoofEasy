"use client";

import { Player } from "@lottiefiles/react-lottie-player";

export default function LottiePlayer({
  src,
  className,
}: {
  className?: string;
  src: string;
}) {
  return <Player autoplay loop src={src} className={className} />;
}
