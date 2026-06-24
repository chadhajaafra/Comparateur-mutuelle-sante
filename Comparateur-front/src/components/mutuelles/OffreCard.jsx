import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Plus } from "lucide-react";

import Card from "../ui/Card";
import Badge from "../ui/Badge";
import ProgressBar from "../ui/ProgressBar";

const niveauLabels = {
    1: "Eco",
    2: "Standard",
    3: "Premium",
};

const niveauVariants = {
    1: "success",
    2: "primary",
    3: "warning",
};

const typeLabels = {
    SanteGenerale: "Santé générale",
    Dentaire: "Dentaire",
    Optique: "Optique",
    Hospitalisation: "Hospitalisation",
    Maternite: "Maternité",
    MedecineDouces: "Médecines douces",
};

export default function OffreCard({
    offre,
    canEdit,
    onDelete,
    mutuelleId,
}) {
    const navigate = useNavigate();

    return (
        <Card className="overflow-hidden">

            <div className="p-5">

                <div className="flex justify-between items-start">

                    <div>

                        <Badge
                            variant={
                                niveauVariants[offre.niveau] || "primary"
                            }
                        >
                            {niveauLabels[offre.niveau]}
                        </Badge>

                        <h3
                            className="
                                mt-3
                                text-lg
                                font-semibold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            {offre.nom}
                        </h3>

                        {offre.description && (
                            <p
                                className="
                                    mt-2
                                    text-sm
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                {offre.description}
                            </p>
                        )}

                    </div>

                    <div className="text-right">

                        <p
                            className="
                                text-3xl
                                font-bold
                                text-violet-600
                            "
                        >
                            {offre.prixMensuel}€
                        </p>

                        <p
                            className="
                                text-xs
                                text-slate-500
                            "
                        >
                            / mois
                        </p>

                    </div>

                </div>

            </div>

            {offre.garanties?.length > 0 && (

                <div
                    className="
                        border-t
                        border-slate-200
                        dark:border-slate-800
                    "
                >
                    {offre.garanties.map((g) => (

                        <div
                            key={g.garantieId}
                            className="
                                px-5
                                py-3
                                flex
                                items-center
                                gap-4
                            "
                        >

                            <div className="w-40">

                                <p
                                    className="
                                        text-sm
                                        text-slate-700
                                        dark:text-slate-300
                                    "
                                >
                                    {typeLabels[g.garantieType] ??
                                        g.garantieNom}
                                </p>

                            </div>

                            <div className="flex-1">

                                <ProgressBar
                                    value={g.tauxRemboursement}
                                />

                            </div>

                            <div
                                className="
                                    text-sm
                                    font-semibold
                                    text-slate-900
                                    dark:text-white
                                    w-12
                                    text-right
                                "
                            >
                                {g.tauxRemboursement}%
                            </div>

                        </div>

                    ))}
                </div>

            )}

            {canEdit && (

                <div
                    className="
                        border-t
                        border-slate-200
                        dark:border-slate-800
                        p-4
                        flex
                        justify-between
                    "
                >

                    <div className="flex gap-2">

                        <button
                            onClick={() =>
                                navigate(
                                    `/mutuelles/${mutuelleId}/offres/${offre.id}/modifier`
                                )
                            }
                            className="
                                p-2
                                rounded-xl
                                hover:bg-slate-100
                                dark:hover:bg-slate-800
                            "
                        >
                            <Pencil size={16} />
                        </button>

                        <button
                            onClick={() => onDelete(offre.id)}
                            className="
                            flex
                            items-center
                            gap-2
                            px-4
                            py-2
                            rounded-xl
                            bg-violet-50
                            text-violet-600
                            hover:bg-violet-100
                            dark:bg-violet-500/10
                        "
                        >
                            <Plus size={14} />
                        
                            <Trash2 size={16} />
                        </button>

                    </div>

                    <button
                        onClick={() =>
                            navigate(
                                `/mutuelles/${mutuelleId}/offres/${offre.id}/garanties/nouvelle`
                            )
                        }
                        className="
                            flex
                            items-center
                            gap-2
                            px-4
                            py-2
                            rounded-xl
                            bg-violet-50
                            text-violet-600
                            hover:bg-violet-100
                            dark:bg-violet-500/10
                        "
                    >
                        <Plus size={14} />
                        Garantie
                    </button>

                </div>

            )}

        </Card>
    );
}