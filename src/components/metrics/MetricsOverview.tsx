import { StatCard } from "@/components/StatCard";
import { Activity, Users, Server, Clock, Frown, Smile } from "lucide-react";
import { formatNumber } from "@/lib/metrics";
import { ParsedMetrics } from "@/lib/types";

interface MetricsOverviewProps {
  stats: {
    totalWatchRequests: number;
    uniqueHosts: number;
    activeUsers: number;
    eventLoopLag: string;
  };
}

export function MetricsOverview({ stats }: MetricsOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <StatCard title="Accounts" value={stats.activeUsers} icon={<Users />} />
      <StatCard
        title="Total Watch Requests"
        value={formatNumber(stats.totalWatchRequests)}
        icon={<Activity />}
      />
    </div>
  );
}
