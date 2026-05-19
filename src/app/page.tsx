import { api } from '@/lib/api-client';

export default async function Home() {
  let backendStatus: string;
  let quoteCount = 0;

  try {
    const quotes = await api.listRecentQuotes(5);
    backendStatus = 'connected';
    quoteCount = quotes.length;
  } catch (error) {
    backendStatus = `error: ${error instanceof Error ? error.message : 'unknown'}`;
  }

  return (
    <main className='min-h-screen p-8'>
      <h1 className='text-2xl font-bold'>Sunsave Demo</h1>
      <p className='mt-4'>
        Backedn status: <strong>{backendStatus}</strong>
      </p>
      <p>
        Found {quoteCount} recent quotes from the API.
      </p>
    </main>
  );
}
