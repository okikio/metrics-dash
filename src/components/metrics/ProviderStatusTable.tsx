import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CollapsibleCard } from "@/components/ui/collapsible-card";
import { Input } from "@/components/ui/input";
import { formatNumber } from "@/lib/metrics";
import { useState } from "react";

interface ProviderStats {
  provider: string;
  success: number;
  failed: number;
  notfound: number;
  total: number;
  successRate: number;
}

interface ProviderStatusTableProps {
  metrics: {
    name: string;
    value: number;
    labels?: Record<string, string>;
  }[];
}

export function ProviderStatusTable({ metrics }: ProviderStatusTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Process the metrics to get provider statistics
  const providerStats = metrics
    .filter((m) => m.name === "mw_provider_status_count")
    .reduce((acc, curr) => {
      const providerId = curr.labels?.provider_id || "unknown";
      const status = curr.labels?.status || "unknown";
      const value = curr.value;

      if (!acc[providerId]) {
        acc[providerId] = {
          provider: providerId,
          success: 0,
          failed: 0,
          notfound: 0,
          total: 0,
          successRate: 0,
        };
      }

      // Using type assertion to handle the dynamic status field
      (acc[providerId] as any)[status] = value;
      acc[providerId].total += value;
      acc[providerId].successRate = (acc[providerId].success / acc[providerId].total) * 100;

      return acc;
    }, {} as Record<string, ProviderStats>);

  // Convert to array and sort by total requests
  const sortedStats = Object.values(providerStats)
    .sort((a, b) => b.total - a.total)
    .filter(stat => 
      stat.provider.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <CollapsibleCard title="Provider Lifetime Statistics">
      <div className="mb-4">
        <Input
          placeholder="Search providers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider</TableHead>
              <TableHead className="text-right">Success</TableHead>
              <TableHead className="text-right">Failed</TableHead>
              <TableHead className="text-right">Not Found</TableHead>
              <TableHead className="text-right">Total Requests</TableHead>
              <TableHead className="text-right">Success Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedStats.map((stat) => (
              <TableRow key={stat.provider}>
                <TableCell className="font-medium">{stat.provider}</TableCell>
                <TableCell className="text-right text-green-500">
                  {formatNumber(stat.success)}
                </TableCell>
                <TableCell className="text-right text-red-500">
                  {formatNumber(stat.failed)}
                </TableCell>
                <TableCell className="text-right text-yellow-500">
                  {formatNumber(stat.notfound)}
                </TableCell>
                <TableCell className="text-right">
                  {formatNumber(stat.total)}
                </TableCell>
                <TableCell className="text-right">
                  {stat.successRate.toFixed(1)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CollapsibleCard>
  );
}