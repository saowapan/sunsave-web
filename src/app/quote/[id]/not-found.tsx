import Link from "next/link";

export default function QuoteNotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-4xl font-semibold">Quote not found</h1>
      <p className="mt-3 text-stone-600">
        This quote doesn’t exist or may have expired.
      </p>
      <Link
        href="/signup"
        className="mt-6 rounded-lg bg-leaf-600 px-6 py-3 font-medium text-white hover:bg-leaf-500"
      >
        Get a new quote
      </Link>
    </main>
  );
}