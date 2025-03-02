interface LoadingIndicatorProps {
  title?: string;
  message?: string;
}

export function LoadingIndicator({
  title = 'Analyzing Packages',
  message = 'Almost there, magic happening behind the scenes..',
}: LoadingIndicatorProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div>
        <div className="flex justify-center items-center">
          <svg
            className="animate-spin h-16 w-16 text-primary/20"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="opacity-25"
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
            />
            <path
              className="opacity-75"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              d="M50 5 A 45 45 0 0 1 95 50"
            />
          </svg>
        </div>
        <div className="mt-6 space-y-2 text-center">
          <p className="text-lg font-medium text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
}
