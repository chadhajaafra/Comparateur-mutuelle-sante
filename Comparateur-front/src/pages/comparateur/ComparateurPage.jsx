// src/pages/comparateur/ComparateurPage.jsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {  AnimatePresence } from 'framer-motion';
import {
    Search, SlidersHorizontal, X, Plus, CheckCircle2,
    ArrowRight, Star, Loader2, ChevronDown
} from 'lucide-react';
import comparateurApi from '../../api/comparateurApi';
import { useComparateur } from '../../hooks/useComparateur';
import { motion } from 'framer-motion';

const TYPES_GARANTIE = [
    { id: 1, label: 'Santé générale', color: '#1d4ed8', bg: '#eff6ff' },
    { id: 2, label: 'Dentaire', color: '#15803d', bg: '#f0fdf4' },
    { id: 3, label: 'Optique', color: '#b45309', bg: '#fffbeb' },
    { id: 4, label: 'Hospitalisation', color: '#7e22ce', bg: '#faf5ff' },
    { id: 5, label: 'Maternité', color: '#be185d', bg: '#fdf2f8' },
    { id: 6, label: 'Médecines douces', color: '#0f766e', bg: '#f0fdfa' },
];

const NIVEAUX = [
    { value: 1, label: 'Éco', color: '#15803d', bg: '#f0fdf4' },
    { value: 2, label: 'Standard', color: '#b45309', bg: '#fffbeb' },
    { value: 3, label: 'Premium', color: '#7e22ce', bg: '#faf5ff' },
];

function ScoreBar({ score, color }) {
    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#f1f5f9' }}>
                <motion.div
                    className="h-full rounded-full"
                    style={{ background: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                />
            </div>
            <span className="text-xs font-bold w-8 text-right tabular-nums"
                style={{ color }}>{score}</span>
        </div>
    );
}

function OffreCard({ offre, onAjouter, isAdded, disabled }) {
    const niveauCfg = NIVEAUX.find(n => n.value === offre.niveau) ?? NIVEAUX[1];
    const scoreColor = offre.scoreTotal >= 75 ? '#15803d'
        : offre.scoreTotal >= 50 ? '#1d4ed8' : '#b45309';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl overflow-hidden"
            style={{
                background: '#ffffff',
                border: isAdded ? '2px solid #1d4ed8' : '1.5px solid #e2e8f0',
                boxShadow: isAdded
                    ? '0 4px 20px rgba(29,78,216,0.12)'
                    : '0 1px 3px rgba(0,0,0,0.06)',
            }}
        >
            {/* Header */}
            <div className="p-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    {offre.mutuelleLogo ? (
                        <img src={offre.mutuelleLogo} alt=""
                            className="w-10 h-10 rounded-xl object-contain"
                            style={{ border: '1px solid #f1f5f9' }} />
                    ) : (
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                            style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                            🏥
                        </div>
                    )}
                    <div>
                        <p className="text-sm font-bold leading-tight" style={{ color: '#0f172a' }}>
                            {offre.nom}
                        </p>
                        <p className="text-xs" style={{ color: '#64748b' }}>{offre.mutuelleNom}</p>
                    </div>
                </div>
                {/* Score badge */}
                <div className="flex flex-col items-center px-3 py-1.5 rounded-xl flex-shrink-0"
                    style={{ background: scoreColor + '12', border: `1px solid ${scoreColor}30` }}>
                    <span className="text-lg font-black tabular-nums" style={{ color: scoreColor }}>
                        {offre.scoreTotal}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wide"
                        style={{ color: scoreColor + 'aa' }}>score</span>
                </div>
            </div>

            {/* Prix + niveau */}
            <div className="px-4 pb-3 flex items-center justify-between">
                <div>
                    <span className="text-2xl font-black" style={{ color: '#0f172a' }}>
                        {offre.prixMensuel}€
                    </span>
                    <span className="text-xs ml-1" style={{ color: '#94a3b8' }}>/mois</span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: niveauCfg.bg, color: niveauCfg.color }}>
                    {niveauCfg.label}
                </span>
            </div>

            {/* Score détails */}
            <div className="px-4 pb-3 flex flex-col gap-1.5">
                <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wide"
                        style={{ color: '#94a3b8' }}>Prix</span>
                    <ScoreBar score={offre.scorePrix} color="#1d4ed8" />
                </div>
                <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wide"
                        style={{ color: '#94a3b8' }}>Niveau</span>
                    <ScoreBar score={offre.scoreNiveau} color="#7e22ce" />
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wide"
                        style={{ color: '#94a3b8' }}>Garanties</span>
                    <ScoreBar score={offre.scoreGaranties} color="#0f766e" />
                </div>
            </div>

            {/* Garanties pills */}
            <div className="px-4 pb-3 flex flex-wrap gap-1.5">
                {offre.garanties.slice(0, 4).map(g => (
                    <span key={g.garantieId}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{
                            background: g.matchCritere ? '#eff6ff' : '#f8fafc',
                            color: g.matchCritere ? '#1d4ed8' : '#64748b',
                            border: `1px solid ${g.matchCritere ? '#bfdbfe' : '#e2e8f0'}`,
                            fontWeight: g.matchCritere ? 700 : 400,
                        }}>
                        {g.nom} · {g.tauxRemboursement}%
                    </span>
                ))}
                {offre.garanties.length > 4 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: '#f1f5f9', color: '#94a3b8' }}>
                        +{offre.garanties.length - 4}
                    </span>
                )}
            </div>

            {/* Action */}
            <div className="px-4 pb-4">
                <button
                    onClick={() => onAjouter(offre.id)}
                    disabled={disabled && !isAdded}
                    className="w-full h-10 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                    style={{
                        background: isAdded ? '#eff6ff' : disabled ? '#f1f5f9' : '#1d4ed8',
                        color: isAdded ? '#1d4ed8' : disabled ? '#94a3b8' : '#ffffff',
                        border: isAdded ? '1.5px solid #bfdbfe' : 'none',
                        cursor: disabled && !isAdded ? 'not-allowed' : 'pointer',
                    }}
                >
                    {isAdded
                        ? <><CheckCircle2 size={15} /> Dans la comparaison</>
                        : <><Plus size={15} /> Comparer</>
                    }
                </button>
            </div>
        </motion.div>
    );
}

export default function ComparateurPage() {
    const navigate = useNavigate();
    const { ajouterOffre, retirerOffre, nbOffres, isInSession } = useComparateur();

    const [results, setResults] = useState(null);
    const [searching, setSearching] = useState(false);
    const [showFilters, setShowFilters] = useState(true);

    // Filtres
    const [search, setSearch] = useState('');
    const [budgetMax, setBudgetMax] = useState('');
    const [niveau, setNiveau] = useState('');
    const [typesSelected, setTypesSelected] = useState([]);

    const toggleType = (id) =>
        setTypesSelected(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);

    const handleSearch = useCallback(async () => {
        setSearching(true);
        try {
            const data = await comparateurApi.rechercher({
                search: search || undefined,
                budgetMax: budgetMax || undefined,
                niveau: niveau || undefined,
                typesGarantie: typesSelected.length ? typesSelected.join(',') : undefined,
                page: 1, pageSize: 20,
            });
            setResults(data);
            setShowFilters(false);
        } finally {
            setSearching(false);
        }
    }, [search, budgetMax, niveau, typesSelected]);

    const handleReset = () => {
        setSearch(''); setBudgetMax(''); setNiveau('');
        setTypesSelected([]); setResults(null); setShowFilters(true);
    };

    return (
        <div className="min-h-screen" style={{ background: '#f8fafc' }}>
            <div className="max-w-5xl mx-auto px-4 py-8">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold" style={{ color: '#0f172a' }}>
                        Comparateur de mutuelles
                    </h1>
                    <p className="text-sm mt-1" style={{ color: '#64748b' }}>
                        Trouvez l'offre qui correspond à vos besoins
                    </p>
                </div>

                {/* Panneau filtres */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="rounded-2xl p-5 mb-6"
                            style={{
                                background: '#ffffff', border: '1.5px solid #e2e8f0',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                            }}
                        >
                            {/* Recherche textuelle */}
                            <div className="relative mb-4">
                                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2"
                                    style={{ color: '#94a3b8' }} />
                                <input
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                    placeholder="Rechercher une mutuelle ou une offre…"
                                    className="w-full h-11 pl-10 pr-4 rounded-xl text-sm outline-none transition-all"
                                    style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', color: '#0f172a' }}
                                    onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                {/* Budget */}
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-wide mb-1.5 block"
                                        style={{ color: '#64748b' }}>Budget max (€/mois)</label>
                                    <input
                                        type="number" value={budgetMax}
                                        onChange={e => setBudgetMax(e.target.value)}
                                        placeholder="ex: 60"
                                        className="w-full h-10 px-3.5 rounded-xl text-sm outline-none transition-all"
                                        style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', color: '#0f172a' }}
                                        onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                                        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                                    />
                                </div>
                                {/* Niveau */}
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-wide mb-1.5 block"
                                        style={{ color: '#64748b' }}>Niveau souhaité</label>
                                    <div className="flex gap-2">
                                        {NIVEAUX.map(n => (
                                            <button key={n.value} type="button"
                                                onClick={() => setNiveau(v => v === n.value ? '' : n.value)}
                                                className="flex-1 h-10 rounded-xl text-xs font-semibold transition-all"
                                                style={{
                                                    background: niveau === n.value ? n.bg : '#f8fafc',
                                                    color: niveau === n.value ? n.color : '#64748b',
                                                    border: `1.5px solid ${niveau === n.value ? n.color + '60' : '#e2e8f0'}`,
                                                }}>
                                                {n.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Types de garantie */}
                            <div className="mb-4">
                                <label className="text-xs font-semibold uppercase tracking-wide mb-2 block"
                                    style={{ color: '#64748b' }}>
                                    Types de soins prioritaires
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {TYPES_GARANTIE.map(t => {
                                        const active = typesSelected.includes(t.id);
                                        return (
                                            <button key={t.id} type="button"
                                                onClick={() => toggleType(t.id)}
                                                className="text-xs font-medium px-3 py-1.5 rounded-full transition-all"
                                                style={{
                                                    background: active ? t.bg : '#f8fafc',
                                                    color: active ? t.color : '#64748b',
                                                    border: `1.5px solid ${active ? t.color + '60' : '#e2e8f0'}`,
                                                    fontWeight: active ? 700 : 400,
                                                }}>
                                                {t.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button onClick={handleReset}
                                    className="px-4 h-10 rounded-xl text-sm font-medium transition-all"
                                    style={{ background: '#f1f5f9', color: '#475569' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}>
                                    Réinitialiser
                                </button>
                                <button onClick={handleSearch} disabled={searching}
                                    className="flex-1 h-10 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                                    style={{
                                        background: '#1d4ed8', color: '#ffffff',
                                        boxShadow: '0 2px 8px rgba(29,78,216,0.25)'
                                    }}>
                                    {searching
                                        ? <><Loader2 size={15} className="animate-spin" /> Recherche…</>
                                        : <><Search size={15} /> Rechercher</>}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Barre résumé résultats */}
                {results && (
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold" style={{ color: '#0f172a' }}>
                                {results.totalCount} offre{results.totalCount !== 1 ? 's' : ''} trouvée{results.totalCount !== 1 ? 's' : ''}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full"
                                style={{ background: '#eff6ff', color: '#1d4ed8' }}>
                                triées par score
                            </span>
                        </div>
                        <button onClick={() => setShowFilters(v => !v)}
                            className="flex items-center gap-1.5 text-sm font-medium"
                            style={{ color: '#1d4ed8' }}>
                            <SlidersHorizontal size={14} />
                            {showFilters ? 'Masquer' : 'Modifier'} les filtres
                        </button>
                    </div>
                )}

                {/* Grille résultats */}
                {results && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {results.items.map(offre => (
                            <OffreCard
                                key={offre.id}
                                offre={offre}
                                isAdded={isInSession(offre.id)}
                                disabled={nbOffres >= 3}
                                onAjouter={async (id) => {
                                    if (isInSession(id)) await retirerOffre(id);
                                    else await ajouterOffre(id);
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Barre flottante comparaison */}
                <AnimatePresence>
                    {nbOffres > 0 && (
                        <motion.div
                            initial={{ y: 80, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 80, opacity: 0 }}
                            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
                        >
                            <div className="flex items-center gap-4 px-5 py-3 rounded-2xl"
                                style={{
                                    background: '#0f172a',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                                }}>
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-1">
                                        {[...Array(nbOffres)].map((_, i) => (
                                            <div key={i}
                                                className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                                                style={{ background: '#1d4ed8', borderColor: '#0f172a' }}>
                                                <span className="text-[10px] font-bold text-white">{i + 1}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-sm font-medium" style={{ color: '#e2e8f0' }}>
                                        {nbOffres} offre{nbOffres > 1 ? 's' : ''} sélectionnée{nbOffres > 1 ? 's' : ''}
                                    </span>
                                </div>
                                <button
                                    onClick={() => navigate('/comparateur/resultat')}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                                    style={{ background: '#1d4ed8', color: '#ffffff' }}>
                                    Comparer <ArrowRight size={14} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}