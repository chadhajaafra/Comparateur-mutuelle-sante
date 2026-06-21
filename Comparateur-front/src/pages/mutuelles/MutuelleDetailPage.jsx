import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Plus } from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import { useMutuelle } from "../../hooks/useMutuelles";
import OffreCard from "../../components/mutuelles/OffreCard";
import Skeleton from "../../components/ui/Skeleton";

export default function MutuelleDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const canEdit = ["Assureur", "Administrateur"].includes(user?.role);

    const { mutuelle, loading, error } = useMutuelle(id);

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-28 rounded-2xl" />
                <Skeleton className="h-48 rounded-2xl" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 text-sm">
                ⚠ {error}
            </div>
        );
    }

    if (!mutuelle) return null;

    const initial = mutuelle.nom?.[0]?.toUpperCase() ?? "M";

    return (
        <div className="space-y-6">

            {/* BACK */}
            <button
                onClick={() => navigate("/mutuelles")}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-white transition"
            >
                <ArrowLeft size={16} />
                Retour aux mutuelles
            </button>

            {/* HERO */}
            <div
                className="
        bg-white/70 dark:bg-slate-900/60
        backdrop-blur-xl
        border border-slate-200 dark:border-slate-800
        rounded-2xl
        p-6
      "
            >
                <div className="flex items-start gap-4">

                    {/* avatar */}
                    <div
                        className="
            w-14 h-14 rounded-2xl
            bg-violet-100 dark:bg-violet-500/10
            text-violet-600 dark:text-violet-300
            flex items-center justify-center
            font-bold text-xl
          "
                    >
                        {initial}
                    </div>

                    {/* info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                                {mutuelle.nom}
                            </h2>

                            <span
                                className={`
                  text-xs px-2 py-1 rounded-lg font-medium
                  ${mutuelle.isActive
                                        ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                                        : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                                    }
                `}
                            >
                                {mutuelle.isActive ? "Actif" : "Inactif"}
                            </span>
                        </div>

                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                            {mutuelle.description}
                        </p>

                        {mutuelle.siteWeb && (
                            <a
                                href={mutuelle.siteWeb}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 text-sm text-violet-600 mt-3 hover:underline"
                            >
                                <ExternalLink size={14} />
                                Site officiel
                            </a>
                        )}
                    </div>

                    {/* actions */}
                    {canEdit && (
                        <button
                            onClick={() => navigate(`/mutuelles/${id}/modifier`)}
                            className="
                px-4 h-9
                rounded-xl
                bg-slate-100 dark:bg-slate-800
                text-sm
                hover:scale-[1.02] transition
              "
                        >
                            Modifier
                        </button>
                    )}
                </div>
            </div>

            {/* OFFERS HEADER */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Offres{" "}
                    <span className="text-sm text-slate-400">
                        ({mutuelle.offres?.length ?? 0})
                    </span>
                </h3>

                {canEdit && (
                    <button
                        onClick={() =>
                            navigate(`/mutuelles/${id}/offres/nouvelle`)
                        }
                        className="
              flex items-center gap-2
              px-3 h-9
              text-sm
              bg-violet-600 hover:bg-violet-700
              text-white
              rounded-xl
              transition
            "
                    >
                        <Plus size={14} />
                        Ajouter
                    </button>
                )}
            </div>

            {/* OFFERS LIST */}
            <div className="space-y-3">
                {mutuelle.offres?.length === 0 && (
                    <div className="p-10 text-center text-slate-500 dark:text-slate-400">
                        Aucune offre disponible
                    </div>
                )}

                {mutuelle.offres?.map((offre) => (
                    <OffreCard
                        key={offre.id}
                        offre={offre}
                        mutuelleId={id}
                        canEdit={canEdit}
                    />
                ))}
            </div>
        </div>
    );
}