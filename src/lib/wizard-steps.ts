/**
 * Ordered list of wizard steps. The order defines the linear flow.
 * The literal-array-of-tuples pattern keeps these as a const so the
 * `Step` type is the precise union of slugs.
 */
export const WIZARD_STEPS = [
  'property-type',
  'region',
  'orientation',
  'bill',
  'review',
  'submit',
] as const;

export type Step = (typeof WIZARD_STEPS)[number];

export const STEP_LABELS: Record<Step, string> = {
  'property-type': 'Property type',
  region: 'Region',
  orientation: 'Roof orientation',
  bill: 'Monthly bill',
  review: 'Review',
  submit: 'Submit',
};

export const FIRST_STEP: Step = 'property-type';

export function isValidStep(value: string | null): value is Step {
  return value !== null && (WIZARD_STEPS as readonly string[]).includes(value);
}

export function nextStep(current: Step): Step | null {
  const idx = WIZARD_STEPS.indexOf(current);
  return idx < WIZARD_STEPS.length - 1 ? WIZARD_STEPS[idx + 1] : null;
}

export function previousStep(current: Step): Step | null {
  const idx = WIZARD_STEPS.indexOf(current);
  return idx > 0 ? WIZARD_STEPS[idx - 1] : null;
}

export function stepIndex(step: Step): number {
  return WIZARD_STEPS.indexOf(step);
}