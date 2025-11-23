"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@feedgot/ui/lib/utils";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerClose,
  DrawerHeader,
  DrawerTitle,
} from "@feedgot/ui/components/drawer";
import { ScrollArea } from "@feedgot/ui/components/scroll-area";
import SidebarItem from "./SidebarItem";
import SidebarSection from "./SidebarSection";
import WorkspaceSwitcher from "./WorkspaceSwitcher";
import Timezone from "./Timezone";
import SignOutButton from "@/components/auth/SignOutButton";
import {
  buildTopNav,
  buildMiddleNav,
  buildBottomNav,
  getSlugFromPath,
} from "./nav";
import MoreIcon from "./more";

export default function MobileSidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname() || "/";
  const slug = getSlugFromPath(pathname);
  const primaryNav = buildTopNav(slug);
  const middleNav = buildMiddleNav(slug);
  const secondaryNav = buildBottomNav();

  return (
    <div className={cn("md:hidden", className)}>
      <Drawer direction="right">
        <div className="fixed bottom-0 inset-x-0 z-50 border-t bg-background">
          <div className="grid grid-cols-5">
            {middleNav.slice(0, 4).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs text-accent hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-[18px] h-[18px] text-foreground/80" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <DrawerTrigger asChild>
              <button className="flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs text-accent hover:text-foreground hover:bg-muted">
                <MoreIcon className="w-[18px] h-[18px] text-foreground/80" />
                <span>More</span>
              </button>
            </DrawerTrigger>
          </div>
        </div>

        <DrawerContent>
          <ScrollArea className="h-full">
            <div className="p-3">
              <div className="group flex items-center gap-2 rounded-md px-3 py-2">
                <img src="/logo.svg" alt="feedback" className="h-6 w-6" />
                <div className="text-sm font-semibold">feedback</div>
                <DrawerClose asChild>
                  <button className="ml-auto rounded-md px-2 py-1 text-xs text-accent hover:bg-muted">
                    Close
                  </button>
                </DrawerClose>
              </div>
              <DrawerHeader>
                <DrawerTitle>Menu</DrawerTitle>
              </DrawerHeader>
              <WorkspaceSwitcher className="mt-3" />
              <Timezone className="mt-2" />
            </div>

            <SidebarSection title="REQUEST">
              {primaryNav.map((item) => (
                <SidebarItem key={item.label} item={item} pathname={pathname} />
              ))}
            </SidebarSection>

            <SidebarSection className="pb-8">
              {secondaryNav.map((item) => (
                <SidebarItem key={item.label} item={item} pathname={pathname} />
              ))}
              <SignOutButton />
            </SidebarSection>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
