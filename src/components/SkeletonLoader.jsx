export function SkeletonCard({ className = '' }) {
  return (
    <div className={`rounded-xl bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 p-5 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <div className="skeleton h-3 w-24 rounded" />
          <div className="skeleton h-7 w-16 rounded" />
          <div className="skeleton h-2.5 w-32 rounded" />
        </div>
        <div className="skeleton h-12 w-12 rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonChart({ height = 280, className = '' }) {
  return (
    <div className={`rounded-xl bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="skeleton h-4 w-32 rounded" />
        <div className="skeleton h-6 w-20 rounded-lg" />
      </div>
      <div className="skeleton rounded-xl" style={{ height }} />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 5, className = '' }) {
  return (
    <div className={`rounded-xl bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 overflow-hidden ${className}`}>
      <div className="px-5 py-4 border-b border-dark-200 dark:border-dark-700">
        <div className="skeleton h-4 w-40 rounded" />
      </div>
      <div className="divide-y divide-dark-100 dark:divide-dark-700/50">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-4 px-5 py-4">
            {Array.from({ length: cols }).map((_, c) => (
              <div key={c} className={`skeleton h-3 rounded flex-1 ${c === 0 ? 'max-w-[80px]' : ''}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonMachineCard({ className = '' }) {
  return (
    <div className={`rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="skeleton h-8 w-8 rounded-lg" />
          <div>
            <div className="skeleton h-3 w-16 rounded mb-1" />
            <div className="skeleton h-2.5 w-24 rounded" />
          </div>
        </div>
        <div className="skeleton h-5 w-16 rounded-full" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="skeleton h-3 w-20 rounded" />
            <div className="skeleton h-3 w-12 rounded" />
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-dark-200 dark:border-dark-700">
        <div className="skeleton h-2 w-full rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="skeleton h-7 w-56 rounded mb-2" />
        <div className="skeleton h-4 w-80 rounded" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => <SkeletonChart key={i} height={250} />)}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <SkeletonMachineCard key={i} />)}
      </div>
    </div>
  );
}

export default function SkeletonLoader({ type = 'card', ...props }) {
  const components = { card: SkeletonCard, chart: SkeletonChart, table: SkeletonTable, machine: SkeletonMachineCard, dashboard: SkeletonDashboard };
  const Component = components[type] || SkeletonCard;
  return <Component {...props} />;
}
