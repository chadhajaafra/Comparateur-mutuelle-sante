export default function PageHeader({
    title,
    description,
    action
}) {

    return (
        <div
            className="
                flex
                items-center
                justify-between
                mb-8
            "
        >
            <div>

                <h1
                    className="
                        text-3xl
                        font-bold
                        text-slate-900
                        dark:text-white
                    "
                >
                    {title}
                </h1>

                <p
                    className="
                        text-slate-500
                        dark:text-slate-400
                        mt-2
                    "
                >
                    {description}
                </p>

            </div>

            {action}

        </div>
    );
}