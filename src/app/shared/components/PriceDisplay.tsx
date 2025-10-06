interface PriceDisplayProps {
    price: string;
    currency: string;
    className?: string;
  }
  
  export function PriceDisplay({ price, currency, className = '' }: PriceDisplayProps) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {price}
        </span>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {currency}
        </span>
      </div>
    );
  }