'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useWizardState } from '@/lib/use-wizard-state';
import {
  FIRST_STEP,
  isValidStep,
  STEP_LABELS,
  WIZARD_STEPS,
  stepIndex,
  type Step,
} from '@/lib/wizard-steps';

// Step components — we'll create these in 7b. Placeholder imports for now.
import { PropertyTypeStep } from './_steps/property-type-step';
import { RegionStep } from './_steps/region-step';
import { OrientationStep } from './_steps/orientation-step';
import { BillStep } from './_steps/bill-step';
import { ReviewStep } from './_steps/review-step';
import { SubmitStep } from './_steps/submit-step';

/**
 * Outer page component. Wraps the inner content in Suspense because
 * `useSearchParams` triggers Next.js's "this should be in Suspense" warning
 * — required for static rendering compatibility.
 */
export default function SignupPage() {
  return (
    <Suspense fallback={<WizardSkeleton />}>
      <WizardInner />
    </Suspense>
  );
}

function WizardInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const wizard = useWizardState();

  const stepParam = searchParams.get('step');
  const stepIsValid = isValidStep(stepParam);

  // Redirect to the first step if the URL has no valid step.
  // This is a side effect, so it lives in an effect — never in render.
  useEffect(() => {
    if (wizard.state !== null && !stepIsValid) {
      router.replace(`/signup?step=${FIRST_STEP}`);
    }
  }, [wizard.state, stepIsValid, router]);

  // Still loading sessionStorage, or about to redirect — show skeleton.
  if (wizard.state === null || !stepIsValid) {
    return <WizardSkeleton />;
  }

  const currentStep: Step = stepParam;

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <ProgressBar currentStep={currentStep} />
      <div className="mt-8">
        <StepRenderer
          step={currentStep}
          state={wizard.state}
          update={wizard.update}
          clear={wizard.clear}
        />
      </div>
    </main>
  );
}

function StepRenderer({
  step,
  state,
  update,
  clear,
}: {
  step: Step;
  state: ReturnType<typeof useWizardState>['state'];
  update: ReturnType<typeof useWizardState>['update'];
  clear: ReturnType<typeof useWizardState>['clear'];
}) {
  // Exhaustive switch — TS will complain if we add a Step and forget a case.
  switch (step) {
    case 'property-type':
      return <PropertyTypeStep state={state ?? {}} update={update} />;
    case 'region':
      return <RegionStep state={state ?? {}} update={update} />;
    case 'orientation':
      return <OrientationStep state={state ?? {}} update={update} />;
    case 'bill':
      return <BillStep state={state ?? {}} update={update} />;
    case 'review':
      return <ReviewStep state={state ?? {}} />;
    case 'submit':
      return <SubmitStep state={state ?? {}} clear={clear} />;
  }
}

function ProgressBar({ currentStep }: { currentStep: Step }) {
  const idx = stepIndex(currentStep);
  const total = WIZARD_STEPS.length;
  const pct = Math.round(((idx + 1) / total) * 100);

  return (
    <div>
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Step {idx + 1} of {total}: {STEP_LABELS[currentStep]}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-emerald-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function WizardSkeleton() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="h-2 w-full rounded-full bg-gray-200" />
      <div className="mt-8 h-64 w-full animate-pulse rounded-lg bg-gray-100" />
    </main>
  );
}