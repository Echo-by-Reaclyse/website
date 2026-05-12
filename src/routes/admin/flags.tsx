import { createFileRoute } from "@tanstack/react-router";
import { ToggleLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/admin/flags")({
  component: FlagsPage,
});

function FlagsPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Feature Flags</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Toggle app features remotely without a code release.
        </p>
      </div>

      <Card className="max-w-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <ToggleLeft className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Coming soon</CardTitle>
              <CardDescription className="mt-0.5">Remote feature control</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This panel will let you enable or disable app features for all users (or specific user
            cohorts) in real time — no app update required. Planned flags include: AI insights,
            time capsule unlocks, new question categories, and experimental UI experiments.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
