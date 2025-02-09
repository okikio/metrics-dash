import { BarChart } from "@/components/Charts/BarChart";
import { LineChart } from "@/components/Charts/LineChart";
import { PieChart } from "@/components/Charts/PieChart";
import { CollapsibleCard } from "@/components/ui/collapsible-card";
import { ChartData } from "@/lib/types";

interface ProviderMetricsProps {
  providerToolData: ChartData;
  providerStatusData: ChartData;
  providerFailuresData: ChartData;
}

export function ProviderMetrics({
  providerToolData,
  providerStatusData,
  providerFailuresData,
}: ProviderMetricsProps) {
  return (
    <>
      <CollapsibleCard title="Provider Performance">
        <div className="grid gap-4 md:grid-cols-2">
          <LineChart
            title="Provider Status Distribution"
            data={providerStatusData}
          />
          <BarChart
            title="Top 10 Provider Failure Rates"
            data={providerFailuresData}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-1 mt-4">
          <PieChart
            title="Provider Tool Distribution"
            data={providerToolData}
          />
        </div>
      </CollapsibleCard>
    </>
  );
}