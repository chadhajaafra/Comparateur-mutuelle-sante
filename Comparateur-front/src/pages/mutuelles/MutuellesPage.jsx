import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Plus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useMutuelles } from '../../hooks/useMutuelles';
import MutuelleCard from '../../components/mutuelles/MutuelleCard';
import mutuelleApi from '../../api/mutuelleApi';

const NIVEAUX = [{ value: '', label: 'Tous' }, { value: 1, label: 'Eco' }, { value: 2, label: 'Standard' }, { value: 3, label: 'Premium' }];
const GARANTIES = [
    { value: '', label: 'Toutes' },
    { value: 'SanteGenerale', label: 'Santé' },
    { value: 'Dentaire', label: 'Dentaire' },
    { value: 'Optique', label: 'Optique' },
    { value: 'Hospitalisation', label: 'Hospitalisation' },
];

export default function MutuellesPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const canEdit = ['Assureur', 'Administrateur'].includes(user?.role);

    const [filters, setFilters] = useState({ page: 1, pageSize: 9 });
    const [search, setSearch] = useState('');

    const { data, loading, error, refetch } = useMutuelles(filters);

    const handleSearch = (e) => {
        if (e.key === 'Enter') setFilters(f => ({ ...f, search, page: 1 }));
    };

    const handleDelete = async (id) => {
        if (!confirm('Désactiver cette mutuelle ?')) return;
        try { await mutuelleApi.delete(id); refetch(); }
        catch { alert('Erreur lors de la suppression'); }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">Mutuelles</h2>
                    <p className="text-slate-500 text-sm mt-0.5">
                        {data?.total ?? 0} mutuelle{data?.total !== 1 ? 's' : ''} disponible{data?.total !== 1 ? 's' : ''}
                    </p>
                </div>
                {canEdit && (
                    <button onClick={() => navigate('/mutuelles/nouvelle')}
                        className="flex items-center gap-2 h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all">
                        <Plus size={16} /> Ajouter
                    </button>
                )}
            </div>

            {/* Filtres */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 h-9 flex-1 min-w-48">
                    <Search size={14} className="text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={handleSearch}
                        placeholder="Rechercher une mutuelle..." className="bg-transparent text-sm outline-none w-full placeholder:text-slate-400" />
                </div>

                <div className="flex items-center gap-2">
                    <SlidersHorizontal size={14} className="text-slate-400" />
                    <span className="text-xs text-slate-500">Niveau :</span>
                    {NIVEAUX.map(n => (
                        <button key={n.value} onClick={() => setFilters(f => ({ ...f, niveau: n.value || undefined, page: 1 }))}
                            className={`h-8 px-3 rounded-lg text-xs font-medium transition-all border ${filters.niveau === n.value
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                }`}>{n.label}
                        </button>
                    ))}
                </div>

                <select onChange={e => setFilters(f => ({ ...f, type: e.target.value || undefined, page: 1 }))}
                    className="h-9 px-3 rounded-lg text-sm border border-slate-200 bg-white text-slate-700 outline-none">
                    {GARANTIES.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                </select>

                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Prix max :</span>
                    <input type="number" placeholder="200" min={0}
                        onChange={e => setFilters(f => ({ ...f, prixMax: e.target.value || undefined, page: 1 }))}
                        className="h-9 w-24 px-3 rounded-lg text-sm border border-slate-200 outline-none" />
                    <span className="text-xs text-slate-400">€/mois</span>
                </div>
            </div>

            {/* Contenu */}
            {loading && (
                <div className="grid grid-cols-1 gap-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 h-24 animate-pulse" />
                    ))}
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-600 text-sm">⚠ {error}</div>
            )}

            {!loading && !error && data?.items?.length === 0 && (
                <div className="text-center py-16">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search size={24} className="text-slate-400" />
                    </div>
                    <p className="text-slate-500 text-sm">Aucune mutuelle trouvée.</p>
                </div>
            )}

            {!loading && data?.items && (
                <>
                    <div className="grid grid-cols-1 gap-3">
                        {data.items.map(m => (
                            <MutuelleCard key={m.id} mutuelle={m} canEdit={canEdit} onDelete={handleDelete} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {data.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6">
                            {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(p => (
                                <button key={p} onClick={() => setFilters(f => ({ ...f, page: p }))}
                                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all border ${filters.page === p
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                        }`}>{p}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}