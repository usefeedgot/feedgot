import { useEffect, useState } from "react";

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(media.matches);
    onChange();
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }
    if ("onchange" in media) {
      const prev: any = (media as any).onchange;
      (media as any).onchange = onChange as any;
      return () => {
        (media as any).onchange = prev ?? null;
      };
    }
    return () => {};
  }, []);
  return reduced;
}