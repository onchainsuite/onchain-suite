import { Button } from "@/components/ui/button";

export function PlanInfoLinks() {
  return (
    <div className="mt-6 grid grid-cols-2 gap-2 sm:mt-8 sm:gap-4 lg:grid-cols-4">
      {["Premium", "Standard", "Essentials", "Free"].map((planName) => (
        <div key={planName} className="text-center">
          <Button variant="ghost" className="text-primary text-xs sm:text-sm">
            About {planName}
          </Button>
        </div>
      ))}
    </div>
  );
}
