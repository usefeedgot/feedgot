"use client";
import { cn } from "@/lib/utils";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@feedgot/ui/components/toggle-group";
import {
  Bold,
  Calendar1,
  Ellipsis,
  Italic,
  Strikethrough,
  Underline,
} from "lucide-react";
import { Button } from "@feedgot/ui/components/button";
import { Card } from "@feedgot/ui/components/card";
import { Container } from "../global/container";

export default function FeaturesSection() {
  return (
    <Container maxWidth="6xl" className="px-4 sm:px-16 lg:px-20 xl:px-24">
      <section>
        <div className="bg-background py-24">
          <div className="mx-auto w-full max-w-5xl px-6">
            <div>
              <h2 className="text-foreground mt-4 text-4xl font-semibold">
                Personal AI, with you Anywhere
              </h2>
              <p className="text-accent mb-12 mt-4 text-balance text-md">
                Quick AI lives a single hotkey away - ready to quickly appear as
                a floating window above your other apps. Get instant assistance
                whether you're browsing, coding, or writing documents.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {/* Long top card (1) */}
              <Card className="p-8 md:col-span-2">
                <div className="flex flex-col gap-6 md:flex-row md:items-center">
                  <div className="flex-1">
                    <h3 className="text-foreground text-2xl font-semibold">
                      Quick AI, ready when you are
                    </h3>
                    <p className="text-muted-foreground mt-3 text-lg">
                      Summon a focused assistant with a single hotkey. Draft content,
                      schedule meetings, and move work forward without context switching.
                    </p>
                    <div className="mt-5 flex gap-3">
                      <Button size="sm" className="rounded-sm">Open Quick AI</Button>
                      <Button size="sm" variant="outline" className="rounded-sm">Learn more</Button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="mx-auto max-w-sm">
                      <ScheduleIllustation className="w-full" variant="mixed" />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Row 2 (2 items) */}
              <Card className="p-6">
                <div className="flex aspect-video items-center justify-center">
                  <CodeIllustration className="w-full" />
                </div>
                <div className="text-center">
                  <h3 className="text-foreground text-xl font-semibold">Marketing Campaigns</h3>
                  <p className="text-muted-foreground mt-4 text-balance text-lg">
                    Plan and execute campaigns with briefs, assets, and timelines in one view.
                  </p>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex aspect-video items-center justify-center">
                  <ScheduleIllustation className="border" variant="outlined" />
                </div>
                <div className="text-center">
                  <h3 className="text-foreground text-xl font-semibold">AI Meeting Scheduler</h3>
                  <p className="text-muted-foreground mt-4 text-balance text-lg">
                    Book, manage, and prep meetings. Auto-summarize agendas and follow-ups.
                  </p>
                </div>
              </Card>

              {/* Row 3 (2 items) */}
              <Card className="p-6">
                <div className="flex aspect-video items-center justify-center">
                  <div className="text-center">
                    <ul className="text-muted-foreground mx-auto w-fit font-mono text-lg font-medium">
                      <li>Blog post outline</li>
                      <li>Social content calendar</li>
                      <li>Landing page copy</li>
                    </ul>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-foreground text-xl font-semibold">Content Planner</h3>
                  <p className="text-muted-foreground mt-4 text-balance text-lg">
                    Keep ideas, drafts, and publishing cadence organized.
                  </p>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex aspect-video items-center justify-center">
                  <div className="flex items-center gap-2 rounded-lg border-foreground/10 border p-2">
                    <ToggleGroup type="multiple" size="sm" className="gap-0.5 *:rounded-md">
                      <ToggleGroupItem value="bold" aria-label="Toggle bold">
                        <Bold className="size-4" />
                      </ToggleGroupItem>
                      <ToggleGroupItem value="italic" aria-label="Toggle italic">
                        <Italic className="size-4" />
                      </ToggleGroupItem>
                      <ToggleGroupItem value="underline" aria-label="Toggle underline">
                        <Underline className="size-4" />
                      </ToggleGroupItem>
                      <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
                        <Strikethrough className="size-4" />
                      </ToggleGroupItem>
                    </ToggleGroup>
                    <span className="bg-border block h-4 w-px"></span>
                    <Button size="icon" className="size-8" variant="ghost">
                      <Ellipsis className="size-3" />
                    </Button>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-foreground text-xl font-semibold">Knowledge Base Assistant</h3>
                  <p className="text-muted-foreground mt-4 text-balance text-lg">
                    Search, summarize, and draft accurate answers from your docs.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}

type IllustrationProps = {
  className?: string;
  variant?: "elevated" | "outlined" | "mixed";
};

export const ScheduleIllustation = ({
  className,
  variant = "elevated",
}: IllustrationProps) => {
  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "bg-background -translate-x-1/8 absolute flex -translate-y-[110%] items-center gap-2 rounded-lg p-1",
          {
            "shadow-black-950/10 shadow-lg": variant === "elevated",
            "border-foreground/10 border": variant === "outlined",
            "border-foreground/10 border shadow-md shadow-black/5":
              variant === "mixed",
          }
        )}
      >
        <Button size="sm" className="rounded-sm">
          <Calendar1 className="size-3" />
          <span className="text-sm font-medium">Schedule</span>
        </Button>
        <span className="bg-border block h-4 w-px"></span>
        <ToggleGroup type="multiple" size="sm" className="gap-0.5 *:rounded-md">
          <ToggleGroupItem value="bold" aria-label="Toggle bold">
            <Bold className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic">
            <Italic className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Toggle underline">
            <Underline className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="strikethrough"
            aria-label="Toggle strikethrough"
          >
            <Strikethrough className="size-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        <span className="bg-border block h-4 w-px"></span>
        <Button size="icon" className="size-8" variant="ghost">
          <Ellipsis className="size-3" />
        </Button>
      </div>
      <span>
        <span className="bg-secondary text-secondary-foreground py-1">
          Tomorrow 8:30 pm
        </span>{" "}
        is our priority.
      </span>
    </div>
  );
};

export const CodeIllustration = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "[mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_50%,transparent_100%)]",
        className
      )}
    >
      <ul className="text-muted-foreground mx-auto w-fit font-mono text-2xl font-medium">
        {["Images", "Variables", "Pages", "Components", "Styles"].map(
          (item, index) => (
            <li
              key={index}
              className={cn(
                index == 2 &&
                  "text-foreground before:absolute before:-translate-x-[110%] before:text-orange-500 before:content-['Import']"
              )}
            >
              {item}
            </li>
          )
        )}
      </ul>
    </div>
  );
};
