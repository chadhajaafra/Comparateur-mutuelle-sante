import { useState } from 'react';
import {
    Plus, RefreshCw, ShieldCheck, Activity, Eye,
    Building2, Baby, Leaf, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useGaranties } from '../../hooks/useGaranties';
import { Button } from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import garantieApi from '../../api/garantieApi';

const TYPES = {
    1: { label: 'Santé générale', key: 'SanteGenerale', icon: Activity },
    2: { label: 'Dentaire', key: 'Dentaire', icon: ShieldCheck },
    3: { label: 'Optique', key: 'Optique', icon: Eye },
    4: { label: 'Hospitalisation', key: 'Hospitalisation', icon: Building2 },
    5: { label: 'Maternité', key: 'Maternite', icon: Baby },
    6: { label: 'Médecines douces', key: 'MedecineDouces', icon: Leaf },
};

function resolveType(type) {
    if (TYPES[type]) return TYPES[type];
    return Object.values(TYPES).find(t => t.key === type);
}

const schema = z.object({
    nom: z.string().min(1, 'Nom requis').max(200),
    type: z.coerce.number().min(1).max(6),
    description: z.string().optional(),
});

export default function CatalogueGarantiesPage() {
    const { garanties, loading, error, refetch } = useGaranties();

    const [showForm, setShowForm] = useState(false);
    const [seeding, setSeeding] = useState(false);
    const [seedDone, setSeedDone] = useState(false);
    const [seedError, setSeedError] = useState('');
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const handleSeed = async () => {
        if (!confirm('Initialiser le catalogue ?')) return;

        setSeeding(true);
        setSeedError('');
        setSeedDone(false);

        try {
            await garantieApi.seed();
            setSeedDone(true);
            refetch();
        } catch (e) {
            setSeedError(e.response?.data?.title || 'Erreur seed');
        } finally {
            setSeeding(false);
        }
    };

    const onSubmit = async (data) => {
        setSubmitting(true);
        setFormError('');

        try {
            await garantieApi.create({
                nom: data.nom,
                type: data.type,
                description: data.description || null,
            });

            reset();
            setShowForm(false);
            refetch();
        } catch (e) {
            setFormError(e.response?.data?.title || 'Erreur création');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                        Catalogue des garanties
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {garanties.length} garantie(s)
                    </p>
                </div>

                <div className="flex gap-2">
                    {!loading && garanties.length === 0 && (
                        <Button onClick={handleSeed} loading={seeding} variant="outline">
                            <RefreshCw size={15} />
                            Seed
                        </Button>
                    )}

                    <Button onClick={() => setShowForm(v => !v)}>
                        <Plus size={15} />
                        Ajouter
                    </Button>
                </div>
            </div>

            {/* ALERTS */}
            <AnimatePresence>
                {seedDone && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-4 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-600 text-sm flex gap-2 items-center"
                    >
                        <CheckCircle size={16} />
                        Catalogue initialisé avec succès
                    </motion.div>
                )}

                {seedError && (
                    <motion.div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm">
                        {seedError}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FORM */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60">

                            <h3 className="text-sm font-semibold mb-4 text-slate-900 dark:text-white">
                                Nouvelle garantie
                            </h3>

                            {formError && (
                                <p className="text-sm text-red-500 mb-3">{formError}</p>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                                <div className="grid grid-cols-2 gap-3">

                                    <Input
                                        label="Nom"
                                        error={errors.nom?.message}
                                        {...register('nom')}
                                    />

                                    <div>
                                        <label className="text-xs text-slate-500">Type</label>
                                        <select
                                            {...register('type')}
                                            className="w-full h-11 mt-1 px-3 rounded-xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:border-violet-500 outline-none"
                                        >
                                            {Object.entries(TYPES).map(([k, t]) => (
                                                <option key={k} value={k}>
                                                    {t.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                </div>

                                <textarea
                                    rows={2}
                                    placeholder="Description..."
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none"
                                    {...register('description')}
                                />

                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => {
                                            setShowForm(false);
                                            reset();
                                        }}
                                    >
                                        Annuler
                                    </Button>

                                    <Button type="submit" loading={submitting} className="flex-1">
                                        Créer
                                    </Button>
                                </div>

                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* GRID */}
            {loading ? (
                <div className="grid grid-cols-3 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-20 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                    ))}
                </div>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

                    {garanties.map(g => {
                        const info = resolveType(g.type);
                        const Icon = info?.icon ?? ShieldCheck;

                        return (
                            <motion.div
                                key={g.id}
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 flex gap-3 items-center hover:shadow-sm transition"
                            >
                                <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center">
                                    <Icon size={18} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                        {g.nom}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        {info?.label}
                                    </div>
                                </div>

                            </motion.div>
                        );
                    })}

                </div>
            )}
        </div>
    );
}