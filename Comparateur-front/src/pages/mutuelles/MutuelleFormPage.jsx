import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import mutuelleApi from '../../api/mutuelleApi';

const schema = z.object({
    nom: z.string().min(1, 'Nom requis').max(200),
    description: z.string().min(1, 'Description requise').max(2000),
    logo: z.string().optional(),
    siteWeb: z.string().url('URL invalide').or(z.literal('')),
});

export default function MutuelleFormPage() {
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data) => {
        try {
            const res = await mutuelleApi.create({ ...data, logo: data.logo || '' });
            navigate(`/mutuelles/${res.data.id}`);
        } catch (e) {
            alert(e.response?.data?.title || 'Erreur lors de la création');
        }
    };

    return (
        <div className="max-w-xl">
            <button onClick={() => navigate('/mutuelles')}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors">
                <ArrowLeft size={16} /> Retour
            </button>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">Nouvelle mutuelle</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input label="Nom de la mutuelle" placeholder="ex: Harmonie Santé"
                        error={errors.nom?.message} {...register('nom')} />

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-700">Description</label>
                        <textarea rows={4} placeholder="Décrivez la mutuelle..."
                            className={`rounded-lg border px-3.5 py-2.5 text-sm bg-slate-50 text-slate-900 placeholder:text-slate-400 outline-none transition-all resize-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 ${errors.description ? 'border-red-400' : 'border-slate-200'}`}
                            {...register('description')} />
                        {errors.description && <p className="text-xs text-red-500">? {errors.description.message}</p>}
                    </div>

                    <Input label="Site web" placeholder="https://www.exemple.fr"
                        error={errors.siteWeb?.message} {...register('siteWeb')} />

                    <Input label="Logo (URL)" placeholder="https://..." {...register('logo')} />

                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => navigate('/mutuelles')} className="flex-1">
                            Annuler
                        </Button>
                        <Button type="submit" loading={isSubmitting} className="flex-1">
                            Créer la mutuelle
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}