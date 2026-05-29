import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useGaranties } from '../../hooks/useGaranties';
import garantieApi from '../../api/garantieApi';

const schema = z.object({
    garantieId: z.string().min(1, 'Choisissez une garantie'),
    tauxRemboursement: z.coerce.number().min(0).max(100, 'Max 100%'),
    plafond: z.coerce.number().min(0).optional().or(z.literal('')),
    details: z.string().optional(),
});

const TYPE_LABELS = {
    SanteGenerale: 'Santé générale',
    Dentaire: 'Dentaire',
    Optique: 'Optique',
    Hospitalisation: 'Hospitalisation',
    Maternite: 'Maternité',
    MedecineDouces: 'Médecines douces',
};

const TYPE_COLORS = {
    SanteGenerale: 'bg-blue-50 text-blue-700 border-blue-200',
    Dentaire: 'bg-green-50 text-green-700 border-green-200',
    Optique: 'bg-amber-50 text-amber-700 border-amber-200',
    Hospitalisation: 'bg-purple-50 text-purple-700 border-purple-200',
    Maternite: 'bg-pink-50 text-pink-700 border-pink-200',
    MedecineDouces: 'bg-teal-50 text-teal-700 border-teal-200',
};

export default function AddGarantieToOffre() {
    const { mutuelleId, offreId } = useParams();
    const navigate = useNavigate();

    // Charge le catalogue depuis l'API
    const { garanties, loading, error } = useGaranties();

    const {
        register, handleSubmit, watch,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { tauxRemboursement: 80 },
    });

    const taux = Number(watch('tauxRemboursement')) || 0;
    const selectedId = watch('garantieId');
    const selected = garanties.find(g => g.id === selectedId);

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
        <div className="max-w-xl">
            <button onClick={() => navigate(`/mutuelles/${mutuelleId}`)}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors">
                <ArrowLeft size={16} /> Retour à la mutuelle
            </button>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-1">
                    Ajouter une garantie à l'offre
                </h2>
                <p className="text-slate-500 text-sm mb-6">
                    Choisissez un type de soin dans le catalogue et définissez le taux de remboursement.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    {/* Catalogue des garanties */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700">
                            Type de garantie
                            <span className="text-slate-400 font-normal ml-1">(catalogue)</span>
                        </label>

                        {loading && (
                            <div className="grid grid-cols-2 gap-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-16 bg-slate-50 rounded-xl border border-slate-200 animate-pulse" />
                                ))}
                            </div>
                        )}

                        {error && (
                            <div className="p-3 bg-red-50 rounded-lg text-red-600 text-sm">
                                ⚠ Impossible de charger le catalogue.{' '}
                                <span className="underline cursor-pointer"
                                    onClick={() => window.location.reload()}>Réessayer</span>
                            </div>
                        )}

                        {!loading && garanties.length === 0 && (
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
                                Le catalogue est vide. Un administrateur doit d'abord initialiser les garanties via{' '}
                                <code className="bg-amber-100 px-1 rounded">POST /api/garanties/seed</code>
                            </div>
                        )}

                        {!loading && garanties.length > 0 && (
                            <div className="grid grid-cols-2 gap-2">
                                {garanties.map(g => (
                                    <label key={g.id}
                                        className={`relative flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedId === g.id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-slate-200 hover:border-slate-300 bg-white'
                                            }`}>
                                        <input type="radio" value={g.id}
                                            {...register('garantieId')}
                                            className="absolute opacity-0 w-0 h-0" />
                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border ${TYPE_COLORS[g.type] ?? 'bg-slate-50 text-slate-600 border-slate-200'
                                            }`}>
                                            <ShieldCheck size={16} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-xs font-semibold text-slate-800 truncate">
                                                {TYPE_LABELS[g.type] ?? g.nom}
                                            </div>
                                            <div className="text-[10px] text-slate-400 truncate">{g.nom}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}

                        {errors.garantieId && (
                            <p className="text-xs text-red-500">⚠ {errors.garantieId.message}</p>
                        )}
                    </div>

                    {/* Taux de remboursement */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-slate-700">
                                Taux de remboursement
                            </label>
                            <span className="text-2xl font-bold text-blue-600">{taux}%</span>
                        </div>
                        <input type="range" min={0} max={100} step={5}
                            className="w-full accent-blue-600"
                            {...register('tauxRemboursement')} />
                        <div className="flex justify-between text-[10px] text-slate-400">
                            <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full transition-all"
                                style={{ width: `${taux}%` }} />
                        </div>
                    </div>

                    {/* Plafond */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            Plafond annuel
                            <span className="text-slate-400 font-normal ml-1">(optionnel)</span>
                        </label>
                        <div className="relative">
                            <input type="number" placeholder="ex: 500"
                                className="w-full h-11 rounded-lg border border-slate-200 px-3.5 pr-14 text-sm bg-slate-50 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                                {...register('plafond')} />
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                                €/an
                            </span>
                        </div>
                    </div>

                    {/* Détails */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            Détails
                            <span className="text-slate-400 font-normal ml-1">(optionnel)</span>
                        </label>
                        <textarea rows={2} placeholder="Précisions sur cette garantie..."
                            className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm bg-slate-50 placeholder:text-slate-400 outline-none resize-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                            {...register('details')} />
                    </div>

                    {/* Aperçu */}
                    {selected && (
                        <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                            <p className="text-xs font-medium text-slate-400 mb-3 uppercase tracking-wide">
                                Aperçu
                            </p>
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-sm text-slate-700 font-medium">
                                    {TYPE_LABELS[selected.type] ?? selected.nom}
                                </span>
                                <div className="flex items-center gap-3 flex-1 max-w-40">
                                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full transition-all"
                                            style={{ width: `${taux}%` }} />
                                    </div>
                                    <span className="text-sm font-bold text-slate-900 w-10 text-right">
                                        {taux}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline"
                            onClick={() => navigate(`/mutuelles/${mutuelleId}`)}
                            className="flex-1">
                            Annuler
                        </Button>
                        <Button type="submit" loading={isSubmitting} className="flex-1"
                            disabled={!selectedId || garanties.length === 0}>
                            Ajouter la garantie
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}