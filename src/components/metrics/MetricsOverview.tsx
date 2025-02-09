import { StatCard } from "@/components/StatCard";
import {
  Activity,
  Users,
  Server,
  Clock,
  Frown,
  Smile,
  Tv2,
} from "lucide-react";
import { formatNumber } from "@/lib/metrics";

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
      <StatCard
        title="Accounts"
        value={formatNumber(stats.activeUsers)}
        icon={<Users />}
      />
      <StatCard
        title="Total Watch Requests"
        value={formatNumber(stats.totalWatchRequests)}
        icon={<Tv2 />}
      />
    </div>
  );
}
