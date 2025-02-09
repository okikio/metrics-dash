import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface RawMetricsViewerProps {
  rawResponse: string;
}

export function RawMetricsViewer({ rawResponse }: RawMetricsViewerProps) {
  const [showRaw, setShowRaw] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Raw Metrics Response</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowRaw(!showRaw)}
        >
          {showRaw ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </CardHeader>
      {showRaw && (
        <CardContent>
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            <pre className="text-xs">{rawResponse}</pre>
          </ScrollArea>
        </CardContent>
      )}
    </Card>
  );
}
