import { useNavigate } from 'react-router-dom';
import { Plus } from "lucide-react";

const niveauStyle = {
    1: { bar: 'border-l-4 border-green-400 bg-green-50/40', badge: 'bg-green-50 text-green-700', fill: 'bg-green-400' },
    2: { bar: 'border-l-4 border-blue-400 bg-blue-50/40', badge: 'bg-blue-50 text-blue-700', fill: 'bg-blue-400' },
    3: { bar: 'border-l-4 border-purple-400 bg-purple-50/40', badge: 'bg-purple-50 text-purple-700', fill: 'bg-purple-400' },
};
const niveauLabels = { 1: 'Eco', 2: 'Standard', 3: 'Premium' };
const typeLabels = {
    SanteGenerale: 'Santé générale', Dentaire: 'Dentaire',
    Optique: 'Optique', Hospitalisation: 'Hospitalisation',
    Maternite: 'Maternité', MedecineDouces: 'Médecines douces',
};

export default function OffreCard({ offre, canEdit, mutuelleId }) {
    const style = niveauStyle[offre.niveau] ?? niveauStyle[1];
    const navigate = useNavigate();

    return (
        <div className={`rounded-xl border border-slate-200 overflow-hidden ${style.bar}`}>
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${style.badge}`}>
                        {niveauLabels[offre.niveau]}
                    </span>
                    <span className="text-sm font-medium text-slate-800">{offre.nom}</span>
                </div>
                <div className="text-right">
                    <span className="text-lg font-bold text-slate-900">{offre.prixMensuel}€</span>
                    <span className="text-xs text-slate-400">/mois</span>
                </div>
            </div>

            {offre.description && (
                <p className="px-4 pb-2 text-xs text-slate-500">{offre.description}</p>
            )}

            {/* Garanties */}
            {offre.garanties?.length > 0 && (
                <div className="border-t border-slate-100">
                    {offre.garanties.map(g => (
                        <div key={g.garantieId} className="flex items-center gap-3 px-4 py-2 border-b border-slate-50 last:border-0">
                            <span className="text-xs text-slate-600 w-36 flex-shrink-0 truncate">
                                {typeLabels[g.garantieType] ?? g.garantieNom}
                            </span>
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full">
                                <div className={`h-full rounded-full ${style.fill}`} style={{ width: `${g.tauxRemboursement}%` }} />
                            </div>
                            <span className="text-xs font-semibold text-slate-700 w-10 text-right">
                                {g.tauxRemboursement}%
                            </span>
                            {g.plafond && (
                                <span className="text-[10px] text-slate-400">max {g.plafond}€</span>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {canEdit && (
                <button
                    onClick={() => navigate(`/mutuelles/${mutuelleId}/offres/${offre.id}/garanties/nouvelle`)}
                    className="flex items-center gap-1.5 w-full px-4 py-2.5 text-xs text-blue-600 hover:bg-blue-50 transition-colors border-t border-slate-100">
                    <Plus size={13} /> Ajouter une garantie
                </button>
            )}
        </div>
    );
}