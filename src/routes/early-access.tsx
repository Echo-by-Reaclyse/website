import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/early-access")({
  beforeLoad: () => {
    throw redirect({ to: "/", replace: true });
  },
  component: () => null,
});
