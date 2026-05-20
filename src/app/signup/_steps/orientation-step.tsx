'use client';

import type { WizardState } from '@/lib/use-wizard-state';
import { ORIENTATION_LABELS, ORIENTATIONS, type QuoteInputs } from '@/lib/contracts';
import { OptionGrid } from '../_components/option-grid';
import { BackLink } from '../_components/back-link';

interface StepProps {
  state: WizardState;
  update: <K extends keyof QuoteInputs>(key: K, value: QuoteInputs[K]) => void;
}

export function OrientationStep({ state, update }: StepProps) {
  return (
    <div>
      <h2 className='text-2xl font-semibold'>
        Which way does your roof face?
      </h2>
      <p className='mt-2 text-gray-600'>
        South-facing roofs generat the most energy.
        Do not worry if you are not sure - pick your best guess.
      </p>
      <div className='mt-6'>
        <OptionGrid
          step='orientation'
          value={state.roofOrientation}
          onSelect={(value) => update('roofOrientation', value)}
          options={ORIENTATIONS}
          labels={ORIENTATION_LABELS}
        />
      </div>
      <BackLink currentStep='orientation' />
    </div>
  );
}