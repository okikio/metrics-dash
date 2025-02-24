"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CollapsibleCard } from "../ui/collapsible-card"
import { Button } from "@/components/ui/button"
import { Copy, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface RawMetricsViewerProps {
  rawResponse: string
  metricsUrl: string
}

export function RawMetricsViewer({ rawResponse, metricsUrl }: RawMetricsViewerProps) {
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawResponse)
      setIsCopied(true)
      toast({
        title: "Copied to clipboard!",
        description: "Raw metrics have been copied to your clipboard.",
      })
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to copy.",
        description: "Couldn't copy the metrics to your clipboard.",
      })
    }
  }

  const getDomainFromUrl = (url: string): string => {
    try {
      if (!url) return "metrics"

      // Remove the protocol & get hostname:
      const hostname = url.replace(/^(https?:\/\/)/, "").split("/")[0]

      // Split the hostname into parts:
      const parts = hostname.split(".")

      // Get the domain name (second-to-last part):
      // For hellothere.com -> hellothere, &
      // For server.demo.com -> demo. Thus:
      return parts[parts.length - 2] || "metrics"
    } catch (err) {
      console.error("Error extracting domain:", err)
      return "metrics"
    }
  }

  const handleDownload = () => {
    const blob = new Blob([rawResponse], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url

    const domain = getDomainFromUrl(metricsUrl)

    // Fetch the date as YYYY-MM-DD format:
    const date = new Date().toISOString().split("T")[0]

    // Save the file as 1 file, fetching domain, and date:
    a.download = `${domain}-metrics-${date}.txt`

    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "File Downloaded!",
      description: `Raw metrics has been saved as "${a.download}".`,
    })
  }

  return (
    <CollapsibleCard title="Raw Metrics Response" defaultExpanded={false}>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 items-center sm:justify-end">
          <Button onClick={handleCopy} variant="outline" size="sm" className="w-full sm:w-auto">
            <Copy className="mr-2 h-4 w-4" />
            {isCopied ? "Copied!" : "Copy"}
          </Button>
          <Button onClick={handleDownload} variant="outline" size="sm" className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4 pb-2">
          <pre className="text-xs">{rawResponse}</pre>
        </ScrollArea>
      </div>
    </CollapsibleCard>
  )
}
