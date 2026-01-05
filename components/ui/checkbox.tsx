import React from 'react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, label, ...props }, ref) => {
        return (
            <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                    <input
                        ref={ref}
                        type="checkbox"
                        className={cn(
                            'w-5 h-5 rounded',
                            'bg-white/[0.02] border-2 border-white/20',
                            'checked:bg-white checked:border-white',
                            'focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black',
                            'transition-all duration-200',
                            'cursor-pointer',
                            'appearance-none',
                            className
                        )}
                        {...props}
                    />
                    <svg
                        className="absolute w-3 h-3 text-black pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <polyline points="2,6 5,9 10,3" />
                    </svg>
                </div>
                {label && (
                    <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                        {label}
                    </span>
                )}
            </label>
        );
    }
);

Checkbox.displayName = 'Checkbox';
