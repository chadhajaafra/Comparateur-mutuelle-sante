import { useState } from 'react';
import {
    Plus, RefreshCw, ShieldCheck, Activity, Eye,
    Building2, Baby, Leaf, Heart, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGaranties } from '../../hooks/useGaranties';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import garantieApi from '../../api/garantieApi';

// ── Map par valeur numérique (ce que l'API retourne) ───────────────────────
const TYPES = {
    1: { label: 'Santé générale', key: 'SanteGenerale', icon: Activity, bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
    2: { label: 'Dentaire', key: 'Dentaire', icon: ShieldCheck, bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
    3: { label: 'Optique', key: 'Optique', icon: Eye, bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
    4: { label: 'Hospitalisation', key: 'Hospitalisation', icon: Building2, bg: '#faf5ff', color: '#7e22ce', border: '#e9d5ff' },
    5: { label: 'Maternité', key: 'Maternite', icon: Baby, bg: '#fdf2f8', color: '#be185d', border: '#fbcfe8' },
    6: { label: 'Médecines douces', key: 'MedecineDouces', icon: Leaf, bg: '#f0fdfa', color: '#0f766e', border: '#99f6e4' },
};

// Résout le type qu'il soit number ou string
function resolveType(type) {
    if (TYPES[type]) return TYPES[type];                          // number : 1,2,3…
    const byKey = Object.values(TYPES).find(t => t.key === type);// string : "SanteGenerale"…
    return byKey ?? null;
}

const schema = z.object({
    nom: z.string().min(1, 'Nom requis').max(200),
    type: z.coerce.number().min(1).max(6),
    description: z.string().optional(),
});

export default function CatalogueGarantiesPage() {
    const { garanties, loading, error, refetch } = useGaranties();
    const [seeding, setSeeding] = useState(false);
    const [seedDone, setSeedDone] = useState(false);
    const [seedError, setSeedError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });

    const handleSeed = async () => {
        if (!confirm('Initialiser le catalogue avec les 6 garanties de base ?')) return;
        setSeeding(true);
        setSeedError('');
        setSeedDone(false);
        try {
            await garantieApi.seed();
            setSeedDone(true);
            refetch();
        } catch (e) {
            setSeedError(e.response?.data?.title || e.response?.data || 'Erreur lors de l\'initialisation.');
        } finally {
            setSeeding(false);
        }
    };

    const onSubmit = async (data) => {
        setSubmitting(true);
        setFormError('');
        try {
            await garantieApi.create({ nom: data.nom, type: data.type, description: data.description || null });
            reset();
            setShowForm(false);
            refetch();
        } catch (e) {
            setFormError(e.response?.data?.title || 'Erreur lors de la création.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">Catalogue des garanties</h2>
                    <p className="text-slate-500 text-sm mt-1">
                        {garanties.length} garantie{garanties.length !== 1 ? 's' : ''} dans le catalogue
                    </p>
                </div>
                <div className="flex gap-2">
                    {!loading && garanties.length === 0 && (
                        <Button onClick={handleSeed} loading={seeding}
                            className="bg-green-600 hover:bg-green-700 text-white border-transparent flex items-center gap-2">
                            <RefreshCw size={15} /> Initialiser le catalogue
                        </Button>
                    )}
                    <Button onClick={() => setShowForm(s => !s)} className="flex items-center gap-2">
                        <Plus size={15} /> Ajouter une garantie
                    </Button>
                </div>
            </div>

            {/* Alertes seed */}
            <AnimatePresence>
                {seedDone && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-3 mb-4 p-4 bg-green-50 border border-green-100 rounded-xl text-green-700 text-sm">
                        <CheckCircle size={18} className="flex-shrink-0" />
                        Catalogue initialisé — 6 garanties créées.
                    </motion.div>
                )}
                {seedError && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="mb-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                        ⚠ {seedError}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Formulaire ajout */}
            <AnimatePresence>
                {showForm && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-4">
                        <div className="bg-white rounded-xl border border-slate-200 p-5">
                            <h3 className="text-sm font-semibold text-slate-900 mb-4">Nouvelle garantie</h3>
                            {formError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
                                    ⚠ {formError}
                                </div>
                            )}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Nom" placeholder="ex: Dentaire avancé"
                                        error={errors.nom?.message} {...register('nom')} />
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium text-slate-700">Type</label>
                                        <select {...register('type')}
                                            className="h-11 rounded-lg border border-slate-200 px-3 text-sm bg-slate-50 text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition-all">
                                            {Object.entries(TYPES).map(([val, t]) => (
                                                <option key={val} value={val}>{t.label}</option>
                                            ))}
                                        </select>
                                        {errors.type && <p className="text-xs text-red-500">⚠ {errors.type.message}</p>}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-700">
                                        Description <span className="text-slate-400 font-normal">(optionnel)</span>
                                    </label>
                                    <textarea rows={2} placeholder="Description de cette garantie..."
                                        className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm bg-slate-50 placeholder:text-slate-400 outline-none resize-none focus:bg-white focus:border-blue-500 transition-all"
                                        {...register('description')} />
                                </div>
                                <div className="flex gap-3">
                                    <Button type="button" variant="outline"
                                        onClick={() => { setShowForm(false); reset(); setFormError(''); }}
                                        className="flex-1">Annuler</Button>
                                    <Button type="submit" loading={submitting} className="flex-1">
                                        Créer la garantie
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Catalogue vide */}
            {!loading && garanties.length === 0 && !showForm && (
                <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck size={28} className="text-slate-400" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-700 mb-2">Catalogue vide</h3>
                    <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
                        Initialisez le catalogue avec les 6 garanties de base.
                    </p>
                    <Button onClick={handleSeed} loading={seeding}
                        className="bg-green-600 hover:bg-green-700 text-white border-transparent mx-auto flex items-center gap-2">
                        <RefreshCw size={15} /> Initialiser le catalogue
                    </Button>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-20 bg-white rounded-xl border border-slate-200 animate-pulse" />
                    ))}
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-600 text-sm">⚠ {error}</div>
            )}

            {/* Grille */}
            {/* Grille */}
            {!loading && garanties.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {garanties.map(g => {
                        const info = resolveType(g.type);
                        const Icon = info?.icon ?? ShieldCheck;
                        const bg = info?.bg ?? '#f8fafc';
                        const color = info?.color ?? '#64748b';
                        const border = info?.border ?? '#e2e8f0';

                        return (
                            <motion.div key={g.id}
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3 hover:border-slate-300 transition-all">

                                {/* Icône colorée — style inline */}
                                <div style={{ background: bg, color, border: `1px solid ${border}` }}
                                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Icon size={20} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-slate-900 truncate">{g.nom}</div>
                                    <div style={{ color }} className="text-xs font-medium mt-0.5">
                                        {info?.label ?? g.type}
                                    </div>
                                    {g.description && (
                                        <div className="text-xs text-slate-400 mt-0.5 truncate">{g.description}</div>
                                    )}
                                </div>

                                {/* Badge type — style inline */}
                                <span style={{ background: bg, color, border: `1px solid ${border}` }}
                                    className="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0">
                                    {info?.label ?? g.type}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>
            )}
          
        </div>
    );
}