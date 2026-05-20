'use client';

import { useCallback, useEffect, useState } from 'react';
import type { QuoteInputs } from './contracts';

/**
 * The wizard collects QuoteInputs progressively. Each step writes its field,
 * the review step reads the full object, the submit step ships it.
 *
 * Partial<> because mid-wizard not every field is set yet.
 */
export type WizardState = Partial<QuoteInputs>;

const STORAGE_KEY = 'sunsave:wizard-state';

/**
 * useWizardState — read/write wizard form state from sessionStorage.
 *
 * Why sessionStorage and not localStorage?
 *   - Cleared when the tab closes — appropriate for an unfinished signup.
 *   - Not shared across tabs — each tab is one "session" of the wizard.
 *
 * Why not React Context?
 *   - Context loses state on refresh; sessionStorage survives it.
 *   - Each step page is its own component tree; no shared parent to host context naturally.
 */
export function useWizardState() {
  // null = "haven't read storage yet" (during SSR + first render)
  // {} or {...} = the actual state
  const [state, setState] = useState<WizardState | null>(null);

  // On first client-side render, hydrate from sessionStorage
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      setState(raw ? (JSON.parse(raw) as WizardState) : {});
    } catch {
      // sessionStorage can throw in some privacy modes; fall back to fresh
      setState({});
    }
  }, []);

  // Update a single field and persist
  const update = useCallback(<K extends keyof QuoteInputs>(
    key: K,
    value: QuoteInputs[K],
  ) => {
    setState((prev) => {
      const next = { ...(prev ?? {}), [key]: value };
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