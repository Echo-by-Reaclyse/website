import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/early-access")({
  beforeLoad: () => {
    throw redirect({ to: "/", hash: "waitlist", replace: true });
  },
  component: () => null,
});
