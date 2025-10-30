export function SimulatorPageHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-balance text-3xl font-bold tracking-tight">
          Route Simulator
        </h1>
        <p className="text-pretty text-muted-foreground">
          Test authentication flows and webhook deliveries in a sandbox
          environment
        </p>
      </div>
    </div>
  );
}
