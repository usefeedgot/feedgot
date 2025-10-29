import { Container } from "./container";
import { HotkeyLink } from "./hotkey-link";
import { LiveDemo } from "./live-demo";

export default function StatsSection() {
  return (
    <section className="bg-background py-10 sm:py-12">
      <Container maxWidth="6xl">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 bg-white p-4 sm:p-6 rounded-lg shadow-md border border-black/10">
          <h2 className="text-foreground max-w-lg sm:max-w-2xl text-balance text-2xl sm:text-3xl lg:text-4xl font-semibold">
            <span className="text-muted-foreground">Build Modern Websites.</span> Drive Results
          </h2>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-muted-foreground">
            Libero sapiente aliquam quibusdam aspernatur, praesentium iusto repellendus.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <HotkeyLink
              href="/signup"
              hotkeyHref="https://dashboard.feedbot.com"
              className="w-full sm:w-auto"
            />
            <LiveDemo className="w-full sm:w-auto" />
          </div>
        </div>
      </Container>
    </section>
  );
}