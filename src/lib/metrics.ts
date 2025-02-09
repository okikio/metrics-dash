import { MetricValue, ParsedMetrics } from "./types";

export function parsePrometheusMetrics(text: string): ParsedMetrics {
  if (!text) {
    throw new Error("No metrics data provided");
  }

  const lines = text.trim().split("\n");
  const metrics: MetricValue[] = [];
  let currentMetric: Partial<MetricValue> = {};

  for (const line of lines) {
    if (!line) continue;

    if (line.startsWith("# HELP")) {
      const parts = line.split(" ");
      if (parts.length >= 3) {
        const name = parts[1];
        const help = parts.slice(2).join(" ");
        currentMetric = { name, help };
      }
    } else if (line.startsWith("# TYPE")) {
      const parts = line.split(" ");
      if (parts.length >= 3) {
        const name = parts[1];
        const type = parts[2];
        currentMetric = { ...currentMetric, name, type };
      }
    } else if (!line.startsWith("#")) {
      // Handle the metric value line
      let name = currentMetric.name;
      let value: number | undefined;
      let labels: Record<string, string> | undefined;

      // First try to extract the basic metric
      const basicMatch = line.match(/^([^\s{]+)\s+([0-9.-]+)$/);
      if (basicMatch) {
        name = basicMatch[1];
        value = parseFloat(basicMatch[2]);
      } else {
        // Try to extract metric with labels
        const complexMatch = line.match(/^([^\s{]+)({[^}]+})\s+([0-9.-]+)$/);
        if (complexMatch) {
          name = complexMatch[1];
          const labelsStr = complexMatch[2];
          value = parseFloat(complexMatch[3]);

          // Parse labels
          labels = {};
          const labelMatches = labelsStr
            .slice(1, -1)
            .match(/([^,=]+)="([^"]+)"/g);
          if (labelMatches) {
            labelMatches.forEach((label) => {
              const [key, val] = label.split("=");
              if (key && val) {
                labels![key.trim()] = val.replace(/"/g, "");
              }
            });
          }
        }
      }

      if (name && value !== undefined && !isNaN(value)) {
        metrics.push({
          name,
          type: currentMetric.type || "untyped",
          help: currentMetric.help || "",
          value,
          ...(labels && { labels }),
        });
      }
    }
  }

  const totalMetrics = metrics.length;

  // Debug log to check the parsed metrics
  console.log("Total metrics parsed:", totalMetrics);
  console.log("Sample metrics:", metrics.slice(0, 3));

  return {
    processMetrics: metrics.filter(
      (m) => m.name?.startsWith("process_") ?? false
    ),
    nodeMetrics: metrics.filter((m) => m.name?.startsWith("nodejs_") ?? false),
    httpMetrics: metrics.filter((m) => m.name?.startsWith("http_") ?? false),
    customMetrics: metrics.filter((m) => m.name?.startsWith("mw_") ?? false),
  };
}

export function formatNumber(num: number): string {
  if (num === undefined || num === null || isNaN(num)) {
    return "Invalid number";
  }

  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toFixed(0);
}
