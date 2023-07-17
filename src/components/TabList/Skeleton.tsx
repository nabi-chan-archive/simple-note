export default function TabListSkeleton() {
  return (
    <nav className="tabs w-full px-2">
      {[...Array<void>(2)].map((_, index) => (
        <div key={index} className="tab tab-bordered flex-1 justify-between">
          <span className="skeleton mb-2 rounded-md text-sm text-transparent">
            컴포넌트를 불러오고 있습니다...
          </span>
        </div>
      ))}
    </nav>
  );
}
