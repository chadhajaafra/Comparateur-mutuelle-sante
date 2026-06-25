import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, Plus } from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import { useMutuelles } from "../../hooks/useMutuelles";
import MutuelleCard from "../../components/mutuelles/MutuelleCard";
import mutuelleApi from "../../api/mutuelleApi";
import Skeleton from "../../components/ui/Skeleton";

const NIVEAUX = [
    { value: "", label: "Tous" },
    { value: 1, label: "Eco" },
    { value: 2, label: "Standard" },
    { value: 3, label: "Premium" },
];

const GARANTIES = [
    { value: "", label: "Toutes" },
    { value: "SanteGenerale", label: "Santé" },
    { value: "Dentaire", label: "Dentaire" },
    { value: "Optique", label: "Optique" },
    { value: "Hospitalisation", label: "Hospitalisation" },
];

export default function MutuellesPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const canEdit = ["Assureur", "Administrateur"].includes(user?.role);

    const [filters, setFilters] = useState({ page: 1, pageSize: 9 });
    const [search, setSearch] = useState("");

    const { data, loading, error, refetch } = useMutuelles(filters);

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            setFilters((f) => ({ ...f, search, page: 1 }));
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Désactiver cette mutuelle ?")) return;

        try {
            await mutuelleApi.delete(id);
            refetch();
        } catch {
            alert("Erreur lors de la suppression");
        }
    };

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                        Mutuelles
                    </h2>

                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {data?.total ?? 0} mutuelle(s) disponible(s)
                    </p>
                </div>

                {canEdit && (
                    <button
                        onClick={() => navigate("/mutuelles/nouvelle")}
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
                        <Plus size={16} />
                        Ajouter
                    </button>
                )}
            </div>

            {/* FILTERS (GLASS UI) */}
            <div
                className="
        bg-white/70 dark:bg-slate-900/60
        backdrop-blur-xl
        border border-slate-200 dark:border-slate-800
        rounded-2xl
        p-4
        flex flex-wrap gap-3 items-center
      "
            >
                {/* SEARCH */}
                <div
                    className="
          flex items-center gap-2
          bg-slate-100 dark:bg-slate-800
          px-3 h-10
          rounded-xl
          flex-1 min-w-60
        "
                >
                    <Search size={14} className="text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleSearch}
                        placeholder="Rechercher une mutuelle..."
                        className="bg-transparent w-full outline-none text-sm"
                    />
                </div>

                {/* NIVEAUX */}
                <div className="flex items-center gap-2">
                    <SlidersHorizontal size={14} className="text-slate-400" />
                    {NIVEAUX.map((n) => (
                        <button
                            key={n.value}
                            onClick={() =>
                                setFilters((f) => ({
                                    ...f,
                                    niveau: n.value || undefined,
                                    page: 1,
                                }))
                            }
                            className={`
                px-3 h-9 rounded-xl text-xs font-medium border transition
                ${filters.niveau === n.value
                                    ? "bg-violet-600 text-white border-violet-600"
                                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                                }
              `}
                        >
                            {n.label}
                        </button>
                    ))}
                </div>

                {/* GARANTIE */}
                <select
                    onChange={(e) =>
                        setFilters((f) => ({
                            ...f,
                            type: e.target.value || undefined,
                            page: 1,
                        }))
                    }
                    className="
            h-9 px-3 rounded-xl text-sm
            border border-slate-200 dark:border-slate-700
            bg-white dark:bg-slate-900
            outline-none
          "
                >
                    {GARANTIES.map((g) => (
                        <option key={g.value} value={g.value}>
                            {g.label}
                        </option>
                    ))}
                </select>

                {/* PRICE */}
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Prix max</span>
                    <input
                        type="number"
                        placeholder="200"
                        min={0}
                        onChange={(e) =>
                            setFilters((f) => ({
                                ...f,
                                prixMax: e.target.value || undefined,
                                page: 1,
                            }))
                        }
                        className="
              w-24 h-9 px-3
              rounded-xl text-sm
              border border-slate-200 dark:border-slate-700
              bg-white dark:bg-slate-900
              outline-none
            "
                    />
                    <span className="text-xs text-slate-400">€/mois</span>
                </div>
            </div>

            {/* ERROR */}
            {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 text-sm">
                    ⚠ {error}
                </div>
            )}

            {/* LOADING SKELETON */}
            {loading && (
                <div className="grid gap-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 rounded-2xl" />
                    ))}
                </div>
            )}

            {/* EMPTY STATE */}
            {!loading && !error && data?.items?.length === 0 && (
                <div className="text-center py-20">
                    <Search size={28} className="mx-auto text-slate-400 mb-3" />
                    <p className="text-slate-500">Aucune mutuelle trouvée</p>
                </div>
            )}

            {/* LIST */}
            {!loading && !error && (
                <div className="grid gap-3">
                    {data?.items?.map((m) => (
                        <MutuelleCard
                            key={m.id}
                            mutuelle={m}
                            canEdit={canEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {/* PAGINATION */}
            {!loading && data?.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(
                        (p) => (
                            <button
                                key={p}
                                onClick={() =>
                                    setFilters((f) => ({ ...f, page: p }))
                                }
                                className={`
                  w-10 h-10 rounded-xl text-sm border transition
                  ${filters.page === p
                                        ? "bg-violet-600 text-white border-violet-600"
                                        : "bg-white dark:bg-slate-900 text-slate-600 border-slate-200 dark:border-slate-700"
                                    }
                `}
                            >
                                {p}
                            </button>
                        )
                    )}
                </div>
            )}
        </div>
    );
}