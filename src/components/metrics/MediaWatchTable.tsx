import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CollapsibleCard } from "@/components/ui/collapsible-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatNumber } from "@/lib/metrics";
import { Check, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

interface MediaStats {
  title: string;
  tmdbId: string;
  attempts: {
    providerId: string;
    success: boolean;
    count: number;
    successCount?: number;
    failureCount?: number;
  }[];
  totalCount: number;
  successRate: number;
}

interface MediaWatchTableProps {
  metrics: {
    name: string;
    value: number;
    labels?: Record<string, string>;
  }[];
}

export function MediaWatchTable({ metrics }: MediaWatchTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Process the metrics to get media statistics
  const mediaStats = metrics
    .filter((m) => m.name === "mw_media_watch_count")
    .reduce(
      (acc, curr) => {
        const title = curr.labels?.title || "Unknown";
        const tmdbId = curr.labels?.tmdb_full_id || "unknown";
        const providerId = curr.labels?.provider_id || "unknown";
        const success = curr.labels?.success === "true";
        const count = curr.value;

        if (!acc[tmdbId]) {
          acc[tmdbId] = {
            title,
            tmdbId,
            attempts: [],
            totalCount: 0,
            successRate: 0,
          };
        }

        // Find if there's already an attempt with this provider
        const existingAttempt = acc[tmdbId].attempts.find(
          (a) => a.providerId === providerId,
        );

        if (existingAttempt) {
          // Update existing attempt
          if (success) {
            existingAttempt.successCount =
              (existingAttempt.successCount || 0) + count;
          } else {
            existingAttempt.failureCount =
              (existingAttempt.failureCount || 0) + count;
          }
          existingAttempt.count += count;
        } else {
          // Add new attempt
          acc[tmdbId].attempts.push({
            providerId,
            success,
            count,
            successCount: success ? count : 0,
            failureCount: success ? 0 : count,
          });
        }

        acc[tmdbId].totalCount += count;

        // Recalculate success rate
        const successfulAttempts = acc[tmdbId].attempts.reduce(
          (sum, a) => sum + (a.successCount || 0),
          0,
        );
        acc[tmdbId].successRate =
          (successfulAttempts / acc[tmdbId].totalCount) * 100;

        return acc;
      },
      {} as Record<string, MediaStats>,
    );

  // Convert to array and sort by total watch count
  const sortedStats = Object.values(mediaStats)
    .sort((a, b) => b.totalCount - a.totalCount)
    .filter((stat) => {
      if (!searchTerm) return true;
      
      const searchTermLower = searchTerm.toLowerCase();
      
      // Search by title
      if (stat.title.toLowerCase().includes(searchTermLower)) {
        return true;
      }
      
      // Search by provider
      return stat.attempts.some(attempt => {
        const isSuccessful = (attempt.successCount || 0) > 0;
        return isSuccessful && 
          attempt.providerId.toLowerCase().includes(searchTermLower);
      });
    })
    // Only limit results when not searching
    .slice(0, searchTerm ? undefined : 20);

  return (
    <CollapsibleCard title="Most Watched Content">
      <div className="mb-4">
        <Input
          placeholder="Search by title or provider..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Total Watches</TableHead>
              <TableHead>Provider Status</TableHead>
              <TableHead className="text-right">Success Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedStats.map((stat) => (
              <TableRow key={stat.tmdbId}>
                <TableCell className="font-medium">{stat.title}</TableCell>
                <TableCell>
                  {stat.tmdbId.startsWith("movie-") ? "Movie" : "TV Show"}
                </TableCell>
                <TableCell className="text-right">
                  {formatNumber(stat.totalCount)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    <TooltipProvider>
                      {stat.attempts.map((attempt, idx) => {
                        // Check if this provider matches the search term
                        const isProviderMatch = searchTerm && 
                          attempt.providerId.toLowerCase().includes(searchTerm.toLowerCase());
                        
                        return (
                          <Tooltip key={`${attempt.providerId}-${idx}`}>
                            <TooltipTrigger>
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                                  isProviderMatch 
                                    ? "bg-blue-500/20 text-blue-500 font-semibold" 
                                    : (attempt.successCount ?? 0) > 0
                                      ? "bg-green-500/20 text-green-500"
                                      : "bg-red-500/20 text-red-500"
                                }`}
                              >
                                {attempt.providerId}
                                {(attempt.successCount ?? 0) > 0 ? (
                                  <Check className="h-3 w-3" />
                                ) : (
                                  <X className="h-3 w-3" />
                                )}
                                ({formatNumber(attempt.count)})
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-sm">
                                Success: {formatNumber(attempt.successCount ?? 0)}
                                <br />
                                Failed: {formatNumber(attempt.failureCount ?? 0)}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </TooltipProvider>
                  </div>
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
