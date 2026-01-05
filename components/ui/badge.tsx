import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
    variant?: 'default' | 'success' | 'warning' | 'error' | 'outline';
    children: React.ReactNode;
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
    variant = 'default',
    children,
    className
}) => {
    const variants = {
        default: 'bg-white/[0.05] text-white/70 border-white/10',
        success: 'bg-green-500/10 text-green-300 border-green-500/20',
        warning: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20',
        error: 'bg-red-500/10 text-red-300 border-red-500/20',
        outline: 'bg-transparent text-white/70 border-white/20',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm',
                variants[variant],
                className
            )}
        >
            {children}
        </span>
    );
};
