'use client';

import type { WizardState } from '@/lib/use-wizard-state';
import { QuoteInputsSchema, type QuoteInputs } from '@/lib/contracts';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { nextStep } from '@/lib/wizard-steps';
import { BackLink } from '../_components/back-link';

interface StepProps {
  state: WizardState;
  update: <K extends keyof QuoteInputs>(key: K, value: QuoteInputs[K]) => void;
}

// Pull just the bill field's rules out of the shared schema so the
// client-side validation matches the server exactly.
const billSchema = QuoteInputsSchema.shape.monthlyBillGbp;

export function BillStep({ state, update }: StepProps) {
  const router = useRouter();

  // Local input state as a string — number inputs are easier to handle
  // as strings until validation/commit time (avoids NaN-while-typing pain)
  const [raw, setRaw] = useState<string>(
    state.monthlyBillGbp !== undefined ? String(state.monthlyBillGbp) : '',
  )

  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    const value = Number(raw);
    const result = billSchema.safeParse(value);

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Please enter a valide amount');
      return;
    }

    setError(null);
    update('monthlyBillGbp', result.data);

    const next = nextStep('bill');
    if (next) {
      router.push(`/signup?step=${next}`)
    }
  };


  return (
    <div>
      <h2 className='text-2xl font-semibold'>
        What is your average monthly electricity bill?
      </h2>
      <p className='mt-2 text-gray-600'>
        We use thi to estimate your energy usage and recommend the right system size.
      </p>
      <div>
        <div className="mt-6">
          <label htmlFor="bill" className="block text-sm font-medium text-gray-700">
            Monthly bill
          </label>
          <div className="relative mt-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              £
            </span>
            <input
              id="bill"
              type="number"
              inputMode="decimal"
              min={10}
              max={2000}
              step="1"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleContinue();
              }}
              className="w-full rounded-lg border-2 border-gray-200 py-3 pl-7 pr-3 text-lg focus:border-emerald-500 focus:outline-none"
              placeholder="120"
              autoFocus
            />
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <p className="mt-2 text-sm text-gray-500">
            Enter an amount between £10 and £2,000.
          </p>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <BackLink currentStep="bill" />
        <button
          type="button"
          onClick={handleContinue}
          className="rounded-lg bg-emerald-500 px-6 py-3 font-medium text-white transition-colors hover:bg-emerald-600"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}