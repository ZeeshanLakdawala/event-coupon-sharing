import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-slate-50 p-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <AlertCircle className="mb-6 h-20 w-20 text-slate-300" />
        <h2 className="mb-3 text-4xl font-black text-slate-900 tracking-tight">404</h2>
        <p className="mb-8 text-lg font-medium text-slate-500">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="h-12 px-8 text-lg rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700">
          <Link href="/">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
