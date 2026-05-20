'use client';

import { useState } from 'react';

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;

    // Prefer the native share sheet on mobile; fall back to clipboard.
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My solar quote', url });
        return;
      } catch {
        // user cancelled the share sheet — do nothing
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked — last resort, select-prompt
      window.prompt('Copy this link:', url);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="rounded-lg bg-solar-500 px-6 py-3 font-medium text-white transition-colors hover:bg-solar-600"
    >
      {copied ? 'Link copied!' : 'Share this quote'}
    </button>
  );
}