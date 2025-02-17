import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black px-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-6 flex flex-col items-center">
          <AlertCircle className="h-10 w-10 text-blue-500 mb-4" />
          <h1 className="text-2xl font-bold text-white">404 Page Not Found</h1>
        </CardContent>
      </Card>
    </div>
  );
}
