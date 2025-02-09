import React, { useState } from "react";
import { ChevronRight } from "lucide-react";

// Simple utility function to concatenate classNames
const classNames = (...classes: (string | boolean | undefined | null)[]) => {
  return classes.filter(Boolean).join(" ");
};

const sections = [
  { id: "overview", label: "Overview" },
  { id: "provider-performance", label: "Provider Performance" },
  { id: "provider-statistics", label: "Provider Statistics" },
  { id: "watched-content", label: "Most Watched Content" },
  { id: "backend-usage", label: "Backend Usage" },
  { id: "system-performance", label: "System Performance" },
  { id: "raw-metrics", label: "Raw Metrics" },
];

export function NavigationIndex() {
  const [activeSection, setActiveSection] = useState("overview");

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="flex h-16 items-center justify-start px-4 md:justify-center">
        <div className="flex gap-2 overflow-x-auto no-scrollbar items-center max-w-full">
          {sections.map((section, index) => (
            <React.Fragment key={section.id}>
              <button
                onClick={() => scrollToSection(section.id)}
                className={classNames(
                  "inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md px-4 text-sm font-medium ring-offset-background transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:pointer-events-none disabled:opacity-50",
                  "hover:bg-accent hover:text-accent-foreground",
                  "flex-shrink-0"
                )}
              >
                {section.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default NavigationIndex;
