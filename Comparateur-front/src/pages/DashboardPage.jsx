import { LayoutDashboard, Users, ShieldPlus, FileText } from 'lucide-react';

const stats = [
    { label: 'Utilisateurs', value: '1 284', trend: '+12%', icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Mutuelles', value: '48', trend: '+3', icon: ShieldPlus, color: 'bg-green-50 text-green-600' },
    { label: 'Devis générés', value: '327', trend: '+18%', icon: FileText, color: 'bg-amber-50 text-amber-600' },
    { label: 'Souscriptions', value: '89', trend: '+7%', icon: LayoutDashboard, color: 'bg-purple-50 text-purple-600' },
];

const mutuelles = [
    { nom: 'Harmonie Santé', garantie: 'Complète', prix: '89 €', statut: 'Actif' },
    { nom: 'MGEN Plus', garantie: 'Standard', prix: '64 €', statut: 'Actif' },
    { nom: 'Malakoff Pro', garantie: 'Premium', prix: '124 €', statut: 'Nouveau' },
    { nom: 'Swiss Life', garantie: 'Eco', prix: '42 €', statut: 'En cours' },
];

const statusStyle = {
    'Actif': 'bg-green-50 text-green-700',
    'Nouveau': 'bg-blue-50 text-blue-700',
    'En cours': 'bg-amber-50 text-amber-700',
};

export default function DashboardPage() {
    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Bonjour 👋</h2>
                <p className="text-slate-500 text-sm mt-1">Voici un aperçu de votre plateforme aujourd'hui.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                {stats.map(({ label, value, trend, icon: Icon, color }) => (
                    <div key={label} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                            <Icon size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                            <p className="text-xl font-bold text-slate-900">{value}</p>
                            <p className="text-xs text-green-600 mt-0.5">{trend} ce mois</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                    <h3 className="text-sm font-semibold text-slate-900">Dernières mutuelles ajoutées</h3>
                </div>
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            {['Mutuelle', 'Garantie', 'Prix / mois', 'Statut'].map(h => (
                                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {mutuelles.map((m, i) => (
                            <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                <td className="px-5 py-3.5 text-sm font-medium text-slate-900">{m.nom}</td>
                                <td className="px-5 py-3.5 text-sm text-slate-600">{m.garantie}</td>
                                <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">{m.prix}</td>
                                <td className="px-5 py-3.5">
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[m.statut]}`}>
                                        {m.statut}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}