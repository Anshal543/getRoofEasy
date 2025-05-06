"use client";

import { Fullscreen, Shrink } from "lucide-react";
import { useEffect, useState } from "react";

export default function FullscreenToggle() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const element = document.documentElement as any;

    if (!isFullscreen) {
      element.requestFullscreen?.();
      (element as any).webkitRequestFullscreen?.();
      (element as any).msRequestFullscreen?.();
    } else {
      document.exitFullscreen?.();
      (document as any).webkitExitFullscreen?.();
      (document as any).msExitFullscreen?.();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const fsElement =
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement;

      setIsFullscreen(!!fsElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange,
      );
    };
  }, []);

  return (
    <button
      onClick={toggleFullscreen}
      className="cursor-pointer rounded-md p-2 hover:bg-[var(--gray-100)] dark:hover:bg-[var(--gray-800)]"
      title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
    >
      {isFullscreen ? <Shrink size={20} /> : <Fullscreen size={20} />}
    </button>
  );
}
