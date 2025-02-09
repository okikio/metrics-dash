import { StatCard } from "@/components/StatCard";
import { Activity, Users, Server, Clock, Frown, Smile } from "lucide-react";
import { formatNumber } from "@/lib/metrics";
import { ParsedMetrics } from "@/lib/types";

interface MetricsOverviewProps {
  stats: {
    totalRequests: number;
    uniqueHosts: number;
    activeUsers: number;
    eventLoopLag: string;
    totalSucesses: number;
    totalFailures: number;
  };
}

export function MetricsOverview({ stats }: MetricsOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <StatCard title="Accounts" value={stats.activeUsers} icon={<Users />} />
      {/* <StatCard
        title="Total Requests"
        value={formatNumber(stats.totalRequests)}
        icon={<Activity />}
      /> */}
      <StatCard
        title="Backend Users"
        value={formatNumber(stats.uniqueHosts)}
        icon={<Server />}
      />
      <StatCard
        title="Total Successes"
        value={formatNumber(stats.totalSucesses)}
        icon={<Smile />}
      />{" "}
      <StatCard
        title="Total Failures"
        value={formatNumber(stats.totalFailures)}
        icon={<Frown />}
      />
    </div>
  );
}
