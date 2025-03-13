import { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MetricsForm } from "@/components/MetricsForm";
import { parsePrometheusMetrics } from "@/lib/metrics";
import { useToast } from "@/hooks/use-toast";
import { MetricsOverview } from "@/components/metrics/MetricsOverview";
import { ProviderMetrics } from "@/components/metrics/ProviderMetrics";
import { SystemMetrics } from "@/components/metrics/SystemMetrics";
import { RawMetricsViewer } from "@/components/metrics/RawMetricsViewer";
import { ProviderStatusTable } from "@/components/metrics/ProviderStatusTable";
import { HostnameStatsTable } from "@/components/metrics/HostnameStatsTable";
import { MediaWatchTable } from "@/components/metrics/MediaWatchTable";
import { NavigationIndex } from "@/components/metrics/NavigationIndex";
import { useIsMobile } from "@/hooks/use-mobile";
import Spinner from "@/components/ui/spinner";
import { GitHubButton } from "@/components/ui/GitHubButton";

interface MetricValue {
  name: string;
  value: number;
  labels?: Record<string, string>;
  help?: string;
  type?: string;
}

interface ParsedMetrics {
  processMetrics: MetricValue[];
  nodeMetrics: MetricValue[];
  httpMetrics: MetricValue[];
  customMetrics: MetricValue[];
}

interface ProviderStats {
  [key: string]: {
    success: number;
    failed: number;
    notfound: number;
  };
}

interface RouteTimings {
  [key: string]: {
    sum: number;
    count: number;
  };
}

export default function Dashboard() {
  const [url, setUrl] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [rawResponse, setRawResponse] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<ParsedMetrics, Error>({
    queryKey: ["metrics", url],
    enabled: !!url,
    queryFn: async () => {
      if (!url) throw new Error("No URL provided");
      if (url === "imported") {
        // Return the already parsed data for imported files
        return queryClient.getQueryData<ParsedMetrics>(["metrics", "imported"]) ?? {
          processMetrics: [],
          nodeMetrics: [],
          httpMetrics: [],
          customMetrics: [],
        };
      }
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch metrics: ${response.statusText}`);
        }
        const text = await response.text();
        setRawResponse(text);
        const parsed = parsePrometheusMetrics(text);
        return parsed;
      } catch (err) {
        throw new Error(
          err instanceof Error ? err.message : "Failed to fetch metrics",
        );
      }
    },
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh && url) {
      interval = setInterval(() => {
        refetch();
      }, 30000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, url, refetch]);

  const handleSubmit = (newUrl: string) => {
    setUrl(newUrl);
  };

  const handleFileImport = (content: string) => {
    setRawResponse(content);
    try {
      const parsed = parsePrometheusMetrics(content);
      // Update the query client cache manually
      queryClient.setQueryData(["metrics", "imported"], parsed);
      setUrl("imported"); // Set a dummy URL to trigger the UI update
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error parsing file",
        description: err instanceof Error ? err.message : "Failed to parse metrics file",
      });
    }
  };

  const chartData = useMemo(() => {
    if (!data) return null;

    // Group provider status data by provider
    const providerStats = data.customMetrics
      .filter((m: MetricValue) => m.name === "mw_provider_status_count")
      .reduce(
        (acc: ProviderStats, curr: MetricValue) => {
          const providerId = curr.labels?.provider_id || "unknown";
          const status = curr.labels?.status || "unknown";
          if (!acc[providerId]) {
            acc[providerId] = { success: 0, failed: 0, notfound: 0 };
          }
          if (
            status === "success" ||
            status === "failed" ||
            status === "notfound"
          ) {
            acc[providerId][status] = curr.value;
          }
          return acc;
        },
        {} as ProviderStats,
      );

    // Calculate failure rates and sort providers
    const providerFailureRates10 = Object.entries(providerStats)
      .map(([provider, stats]: [string, { success: number; failed: number; notfound: number }]) => {
        const total = stats.success + stats.failed + stats.notfound;
        const failureRate = (stats.failed / total) * 100;
        return { provider, failureRate, ...stats };
      })
      .sort((a, b) => b.failureRate - a.failureRate)
      .slice(0, 10);

    const providerFailureRates20 = Object.entries(providerStats)
      .map(([provider, stats]: [string, { success: number; failed: number; notfound: number }]) => {
        const total = stats.success + stats.failed + stats.notfound;
        const failureRate = (stats.failed / total) * 100;
        return { provider, failureRate, ...stats };
      })
      .sort((a, b) => b.failureRate - a.failureRate)
      .slice(0, 20);

    const providerToolData = {
      labels: data.customMetrics
        .filter((m: MetricValue) => m.name === "mw_provider_tool_count")
        .slice(0, 10)
        .map((m: MetricValue) => m.labels?.tool || "unknown"),
      datasets: [
        {
          label: "Provider Tool Usage",
          data: data.customMetrics
            .filter((m: MetricValue) => m.name === "mw_provider_tool_count")
            .slice(0, 10)
            .map((m: MetricValue) => m.value),
          backgroundColor: [
            "rgba(54, 162, 235, 0.8)",
            "rgba(75, 192, 192, 0.8)",
            "rgba(153, 102, 255, 0.8)",
          ],
        },
      ],
    };

    const httpDurationData = {
      labels: data.httpMetrics
        .filter((m: MetricValue) => m.name === "http_request_duration_seconds_count")
        .slice(0, 10)
        .map((m: MetricValue) => `${m.labels?.method || ""} ${m.labels?.route || ""}`),
      datasets: [
        {
          label: "Request Count",
          data: data.httpMetrics
            .filter((m: MetricValue) => m.name === "http_request_duration_seconds_count")
            .slice(0, 10)
            .map((m: MetricValue) => m.value),
          backgroundColor: ["rgba(54, 162, 235, 0.8)"],
        },
      ],
    };

    const providerStatusData = {
      labels: ["Success", "Failed", "Not Found"],
      datasets: [
        {
          label: "Status Count",
          data: [
            data.customMetrics
              .filter(
                (m: MetricValue) =>
                  m.name === "mw_provider_status_count" &&
                  m.labels?.status === "success",
              )
              .reduce((acc: number, curr: MetricValue) => acc + (typeof curr.value === "number" ? curr.value : 0), 0),
            data.customMetrics
              .filter(
                (m: MetricValue) =>
                  m.name === "mw_provider_status_count" &&
                  m.labels?.status === "failed",
              )
              .reduce((acc: number, curr: MetricValue) => acc + (typeof curr.value === "number" ? curr.value : 0), 0),
            data.customMetrics
              .filter(
                (m: MetricValue) =>
                  m.name === "mw_provider_status_count" &&
                  m.labels?.status === "notfound",
              )
              .reduce((acc: number, curr: MetricValue) => acc + (typeof curr.value === "number" ? curr.value : 0), 0),
          ],
          borderColor: "rgba(53, 162, 235, 1)",
          backgroundColor: [
            "rgba(53, 162, 235, 0.5)",
            "rgba(53, 162, 235, 0.5)",
            "rgba(53, 162, 235, 0.5)",
          ],
          fill: true,
        },
      ],
    };

    const providerFailuresData10 = {
      labels: providerFailureRates10.map((p) => p.provider),
      datasets: [
        {
          label: "Failure Rate (%)",
          data: providerFailureRates10.map((p) =>
            parseFloat(p.failureRate.toFixed(1)),
          ),
          backgroundColor: providerFailureRates10.map(
            () => "rgba(239, 68, 68, 0.8)",
          ),
        },
      ],
    };

    const providerFailuresData20 = {
      labels: providerFailureRates20.map((p) => p.provider),
      datasets: [
        {
          label: "Failure Rate (%)",
          data: providerFailureRates20.map((p) =>
            parseFloat(p.failureRate.toFixed(1)),
          ),
          backgroundColor: providerFailureRates20.map(
            () => "rgba(239, 68, 68, 0.8)",
          ),
        },
      ],
    };

    // Calculate average response times by route
    const routeTimings = data.httpMetrics
      .filter((m: MetricValue) => m.name.startsWith("http_request_duration_seconds"))
      .reduce(
        (acc: RouteTimings, curr: MetricValue) => {
          const route = curr.labels?.route;
          const method = curr.labels?.method;
          if (!route || !method) return acc;

          const key = `${method} ${route}`;
          if (!acc[key]) {
            acc[key] = {
              sum: 0,
              count: 0,
            };
          }

          if (curr.name === "http_request_duration_seconds_sum") {
            acc[key].sum = curr.value;
          } else if (curr.name === "http_request_duration_seconds_count") {
            acc[key].count = curr.value;
          }

          return acc;
        },
        {} as RouteTimings,
      );

    // Convert to averages and sort by response time
    const responseTimeData = {
      labels: Object.entries(routeTimings)
        .map(([route, timing]: [string, { sum: number; count: number }]) => ({
          route,
          avgTime: (timing.sum / timing.count) * 1000,
        }))
        .sort((a, b) => b.avgTime - a.avgTime)
        .slice(0, 10)
        .map((entry) => entry.route),
      datasets: [
        {
          label: "Average Response Time (ms)",
          data: Object.entries(routeTimings)
            .map(([_, timing]: [string, { sum: number; count: number }]) => 
              (timing.sum / timing.count) * 1000
            )
            .sort((a, b) => b - a)
            .slice(0, 10),
          backgroundColor: ["rgba(234, 179, 8, 0.8)"],
        },
      ],
    };

    return {
      providerToolData,
      httpDurationData,
      providerStatusData,
      providerFailuresData10,
      providerFailuresData20,
      responseTimeData,
    };
  }, [data]);

  const stats = useMemo(() => {
    if (!data) return null;

    const totalWatchRequests = data.customMetrics
      .filter((m: MetricValue) => m.name === "mw_media_watch_count")
      .reduce(
        (acc: number, curr: MetricValue) => acc + (typeof curr.value === "number" ? curr.value : 0),
        0,
      );

    const uniqueHosts = new Set(
      data.customMetrics
        .filter((m: MetricValue) => m.name === "mw_provider_hostname_count")
        .map((m: MetricValue) => m.labels?.hostname),
    ).size;

    return {
      totalWatchRequests,
      uniqueHosts,
      activeUsers:
        data.customMetrics.find((m: MetricValue) => m.name === "mw_user_count")?.value || 0,
      eventLoopLag: (
        data.nodeMetrics.find((m: MetricValue) => m.name === "nodejs_eventloop_lag_seconds")
          ?.value || 0
      ).toFixed(3),
    };
  }, [data]);

  const isMobile = useIsMobile();

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6 pl-2">
          <span className="h-12 w-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              viewBox="0 0 24 24"
            >
              <path
                d="M18.186,4.5V6.241H16.445V4.5H9.482V6.241H7.741V4.5H6V20.168H7.741V18.427H9.482v1.741h6.964V18.427h1.741v1.741h1.741V4.5Zm-8.7,12.186H7.741V14.945H9.482Zm0-3.482H7.741V11.464H9.482Zm0-3.482H7.741V7.982H9.482Zm8.7,6.964H16.445V14.945h1.741Zm0-3.482H16.445V11.464h1.741Zm0-3.482H16.445V7.982h1.741Z"
                transform="translate(10.018 -7.425) rotate(45)"
                fill="currentColor"
              />
            </svg>
          </span>
          <h1 className="text-4xl font-bold">Metrics Dashboard</h1>
        </div>
        <MetricsForm
          onSubmit={handleSubmit}
          onFileImport={handleFileImport}
          isLoading={isLoading}
          autoRefresh={autoRefresh}
          onAutoRefreshToggle={() => setAutoRefresh(!autoRefresh)}
        />
      </div>

      {isMobile && (
        <div className="w-full flex items-center justify-center">
          <p className="text-s text-muted-foreground">
            Please use a larger screen for a better experience.
          </p>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center h-64 pt-40">
          <p className="text-lg text-muted-foreground">Loading metrics...</p>
          <Spinner />
        </div>
      )}

      {data && stats && chartData && (
        <div className="space-y-8">
          <NavigationIndex />
          <div id="overview">
            <MetricsOverview stats={stats} />
          </div>
          <div id="provider-performance">
            <ProviderMetrics {...chartData} />
          </div>
          <div id="provider-statistics">
            <ProviderStatusTable metrics={data.customMetrics} />
          </div>
          <div id="watched-content">
            <MediaWatchTable metrics={data.customMetrics} />
          </div>
          <div id="backend-usage">
            <HostnameStatsTable metrics={data.customMetrics} />
          </div>
          <div id="system-performance">
            <SystemMetrics
              httpDurationData={chartData.httpDurationData}
              responseTimeData={chartData.responseTimeData}
            />
          </div>
          {rawResponse && (
            <div id="raw-metrics">
              <RawMetricsViewer
                rawResponse={rawResponse}
                metricsUrl={url || ""}
              />
            </div>
          )}
        </div>
      )}
      <GitHubButton />
    </DashboardLayout>
  );
}
