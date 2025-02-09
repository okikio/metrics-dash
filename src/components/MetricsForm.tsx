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

const formSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

interface MetricsFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  autoRefresh: boolean;
  onAutoRefreshToggle: () => void;
}

export function MetricsForm({
  onSubmit,
  isLoading,
  autoRefresh,
  onAutoRefreshToggle,
}: MetricsFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "https://server.fifthwit.tech/metrics",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => onSubmit(data.url))}
        className="flex gap-4 items-end"
      >
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Metrics URL</FormLabel>
              <FormControl>
                <Input placeholder="https://your-server/metrics" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          Fetch Metrics
        </Button>
        <Button
          type="button"
          variant={autoRefresh ? "secondary" : "outline"}
          onClick={onAutoRefreshToggle}
          className="gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${autoRefresh ? "animate-spin" : ""}`}
          />
          Auto-refresh
        </Button>
      </form>
    </Form>
  );
}
