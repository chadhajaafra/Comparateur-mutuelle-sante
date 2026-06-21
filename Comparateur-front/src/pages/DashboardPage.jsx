import {
    Users,
    ShieldPlus,
    FileText,
    LayoutDashboard,
} from "lucide-react";

import PageTransition from "../components/ui/PageTransition";
import StatCard from "../components/ui/StatCard";

const stats = [
    {
        label: "Utilisateurs",
        value: "1 284",
        trend: "+12%",
        icon: Users,
    },
    {
        label: "Mutuelles",
        value: "48",
        trend: "+3%",
        icon: ShieldPlus,
    },
    {
        label: "Devis générés",
        value: "327",
        trend: "+18%",
        icon: FileText,
    },
    {
        label: "Souscriptions",
        value: "89",
        trend: "+7%",
        icon: LayoutDashboard,
    },
];

const mutuelles = [
    { nom: "Harmonie Santé", garantie: "Complète", prix: "89 €", statut: "Actif" },
    { nom: "MGEN Plus", garantie: "Standard", prix: "64 €", statut: "Actif" },
    { nom: "Malakoff Pro", garantie: "Premium", prix: "124 €", statut: "Nouveau" },
    { nom: "Swiss Life", garantie: "Eco", prix: "42 €", statut: "En cours" },
];

const statusStyle = {
    Actif:
        "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
    Nouveau:
        "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
    "En cours":
        "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
};

export default function DashboardPage() {
    return (
        <PageTransition>
            <div className="space-y-6">

                {/* HEADER */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                        Bonjour 👋
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Voici un aperçu de votre plateforme aujourd’hui.
                    </p>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {stats.map((s) => (
                        <StatCard
                            key={s.label}
                            title={s.label}
                            value={s.value}
                            trend={s.trend}
                            icon={s.icon}
                        />
                    ))}
                </div>

                {/* TABLE CARD */}
                <div
                    className="
          bg-white/70 dark:bg-slate-900/60
          backdrop-blur-xl
          border border-slate-200 dark:border-slate-800
          rounded-2xl
          overflow-hidden
        "
                >
                    {/* HEADER TABLE */}
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                        <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
                            Dernières mutuelles ajoutées
                        </h3>
                    </div>

                    {/* TABLE */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs text-slate-500 dark:text-slate-400">
                                    <th className="px-6 py-3">Mutuelle</th>
                                    <th className="px-6 py-3">Garantie</th>
                                    <th className="px-6 py-3">Prix</th>
                                    <th className="px-6 py-3">Statut</th>
                                </tr>
                            </thead>

                            <tbody>
                                {mutuelles.map((m, i) => (
                                    <tr
                                        key={i}
                                        className="
                      border-t border-slate-100 dark:border-slate-800
                      hover:bg-slate-50/50 dark:hover:bg-slate-800/40
                      transition
                    "
                                    >
                                        <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">
                                            {m.nom}
                                        </td>

                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                            {m.garantie}
                                        </td>

                                        <td className="px-6 py-4 font-semibold text-slate-800 dark:text-white">
                                            {m.prix}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={`
                          px-2 py-1 rounded-lg text-xs font-medium
                          ${statusStyle[m.statut]}
                        `}
                                            >
                                                {m.statut}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </PageTransition>
    );
}