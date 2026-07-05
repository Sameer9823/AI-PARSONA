export default function DashboardLoading() {
  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div className="shimmer h-10 w-48 rounded-xl" />
      <div className="flex-1 space-y-4">
        <div className="shimmer ml-auto h-16 w-2/3 rounded-2xl" />
        <div className="shimmer h-24 w-3/4 rounded-2xl" />
        <div className="shimmer ml-auto h-12 w-1/2 rounded-2xl" />
      </div>
      <div className="shimmer h-14 w-full rounded-2xl" />
    </div>
  );
}
