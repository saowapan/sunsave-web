'use client'

import Link from 'next/link';
import { previousStep, type Step } from '@/lib/wizard-steps';

interface BackLinkProps {
  currentStep: Step;
}

export function BackLink({ currentStep }: BackLinkProps) {
  const prev = previousStep(currentStep);
  if (!prev) return null;

  return (
    <Link
      href={`/signup?step=${prev}`}
      className="mt-10 inline-block text-sm font-medium text-gray-600 hover:text-gray-800">
      ← Back
    </Link>
  )
}