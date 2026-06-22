export default function Card({
    children,
    className = "",
    onClick,
}) {
    return (
        <div
            onClick={onClick}
            className={`
                bg-white
                dark:bg-slate-900

                border
                border-slate-200
                dark:border-slate-800

                rounded-3xl

                shadow-sm
                hover:shadow-md

                transition-all

                ${onClick ? "cursor-pointer" : ""}

                ${className}
            `}
        >
            {children}
        </div>
    );
}