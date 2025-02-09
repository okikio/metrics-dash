import { Loader2 } from "lucide-react";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
    </div>
  );
};

export default Spinner;
