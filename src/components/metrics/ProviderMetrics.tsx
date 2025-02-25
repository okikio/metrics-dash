import { BarChart } from "@/components/Charts/BarChart";
import { PieChart } from "@/components/Charts/PieChart";
import { CollapsibleCard } from "@/components/ui/collapsible-card";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ChartData } from "@/lib/types";

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
    <CollapsibleCard title="Provider Performance">
      <div className="flex flex-col gap-4">
        <div className="w-full">
          <BarChart
            title="Provider Status Distribution"
            data={providerStatusData}
          />
        </div>

        <div className="flex flex-col md:grid md:grid-cols-3 gap-4">
          <div className="w-full">
            <PieChart
              title="Provider Tool Distribution"
              data={providerToolData}
            />
          </div>
          <div className="w-full md:col-span-2">
            {isMobile ? (
              <BarChart
                title="Top 10 Provider Failure Rates"
                data={providerFailuresData10}
              />
            ) : (
              <BarChart
                title="Top 20 Provider Failure Rates"
                description="May contain outliers"
                data={providerFailuresData20}
              />
            )}
          </div>
        </div>
      </div>
    </CollapsibleCard>
  );
}
