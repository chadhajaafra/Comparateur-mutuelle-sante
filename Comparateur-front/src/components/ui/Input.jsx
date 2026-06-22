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
        px-4
        py-3

        rounded-xl

        border
        border-slate-200
        dark:border-slate-700

        bg-white
        dark:bg-slate-900

        text-slate-900
        dark:text-white

        placeholder:text-slate-400
        dark:placeholder:text-slate-500

        transition-all
        duration-300

        hover:border-violet-300

        focus:border-violet-500
        focus:ring-4
        focus:ring-violet-100
        dark:focus:ring-violet-500/20

        outline-none

        ${error ? "border-red-500" : ""}
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