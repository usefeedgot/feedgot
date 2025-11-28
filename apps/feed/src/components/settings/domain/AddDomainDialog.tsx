"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@feedgot/ui/components/dialog";
import { Input } from "@feedgot/ui/components/input";
import { Button } from "@feedgot/ui/components/button";

export default function AddDomainDialog({
  open,
  onOpenChange,
  onSave,
  saving,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (baseDomain: string) => void;
  saving?: boolean;
}) {
  const [value, setValue] = React.useState("");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-1/2 -translate-y-1/2 w-[min(92vw,520px)] sm:w-[420px] m-4">
        <DialogHeader>
          <DialogTitle>Add domain</DialogTitle>
          <DialogDescription className="text-accent">
            This will be the primary domain for your workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <label htmlFor="domain" className="text-xs">
            Domain
          </label>
          <div className="relative flex items-center">
            <span className="inline-flex items-center h-10 px-3 bg-muted border rounded-l-md text-black select-none">
              https://feedback.
            </span>
            <Input
              id="domain"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="example.com"
              className="h-10 flex-1 rounded-l-none border-l-0 placeholder:text-accent/70"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-3">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onSave(value)} disabled={Boolean(saving)}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
