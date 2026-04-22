import { clsx } from 'clsx';

const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white border-transparent',
    outline: 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 border-transparent',
    danger: 'bg-red-50 hover:bg-red-100 text-red-600 border-transparent',
};

const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
};

export function Button({ children, variant = 'primary', size = 'md', className, loading, ...props }) {
    return (
        <button
            className={clsx(
                'inline-flex items-center justify-center gap-2 rounded-lg border font-medium transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]',
                variants[variant], sizes[size], className
            )}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading
                ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                : children}
        </button>
    );
}