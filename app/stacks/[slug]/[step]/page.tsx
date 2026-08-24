import { notFound } from "next/navigation";
import { getAllStacks, getStackBySlug, getStepComponent } from "@/lib/content";
import { Sidebar } from "@/components/ui/Sidebar";
import { StepNavigation } from "@/components/ui/StepNavigation";
import { StepLayout } from "@/components/ui/StepLayout";

export function generateStaticParams() {
  return getAllStacks().flatMap((stack) =>
    stack.steps.map((step) => ({ slug: stack.metadata.slug, step: step.slug }))
  );
}

export const dynamicParams = false;

export default async function StepPage({ params }: { params: Promise<{ slug: string; step: string }> }) {
  const { slug, step: stepSlug } = await params;

  const stack = getStackBySlug(slug);
  if (!stack) notFound();

  const stepIndex = stack.steps.findIndex((s) => s.slug === stepSlug);
  const step = stack.steps[stepIndex];
  if (!step) notFound();

  const prevStep = stepIndex > 0 ? stack.steps[stepIndex - 1] : null;
  const nextStep = stepIndex < stack.steps.length - 1 ? stack.steps[stepIndex + 1] : null;

  let StepComponent;
  try {
    StepComponent = await getStepComponent(slug, stepSlug);
  } catch {
    notFound();
  }

  return (
    <StepLayout sidebar={<Sidebar steps={stack.steps} basePath={`/stacks/${slug}`} />}>
      <article className="max-w-4xl mx-auto">
        <StepComponent />
        <StepNavigation
          prevStep={prevStep}
          nextStep={nextStep}
          basePath={`/stacks/${slug}`}
        />
      </article>
    </StepLayout>
  );
}