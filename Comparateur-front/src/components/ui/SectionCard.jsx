import Card from "./Card";

export default function SectionCard({
    title,
    subtitle,
    children
}) {

    return (
        <Card className="p-6">

            {(title || subtitle) && (
                <div className="mb-6">

                    {title && (
                        <h3 className="
                            text-lg
                            font-semibold
                            text-slate-900
                            dark:text-white
                        ">
                            {title}
                        </h3>
                    )}

                    {subtitle && (
                        <p className="
                            text-sm
                            text-slate-500
                            dark:text-slate-400
                            mt-1
                        ">
                            {subtitle}
                        </p>
                    )}

                </div>
            )}

            {children}

        </Card>
    );
}