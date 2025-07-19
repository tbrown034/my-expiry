export default function LoadingSpinner({ 
  size = 'md', 
  color = 'green', 
  className = '',
  text = null 
}) {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4', 
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  const colorClasses = {
    green: 'border-green-600',
    blue: 'border-blue-600',
    gray: 'border-gray-600',
    white: 'border-white',
    emerald: 'border-emerald-600'
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-sm', 
    lg: 'text-base',
    xl: 'text-lg'
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <div 
        className={`
          ${sizeClasses[size]} 
          ${colorClasses[color]}
          border-2 border-t-transparent rounded-full animate-spin
        `}
      />
      {text && (
        <span className={`${textSizes[size]} text-gray-600 animate-pulse`}>
          {text}
        </span>
      )}
    </div>
  );
}

// Specialized loading components
export function ButtonSpinner({ size = 'sm', color = 'white' }) {
  return <LoadingSpinner size={size} color={color} />;
}

export function PageSpinner({ text = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center py-12">
      <LoadingSpinner size="lg" color="green" text={text} />
    </div>
  );
}

export function InlineSpinner({ text = null }) {
  return <LoadingSpinner size="sm" color="green" text={text} className="inline-flex" />;
}

export function CardSpinner({ text = 'Processing...' }) {
  return (
    <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
      <LoadingSpinner size="lg" color="green" text={text} />
    </div>
  );
}