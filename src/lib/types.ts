export interface MetricValue {
  name: string;
  type: string;
  help: string;
  value: number;
  labels?: Record<string, string>;
}

export interface ParsedMetrics {
  processMetrics: MetricValue[];
  nodeMetrics: MetricValue[];
  httpMetrics: MetricValue[];
  customMetrics: MetricValue[];
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    fill?: boolean;
  }[];
}

export interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
}
