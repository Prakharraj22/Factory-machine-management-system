export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-16 w-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-primary-200 border-t-primary-600 dark:border-dark-700 dark:border-t-primary-400`}
      />
      {text && (
        <p className="text-sm text-dark-500 dark:text-dark-400 animate-pulse">{text}</p>
      )}
    </div>
  );
}
