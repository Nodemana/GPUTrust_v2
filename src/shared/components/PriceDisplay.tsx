interface PriceDisplayProps {
    price: string;
    currency: string;
    className?: string;
  }
  
  export function PriceDisplay({ price, currency, className = '' }: PriceDisplayProps) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <span className="text-2xl font-bold text-highlight dark:text-highlight">
          {price}
        </span>
        <span className="text-sm text-text-muted dark:text-text-muted">
          {currency}
        </span>
      </div>
    );
  }