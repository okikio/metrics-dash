"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RefreshCw } from 'lucide-react'

const formSchema = z.object({
  url: z.string().url("Please enter a valid URL."),
})

interface MetricsFormProps {
  onSubmit: (url: string) => void
  isLoading: boolean
  autoRefresh: boolean
  onAutoRefreshToggle: () => void
  currentUrl?: string
}

export function MetricsForm({ 
  onSubmit, 
  isLoading, 
  autoRefresh, 
  onAutoRefreshToggle,
  currentUrl 
}: MetricsFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: currentUrl || ""
    }
  })

  return (
    <div className="flex items-center justify-center p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => onSubmit(data.url))}
          className="flex flex-col gap-6 w-full max-w-md"
        >
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Metrics URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://your-server/metrics" {...field} className="w-full rounded-xl" />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="rounded-xl hover:bg-[#4A89F3]"
            >
              Fetch Metrics
            </Button>
            <Button
              type="button"
              variant={autoRefresh ? "secondary" : "outline"}
              onClick={onAutoRefreshToggle}
              className="gap-2 rounded-xl"
            >
              <RefreshCw className={`h-4 w-4 ${autoRefresh ? "animate-spin" : ""}`} />
              Auto-refresh
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
