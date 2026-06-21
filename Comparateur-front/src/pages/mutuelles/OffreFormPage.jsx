import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Input from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import mutuelleApi from "../../api/mutuelleApi";

const schema = z.object({
    nom: z.string().min(1, "Nom requis").max(200),
    niveau: z.coerce.number().min(1).max(3),
    prixMensuel: z.coerce.number().min(1, "Prix requis").max(10000),
    description: z.string().optional(),
});

const NIVEAUX = [
    { value: 1, label: "Eco" },
    { value: 2, label: "Standard" },
    { value: 3, label: "Premium" },
];

export default function OffreFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { niveau: 1 },
    });

    const selectedNiveau = watch("niveau");

    const onSubmit = async (data) => {
        try {
            await mutuelleApi.addOffre(id, data);
            navigate(`/mutuelles/${id}`);
        } catch (e) {
            alert(
                e.response?.data?.title || "Erreur lors de la création de l'offre"
            );
        }
    };

    return (
        <div className="max-w-2xl space-y-6">

            {/* BACK */}
            <button
                onClick={() => navigate(`/mutuelles/${id}`)}
                className="
          flex items-center gap-2
          text-sm text-slate-500
          hover:text-slate-800 dark:hover:text-white
          transition
        "
            >
                <ArrowLeft size={16} />
                Retour à la mutuelle
            </button>

            {/* CARD */}
            <div
                className="
        bg-white/70 dark:bg-slate-900/60
        backdrop-blur-xl
        border border-slate-200 dark:border-slate-800
        rounded-2xl
        p-6
      "
            >
                {/* HEADER */}
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                    Nouvelle offre
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    Ajoutez une offre Eco, Standard ou Premium
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    {/* NOM */}
                    <Input
                        label="Nom de l'offre"
                        placeholder="ex: Formule Eco"
                        error={errors.nom?.message}
                        {...register("nom")}
                    />

                    {/* NIVEAU (SEGMENTED UI MODERNE) */}
                    <div>
                        <label className="text-sm text-slate-600 dark:text-slate-300">
                            Niveau de couverture
                        </label>

                        <div className="grid grid-cols-3 gap-2 mt-2">
                            {NIVEAUX.map((n) => (
                                <label key={n.value}>
                                    <input
                                        type="radio"
                                        value={n.value}
                                        {...register("niveau")}
                                        className="hidden"
                                    />

                                    <div
                                        className={`
                      cursor-pointer
                      p-3 rounded-xl
                      border text-center
                      transition
                      ${Number(selectedNiveau) === n.value
                                                ? "bg-violet-600 text-white border-violet-600"
                                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                                            }
                    `}
                                    >
                                        <span className="text-sm font-medium">
                                            {n.label}
                                        </span>
                                    </div>
                                </label>
                            ))}
                        </div>

                        {errors.niveau && (
                            <p className="text-xs text-red-500 mt-1">
                                {errors.niveau.message}
                            </p>
                        )}
                    </div>

                    {/* PRIX */}
                    <div>
                        <label className="text-sm text-slate-600 dark:text-slate-300">
                            Prix mensuel (€)
                        </label>

                        <div className="relative mt-1">
                            <input
                                type="number"
                                step="0.01"
                                placeholder="89.00"
                                className={`
                  w-full h-11 px-3 pr-10
                  rounded-xl
                  bg-slate-100 dark:bg-slate-800
                  border outline-none
                  text-sm
                  transition
                  focus:bg-white dark:focus:bg-slate-900
                  focus:border-violet-500
                  ${errors.prixMensuel
                                        ? "border-red-400"
                                        : "border-slate-200 dark:border-slate-700"
                                    }
                `}
                                {...register("prixMensuel")}
                            />

                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                €
                            </span>
                        </div>

                        {errors.prixMensuel && (
                            <p className="text-xs text-red-500 mt-1">
                                {errors.prixMensuel.message}
                            </p>
                        )}
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <label className="text-sm text-slate-600 dark:text-slate-300">
                            Description{" "}
                            <span className="text-slate-400">(optionnel)</span>
                        </label>

                        <textarea
                            rows={3}
                            placeholder="Décrivez cette offre..."
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
                focus:bg-white dark:focus:bg-slate-900
              "
                            {...register("description")}
                        />
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate(`/mutuelles/${id}`)}
                            className="flex-1"
                        >
                            Annuler
                        </Button>

                        <Button
                            type="submit"
                            loading={isSubmitting}
                            className="flex-1"
                        >
                            Créer l'offre
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}