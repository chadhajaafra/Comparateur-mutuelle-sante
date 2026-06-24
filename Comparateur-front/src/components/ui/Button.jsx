import { clsx } from "clsx";

const variants = {
    primary: `
    bg-gradient-to-r
    from-violet-600
    to-purple-600
    text-white
    border-transparent
    hover:shadow-[0_10px_30px_rgba(124,58,237,0.35)]
    hover:-translate-y-0.5
  `,

    outline: `
    bg-white
    dark:bg-slate-900
    border-slate-200
    dark:border-slate-700
    text-slate-700
    dark:text-slate-200
    hover:bg-slate-50
    dark:hover:bg-slate-800
  `,

    ghost: `
    bg-transparent
    border-transparent
    text-slate-600
    dark:text-slate-300
    hover:bg-slate-100
    dark:hover:bg-slate-800
  `,

    soft: `
    bg-violet-50
    dark:bg-violet-500/10
    border-transparent
    text-violet-600
    dark:text-violet-400
    hover:bg-violet-100
    dark:hover:bg-violet-500/20
  `,

    danger: `
    bg-gradient-to-r
    from-red-500
    to-red-600
    text-white
    border-transparent
    hover:shadow-lg
  `,
};

const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-base",
};

export function Button({
    children,
    variant = "primary",
    size = "md",
    className,
    loading = false,
    leftIcon,
    rightIcon,
    ...props
}) {
    return (
        <button
            className={clsx(
                `
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-xl
        font-semibold
        border
        transition-all
        duration-300
        disabled:opacity-50
        disabled:cursor-not-allowed
        active:scale-[0.98]
        `,
                variants[variant],
                sizes[size],
                className
            )}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading ? (
                <>
                    <span
                        className="
              w-4 h-4
              border-2
              border-current
              border-t-transparent
              rounded-full
              animate-spin
            "
                    />
                    Chargement...
                </>
            ) : (
                <>
                    {leftIcon}
                    {children}
                    {rightIcon}
                </>
            )}
        </button>
    );
}

export default Button;