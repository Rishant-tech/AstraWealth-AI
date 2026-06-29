import { PageHeader } from "@/components/PageHeader";
import { PlannerForm } from "@/components/PlannerForm";
import { Shell } from "@/components/Shell";

export default function PortfolioPlannerPage() {
  return (
    <Shell>
      <PageHeader
        eyebrow="Portfolio planner"
        title="Build a scenario-based allocation"
        description="Enter your assumptions and get a probability-aware plan with allocation, phased deployment, future scenarios, rebalancing rules, and risk explanation."
      />
      <PlannerForm />
    </Shell>
  );
}
