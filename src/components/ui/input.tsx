import React from 'react';

export interface InputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    variant?: 'default' | 'error' | 'success' | 'warning';
    size?: 'default' | 'sm' | 'lg';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className = '',
            variant = 'default',
            size = 'default',
            type = 'text',
            ...props
        },
        ref
    ) => {
        const baseStyles =
            'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

        const variants = {
            default: 'border-input focus-visible:ring-ring',
            error: 'border-red-500 focus-visible:ring-red-500',
            success: 'border-green-500 focus-visible:ring-green-500',
            warning: 'border-yellow-500 focus-visible:ring-yellow-500',
        };

        const sizes = {
            default: 'h-10 px-3 py-2',
            sm: 'h-9 px-3 py-1',
            lg: 'h-11 px-4 py-3',
        };

        const combinedClassName =
            `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`.trim();

        return (
            <input
                type={type}
                className={combinedClassName}
                ref={ref}
                {...props}
            />
        );
    }
);

Input.displayName = 'Input';

export { Input };
