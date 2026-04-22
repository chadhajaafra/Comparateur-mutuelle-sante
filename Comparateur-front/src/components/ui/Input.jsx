import { forwardRef } from 'react';
import { clsx } from 'clsx';

export const Input = forwardRef(({ label, error, hint, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
        {label && (
            <label className="text-sm font-medium text-slate-700 flex items-center justify-between">
                {label}
                {hint && <span className="text-xs font-normal text-slate-400">{hint}</span>}
            </label>
        )}
        <input
            ref={ref}
            className={clsx(
                'h-11 rounded-lg border px-3.5 text-sm bg-slate-50 text-slate-900 placeholder:text-slate-400 outline-none transition-all',
                'focus:bg-white focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10',
                error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 hover:border-slate-300',
                className
            )}
            {...props}
        />
        {error && <p className="text-xs text-red-500 flex items-center gap-1"><span>⚠</span>{error}</p>}
    </div>
));