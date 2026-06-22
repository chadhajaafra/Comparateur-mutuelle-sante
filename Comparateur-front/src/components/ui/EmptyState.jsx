import { Search } from "lucide-react";

export default function EmptyState({
    title = "Aucune donnée",
    description = "Aucun résultat trouvé."
}) {

    return (
        <div
            className="
                py-20
                flex
                flex-col
                items-center
                justify-center
            "
        >
            <div
                className="
                    w-16
                    h-16
                    rounded-2xl
                    bg-slate-100
                    dark:bg-slate-800
                    flex
                    items-center
                    justify-center
                    mb-4
                "
            >
                <Search className="text-slate-400" />
            </div>

            <h3 className="
                font-semibold
                text-slate-900
                dark:text-white
            ">
                {title}
            </h3>

            <p className="
                text-sm
                text-slate-500
                mt-1
            ">
                {description}
            </p>
        </div>
    );
}