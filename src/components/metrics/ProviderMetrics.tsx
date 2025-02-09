import { BarChart } from "@/components/Charts/BarChart";
import { LineChart } from "@/components/Charts/LineChart";
import { PieChart } from "@/components/Charts/PieChart";
import { CollapsibleCard } from "@/components/ui/collapsible-card";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChartData } from "@/lib/types";

interface ProviderMetricsProps {
  providerToolData: ChartData;
  providerStatusData: ChartData;
  providerFailuresData10: ChartData;
  providerFailuresData20: ChartData;
}

export function ProviderMetrics({
  providerToolData,
  providerStatusData,
  providerFailuresData10,
  providerFailuresData20,
}: ProviderMetricsProps) {
  const isMobile = useIsMobile();
  return (
    <>
      <CollapsibleCard title="Provider Performance">
        <div className="grid gap-4 md:grid-cols-1">
          <LineChart
            title="Provider Status Distribution"
            data={providerStatusData}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3 mt-4">
          <PieChart
            title="Provider Tool Distribution"
            data={providerToolData}
          />
          {isMobile ? (
            <BarChart
              title="Top 10 Provider Failure Rates"
              data={providerFailuresData10}
            />
          ) : (
            <BarChart
              title="Top 20 Provider Failure Rates"
              data={providerFailuresData20}
            />
          )}
        </div>
      </CollapsibleCard>
    </>
  );
}
