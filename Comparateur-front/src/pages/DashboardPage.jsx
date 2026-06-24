import {
    Users,
    ShieldPlus,
    FileText,
    LayoutDashboard,
} from "lucide-react";

import PageTransition from "../components/ui/PageTransition";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";

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
    {
        nom: "Harmonie Santé",
        garantie: "Complète",
        prix: "89 €",
        statut: "Actif",
    },
    {
        nom: "MGEN Plus",
        garantie: "Standard",
        prix: "64 €",
        statut: "Actif",
    },
    {
        nom: "Malakoff Pro",
        garantie: "Premium",
        prix: "124 €",
        statut: "Nouveau",
    },
    {
        nom: "Swiss Life",
        garantie: "Eco",
        prix: "42 €",
        statut: "En cours",
    },
];

export default function DashboardPage() {
    return (
        <PageTransition>

            <PageHeader
                title="Dashboard"
                description="Vue globale de votre plateforme mutuelle"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
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

            <Card className="mt-6 p-0 overflow-hidden">

                <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                        Dernières mutuelles ajoutées
                    </h3>
                </div>

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800">
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500">
                                    Mutuelle
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500">
                                    Garantie
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500">
                                    Prix
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500">
                                    Statut
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {mutuelles.map((m) => (
                                <tr
                                    key={m.nom}
                                    className="
                                        border-b border-slate-100
                                        dark:border-slate-800
                                        hover:bg-slate-50
                                        dark:hover:bg-slate-800/40
                                        transition
                                    "
                                >
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                        {m.nom}
                                    </td>

                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                        {m.garantie}
                                    </td>

                                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                                        {m.prix}
                                    </td>

                                    <td className="px-6 py-4">
                                        <Badge
                                            variant={
                                                m.statut === "Actif"
                                                    ? "success"
                                                    : m.statut === "Nouveau"
                                                        ? "primary"
                                                        : "warning"
                                            }
                                        >
                                            {m.statut}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>

                </div>

            </Card>

        </PageTransition>
    );
}