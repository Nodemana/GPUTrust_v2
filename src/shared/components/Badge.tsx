/*interface BadgeProps {
    children: React.ReactNode;
    variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
  }
  
  export function Badge({ 
    children, 
    variant = 'default', 
    size = 'md',
    className = '' 
  }: BadgeProps) {
    const baseClasses = 'inline-flex items-center font-medium rounded-full';
    
    const variantClasses = {
      success: 'bg-highlight-dark text-text-dark dark:bg-highlight-dark dark:text-text-dark',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    };
  
    const sizeClasses = {
      sm: 'text-xs px-2 py-1',
      md: 'text-sm px-2.5 py-1.5',
      lg: 'text-base px-3 py-2'
    };
  
    return (
      <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
        {children}
      </span>
    );
  }
    */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };