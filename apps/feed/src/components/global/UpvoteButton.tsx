"use client";

import React, { useState, useTransition } from "react";
import { LoveIcon } from "@feedgot/ui/icons/love";
import { cn } from "@feedgot/ui/lib/utils";
import { client } from "@feedgot/api/client";
import { toast } from "sonner";

interface UpvoteButtonProps {
  postId: string;
  upvotes: number;
  hasVoted?: boolean;
  className?: string;
  activeBg?: boolean;
}

export function UpvoteButton({
  postId,
  upvotes: initialUpvotes,
  hasVoted: initialHasVoted,
  className,
  activeBg = false,
}: UpvoteButtonProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [hasVoted, setHasVoted] = useState(initialHasVoted || false);
  const [isPending, startTransition] = useTransition();

  const handleVote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic update
    const previousUpvotes = upvotes;
    const previousHasVoted = hasVoted;

    setHasVoted(!hasVoted);
    setUpvotes(hasVoted ? upvotes - 1 : upvotes + 1);

    startTransition(async () => {
      try {
        const res = await client.post.vote.$post({ postId });
        if (res.ok) {
          const data = await res.json();
          setUpvotes(data.upvotes);
          setHasVoted(data.hasVoted);
        } else {
          setUpvotes(previousUpvotes);
          setHasVoted(previousHasVoted);
          if (res.status === 401) toast.error("Please sign in to vote");
        }
      } catch (error) {
        setUpvotes(previousUpvotes);
        setHasVoted(previousHasVoted);
        console.error("Failed to vote:", error);
      }
    });
  };

  return (
    <button
      onClick={handleVote}
      disabled={isPending}
      className={cn(
        "inline-flex items-center gap-1 group transition-colors cursor-pointer",
        className
      )}
      aria-pressed={hasVoted}
    >
      <span
        className={cn(
          "inline-flex items-center gap-1 px-1.5 py-0.5 rounded",
          hasVoted && activeBg ? "bg-red-100" : "",
          "group-hover:bg-red-500"
        )}
      >
        <LoveIcon
          className={cn(
            "w-3 h-3 transition-colors",
            hasVoted
              ? "fill-current text-red-600 group-hover:text-white"
              : "text-muted-foreground group-hover:text-white"
          )}
        />
        <span
          className={cn(
            "tabular-nums",
            hasVoted ? "text-red-600" : "text-muted-foreground",
            "group-hover:text-white"
          )}
        >
          {upvotes}
        </span>
      </span>
    </button>
  );
}
