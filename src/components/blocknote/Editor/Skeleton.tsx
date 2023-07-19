export default function EditorSkeleton() {
  return (
    <div className="flex w-full flex-col gap-2">
      {[...Array<void>(10)].map((_, i) => (
        <div key={i}>
          <span className="skeleton text-transparent">
            {[...Array<void>(12)].map((_, j) => (
              <span key={j} className="inline-block h-4 w-20" />
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}
