"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@feedgot/ui/components/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@feedgot/ui/components/dialog";
import { cn } from "@feedgot/ui/lib/utils";
import { MobileBoardsMenu } from "./MobileBoardsMenu";
import { CommentsIcon } from "@feedgot/ui/icons/comments";
import { RoadmapIcon } from "@feedgot/ui/icons/roadmap";
import { ChangelogIcon } from "@feedgot/ui/icons/changelog";
import React from "react";
import { Bell } from "lucide-react";
import SubdomainUserDropdown from "@/components/subdomain/SubdomainUserDropdown";
import { client } from "@feedgot/api/client";

type WorkspaceInfo = {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  logo: string | null;
};

export function DomainHeader({
  workspace,
  subdomain,
  changelogVisible: initialChangelogVisible = true,
  initialUser,
}: {
  workspace: WorkspaceInfo;
  subdomain: string;
  changelogVisible?: boolean;
  initialUser?: { name?: string; email?: string; image?: string | null } | null;
}) {
  const pathname = usePathname() || "";
  const feedbackBase = `/`;
  const roadmapBase = `/roadmap`;
  const changelogBase = `/changelog`;
  const isFeedback = pathname === "/";
  const isRoadmap = pathname.startsWith(roadmapBase);
  const isChangelog = pathname.startsWith(changelogBase);
  const [authOpen, setAuthOpen] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<"sign-in" | "sign-up">(
    "sign-in"
  );
  const [verifying] = React.useState(false);
  const [user] = React.useState<{
    name?: string;
    email?: string;
    image?: string | null;
  } | null>(initialUser ?? null);
  const [changelogVisible, setChangelogVisible] = React.useState(
    Boolean(initialChangelogVisible)
  );
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [unread, setUnread] = React.useState<number>(0);
  const itemCls = (active: boolean) =>
    cn(
      "rounded-md border px-3 py-2 group",
      active
        ? "bg-background/50 border-accent/20"
        : "border-transparent hover:bg-muted"
    );
  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await client.changelog.visible.$get({ slug: subdomain });
        const d = await res.json();
        if (active) setChangelogVisible(Boolean((d as any)?.visible));
      } catch {}
    })();
    client.comment.mentionsCount
      .$get()
      .then(async (res) => {
        const d = await res.json().catch(() => ({}));
        if (active) setUnread(Number((d as any)?.unread || 0));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  const loadNotifications = React.useCallback(async () => {
    try {
      const res = await client.comment.mentionsList.$get({ limit: 50 });
      const d = await res.json();
      setNotifications((d as any)?.notifications || []);
    } catch {}
  }, []);
  const onOpenChange = React.useCallback(
    (v: boolean) => {
      setNotifOpen(v);
      if (v) loadNotifications();
    },
    [loadNotifications]
  );
  const markRead = React.useCallback(async (id: string) => {
    try {
      await client.comment.mentionsMarkRead.$post({ id });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
      setUnread((u) => Math.max(0, u - 1));
    } catch {}
  }, []);
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || ""}/start`;
  return (
    <header className={cn("py-3 sm:py-5")}>
      <div className="md:hidden grid grid-cols-[1fr_auto_1fr] items-center w-full">
        <div className="justify-self-start">
          <MobileBoardsMenu slug={workspace.slug} subdomain={subdomain} />
        </div>
        <div className="inline-flex items-center justify-center justify-self-center">
          {workspace.logo ? (
            <Image
              src={workspace.logo}
              alt={workspace.name}
              width={32}
              height={32}
              className="rounded-sm object-cover"
            />
          ) : (
            <div className="h-9 w-9 rounded-sm bg-muted flex items-center justify-center text-md font-semibold">
              {workspace.name?.[0]?.toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 justify-self-end">
          <Button type="button" size="xs" variant="nav" className="relative" onClick={() => onOpenChange(true)}>
            <Bell className="w-[18px] h-[18px] text-foreground opacity-60 group-hover:text-primary transition-colors" />
            {unread > 0 ? (
              <span className="absolute -top-1 -right-1 rounded-md bg-muted ring-1 ring-border px-1.5 py-0.5 text-[10px] tabular-nums">
                {unread}
              </span>
            ) : null}
          </Button>
          <Button asChild size="xs" variant="nav">
            <Link href={dashboardUrl}>Dashboard</Link>
          </Button>
          <SubdomainUserDropdown
            workspace={workspace}
            subdomain={subdomain}
            initialUser={user || null}
          />
        </div>
      </div>

      <div className="hidden md:flex items-center gap-1 w-full">
        <div className="flex items-center gap-1">
          <Image
            src={workspace.logo || ""}
            alt={workspace.name}
            width={32}
            height={32}
            className="rounded-sm object-cover"
          />
          <div className="text-md font-medium">{workspace.name}</div>
        </div>
        <span className="mx-2 text-accent" aria-hidden>
          |
        </span>

        <nav className="flex-1">
          <ul className="flex items-center gap-3 text-sm">
            <li>
              <Link
                href={feedbackBase}
                className={itemCls(isFeedback)}
                aria-current={isFeedback ? "page" : undefined}
              >
                <span className="inline-flex items-center gap-2">
                  Feedback
                  <CommentsIcon
                    size={16}
                    className={cn(
                      "opacity-90 text-accent rounded-sm p-0.5 group-hover:bg-primary group-hover:text-primary-foreground",
                      isFeedback ? "bg-primary text-primary-foreground" : ""
                    )}
                  />
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={roadmapBase}
                className={itemCls(isRoadmap)}
                aria-current={isRoadmap ? "page" : undefined}
              >
                <span className="inline-flex items-center gap-2">
                  Roadmap
                  <RoadmapIcon
                    size={16}
                    className={cn(
                      "opacity-90 text-accent rounded-sm p-0.5 group-hover:bg-primary group-hover:text-primary-foreground",
                      isRoadmap ? "bg-primary text-primary-foreground" : ""
                    )}
                  />
                </span>
              </Link>
            </li>
            <li>
              {changelogVisible ? (
                <Link
                  href={changelogBase}
                  className={itemCls(isChangelog)}
                  aria-current={isChangelog ? "page" : undefined}
                >
                  <span className="inline-flex items-center gap-2">
                    Changelog
                    <ChangelogIcon
                      size={16}
                      className={cn(
                        "opacity-90 text-accent rounded-sm p-0.5 group-hover:bg-primary group-hover:text-primary-foreground",
                        isChangelog ? "bg-primary text-primary-foreground" : ""
                      )}
                    />
                  </span>
                </Link>
              ) : null}
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Button type="button" size="xs" variant="nav" className="relative" onClick={() => onOpenChange(true)}>
            <Bell className="w-[18px] h-[18px] text-foreground opacity-60 group-hover:text-primary transition-colors" />
            {unread > 0 ? (
              <span className="absolute -top-1 -right-1 rounded-md bg-muted ring-1 ring-border px-1.5 py-0.5 text-[10px] tabular-nums">
                {unread}
              </span>
            ) : null}
          </Button>
          <Button asChild size="xs" variant="nav">
            <Link href={dashboardUrl}>Dashboard</Link>
          </Button>
          <SubdomainUserDropdown
            workspace={workspace}
            subdomain={subdomain}
            initialUser={user || null}
          />
        </div>
      </div>
      <Dialog open={notifOpen} onOpenChange={onOpenChange}>
        <DialogContent className="top-1/2 -translate-y-1/2 w-[min(92vw,600px)] m-4">
          <DialogHeader>
            <DialogTitle>Mentions</DialogTitle>
          </DialogHeader>
          <div className="divide-y">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-accent text-sm">No notifications</div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="text-xs text-accent w-32">{new Date(n.createdAt).toLocaleString()}</div>
                  <div className="flex-1">
                    <div className="text-sm">
                      <span className="font-medium">{n.authorName || "Someone"}</span> mentioned you in{" "}
                      <Link href={`/p/${n.postSlug}`} className="text-primary hover:underline" onClick={() => markRead(n.id)}>
                        {n.postTitle || n.postSlug}
                      </Link>
                    </div>
                    <div className="text-xs text-accent truncate">{n.commentContent || ""}</div>
                  </div>
                  {!n.isRead ? (
                    <Button type="button" variant="outline" size="sm" onClick={() => markRead(n.id)}>Mark read</Button>
                  ) : (
                    <span className="text-[10px] text-accent">Read</span>
                  )}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
