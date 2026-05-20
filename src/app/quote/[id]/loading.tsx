export default function Loading() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <div className="h-8 w-48 animate-pulse rounded bg-stone-200">
        <div className="mt-8 grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-stone-100" />
          ))}
        </div>
      </div>

    </main>
  )
}