"use client";

import { useState } from "react";
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
import { RefreshCw } from "lucide-react";
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
  isLoading: boolean;
  autoRefresh: boolean;
  onAutoRefreshToggle: () => void;
  currentUrl?: string;
}

export function MetricsForm({
  onSubmit,
  isLoading,
  autoRefresh,
  onAutoRefreshToggle,
  currentUrl,
}: MetricsFormProps) {
  const { toast } = useToast();
  const [localLoading, setLocalLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: currentUrl || "",
    },
  });

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
            `Failed to fetch "${url}" (Status: ${response.status})`,
          );
        }
      }

      clearTimeout(timeoutId);

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("text/plain")) {
        throw new Error(
          `Invalid metrics endpoint: "${url}" does not return text/plain content`,
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

  return (
    <div className="flex items-center justify-center p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-6 w-full max-w-md"
        >
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Metrics URL:</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://your-server/metrics"
                    {...field}
                    className="w-full rounded-xl"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="submit"
              disabled={isLoading || localLoading}
              className="rounded-xl hover:bg-[#4A89F3]"
            >
              {localLoading ? "Fetching..." : "Fetch Metrics"}{" "}
              {/* Change the text based on what's going on within the code. */}
            </Button>
            <Button
              type="button"
              variant={autoRefresh ? "secondary" : "outline"}
              onClick={onAutoRefreshToggle}
              className="gap-2 rounded-xl"
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${autoRefresh ? "animate-spin" : ""}`}
              />
              Auto-refresh
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
