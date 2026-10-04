import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/summit")({
  beforeLoad: () => {
    throw redirect({ to: "/", replace: true });
  },
  component: () => null,
});
