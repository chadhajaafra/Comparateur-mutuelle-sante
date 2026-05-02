import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useGaranties } from '../../hooks/useGaranties';
import garantieApi from '../../api/garantieApi';

const schema = z.object({
    garantieId: z.string().min(1, 'Choisissez une garantie'),
    tauxRemboursement: z.coerce.number().min(0).max(100, 'Max 100%'),
    plafond: z.coerce.number().min(0).optional().or(z.literal('')),
    details: z.string().optional(),
});

const TYPE_LABELS = {
    SanteGenerale: 'Santé générale', Dentaire: 'Dentaire',
    Optique: 'Optique', Hospitalisation: 'Hospitalisation',
    Maternite: 'Maternité', MedecineDouces: 'Médecines douces',
};

const TYPE_COLORS = {
    SanteGenerale: 'bg-blue-50 text-blue-700',
    Dentaire: 'bg-green-50 text-green-700',
    Optique: 'bg-amber-50 text-amber-700',
    Hospitalisation: 'bg-purple-50 text-purple-700',
    Maternite: 'bg-pink-50 text-pink-700',
    MedecineDouces: 'bg-teal-50 text-teal-700',
};

export default function AddGarantieToOffre() {
    const { mutuelleId, offreId } = useParams();
    const navigate = useNavigate();
    const { garanties, loading } = useGaranties();

    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { tauxRemboursement: 80 },
    });

    const taux = watch('tauxRemboursement') || 0;
    const selectedId = watch('garantieId');
    const selectedGarantie = garanties.find(g => g.id === selectedId);

    const onSubmit = async (data) => {
        try {
            await garantieApi.addToOffre(offreId, {
                ...data,
                plafond: data.plafond || null,
            });
            navigate(`/mutuelles/${mutuelleId}`);
        } catch (e) {
            alert(e.response?.data?.title || 'Erreur lors de l\'ajout');
        }
    };

    return (
        <div className="max-w-xl">
            <button onClick={() => navigate(`/mutuelles/${mutuelleId}`)}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors">
                <ArrowLeft size={16} /> Retour à la mutuelle
            </button>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-1">Ajouter une garantie</h2>
                <p className="text-slate-500 text-sm mb-6">Associez une garantie à cette offre avec son taux de remboursement.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    {/* Sélection garantie */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-700">Type de garantie</label>
                        {loading ? (
                            <div className="h-32 bg-slate-50 rounded-xl border border-slate-200 animate-pulse" />
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                {garanties.map(g => (
                                    <label key={g.id}
                                        className="relative flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 transition-all">
                                        <input type="radio" value={g.id} {...register('garantieId')}
                                            className="absolute opacity-0 w-0 h-0" />
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${TYPE_COLORS[g.type] ?? 'bg-slate-50 text-slate-600'}`}>
                                            <ShieldCheck size={15} />
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-slate-800">{TYPE_LABELS[g.type] ?? g.nom}</div>
                                            <div className="text-[10px] text-slate-400">{g.nom}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                        {errors.garantieId && <p className="text-xs text-red-500">? {errors.garantieId.message}</p>}
                    </div>

                    {/* Taux de remboursement */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-slate-700">Taux de remboursement</label>
                            <span className="text-2xl font-bold text-blue-600">{taux}%</span>
                        </div>
                        <input type="range" min={0} max={100} step={5}
                            className="w-full accent-blue-600"
                            {...register('tauxRemboursement')} />
                        <div className="flex justify-between text-[10px] text-slate-400">
                            <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                        </div>
                        {/* Barre visuelle */}
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full transition-all"
                                style={{ width: `${taux}%` }} />
                        </div>
                    </div>

                    {/* Plafond */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            Plafond annuel <span className="text-slate-400 font-normal">(optionnel)</span>
                        </label>
                        <div className="relative">
                            <input type="number" placeholder="ex: 500"
                                className="w-full h-11 rounded-lg border border-slate-200 px-3.5 pr-10 text-sm bg-slate-50 outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                                {...register('plafond')} />
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">€/an</span>
                        </div>
                    </div>

                    {/* Détails */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            Détails <span className="text-slate-400 font-normal">(optionnel)</span>
                        </label>
                        <textarea rows={2} placeholder="Précisions sur cette garantie..."
                            className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm bg-slate-50 placeholder:text-slate-400 outline-none transition-all resize-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                            {...register('details')} />
                    </div>

                    {/* Preview */}
                    {selectedGarantie && (
                        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                            <p className="text-xs font-medium text-slate-500 mb-2">Aperçu</p>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-700">{TYPE_LABELS[selectedGarantie.type]}</span>
                                <div className="flex items-center gap-3">
                                    <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${taux}%` }} />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-900">{taux}%</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline"
                            onClick={() => navigate(`/mutuelles/${mutuelleId}`)} className="flex-1">
                            Annuler
                        </Button>
                        <Button type="submit" loading={isSubmitting} className="flex-1">
                            Ajouter la garantie
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}