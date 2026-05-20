'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { WizardState } from '@/lib/use-wizard-state';
import { QuoteInputsSchema } from '@/lib/contracts';
import { api, ApiError } from '@/lib/api-client';

interface SubmitStepProps {
  state: WizardState;
  clear: () => void;
}

type SubmitStatus =
  | { phase: 'submitting' }
  | { phase: 'error'; message: string }
  | { phase: 'success'; quoteId: string };

export function SubmitStep({ state, clear }: SubmitStepProps) {
  const router = useRouter();

  // Validate during render — it's pure and cheap, and seeding the initial
  // state from it avoids a setState-in-effect for the failure case.
  const parsed = QuoteInputsSchema.safeParse(state);

  const [status, setStatus] = useState<SubmitStatus>(() =>
    parsed.success
      ? { phase: 'submitting' }
      : {
          phase: 'error',
          message:
            'Your details are incomplete. Please go back and finish every step.',
        },
  );

  // Guard against the effect firing twice (React 18 StrictMode in dev
  // mounts effects twice). Without this we'd POST two quotes.
  const hasSubmitted = useRef(false);

  useEffect(() => {
    if (hasSubmitted.current) return;
    if (!parsed.success) return; // initial state already reflects the error

    hasSubmitted.current = true;

    api
      .createQuote(parsed.data)
      .then((quote) => {
        setStatus({ phase: 'success', quoteId: quote.id });
        clear(); // wipe wizard state — the quote now lives server-side
      })
      .catch((error: unknown) => {
        const message =
          error instanceof ApiError
            ? `Something went wrong (${error.status}). Please try again.`
            : 'Could not reach the server. Please try again.';
        setStatus({ phase: 'error', message });
        hasSubmitted.current = false; // allow a retry
      });
    // We intentionally run this once on mount; state is captured at that point.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // On success, redirect to the shareable quote page.
  useEffect(() => {
    if (status.phase === 'success') {
      router.replace(`/quote/${status.quoteId}`);
    }
  }, [status, router]);

  if (status.phase === 'error') {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <span className="text-2xl text-red-600">!</span>
        </div>
        <h2 className="mt-4 text-xl font-semibold">Couldn’t generate quote</h2>
        <p className="mt-2 text-gray-600">{status.message}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/signup?step=review"
            className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to review
          </Link>
          <button
            type="button"
            onClick={() => {
              // Re-trigger the submit effect by remounting via a hard nav.
              router.refresh();
              window.location.reload();
            }}
            className="rounded-lg bg-emerald-500 px-5 py-2.5 font-medium text-white hover:bg-emerald-600"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // idle / submitting / success-before-redirect all show a spinner
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-500" />
      <p className="mt-4 font-medium">Calculating your solar quote…</p>
      <p className="mt-1 text-sm text-gray-500">This only takes a moment.</p>
    </div>
  );
}