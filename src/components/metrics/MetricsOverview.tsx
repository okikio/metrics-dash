import { StatCard } from "@/components/StatCard";
import { Activity, Users, Server, Clock } from "lucide-react";
import { formatNumber } from "@/lib/metrics";
import { ParsedMetrics } from "@/lib/types";

interface MetricsOverviewProps {
  stats: {
    totalRequests: number;
    uniqueHosts: number;
    activeUsers: number;
    eventLoopLag: string;
    totalFailures: number;
  };
}

export function MetricsOverview({ stats }: MetricsOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <StatCard title="Accounts" value={stats.activeUsers} icon={<Users />} />
      <StatCard
        title="Total Requests"
        value={formatNumber(stats.totalRequests)}
        icon={<Activity />}
      />
    </div>
  );
}
