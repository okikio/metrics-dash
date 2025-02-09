import { ScrollArea } from "@/components/ui/scroll-area";
import { CollapsibleCard } from "../ui/collapsible-card";

interface RawMetricsViewerProps {
  rawResponse: string;
}

export function RawMetricsViewer({ rawResponse }: RawMetricsViewerProps) {
  return (
    <CollapsibleCard title={"Raw Metrics Response"} defaultExpanded={false}>
      <ScrollArea className="h-[400px] w-full rounded-md border p-4 pb-2">
        <pre className="text-xs">{rawResponse}</pre>
      </ScrollArea>
    </CollapsibleCard>
  );
}
