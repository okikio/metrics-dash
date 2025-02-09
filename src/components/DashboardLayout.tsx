import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background relative">
      <main className="p-8">{children}</main>
      <ScrollToTopButton />
    </div>
  );
}
