import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
        const baseStyles = 'font-semibold rounded-lg transition-all duration-200 inline-flex items-center justify-center';

        const variants = {
            primary: 'bg-white text-black hover:bg-white/90 hover:scale-105 border border-white/10',
            secondary: 'bg-white/[0.02] text-white border border-white/10 hover:border-white/30 hover:bg-white/[0.05] backdrop-blur-xl',
            ghost: 'text-white/60 hover:text-white hover:bg-white/[0.05]',
            outline: 'bg-transparent text-white border border-white/20 hover:border-white/40 hover:bg-white/[0.05]',
        };

        const sizes = {
            sm: 'px-4 py-2 text-sm',
            md: 'px-6 py-3 text-base',
            lg: 'px-8 py-4 text-lg',
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
