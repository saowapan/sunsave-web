'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { WizardState } from '@/lib/use-wizard-state';
import {
  PROPERTY_TYPE_LABELS,
  REGION_LABELS,
  ORIENTATION_LABELS,
  QuoteInputsSchema,
} from '@/lib/contracts';
import { nextStep } from '@/lib/wizard-steps';

interface ReviewStepProps {
  state: WizardState;
}

export function ReviewStep({ state }: ReviewStepProps) {
  const router = useRouter();

  // Validate the accumulated wizard state against the full schema.
  // If the user skipped a step (e.g. deep-linked to ?step=review),
  // this tells us exactly what's missing.
  const parsed = QuoteInputsSchema.safeParse(state);
  const isComplete = parsed.success;

  const rows: Array<{ label: string; value: string; editStep: string }> = [
    {
      label: 'Property type',
      value: state.propertyType
        ? PROPERTY_TYPE_LABELS[state.propertyType]
        : '—',
      editStep: 'property-type',
    },
    {
      label: 'Region',
      value: state.region ? REGION_LABELS[state.region] : '—',
      editStep: 'region',
    },
    {
      label: 'Roof orientation',
      value: state.roofOrientation
        ? ORIENTATION_LABELS[state.roofOrientation]
        : '—',
      editStep: 'orientation',
    },
    {
      label: 'Monthly electricity bill',
      value:
        state.monthlyBillGbp !== undefined
          ? `£${state.monthlyBillGbp.toFixed(2)}`
          : '—',
      editStep: 'bill',
    },
  ];

  const handleContinue = () => {
    const next = nextStep('review'); // → 'submit'
    if (next) {
      router.push(`/signup?step=${next}`);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold">Review your details</h2>
      <p className="mt-2 text-gray-600">
        Check everything looks right before we calculate your quote.
      </p>

      <dl className="mt-6 divide-y divide-gray-200 rounded-lg border border-gray-200">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between px-4 py-3"
          >
            <div>
              <dt className="text-sm text-gray-500">{row.label}</dt>
              <dd className="font-medium">{row.value}</dd>
            </div>
            <Link
              href={`/signup?step=${row.editStep}`}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              Edit
            </Link>
          </div>
        ))}
      </dl>

      {!isComplete && (
        <p className="mt-4 rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Some details are missing. Please complete every step before
          continuing.
        </p>
      )}

      <div className="mt-6 flex items-center justify-between">
        <Link
          href="/signup?step=bill"
          className="text-sm font-medium text-gray-600 hover:text-gray-800"
        >
          ← Back
        </Link>
        <button
          type="button"
          onClick={handleContinue}
          disabled={!isComplete}
          className="rounded-lg bg-emerald-500 px-6 py-3 font-medium text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          Get my quote →
        </button>
      </div>
    </div>
  );
}