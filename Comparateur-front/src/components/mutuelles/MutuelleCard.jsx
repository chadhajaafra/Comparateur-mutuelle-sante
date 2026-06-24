import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

import Card from "../ui/Card";
import Badge from "../ui/Badge";

const niveauLabels = {
    1: "Eco",
    2: "Standard",
    3: "Premium",
};

const typeLabels = {
    SanteGenerale: "Santé",
    Dentaire: "Dentaire",
    Optique: "Optique",
    Hospitalisation: "Hospitalisation",
    Maternite: "Maternité",
    MedecineDouces: "Médecines douces",
};

export default function MutuelleCard({ mutuelle, onDelete, canEdit }) {
    const navigate = useNavigate();

    const initial = mutuelle.nom?.charAt(0)?.toUpperCase() ?? "M";
    const prixMin = mutuelle.prixMin ?? 0;
    const prixMax = mutuelle.prixMax ?? 0;

    const handleNavigate = () => {
        navigate(`/mutuelles/${mutuelle.id}`);
    };

    return (
        <Card
            onClick={handleNavigate}
            className="
                p-6
                cursor-pointer
                hover:-translate-y-1
                hover:border-violet-300
                transition-all
                group
            "
        >
            <div className="flex items-start gap-4">

                {/* Avatar */}
                <div className="
                    w-16 h-16 rounded-2xl
                    bg-gradient-to-br from-violet-500 to-indigo-600
                    flex items-center justify-center
                    text-white font-bold text-xl shadow-lg
                ">
                    {initial}
                </div>

                {/* Infos */}
                <div className="flex-1">

                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {mutuelle.nom}
                        </h3>

                        <Badge variant={mutuelle.isActive ? "success" : "default"}>
                            {mutuelle.isActive ? "Actif" : "Inactif"}
                        </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                        {mutuelle.typesGaranties?.slice(0, 4).map((type) => (
                            <Badge key={type} variant="primary">
                                {typeLabels[type] ?? type}
                            </Badge>
                        ))}
                    </div>

                    <div className="flex gap-2 mt-4">
                        {[1, 2, 3].map((n) => (
                            <Badge
                                key={n}
                                variant={
                                    mutuelle.nbOffres >= n ? "success" : "default"
                                }
                            >
                                {niveauLabels[n]}
                            </Badge>
                        ))}
                    </div>

                </div>

                {/* Prix + actions */}
                <div className="text-right">

                    <div className="text-3xl font-bold text-slate-900 dark:text-white">
                        {prixMin === prixMax
                            ? `${prixMin}€`
                            : `${prixMin}€ - ${prixMax}€`}
                    </div>

                    <div className="text-xs text-slate-500 dark:text-slate-400">
                        par mois
                    </div>

                    {canEdit && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // IMPORTANT
                                onDelete?.(mutuelle.id);
                            }}
                            className="
                                mt-4 inline-flex items-center gap-1
                                text-sm text-red-500 hover:text-red-600
                            "
                        >
                            <Trash2 size={14} />
                            Supprimer
                        </button>
                    )}

                </div>

            </div>
        </Card>
    );
}