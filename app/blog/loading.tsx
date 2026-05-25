export default function BlogLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div className="h-10 w-48 bg-muted rounded-lg mb-4" />
      <div className="h-5 w-64 bg-muted rounded mb-12" />
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="post-card h-32 bg-muted/30" />
        ))}
      </div>
    </div>
  )
}
