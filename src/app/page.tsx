import Link from 'next/link';

export default function Home() {
  return (
    <main className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4 text-center">
      <p className="font-body text-sm font-medium uppercase tracking-widest text-leaf-600">
        Solar, simplified
      </p>
      <h1 className="mt-4 font-display text-5xl font-semibold leading-tight sm:text-6xl">
        Go solar for{' '}
        <span className="text-leaf-600">£0 upfront</span>
      </h1>
      <p className="mt-5 max-w-xl text-lg text-stone-600">
        Get an instant estimate of your savings, system size, and monthly
        subscription. Takes less than a minute.
      </p>
      <Link
        href="/signup"
        className="mt-8 rounded-full bg-solar-600 px-8 py-4 text-lg font-medium text-white shadow-lg transition-all hover:bg-leaf-500 hover:shadow-xl"
      >
        Calculate my savings →
      </Link>
      <p className="mt-6 text-xs text-stone-400">
        A portfolio demo project
      </p>
    </main>
  );
}