export default function ProgressBar({
    value
}) {

    return (
        <div
            className="
                h-2.5
                bg-slate-100
                dark:bg-slate-800
                rounded-full
                overflow-hidden
            "
        >
            <div
                className="
                    h-full
                    rounded-full
                    bg-gradient-to-r
                    from-violet-500
                    to-indigo-500
                    transition-all
                    duration-700
                "
                style={{
                    width: `${value}%`
                }}
            />
        </div>
    );
}