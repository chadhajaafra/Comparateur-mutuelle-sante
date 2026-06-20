import { forwardRef } from "react";

const Input = forwardRef(
    ({ label, error, hint, className = "", ...props }, ref) => {
        return (
            <div className="space-y-2">
                {label && (
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {label}
                    </div>
                )}

                <input
                    ref={ref}
                    {...props}
                    className={`
                    w-full
                    px-4 py-3
                    rounded-xl
                    border border-slate-200
                    bg-slate-50
                    focus:border-violet-600
                    focus:ring-4
                    focus:ring-violet-100
                    outline-none
                    transition-all
                    ${className}
                `}
                />

                {hint}

                {error && (
                    <p className="text-red-500 text-sm">
                        {error}
                    </p>
                )}
            </div>
        );
    });

export default Input;