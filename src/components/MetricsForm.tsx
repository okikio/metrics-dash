import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  url: z.string().url("Please enter a valid URL."),
});

const errorTitles = [
  "Oops! We hit a snag:",
  "Houston, we have a problem:",
  "Well, this is awkward:",
  "Unexpected detour:",
  "That didn't go as planned:",
  "Minor setback detected:",
  "Plot twist:",
  "Hmm, something's not right:",
  "We ran into a hiccup:",
  "Quick heads up:",
];

interface MetricsFormProps {
  onSubmit: (url: string) => void;
  onFileImport: (content: string) => void;
  isLoading: boolean;
  autoRefresh: boolean;
  onAutoRefreshToggle: () => void;
  currentUrl?: string;
}

export function MetricsForm({
  onSubmit,
  onFileImport,
  isLoading,
  autoRefresh,
  onAutoRefreshToggle,
  currentUrl,
}: MetricsFormProps) {
  const { toast } = useToast();
  const [localLoading, setLocalLoading] = useState(false);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: currentUrl || "",
    },
  });

  // Auto-refresh effect
  useEffect(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }

    if (autoRefresh && form.getValues().url) {
      const url = form.getValues().url;

      if (formSchema.shape.url.safeParse(url).success) {
        refreshIntervalRef.current = setInterval(() => {
          if (!isLoading && !localLoading) {
            handleSubmit(form.getValues());
          }
        }, 10000); // 10 seconds
      }
    }

    // Cleanup interval on unmount or when dependencies change
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [autoRefresh, isLoading, localLoading, form.getValues().url]);

  const getRandomErrorTitle = () => {
    const randomIndex = Math.floor(Math.random() * errorTitles.length);
    return errorTitles[randomIndex];
  };

  const checkUrlAvailability = async (url: string): Promise<boolean> => {
    const headers = {
      Accept: "text/plain",
      "User-Agent": "Mozilla/5.0 (compatible; MetricsFetcher/1.0)",
    };

    try {
      let response: Response | null = null;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // ⏳ 15-second timeout

      try {
        response = await fetch(url, {
          method: "HEAD",
          headers,
          signal: controller.signal,
        });
      } catch (err) {
        console.warn(`HEAD request failed, falling back to GET for: ${url}`);
      }

      if (!response || !response.ok) {
        response = await fetch(url, {
          method: "GET",
          headers,
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch "${url}" (Status: ${response.status})`
          );
        }
      }

      clearTimeout(timeoutId);

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("text/plain")) {
        throw new Error(
          `Invalid metrics endpoint: "${url}" does not return text/plain content`
        );
      }

      return true;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          toast({
            variant: "destructive",
            title: getRandomErrorTitle(),
            description: `Connection timed out while trying to reach "${url}". The server might be slow or unreachable.`,
          });
        } else {
          toast({
            variant: "destructive",
            title: getRandomErrorTitle(),
            description: error.message,
          });
        }
      }
      return false;
    }
  };

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setLocalLoading(true); // Almost instantly toggle the loading state.
    const isAvailable = await checkUrlAvailability(data.url);
    if (isAvailable) {
      onSubmit(data.url);
    }

    setLocalLoading(false); // Resets the loading state after request.
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileImport(content);
      // Reset the file input
      event.target.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex items-center justify-center p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-6 w-full max-w-md lg:max-w-[1800px]"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:gap-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Metrics URL:</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://your-server/metrics or import a file"
                      {...field}
                      className="w-full rounded-xl"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 lg:mt-0 lg:flex lg:flex-shrink-0">
              <Button
                type="submit"
                disabled={isLoading || localLoading}
                className="rounded-xl hover:bg-[#4A89F3] lg:w-[150px]"
              >
                {localLoading ? "Fetching..." : "Fetch Metrics"}
              </Button>
              <Button
                type="button"
                variant={autoRefresh ? "secondary" : "outline"}
                onClick={onAutoRefreshToggle}
                className="gap-2 rounded-xl lg:w-[150px]"
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 ${autoRefresh ? "animate-spin" : ""}`}
                />
                Auto-refresh
              </Button>
              <div className="relative hidden md:block">
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2 rounded-xl lg:w-[150px] w-full"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="h-4 w-4" />
                  Import File
                </Button>
                <input
                  type="file"
                  id="file-upload"
                  accept=".txt"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
