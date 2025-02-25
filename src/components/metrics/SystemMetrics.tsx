import { BarChart } from "@/components/Charts/BarChart";
import { CollapsibleCard } from "@/components/ui/collapsible-card";
import type { ChartData } from "@/lib/types";

interface SystemMetricsProps {
  httpDurationData: ChartData;
  responseTimeData: ChartData;
}

export function SystemMetrics({
  httpDurationData,
  responseTimeData,
}: SystemMetricsProps) {
  return (
    <CollapsibleCard title="System Performance">
      <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
        <div className="w-full">
          <BarChart
            title="HTTP Request Count by Route"
            data={httpDurationData}
          />
        </div>
        <div className="w-full">
          <BarChart
            title="Average Response Time by Route (ms)"
            data={responseTimeData}
          />
        </div>
      </div>
    </CollapsibleCard>
  );
}
