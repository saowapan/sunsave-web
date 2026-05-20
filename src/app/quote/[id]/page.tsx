import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { api, ApiError } from '@/lib/api-client';
import {
  PROPERTY_TYPE_LABELS,
  REGION_LABELS,
  ORIENTATION_LABELS,
  type QuoteResponse,
} from '@/lib/contracts';
import { ShareButton } from './share-button';

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Fetch the quote once, server-side. Shared by both generateMetadata and
 * the page component — Next.js dedupes identical fetches within a request,
 * but since we use our api client (not raw fetch) we fetch explicitly and
 * pass nothing between them; each calls the API. For a demo that's fine.
 */

async function getQuote(id: string): Promise<QuoteResponse | null> {
  try {
    return await api.getQuote(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;  // genuine errors (500, network) should surface, not 404
  }
}

export async function generateMetadata({ params, }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const quote = await getQuote(id);
  if (!quote) return { title: 'Quote not found - Sunsave Demo' };

  return {
    title: `Your solar quote — save £${Math.round(quote.annualSavingsGbp)}/year`,
    description: `A ${quote.systemSizeKw}kW solar system for your ${PROPERTY_TYPE_LABELS[quote.propertyType]} in ${REGION_LABELS[quote.region]}.`,
  };
}

export default async function QuotePage({ params }: PageProps) {
  const { id } = await params;
  const quote = await getQuote(id);

  if (!quote) {
    notFound(); // rednder not-found.tsx
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      {/* Header */}
      <div className="text-center">
        <p className="font-body text-sm font-medium uppercase tracking-widest text-leaf-600">
          Your personalised quote
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">
          Save{' '}
          <span className="text-leaf-600">
            £{Math.round(quote.annualSavingsGbp).toLocaleString()}
          </span>{' '}
          a year
        </h1>
        <p className="mt-3 text-stone-600">
          with a {quote.systemSizeKw}kW solar system on your{' '}
          {PROPERTY_TYPE_LABELS[quote.propertyType].toLowerCase()} in{' '}
          {REGION_LABELS[quote.region]}.
        </p>
      </div>

      {/* Headline subscription price */}
      <div className="mt-10 overflow-hidden rounded-2xl bg-gradient-to-br from-leaf-600 to-leaf-500 p-8 text-center text-white shadow-lg">
        <p className="text-sm font-medium uppercase tracking-wider opacity-90">
          Monthly subscription
        </p>
        <p className="mt-2 font-display text-6xl font-semibold">
          £{quote.monthlySubscriptionGbp.toFixed(2)}
        </p>
        <p className="mt-1 text-sm opacity-90">
          No upfront cost · Installation, maintenance & monitoring included
        </p>
      </div>

      {/* Stat grid */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard
          label="System size"
          value={`${quote.systemSizeKw} kW`}
          hint="Recommended for your home"
        />
        <StatCard
          label="Annual generation"
          value={`${quote.annualGenerationKwh.toLocaleString()} kWh`}
          hint="Estimated per year"
        />
        <StatCard
          label="CO₂ avoided"
          value={`${quote.annualCo2SavedKg.toLocaleString()} kg`}
          hint="Per year vs grid power"
        />
        <StatCard
          label="Buy outright"
          value={`£${quote.upfrontPriceGbp.toLocaleString()}`}
          hint="One-off purchase price"
        />
        <StatCard
          label="Payback period"
          value={`${quote.paybackYears} yrs`}
          hint="If bought outright"
        />
        <StatCard
          label="Roof"
          value={ORIENTATION_LABELS[quote.roofOrientation]}
          hint="Facing direction"
        />
      </div>

      {/* Disclaimer + CTA */}
      <p className="mt-8 text-center text-xs text-stone-500">
        Estimates only, based on typical UK figures. A full survey would refine
        these numbers. This is a portfolio demo, not a real Sunsave product.
      </p>

      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/signup"
          className="rounded-lg border border-stone-300 px-6 py-3 font-medium text-stone-700 transition-colors hover:bg-stone-100"
        >
          Start a new quote
        </Link>
        <ShareButton />
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
        {label}
      </p>
      <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-stone-400">{hint}</p>
    </div>
  );
}