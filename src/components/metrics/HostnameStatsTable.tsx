import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CollapsibleCard } from "@/components/ui/collapsible-card";
import { formatNumber } from "@/lib/metrics";

interface HostStats {
  hostname: string;
  count: number;
  percentage: number;
}

interface HostnameStatsTableProps {
  metrics: {
    name: string;
    value: number;
    labels?: Record<string, string>;
  }[];
}

export function HostnameStatsTable({ metrics }: HostnameStatsTableProps) {
  // Process the metrics to get hostname statistics
  const hostStats = metrics
    .filter((m) => m.name === "mw_provider_hostname_count")
    .map((m) => ({
      hostname: m.labels?.hostname || "unknown",
      count: m.value,
    }))
    .sort((a, b) => b.count - a.count);

  // Calculate total requests for percentage
  const totalRequests = hostStats.reduce((acc, curr) => acc + curr.count, 0);

  // Add percentage to each stat
  const statsWithPercentage: HostStats[] = hostStats.map((stat) => ({
    ...stat,
    percentage: (stat.count / totalRequests) * 100,
  }));

  return (
    <CollapsibleCard title="Backend Usage by Domain">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Domain</TableHead>
              <TableHead className="text-right">Request Count</TableHead>
              <TableHead className="text-right">Traffic Share</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statsWithPercentage.map((stat) => (
              <TableRow key={stat.hostname}>
                <TableCell className="font-medium">{stat.hostname}</TableCell>
                <TableCell className="text-right">
                  {formatNumber(stat.count)}
                </TableCell>
                <TableCell className="text-right">
                  {stat.percentage.toFixed(2)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CollapsibleCard>
  );
}
