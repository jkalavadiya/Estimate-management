import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?:
        | 'default'
        | 'secondary'
        | 'destructive'
        | 'outline'
        | 'success'
        | 'warning';
    size?: 'default' | 'sm' | 'lg';
    children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    (
        {
            className = '',
            variant = 'default',
            size = 'default',
            children,
            ...props
        },
        ref
    ) => {
        const baseStyles =
            'inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';

        const variants = {
            default:
                'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
            secondary:
                'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
            destructive:
                'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
            outline:
                'text-foreground border-border bg-background hover:bg-accent hover:text-accent-foreground',
            success:
                'border-transparent bg-green-500 text-white shadow hover:bg-green-600',
            warning:
                'border-transparent bg-yellow-500 text-white shadow hover:bg-yellow-600',
        };

        const sizes = {
            default: 'px-2.5 py-0.5 text-xs',
            sm: 'px-2 py-0.5 text-xs',
            lg: 'px-3 py-1 text-sm',
        };

        const combinedClassName =
            `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`.trim();

        return (
            <div className={combinedClassName} ref={ref} {...props}>
                {children}
            </div>
        );
    }
);

Badge.displayName = 'Badge';

export { Badge };
