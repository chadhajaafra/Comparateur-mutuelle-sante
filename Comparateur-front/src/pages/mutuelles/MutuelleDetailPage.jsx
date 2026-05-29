import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Plus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useMutuelle } from '../../hooks/useMutuelles';
import OffreCard from '../../components/mutuelles/OffreCard';

export default function MutuelleDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const canEdit = ['Assureur', 'Administrateur'].includes(user?.role);

    const { mutuelle, loading, error } = useMutuelle(id);

    if (loading) return (
        <div className="space-y-4">
            <div className="h-32 bg-white rounded-xl border border-slate-200 animate-pulse" />
            <div className="h-48 bg-white rounded-xl border border-slate-200 animate-pulse" />
        </div>
    );

    if (error) return (
        <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-red-600">⚠ {error}</div>
    );

    if (!mutuelle) return null;

    const initial = mutuelle.nom?.[0]?.toUpperCase() ?? 'M';

    return (
        <div>
            {/* Retour */}
            <button onClick={() => navigate('/mutuelles')}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-4 transition-colors">
                <ArrowLeft size={16} /> Retour aux mutuelles
            </button>

            {/* Hero */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4">
                <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 font-bold text-2xl flex-shrink-0">
                        {initial}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-xl font-semibold text-slate-900">{mutuelle.nom}</h2>
                            {mutuelle.isActive
                                ? <span className="text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-700">Actif</span>
                                : <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">Inactif</span>
                            }
                        </div>
                        <p className="text-slate-500 text-sm mb-3 leading-relaxed">{mutuelle.description}</p>
                        {mutuelle.siteWeb && (
                            <a href={mutuelle.siteWeb} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline">
                                <ExternalLink size={13} /> {mutuelle.siteWeb}
                            </a>
                        )}
                    </div>
                    {canEdit && (
                        <button onClick={() => navigate(`/mutuelles/${id}/modifier`)}
                            className="h-9 px-4 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-all flex-shrink-0">
                            Modifier
                        </button>
                    )}
                </div>
            </div>

            {/* Offres */}
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-slate-900">
                    Offres disponibles <span className="text-slate-400 font-normal text-sm">({mutuelle.offres?.length ?? 0})</span>
                </h3>
                {canEdit && (
                    <button onClick={() => navigate(`/mutuelles/${id}/offres/nouvelle`)}
                        className="flex items-center gap-1.5 h-8 px-3 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all">
                        <Plus size={13} /> Ajouter une offre
                    </button>
                )}
            </div>

            <div className="space-y-3">
                {mutuelle.offres?.length === 0 && (
                    <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-sm">
                        Aucune offre pour cette mutuelle.
                    </div>
                )}
                {mutuelle.offres?.map(offre => (
                    <OffreCard key={offre.id} offre={offre} mutuelleId={id} canEdit={canEdit} />
                ))}
            </div>
        </div>
    );
}