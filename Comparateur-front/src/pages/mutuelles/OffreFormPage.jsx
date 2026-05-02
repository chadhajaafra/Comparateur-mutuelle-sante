import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import mutuelleApi from '../../api/mutuelleApi';

const schema = z.object({
    nom: z.string().min(1, 'Nom requis').max(200),
    niveau: z.coerce.number().min(1).max(3),
    prixMensuel: z.coerce.number().min(1, 'Prix requis').max(10000),
    description: z.string().optional(),
});

const NIVEAUX = [
    { value: 1, label: 'Eco' },
    { value: 2, label: 'Standard' },
    { value: 3, label: 'Premium' },
];

export default function OffreFormPage() {
    const { id } = useParams(); // mutuelleId
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { niveau: 1 },
    });

    const onSubmit = async (data) => {
        try {
            await mutuelleApi.addOffre(id, data);
            navigate(`/mutuelles/${id}`);
        } catch (e) {
            alert(e.response?.data?.title || "Erreur lors de la création de l'offre");
        }
    };

    return (
        <div className="max-w-xl">
            <button onClick={() => navigate(`/mutuelles/${id}`)}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors">
                <ArrowLeft size={16} /> Retour à la mutuelle
            </button>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-1">Nouvelle offre</h2>
                <p className="text-slate-500 text-sm mb-6">Ajoutez une offre Eco, Standard ou Premium.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input label="Nom de l'offre" placeholder="ex: Formule Eco"
                        error={errors.nom?.message} {...register('nom')} />

                    {/* Niveau */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-700">Niveau de couverture</label>
                        <div className="grid grid-cols-3 gap-2">
                            {NIVEAUX.map(n => (
                                <label key={n.value}
                                    className="relative flex flex-col items-center gap-1 p-3 rounded-xl border border-slate-200 cursor-pointer has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 transition-all">
                                    <input type="radio" value={n.value} {...register('niveau')}
                                        className="absolute opacity-0 w-0 h-0" />
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${n.value === 1 ? 'bg-green-50 text-green-700' :
                                            n.value === 2 ? 'bg-blue-50 text-blue-700' :
                                                'bg-purple-50 text-purple-700'
                                        }`}>{n.label}</span>
                                </label>
                            ))}
                        </div>
                        {errors.niveau && <p className="text-xs text-red-500">? {errors.niveau.message}</p>}
                    </div>

                    {/* Prix */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-700">Prix mensuel (€)</label>
                        <div className="relative">
                            <input type="number" step="0.01" placeholder="89.00"
                                className={`w-full h-11 rounded-lg border px-3.5 pr-10 text-sm bg-slate-50 outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 ${errors.prixMensuel ? 'border-red-400' : 'border-slate-200'}`}
                                {...register('prixMensuel')} />
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">€</span>
                        </div>
                        {errors.prixMensuel && <p className="text-xs text-red-500">? {errors.prixMensuel.message}</p>}
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            Description <span className="text-slate-400 font-normal">(optionnel)</span>
                        </label>
                        <textarea rows={3} placeholder="Décrivez cette offre..."
                            className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm bg-slate-50 text-slate-900 placeholder:text-slate-400 outline-none transition-all resize-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                            {...register('description')} />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => navigate(`/mutuelles/${id}`)} className="flex-1">
                            Annuler
                        </Button>
                        <Button type="submit" loading={isSubmitting} className="flex-1">
                            Créer l'offre
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}