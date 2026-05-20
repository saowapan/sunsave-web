'use client';

import { useRouter } from 'next/navigation';
import { nextStep, type Step } from '@/lib/wizard-steps';

interface OptionGridProps<T extends string> {
  /** The wizard step this grid is rendering (used to navigate forward) */
  step: Step;
  /** The currently selected value, if any */
  value: T | undefined;
  /** Called when the user picks an option */
  onSelect: (value: T) => void;
  /** The selectable options */
  options: ReadonlyArray<T>;
  /** Display label for each option code */
  labels: Record<T, string>;
}

/**
 * Generic option grid for "pick one" wizard steps.
 *
 * Auto-advances to the next step when a selection is made — Sunsave's
 * own wizard does this and it's a much nicer UX than "pick then click Next."
 */
export function OptionGrid<T extends string>({
  step,
  value,
  onSelect,
  options,
  labels,
}: OptionGridProps<T>) {
  const router = useRouter();

  const handlePick = (opt: T) => {
    onSelect(opt);
    const next = nextStep(step);
    if (next) {
      router.push(`/signup?step=${next}`);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {options.map((opt) => {
        const selected = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => handlePick(opt)}
            className={`rounded-lg border-2 p-4 text-left transition-all ${selected
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
              }`}
          >
            <span className="font-medium">{labels[opt]}</span>
          </button>
        );
      })}
    </div>
  );
}