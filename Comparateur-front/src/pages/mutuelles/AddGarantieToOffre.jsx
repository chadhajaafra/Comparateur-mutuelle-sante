import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, ShieldCheck, Activity, Eye,
    Building2, Baby, Leaf, AlertCircle, Loader2, CheckCircle2
} from 'lucide-react';
import { useGaranties } from '../../hooks/useGaranties';
import garantieApi from '../../api/garantieApi';

// ─── Même config que CatalogueGarantiesPage ───────────────────────────────────
const TYPES = {
    1: { label: 'Santé générale', key: 'SanteGenerale', icon: Activity, bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
    2: { label: 'Dentaire', key: 'Dentaire', icon: ShieldCheck, bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
    3: { label: 'Optique', key: 'Optique', icon: Eye, bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
    4: { label: 'Hospitalisation', key: 'Hospitalisation', icon: Building2, bg: '#faf5ff', color: '#7e22ce', border: '#e9d5ff' },
    5: { label: 'Maternité', key: 'Maternite', icon: Baby, bg: '#fdf2f8', color: '#be185d', border: '#fbcfe8' },
    6: { label: 'Médecines douces', key: 'MedecineDouces', icon: Leaf, bg: '#f0fdfa', color: '#0f766e', border: '#99f6e4' },
};

function resolveType(type) {
    if (TYPES[type]) return TYPES[type];
    return Object.values(TYPES).find(t => t.key === type) ?? null;
}

function getTauxStyle(taux) {
    if (taux >= 80) return { bar: '#15803d', text: '#14532d', bg: '#f0fdf4' };
    if (taux >= 50) return { bar: '#1d4ed8', text: '#1e3a8a', bg: '#eff6ff' };
    if (taux >= 25) return { bar: '#b45309', text: '#78350f', bg: '#fffbeb' };
    return { bar: '#dc2626', text: '#7f1d1d', bg: '#fef2f2' };
}

// ─── Schema ───────────────────────────────────────────────────────────────────
const schema = z.object({
    garantieId: z.string().min(1, 'Choisissez une garantie'),
    tauxRemboursement: z.coerce.number().min(0).max(100),
    plafond: z.coerce.number().min(0).optional().or(z.literal('')),
    details: z.string().optional(),
});

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AddGarantieToOffre() {
    const { mutuelleId, offreId } = useParams();
    const navigate = useNavigate();
    const { garanties, loading, error } = useGaranties();

    const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { tauxRemboursement: 80 },
    });

    const taux = Number(watch('tauxRemboursement')) || 0;
    const selectedId = watch('garantieId');
    const selected = garanties.find(g => g.id === selectedId);
    const selInfo = selected ? resolveType(selected.type) : null;
    const tauxStyle = getTauxStyle(taux);

    const onSubmit = async (data) => {
        try {
            await garantieApi.addToOffre(offreId, {
                garantieId: data.garantieId,
                tauxRemboursement: Number(data.tauxRemboursement),
                plafond: data.plafond ? Number(data.plafond) : null,
                details: data.details || null,
            });
            navigate(`/mutuelles/${mutuelleId}`);
        } catch (e) {
            alert(e.response?.data?.title || "Erreur lors de l'ajout");
        }
    };

    return (
        <div className="max-w-2xl">
            {/* Back */}
            <button
                onClick={() => navigate(`/mutuelles/${mutuelleId}`)}
                className="flex items-center gap-2 text-sm font-medium mb-6 transition-colors"
                style={{ color: '#64748b' }}
                onMouseEnter={e => e.currentTarget.style.color = '#0f172a'}
                onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
            >
                <ArrowLeft size={16} /> Retour à la mutuelle
            </button>

            <div className="rounded-xl p-6"
                style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>

                <h2 className="text-lg font-semibold mb-1" style={{ color: '#0f172a' }}>
                    Ajouter une garantie à l'offre
                </h2>
                <p className="text-sm mb-6" style={{ color: '#64748b' }}>
                    Choisissez un type de soin dans le catalogue et définissez le taux de remboursement.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

                    {/* ── Catalogue ── */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium" style={{ color: '#374151' }}>
                            Type de garantie{' '}
                            <span style={{ color: '#94a3b8', fontWeight: 400 }}>(catalogue)</span>
                        </label>

                        {/* Loading skeletons */}
                        {loading && (
                            <div className="grid grid-cols-1 gap-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-16 rounded-xl animate-pulse"
                                        style={{ background: '#f1f5f9' }} />
                                ))}
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="flex items-center gap-3 p-3 rounded-xl"
                                style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                                <AlertCircle size={16} style={{ color: '#ef4444', flexShrink: 0 }} />
                                <span className="text-sm" style={{ color: '#7f1d1d' }}>
                                    Impossible de charger le catalogue.{' '}
                                    <button onClick={() => window.location.reload()}
                                        className="underline" style={{ color: '#ef4444' }}>
                                        Réessayer
                                    </button>
                                </span>
                            </div>
                        )}

                        {/* Empty */}
                        {!loading && garanties.length === 0 && (
                            <div className="p-4 rounded-xl"
                                style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                                <p className="text-sm font-semibold mb-1" style={{ color: '#92400e' }}>
                                    Catalogue vide
                                </p>
                                <p className="text-xs" style={{ color: '#b45309' }}>
                                    Un administrateur doit initialiser les garanties via{' '}
                                    <code className="px-1.5 py-0.5 rounded"
                                        style={{ background: '#fef3c7', color: '#92400e', fontSize: 11 }}>
                                        POST /api/garanties/seed
                                    </code>
                                </p>
                            </div>
                        )}

                        {/* Liste — même style que CatalogueGarantiesPage */}
                        {!loading && garanties.length > 0 && (
                            <>
                                <input type="hidden" {...register('garantieId')} />
                                <div className="flex flex-col gap-2">
                                    {garanties.map((g, i) => {
                                        const info = resolveType(g.type);
                                        const Icon = info?.icon ?? ShieldCheck;
                                        const bg = info?.bg ?? '#f8fafc';
                                        const color = info?.color ?? '#64748b';
                                        const border = info?.border ?? '#e2e8f0';
                                        const isSelected = selectedId === g.id;

                                        return (
                                            <motion.button
                                                key={g.id}
                                                type="button"
                                                initial={{ opacity: 0, y: 6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.03 }}
                                                onClick={() => setValue('garantieId', g.id, { shouldValidate: true, shouldDirty: true })}
                                                className="flex items-center gap-3 p-3 rounded-xl transition-all text-left w-full"
                                                style={{
                                                    background: isSelected ? bg : '#ffffff',
                                                    border: `1.5px solid ${isSelected ? color : '#e2e8f0'}`,
                                                    boxShadow: isSelected ? `0 2px 12px ${color}20` : '0 1px 2px rgba(0,0,0,0.04)',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                {/* Icône — identique catalogue */}
                                                <div
                                                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                                                    style={{ background: bg, color, border: `1px solid ${border}` }}
                                                >
                                                    <Icon size={20} />
                                                </div>

                                                {/* Texte */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-semibold truncate"
                                                        style={{ color: '#0f172a' }}>
                                                        {g.nom}
                                                    </div>
                                                    {g.description && (
                                                        <div className="text-xs mt-0.5 truncate"
                                                            style={{ color: '#94a3b8' }}>
                                                            {g.description}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Badge type — identique catalogue */}
                                                <span
                                                    className="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0"
                                                    style={{ background: bg, color, border: `1px solid ${border}` }}
                                                >
                                                    {info?.label ?? g.type}
                                                </span>

                                                {/* Checkmark si sélectionné */}
                                                <AnimatePresence>
                                                    {isSelected && (
                                                        <motion.div
                                                            initial={{ scale: 0, opacity: 0 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                            exit={{ scale: 0, opacity: 0 }}
                                                        >
                                                            <CheckCircle2 size={18} style={{ color, flexShrink: 0 }} />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.button>
                                        );
                                    })}
                                </div>

                                {errors.garantieId && (
                                    <p className="flex items-center gap-1 text-xs mt-1"
                                        style={{ color: '#ef4444' }}>
                                        <AlertCircle size={12} /> {errors.garantieId.message}
                                    </p>
                                )}
                            </>
                        )}
                    </div>

                    {/* ── Taux ── */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium" style={{ color: '#374151' }}>
                                Taux de remboursement
                            </label>
                            <motion.span
                                key={taux}
                                initial={{ scale: 0.85, opacity: 0.5 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-2xl font-black tabular-nums"
                                style={{ color: tauxStyle.text }}
                            >
                                {taux}%
                            </motion.span>
                        </div>

                        <input
                            type="range" min={0} max={100} step={5}
                            className="w-full"
                            style={{ accentColor: tauxStyle.bar }}
                            {...register('tauxRemboursement')}
                        />

                        <div className="flex justify-between text-xs" style={{ color: '#cbd5e1' }}>
                            <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                        </div>

                        <div className="h-2 rounded-full overflow-hidden" style={{ background: '#f1f5f9' }}>
                            <motion.div
                                className="h-full rounded-full"
                                style={{ background: tauxStyle.bar }}
                                animate={{ width: `${taux}%` }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                        </div>

                        <div className="flex justify-end">
                            <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                                style={{ background: tauxStyle.bg, color: tauxStyle.text }}>
                                {taux >= 80 ? 'Excellent' : taux >= 50 ? 'Bon' : taux >= 25 ? 'Partiel' : 'Faible'}
                            </span>
                        </div>
                    </div>

                    {/* ── Plafond ── */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium" style={{ color: '#374151' }}>
                            Plafond annuel{' '}
                            <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optionnel)</span>
                        </label>
                        <div className="relative">
                            <input
                                type="number" placeholder="ex: 500"
                                className="w-full h-11 rounded-lg px-3.5 pr-14 text-sm outline-none transition-all"
                                style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }}
                                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                                {...register('plafond')}
                            />
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm"
                                style={{ color: '#94a3b8' }}>
                                €/an
                            </span>
                        </div>
                    </div>

                    {/* ── Détails ── */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium" style={{ color: '#374151' }}>
                            Détails{' '}
                            <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optionnel)</span>
                        </label>
                        <textarea
                            rows={2}
                            placeholder="Précisions sur cette garantie…"
                            className="rounded-lg px-3.5 py-2.5 text-sm outline-none resize-none transition-all"
                            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }}
                            onFocus={e => e.target.style.borderColor = '#3b82f6'}
                            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                            {...register('details')}
                        />
                    </div>

                    {/* ── Aperçu ── */}
                    <AnimatePresence>
                        {selected && selInfo && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                className="rounded-xl p-4"
                                style={{
                                    background: selInfo.bg,
                                    border: `1px solid ${selInfo.border}`,
                                }}
                            >
                                <p className="text-xs font-semibold uppercase tracking-widest mb-3"
                                    style={{ color: selInfo.color }}>
                                    Aperçu
                                </p>
                                <div className="flex items-center gap-3">
                                    {/* Icône */}
                                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{ background: selInfo.bg, color: selInfo.color, border: `1px solid ${selInfo.border}` }}>
                                        {(() => { const Icon = selInfo.icon; return <Icon size={20} />; })()}
                                    </div>
                                    {/* Nom + description */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate" style={{ color: '#0f172a' }}>
                                            {selected.nom}
                                        </p>
                                        {selected.description && (
                                            <p className="text-xs truncate" style={{ color: '#64748b' }}>
                                                {selected.description}
                                            </p>
                                        )}
                                    </div>
                                    {/* Barre taux */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <div className="w-24 h-2 rounded-full overflow-hidden"
                                            style={{ background: `${selInfo.color}25` }}>
                                            <motion.div
                                                className="h-full rounded-full"
                                                style={{ background: selInfo.color }}
                                                animate={{ width: `${taux}%` }}
                                                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                                            />
                                        </div>
                                        <span className="text-sm font-bold w-10 text-right"
                                            style={{ color: '#0f172a' }}>
                                            {taux}%
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── Actions ── */}
                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={() => navigate(`/mutuelles/${mutuelleId}`)}
                            className="flex-1 h-11 rounded-lg text-sm font-semibold transition-all"
                            style={{ background: '#f1f5f9', color: '#475569' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                            onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !selectedId || garanties.length === 0}
                            className="flex-1 h-11 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all"
                            style={{
                                background: isSubmitting || !selectedId ? '#bfdbfe' : '#1d4ed8',
                                color: '#ffffff',
                                cursor: isSubmitting || !selectedId ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {isSubmitting
                                ? <><Loader2 size={15} className="animate-spin" /> Ajout en cours…</>
                                : <><ShieldCheck size={15} /> Ajouter la garantie</>
                            }
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}