import { clsx } from 'clsx';

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
bg - white
border - slate - 200
text - slate - 700
hover: bg - slate - 50
    `,

ghost: `
bg - transparent
border - transparent
text - slate - 600
hover: bg - slate - 100
    `,

danger: `
bg - gradient - to - r
from - red - 500
to - red - 600
text - white
border - transparent
hover: shadow - lg
    `,

};

const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-5 text-sm',
    lg: 'h-12 px-6 text-base',
};

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    className,
    loading,

    ...props
}) {
    return (
        <button
            className={clsx(
                `                 inline-flex
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
                <> <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Loading...
                </>
            ) : (
                children
            )} </button>
    );
}

export default Button;
