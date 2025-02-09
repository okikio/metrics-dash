import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { ChartData } from "@/lib/types";

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right" as const,
    },
  },
};

interface PieChartProps {
  title: string;
  data: ChartData;
}

export function PieChart({ title, data }: PieChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <Pie options={options} data={data} />
      </CardContent>
    </Card>
  );
}
