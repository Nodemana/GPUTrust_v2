
export interface ButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
    variant?: 'primary' | 'secondary' | 'tertiary';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    loading?: boolean; 
}

export function Button({ children, onClick, className, variant = 'primary', size = 'md', disabled = false, type = 'button', loading = false}: ButtonProps) {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1';
    
    const variantClasses = {
        primary: 'bg-highlight text-white hover:bg-highlight-stroke focus:ring-highlight-stroke',
        secondary: 'bg-secondary-highlight text-text-dark hover:bg-secondary-highlight-stroke focus:ring-secondary-highlight-stroke',
        tertiary: 'bg-transparent text-text-light hover:bg-secondary focus:ring-stroke'
    };

    const sizeClasses = {
        sm: 'text-size-small px-spacing-large py-size-medium',
        md: 'text-size-medium px-spacing-xlarge py-size-large',
        lg: 'text-size-large px-spacing-xxlarge py-spacing-xlarge'
    };



    return <button 
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} 
        onClick={onClick}
        disabled={disabled || loading}
        type={type}
    >
        {loading} 
        
        {children}
    </button>;
}