'use client';

import type { WizardState } from '@/lib/use-wizard-state';
import { REGION_LABELS, REGIONS, type QuoteInputs } from '@/lib/contracts';
import { OptionGrid } from '../_components/option-grid';
import { BackLink } from '../_components/back-link';

interface StepProps {
  state: WizardState;
  update: <K extends keyof QuoteInputs>(key: K, value: QuoteInputs[K]) => void;
}

export function RegionStep({ state, update }: StepProps) {
  return (
    <div>
      <h2 className='text-2xl font-semibold'>Where in the UK are you?</h2>
      <p className='mt-2 text-gray-600'>
        Sunlight level vary by region, which affects how much energy your panels will generate.
      </p>
      <div>
        <OptionGrid
          step="region"
          value={state.region}
          onSelect={(value) => update('region', value)}
          options={REGIONS}
          labels={REGION_LABELS}
        />
      </div>
      <BackLink currentStep='region' />
    </div>
  );
}