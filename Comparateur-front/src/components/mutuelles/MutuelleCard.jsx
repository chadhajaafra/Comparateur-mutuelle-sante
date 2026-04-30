import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ExternalLink } from 'lucide-react';

const niveauColors = {
    1: 'bg-green-50 text-green-700',
    2: 'bg-blue-50 text-blue-700',
    3: 'bg-purple-50 text-purple-700',
};
const niveauLabels = { 1: 'Eco', 2: 'Standard', 3: 'Premium' };

const typeLabels = {
    SanteGenerale: 'Santé', Dentaire: 'Dentaire',
    Optique: 'Optique', Hospitalisation: 'Hospit.',
    Maternite: 'Maternité', MedecineDouces: 'Médecines douces',
};

const tagColors = [
    'bg-blue-50 text-blue-700', 'bg-green-50 text-green-700',
    'bg-amber-50 text-amber-700', 'bg-purple-50 text-purple-700',
    'bg-red-50 text-red-700',
];

export default function MutuelleCard({ mutuelle, onDelete, canEdit }) {
    const navigate = useNavigate();
    const initial = mutuelle.nom?.[0]?.toUpperCase() ?? 'M';
    const prixMin = mutuelle.prixMin ?? 0;
    const prixMax = mutuelle.prixMax ?? 0;

    return (
        <div
            onClick={() => navigate(`/mutuelles/${mutuelle.id}`)}
            className="bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-4 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all group"
        >
            {/* Logo */}
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 font-bold text-lg flex-shrink-0">
                {initial}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-slate-900 truncate">{mutuelle.nom}</h3>
                    {mutuelle.isActive
                        ? <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 flex-shrink-0">Actif</span>
                        : <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 flex-shrink-0">Inactif</span>
                    }
                </div>

                {/* Types de garanties */}
                <div className="flex gap-1.5 flex-wrap mt-1.5">
                    {mutuelle.typesGaranties?.slice(0, 4).map((t, i) => (
                        <span key={t} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${tagColors[i % tagColors.length]}`}>
                            {typeLabels[t] ?? t}
                        </span>
                    ))}
                </div>

                {/* Niveaux */}
                <div className="flex gap-1 mt-2">
                    {[1, 2, 3].map(n => (
                        <span key={n} className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${niveauColors[n]} opacity-40`}
                            style={{ opacity: mutuelle.nbOffres >= n ? 1 : 0.3 }}>
                            {niveauLabels[n]}
                        </span>
                    ))}
                </div>
            </div>

            {/* Prix + actions */}
            <div className="text-right flex-shrink-0">
                <div className="text-base font-bold text-slate-900">
                    {prixMin === prixMax ? `${prixMin}€` : `${prixMin}€ – ${prixMax}€`}
                </div>
                <div className="text-[10px] text-slate-400">/mois</div>
                {canEdit && (
                    <button
                        onClick={e => { e.stopPropagation(); onDelete?.(mutuelle.id); }}
                        className="mt-2 text-[10px] text-red-400 hover:text-red-600 transition-colors"
                    >
                        Supprimer
                    </button>
                )}
            </div>
        </div>
    );
}