"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { throttle } from "lodash";

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

  const determineActiveSection = useCallback(() => {
    let currentSection = sections[0].id;
    const scrollPosition = window.scrollY + 100; // Add offset for header

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element && element.offsetTop <= scrollPosition) {
        currentSection = section.id;
      }
    });

    setActiveSection(currentSection);
  }, []);

  useEffect(() => {
    const throttledScrollHandler = throttle(determineActiveSection, 100);

    window.addEventListener("scroll", throttledScrollHandler);
    determineActiveSection(); // Initial check

    return () => {
      window.removeEventListener("scroll", throttledScrollHandler);
    };
  }, [determineActiveSection]);

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
    <nav className="sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="flex h-16 items-center px-4">
        {/* Mobile Dropdown */}
        <div className="md:hidden w-full">
          <Select value={activeSection} onValueChange={scrollToSection}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select section" className="text-left" />
            </SelectTrigger>
            <SelectContent className="w-full">
              {sections.map((section) => (
                <SelectItem key={section.id} value={section.id}>
                  {section.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-2 overflow-x-auto no-scrollbar items-center justify-center w-full">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={cn(
                "inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md px-4 text-sm font-medium ring-offset-background transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:pointer-events-none disabled:opacity-50",
                "hover:bg-accent hover:text-accent-foreground",
                "flex-shrink-0",
                activeSection === section.id &&
                  "bg-accent text-accent-foreground",
              )}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default NavigationIndex;
