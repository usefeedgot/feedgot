import type { ReactNode } from "react";

export const CardAccent = ({ children }: { children: ReactNode }) => (
  <p className="text-accent mt-1 text-sm sm:text-base">{children}</p>
);

export const CardTag = ({ children = "no setup required" }: { children?: ReactNode }) => (
  <span className="absolute right-3 top-3 text-accent text-xs border border-border bg-muted backdrop-blur-sm rounded-sm px-2 py-0.5">
    {children}
  </span>
);