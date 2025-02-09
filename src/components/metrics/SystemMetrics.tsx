import { BarChart } from "@/components/Charts/BarChart";
import { CollapsibleCard } from "@/components/ui/collapsible-card";
import { ChartData } from "@/lib/types";

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
      <div className="grid gap-4 md:grid-cols-2">
        <BarChart title="HTTP Request Count by Route" data={httpDurationData} />
        <BarChart
          title="Average Response Time by Route (ms)"
          data={responseTimeData}
        />
      </div>
    </CollapsibleCard>
  );
}
