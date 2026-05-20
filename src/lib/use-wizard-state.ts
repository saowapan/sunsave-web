'use client';

import { useCallback, useState } from 'react';
import type { QuoteInputs } from './contracts';

/**
 * The wizard collects QuoteInputs progressively. Each step writes its field,
 * the review step reads the full object, the submit step ships it.
 *
 * Partial<> because mid-wizard not every field is set yet.
 */
export type WizardState = Partial<QuoteInputs>;

const STORAGE_KEY = 'sunsave:wizard-state';

function readStorage(): WizardState {
  // SSR: window is undefined, return empty state.
  // Client: read once, synchronously, so first render already has data.
  //
  // This component is rendered under Suspense with useSearchParams(), so
  // SSR always falls back to the skeleton — the wizard form never renders
  // on the server. That means there's no SSR/client mismatch to worry about.
  if (typeof window === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WizardState) : {};
  } catch {
    // sessionStorage can throw in some privacy modes
    return {};
  }
}

/**
 * useWizardState — read/write wizard form state from sessionStorage.
 */
export function useWizardState() {
  const [state, setState] = useState<WizardState>(readStorage);

  // Update a single field and persist
  const update = useCallback(<K extends keyof QuoteInputs>(
    key: K,
    value: QuoteInputs[K],
  ) => {
    setState((prev) => {
      const next = { ...prev, [key]: value };
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore quota / privacy errors
      }
      return next;
    });
  }, []);

  // Wipe everything (after successful submission)
  const clear = useCallback(() => {
    setState({});
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { state, update, clear };
}