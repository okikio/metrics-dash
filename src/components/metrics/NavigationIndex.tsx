import { cn } from "@/lib/utils";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "provider-performance", label: "Provider Performance" },
  { id: "system-performance", label: "System Performance" },
  { id: "provider-statistics", label: "Provider Statistics" },
  { id: "backend-usage", label: "Backend Usage" },
  { id: "watched-content", label: "Most Watched Content" },
  { id: "raw-metrics", label: "Raw Metrics" },
];

export function NavigationIndex() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -20;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 gap-2 overflow-x-auto">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className="inline-flex items-center text-sm font-medium transition-colors hover:text-primary hover:bg-muted px-3 py-1.5 rounded-md border border-input text-muted-foreground"
          >
            {section.label}
          </button>
        ))}
      </div>
    </nav>
  );
}