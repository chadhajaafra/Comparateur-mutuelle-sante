import { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    ArrowLeft, Download, X, CheckCircle2, XCircle,
    Trash2, Plus, Star, TrendingUp, Shield, Zap,
    ChevronDown, ChevronUp, SlidersHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useComparateur } from '../../hooks/useComparateur';
import comparateurApi from '../../api/comparateurApi';
import PageTransition from '../../components/ui/PageTransition';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';

// ─── Constants ────────────────────────────────────────────────────────────────
const GARANTIES_META = [
    { id: 1, label: 'Soins courants', icon: '🩺', key: 'SanteGenerale' },
    { id: 2, label: 'Dentaire', icon: '🦷', key: 'Dentaire' },
    { id: 3, label: 'Optique', icon: '👓', key: 'Optique' },
    { id: 4, label: 'Hospitalisation', icon: '🏥', key: 'Hospitalisation' },
    { id: 5, label: 'Maternité', icon: '🤱', key: 'Maternite' },
    { id: 6, label: 'Médecines douces', icon: '🌿', key: 'MedecineDouces' },
];

const NIVEAU_CFG = {
    1: { label: 'Éco', color: '#059669', bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/20' },
    2: { label: 'Standard', color: '#7C3AED', bg: 'bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-500/20' },
    3: { label: 'Premium', color: '#D97706', bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/20' },
};

// ─── ScoreRing ────────────────────────────────────────────────────────────────
function ScoreRing({ score, size = 64, stroke = 5 }) {
    const r = (size - stroke * 2) / 2;
    const circ = 2 * Math.PI * r;
    const pct = (score / 100) * circ;
    const color = score >= 75 ? '#10b981' : score >= 50 ? '#7C3AED' : '#f59e0b';
    return (
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke="currentColor" strokeWidth={stroke}
                className="text-slate-100 dark:text-slate-800" />
            <circle cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke={color} strokeWidth={stroke}
                strokeDasharray={`${pct} ${circ}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray .8s cubic-bezier(.4,0,.2,1)' }} />
            <text x={size / 2} y={size / 2}
                textAnchor="middle" dominantBaseline="central"
                style={{
                    transform: 'rotate(90deg)', transformOrigin: `${size / 2}px ${size / 2}px`,
                    fill: color, fontSize: size * 0.26, fontWeight: 700, fontFamily: 'inherit'
                }}>
                {score}
            </text>
        </svg>
    );
}

// ─── MiniBar ──────────────────────────────────────────────────────────────────
function MiniBar({ label, score, color }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 w-16 shrink-0">{label}</span>
            <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
                    style={{ background: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                />
            </div>
            <span className="text-[11px] font-semibold w-6 text-right tabular-nums"
                style={{ color }}>{score}</span>
        </div>
    );
}

// ─── OffreCard ────────────────────────────────────────────────────────────────
function OffreCard({ offre, isAdded, disabled, onToggle, rank }) {
    const [expanded, setExpanded] = useState(false);
    const cfg = NIVEAU_CFG[offre.niveau] ?? NIVEAU_CFG[2];
    const isBest = rank === 0;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: rank * 0.07 }}
        >
            <div className={`
                relative rounded-3xl border transition-all duration-300 overflow-hidden
                bg-white dark:bg-slate-900
                ${isAdded
                    ? 'border-violet-400 dark:border-violet-500 shadow-[0_0_0_3px_rgba(124,58,237,0.12)]'
                    : 'border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md'}
            `}>
                {/* Best badge */}
                {isBest && (
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-indigo-500" />
                )}
                {isBest && (
                    <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold
                            bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
                            <Star size={9} /> Meilleur score
                        </span>
                    </div>
                )}

                <div className="p-5 pt-8">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl
                                ${cfg.bg} border ${cfg.border}`}>
                                🏥
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900 dark:text-white text-sm leading-tight">
                                    {offre.nom}
                                </p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                    {offre.mutuelleNom}
                                </p>
                            </div>
                        </div>
                        <ScoreRing score={offre.scoreTotal} size={52} stroke={4} />
                    </div>

                    {/* Prix + niveau */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
                                {offre.prixMensuel}
                            </span>
                            <span className="text-sm text-slate-400">€/mois</span>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                            border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                            {cfg.label}
                        </span>
                    </div>

                    {/* Score bars */}
                    <div className="flex flex-col gap-2 mb-4">
                        <MiniBar label="Prix" score={offre.scorePrix} color="#7C3AED" />
                        <MiniBar label="Niveau" score={offre.scoreNiveau} color="#3b82f6" />
                        <MiniBar label="Garanties" score={offre.scoreGaranties} color="#10b981" />
                    </div>

                    {/* Garanties pills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {offre.garanties.slice(0, expanded ? undefined : 3).map(g => (
                            <span key={g.garantieId}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border
                                    ${g.matchCritere
                                        ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-500/30'
                                        : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}>
                                {g.matchCritere && <CheckCircle2 size={9} />}
                                {g.nom} · {g.tauxRemboursement}%
                            </span>
                        ))}
                        {offre.garanties.length > 3 && (
                            <button onClick={() => setExpanded(v => !v)}
                                className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px]
                                    text-slate-400 hover:text-violet-500 transition-colors">
                                {expanded
                                    ? <><ChevronUp size={10} /> Moins</>
                                    : <><ChevronDown size={10} /> +{offre.garanties.length - 3}</>}
                            </button>
                        )}
                    </div>

                    {/* CTA */}
                    <Button
                        variant={isAdded ? 'soft' : disabled && !isAdded ? 'ghost' : 'primary'}
                        size="sm"
                        className="w-full"
                        disabled={disabled && !isAdded}
                        leftIcon={isAdded ? <CheckCircle2 size={14} /> : <Plus size={14} />}
                        onClick={() => onToggle(offre.id)}
                    >
                        {isAdded ? 'Dans la comparaison' : disabled ? 'Max 3 offres' : 'Comparer'}
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}

// ─── TableauComparaison ───────────────────────────────────────────────────────
function TableauComparaison({ offres, onRetirer, tableRef }) {
    const checkGarantie = (offre, typeLabel) =>
        offre.garanties.find(g => g.type === typeLabel || g.nom === typeLabel);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="overflow-hidden p-0">
                <div ref={tableRef} className="overflow-x-auto">
                    <table className="w-full" style={{ tableLayout: 'fixed', minWidth: 520 }}>
                        <colgroup>
                            <col style={{ width: 140 }} />
                            {offres.map(o => <col key={o.id} />)}
                        </colgroup>
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider
                                    text-slate-400 dark:text-slate-500">
                                    Critère
                                </th>
                                {offres.map((o, i) => (
                                    <th key={o.id} className="px-4 py-4 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            {i === 0 && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                                                    text-[10px] font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white mb-1">
                                                    <Star size={9} /> Meilleur
                                                </span>
                                            )}
                                            <span className="text-sm font-semibold text-slate-900 dark:text-white">{o.nom}</span>
                                            <span className="text-xs text-slate-400">{o.mutuelleNom}</span>
                                            <button onClick={() => onRetirer(o.id)}
                                                className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-red-400
                                                    dark:text-slate-600 dark:hover:text-red-400 transition-colors mt-1">
                                                <X size={11} /> Retirer
                                            </button>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {/* Score global */}
                            <SectionRow label="Scores" colSpan={offres.length + 1} />
                            <DataRow label="Score global" offres={offres} render={o => {
                                const c = o.scoreTotal >= 75 ? 'text-emerald-500' : o.scoreTotal >= 50 ? 'text-violet-500' : 'text-amber-500';
                                return <span className={`text-2xl font-bold tabular-nums ${c}`}>{o.scoreTotal}</span>;
                            }} />
                            <DataRow label="Prix" offres={offres} render={o => {
                                const c = o.scorePrix >= 75 ? 'text-emerald-500' : o.scorePrix >= 50 ? 'text-violet-500' : 'text-amber-500';
                                return <span className={`text-sm font-semibold tabular-nums ${c}`}>{o.scorePrix}</span>;
                            }} />
                            <DataRow label="Niveau" offres={offres} render={o => {
                                const c = o.scoreNiveau >= 75 ? 'text-emerald-500' : o.scoreNiveau >= 50 ? 'text-violet-500' : 'text-amber-500';
                                return <span className={`text-sm font-semibold tabular-nums ${c}`}>{o.scoreNiveau}</span>;
                            }} />
                            <DataRow label="Garanties" offres={offres} render={o => {
                                const c = o.scoreGaranties >= 75 ? 'text-emerald-500' : o.scoreGaranties >= 50 ? 'text-violet-500' : 'text-amber-500';
                                return <span className={`text-sm font-semibold tabular-nums ${c}`}>{o.scoreGaranties}</span>;
                            }} />

                            {/* Tarif */}
                            <SectionRow label="Tarif" colSpan={offres.length + 1} />
                            <DataRow label="Prix mensuel" offres={offres} render={o => (
                                <span className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
                                    {o.prixMensuel} €
                                </span>
                            )} />
                            <DataRow label="Niveau" offres={offres} render={o => {
                                const cfg = NIVEAU_CFG[o.niveau] ?? NIVEAU_CFG[2];
                                return (
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                                        border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                                        {cfg.label}
                                    </span>
                                );
                            }} />

                            {/* Garanties */}
                            <SectionRow label="Garanties" colSpan={offres.length + 1} />
                            {GARANTIES_META.map(type => (
                                <DataRow key={type.id} label={`${type.icon} ${type.label}`} offres={offres} render={o => {
                                    const g = checkGarantie(o, type.key) ?? checkGarantie(o, type.label);
                                    if (!g) return <XCircle size={16} className="text-slate-200 dark:text-slate-700 mx-auto" />;
                                    return (
                                        <div className="flex flex-col items-center gap-0.5">
                                            <CheckCircle2 size={14} className="text-emerald-500" />
                                            <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                                                {g.tauxRemboursement}%
                                            </span>
                                            {g.plafond && (
                                                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                                    {g.plafond}€/an
                                                </span>
                                            )}
                                        </div>
                                    );
                                }} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </motion.div>
    );
}

function SectionRow({ label, colSpan }) {
    return (
        <tr className="bg-slate-50 dark:bg-slate-800/40 border-y border-slate-100 dark:border-slate-800">
            <td colSpan={colSpan} className="px-5 py-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    {label}
                </span>
            </td>
        </tr>
    );
}

function DataRow({ label, offres, render }) {
    return (
        <tr className="border-b border-slate-50 dark:border-slate-800/50
            hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
            <td className="px-5 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                {label}
            </td>
            {offres.map(o => (
                <td key={o.id} className="px-4 py-3 text-center border-l border-slate-50 dark:border-slate-800/50">
                    {render(o)}
                </td>
            ))}
        </tr>
    );
}

// ─── SkeletonCards ────────────────────────────────────────────────────────────
function SkeletonCards() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2].map(i => (
                <div key={i} className="rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                    <div className="flex justify-between">
                        <Skeleton className="w-11 h-11 rounded-2xl" />
                        <Skeleton className="w-12 h-12 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-2/3 rounded-lg" />
                    <Skeleton className="h-3 w-1/3 rounded-lg" />
                    <Skeleton className="h-8 w-1/2 rounded-lg" />
                    <div className="space-y-2">
                        <Skeleton className="h-2 rounded-full" />
                        <Skeleton className="h-2 rounded-full" />
                        <Skeleton className="h-2 rounded-full" />
                    </div>
                    <Skeleton className="h-9 rounded-xl" />
                </div>
            ))}
        </div>
    );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function ComparaisonResultatPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const tableRef = useRef(null);
    const { ajouterOffre, retirerOffre, isInSession, nbOffres, viderSession } = useComparateur();

    const criteres = location.state?.criteres ?? {};
    const profil = location.state?.profil ?? {};

    const [offres, setOffres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState('cartes'); // 'cartes' | 'tableau'

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await comparateurApi.rechercher({
                    budgetMax: criteres.budgetMax || undefined,
                    niveauSouhaite: criteres.niveauSouhaite || undefined,
                    typesGarantie: criteres.typesGarantie ?? [],
                    page: 1,
                    pageSize: 20,
                });
                setOffres(data.items ?? []);
            } catch {
                setError('Impossible de charger les offres. Vérifie ta connexion.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const exportPDF = async () => {
        const { default: html2pdf } = await import('html2pdf.js/dist/html2pdf.bundle.min.js');
        html2pdf()
            .set({
                margin: [10, 10],
                filename: 'comparaison-mutuelles.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
            })
            .from(tableRef.current)
            .save();
    };

    const offresSelectionnees = offres.filter(o => isInSession(o.id));
    const sorted = [...offres].sort((a, b) => b.scoreTotal - a.scoreTotal);

    // ── Résumé critères ──────────────────────────────────────────────────────
    const criteresTags = [
        criteres.budgetMax && `Budget ${criteres.budgetMax}€/mois`,
        criteres.niveauSouhaite && `Niveau ${['', 'Éco', 'Standard', 'Premium'][criteres.niveauSouhaite]}`,
        profil.couverture && `Couverture ${profil.couverture}`,
    ].filter(Boolean);

    return (
        <PageTransition>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
                <div className="max-w-6xl mx-auto px-4 py-8">

                    {/* ── Header ───────────────────────────────────────────── */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <button onClick={() => navigate('/comparateur')}
                                className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-violet-500
                                    dark:text-slate-500 dark:hover:text-violet-400 transition-colors mb-3">
                                <ArrowLeft size={15} /> Modifier mes critères
                            </button>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {loading ? 'Recherche en cours…' : `${sorted.length} offre${sorted.length > 1 ? 's' : ''} trouvée${sorted.length > 1 ? 's' : ''}`}
                            </h1>
                            {criteresTags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {criteresTags.map(t => (
                                        <span key={t}
                                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs
                                                bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400
                                                border border-violet-100 dark:border-violet-500/20">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Vue toggle */}
                        {!loading && sorted.length > 0 && (
                            <div className="flex items-center gap-2">
                                <div className="flex rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                    {[
                                        { key: 'cartes', label: 'Cartes', icon: <Shield size={14} /> },
                                        { key: 'tableau', label: 'Tableau', icon: <SlidersHorizontal size={14} /> },
                                    ].map(v => (
                                        <button key={v.key} onClick={() => setView(v.key)}
                                            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-all
                                                ${view === v.key
                                                    ? 'bg-violet-600 text-white'
                                                    : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                }`}>
                                            {v.icon} {v.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Loading ───────────────────────────────────────────── */}
                    {loading && <SkeletonCards />}

                    {/* ── Error ─────────────────────────────────────────────── */}
                    {!loading && error && (
                        <Card className="p-8 text-center">
                            <p className="text-slate-500 dark:text-slate-400 mb-4">{error}</p>
                            <Button variant="outline" onClick={() => navigate('/comparateur')}>
                                Retour
                            </Button>
                        </Card>
                    )}

                    {/* ── Empty ─────────────────────────────────────────────── */}
                    {!loading && !error && sorted.length === 0 && (
                        <Card className="py-4">
                            <EmptyState
                                title="Aucune offre trouvée"
                                description="Essaie d'élargir tes critères de recherche."
                            />
                            <div className="flex justify-center pb-6">
                                <Button variant="primary" onClick={() => navigate('/comparateur')}>
                                    Modifier les critères
                                </Button>
                            </div>
                        </Card>
                    )}

                    {/* ── Résultats ─────────────────────────────────────────── */}
                    {!loading && !error && sorted.length > 0 && (
                        <>
                            <AnimatePresence mode="wait">
                                {view === 'cartes' ? (
                                    <motion.div key="cartes"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                            {sorted.map((offre, i) => (
                                                <OffreCard
                                                    key={offre.id}
                                                    offre={offre}
                                                    rank={i}
                                                    isAdded={isInSession(offre.id)}
                                                    disabled={nbOffres >= 3}
                                                    onToggle={async (id) => {
                                                        if (isInSession(id)) await retirerOffre(id);
                                                        else await ajouterOffre(id);
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div key="tableau"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        {offresSelectionnees.length >= 2 ? (
                                            <TableauComparaison
                                                offres={offresSelectionnees}
                                                onRetirer={retirerOffre}
                                                tableRef={tableRef}
                                            />
                                        ) : (
                                            <Card className="py-4">
                                                <EmptyState
                                                    title="Sélectionne au moins 2 offres"
                                                    description="Reviens en vue Cartes et clique sur Comparer pour en ajouter."
                                                />
                                            </Card>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </>
                    )}

                    {/* ── Barre flottante ───────────────────────────────────── */}
                    <AnimatePresence>
                        {nbOffres > 0 && (
                            <motion.div
                                initial={{ y: 80, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 80, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
                            >
                                <div className="flex items-center gap-4 px-5 py-3 rounded-2xl
                                    bg-slate-900 dark:bg-slate-800
                                    border border-slate-700 dark:border-slate-700
                                    shadow-[0_8px_32px_rgba(0,0,0,0.35)]">

                                    {/* Avatars offres */}
                                    <div className="flex -space-x-2">
                                        {[...Array(nbOffres)].map((_, i) => (
                                            <div key={i}
                                                className="w-7 h-7 rounded-full border-2 border-slate-900 dark:border-slate-800
                                                    bg-gradient-to-br from-violet-500 to-indigo-600
                                                    flex items-center justify-center text-[11px] font-bold text-white">
                                                {i + 1}
                                            </div>
                                        ))}
                                    </div>

                                    <span className="text-sm font-medium text-slate-200">
                                        {nbOffres} offre{nbOffres > 1 ? 's' : ''} sélectionnée{nbOffres > 1 ? 's' : ''}
                                    </span>

                                    <div className="flex items-center gap-2">
                                        {nbOffres >= 2 && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                                                leftIcon={<SlidersHorizontal size={13} />}
                                                onClick={() => setView('tableau')}
                                            >
                                                Comparer
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            leftIcon={<Trash2 size={13} />}
                                            onClick={viderSession}
                                        >
                                            Vider
                                        </Button>
                                        {view === 'tableau' && offresSelectionnees.length >= 2 && (
                                            <Button
                                                size="sm"
                                                variant="primary"
                                                leftIcon={<Download size={13} />}
                                                onClick={exportPDF}
                                            >
                                                PDF
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* padding bottom pour la barre flottante */}
                    {nbOffres > 0 && <div className="h-24" />}
                </div>
            </div>
        </PageTransition>
    );
}