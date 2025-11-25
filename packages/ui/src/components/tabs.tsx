"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@feedgot/ui/lib/utils";
const GliderContext = React.createContext<{
  value?: string;
  onHover?: (el: HTMLElement) => void;
  onActive?: (el: HTMLElement) => void;
} | null>(null);

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  const value = (props as any).value as string | undefined;
  return (
    <GliderContext.Provider value={{ value }}>
      <TabsPrimitive.Root
        data-slot="tabs"
        className={cn("flex flex-col gap-2", className)}
        {...props}
      />
    </GliderContext.Provider>
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const ctx = React.useContext(GliderContext);
  const [indicator, setIndicator] = React.useState<{
    x: number;
    width: number;
    visible: boolean;
  }>({ x: 0, width: 0, visible: false });
  const [hover, setHover] = React.useState<{
    x: number;
    width: number;
    visible: boolean;
  }>({ x: 0, width: 0, visible: false });

  const measure = React.useCallback((el: HTMLElement | null) => {
    const root = listRef.current;
    if (!el || !root) return;
    const navRect = root.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    const x = rect.left - navRect.left;
    const width = rect.width;
    requestAnimationFrame(() => {
      setIndicator({ x, width, visible: true });
    });
  }, []);

  const measureHover = React.useCallback((el: HTMLElement | null) => {
    const root = listRef.current;
    if (!root) return;
    if (!el) {
      requestAnimationFrame(() =>
        setHover((prev) => ({ x: prev.x, width: prev.width, visible: false }))
      );
      return;
    }
    const navRect = root.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    const x = rect.left - navRect.left;
    const width = rect.width;
    requestAnimationFrame(() => setHover({ x, width, visible: true }));
  }, []);

  React.useLayoutEffect(() => {
    const root = listRef.current;
    if (!root) return;
    const v = ctx?.value;
    if (!v) return;
    const el = root.querySelector<HTMLElement>(
      `[data-slot="tabs-trigger"][data-value="${v}"]`
    );
    measure(el);
  }, [ctx?.value, measure]);

  return (
    <TabsPrimitive.List
      ref={listRef as any}
      data-slot="tabs-list"
      className={cn(
        "relative flex w-full items-center gap-2 border-b pb-1",
        className
      )}
      onPointerLeave={() =>
        setHover((prev) => ({ x: prev.x, width: prev.width, visible: false }))
      }
      {...props}
    >
      <AnimatePresence>
        {hover.visible && (
          <motion.div
            key="hover"
            className={cn("pointer-events-none absolute top-0 bottom-1 left-0 rounded-md bg-accent/10 z-0")}
            initial={{ opacity: 0, x: hover.x, width: hover.width }}
            animate={{ opacity: 1, x: hover.x, width: hover.width }}
            exit={{ opacity: 0, x: hover.x, width: hover.width }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.15 }}
          />
        )}
      </AnimatePresence>
      <GliderContext.Provider
        value={{
          value: ctx?.value,
          onHover: (el) => measureHover(el),
          onActive: (el) => {
            measure(el);
            measureHover(null);
          },
        }}
      >
        {props.children}
      </GliderContext.Provider>
      <motion.div
        aria-hidden
        className={cn(
          "pointer-events-none absolute bottom-0 left-0 h-[2px] rounded-full bg-primary z-0",
          indicator.visible ? "opacity-100" : "opacity-0"
        )}
        initial={false}
        animate={{ x: indicator.x, width: indicator.width, opacity: indicator.visible ? 1 : 0 }}
        transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
      />
    </TabsPrimitive.List>
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const ctx = React.useContext(GliderContext);
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      data-value={(props as any).value}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 px-2 py-1 text-sm font-medium whitespace-nowrap border-b-2 border-transparent transition-colors cursor-pointer disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground",
        className
      )}
      {...props}
      onPointerEnter={(e) => {
        ctx?.onHover?.(e.currentTarget as HTMLElement);
        (props as any).onPointerEnter?.(e);
      }}
      onPointerDown={(e) => {
        ctx?.onActive?.(e.currentTarget as HTMLElement);
        (props as any).onPointerDown?.(e);
      }}
      onFocus={(e) => {
        ctx?.onHover?.(e.currentTarget as HTMLElement);
        (props as any).onFocus?.(e);
      }}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
