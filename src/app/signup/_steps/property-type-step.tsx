'use client';

import type { WizardState } from '@/lib/use-wizard-state';
import { PROPERTY_TYPE_LABELS, PROPERTY_TYPES, type QuoteInputs } from '@/lib/contracts';
import { OptionGrid } from '../_components/option-grid';

interface StepProps {
  state: WizardState;
  update: <K extends keyof QuoteInputs>(key: K, value: QuoteInputs[K]) => void;
}

export function PropertyTypeStep({ state, update }: StepProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold">What type of home do you have?</h2>
      <p className='mt-2 text-gray-600'>
        This helps us estimate how much roof space is available for panels.
      </p>
      <div className='mt-6'>
        <OptionGrid
          step='property-type'
          value={state.propertyType}
          onSelect={(value) => update('propertyType', value)}
          options={PROPERTY_TYPES}
          labels={PROPERTY_TYPE_LABELS}
        />
      </div>
    </div>
  )

}