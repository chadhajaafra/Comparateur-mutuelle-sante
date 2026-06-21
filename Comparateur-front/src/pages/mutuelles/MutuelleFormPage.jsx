import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Input from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import mutuelleApi from "../../api/mutuelleApi";

const schema = z.object({
    nom: z.string().min(1, "Nom requis").max(200),
    description: z.string().min(1, "Description requise").max(2000),
    logo: z.string().optional(),
    siteWeb: z.string().url("URL invalide").or(z.literal("")),
});

export default function MutuelleFormPage() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data) => {
        try {
            const res = await mutuelleApi.create({
                ...data,
                logo: data.logo || "",
            });

            navigate(`/mutuelles/${res.data.id}`);
        } catch (e) {
            alert(e.response?.data?.title || "Erreur lors de la création");
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">

            {/* BACK */}
            <button
                onClick={() => navigate("/mutuelles")}
                className="
          flex items-center gap-2
          text-sm text-slate-500
          hover:text-slate-900 dark:hover:text-white
          transition
        "
            >
                <ArrowLeft size={16} />
                Retour
            </button>

            {/* CARD */}
            <div
                className="
        bg-white/70 dark:bg-slate-900/60
        backdrop-blur-xl
        border border-slate-200 dark:border-slate-800
        rounded-2xl
        p-6
        shadow-sm
      "
            >

                {/* TITLE */}
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                    Nouvelle mutuelle
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    Créez une nouvelle mutuelle dans votre système
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    {/* NOM */}
                    <Input
                        label="Nom de la mutuelle"
                        placeholder="ex: Harmonie Santé"
                        error={errors.nom?.message}
                        {...register("nom")}
                    />

                    {/* DESCRIPTION */}
                    <div>
                        <label className="text-sm text-slate-600 dark:text-slate-300">
                            Description
                        </label>

                        <textarea
                            rows={4}
                            placeholder="Décrivez la mutuelle..."
                            className="
                w-full mt-1
                px-3 py-2
                rounded-xl
                bg-slate-100 dark:bg-slate-800
                border border-slate-200 dark:border-slate-700
                text-sm
                outline-none
                resize-none
                focus:border-violet-500
                focus:ring-2 focus:ring-violet-500/10
                transition
              "
                            {...register("description")}
                        />

                        {errors.description && (
                            <p className="text-xs text-red-500 mt-1">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* SITE WEB */}
                    <Input
                        label="Site web"
                        placeholder="https://www.exemple.fr"
                        error={errors.siteWeb?.message}
                        {...register("siteWeb")}
                    />

                    {/* LOGO */}
                    <Input
                        label="Logo (URL)"
                        placeholder="https://..."
                        {...register("logo")}
                    />

                    {/* ACTIONS */}
                    <div className="flex gap-3 pt-2">

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate("/mutuelles")}
                            className="flex-1"
                        >
                            Annuler
                        </Button>

                        <Button
                            type="submit"
                            loading={isSubmitting}
                            className="flex-1"
                        >
                            Créer la mutuelle
                        </Button>

                    </div>

                </form>
            </div>
        </div>
    );
}