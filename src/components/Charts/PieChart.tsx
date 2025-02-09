import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";
import { ChartData } from "@/lib/types";

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right" as const,
    },
    tooltip: {
      callbacks: {
        label: (context: TooltipItem<"pie">) => {
          const label = context.label || "";
          const value = context.parsed;
          const total = context.dataset.data.reduce(
            (a: number, b: number) => a + b,
            0
          );
          const percentage = ((value / total) * 100).toFixed(2) + "%";
          return `${label}: ${value} (${percentage})`;
        },
      },
    },
  },
};

interface PieChartProps {
  title: string;
  data: ChartData;
}

export function PieChart({ title, data }: PieChartProps) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-auto md:h-[400px] max-h-[400px] w-full">
        <Pie options={options} data={data} />
      </CardContent>
    </Card>
  );
}
