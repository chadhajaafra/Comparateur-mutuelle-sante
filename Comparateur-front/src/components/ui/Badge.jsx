export default function Badge({ children, variant = "default" }) {
    const variants = {
        success:
            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
        warning:
            "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
        danger:
            "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20",
        primary:
            "bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20",
        default:
            "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
    };
    return (
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${variants[variant]}`}
        >
            {children}
        </span>
    );
}