import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
    Tag, DollarSign, FileText, BarChart2, ArrowLeft,
    CheckCircle2, AlertCircle, Loader2, Save, Shield
} from "lucide-react";
import axiosClient from "../../api/axiosClient";

// ─── Constants ────────────────────────────────────────────────────────────────
const NIVEAUX = [
    { value: 1, label: "Éco", description: "Couverture de base", color: "#10b981", bg: "#ecfdf5" },
    { value: 2, label: "Standard", description: "Couverture intermédiaire", color: "#f59e0b", bg: "#fffbeb" },
    { value: 3, label: "Premium", description: "Couverture maximale", color: "#6366f1", bg: "#eef2ff" },
];

// ─── Zod Schema ───────────────────────────────────────────────────────────────
const offreSchema = z.object({
    nom: z.string().min(2, "Minimum 2 caractères").max(100),
    niveau: z.coerce.number().int().min(1).max(3),
    prixMensuel: z.coerce
        .number({ invalid_type_error: "Entrez un montant valide" })
        .positive("Le prix doit être positif")
        .max(9999.99, "Maximum 9999.99 €"),
    description: z.string().max(1000, "Maximum 1000 caractères").optional().or(z.literal("")),
    isActive: z.boolean(),
});

// ─── Field Component ──────────────────────────────────────────────────────────
function Field({ label, hint, error, children, icon: Icon }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold tracking-wide" style={{ color: "#374151" }}>
                {Icon && <Icon size={14} className="inline mr-1.5 mb-0.5" style={{ color: "#6366f1" }} />}
                {label}
            </label>
            {children}
            {hint && !error && <p className="text-xs" style={{ color: "#9ca3af" }}>{hint}</p>}
            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="text-xs flex items-center gap-1"
                        style={{ color: "#ef4444" }}
                    >
                        <AlertCircle size={12} /> {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Niveau Selector ──────────────────────────────────────────────────────────
function NiveauSelector({ value, onChange }) {
    return (
        <div className="grid grid-cols-3 gap-3">
            {NIVEAUX.map((n) => {
                const selected = Number(value) === n.value;
                return (
                    <button
                        key={n.value}
                        type="button"
                        onClick={() => onChange(n.value)}
                        className="flex flex-col items-center gap-1.5 rounded-xl py-4 px-3 transition-all"
                        style={{
                            border: `2px solid ${selected ? n.color : "#e5e7eb"}`,
                            background: selected ? n.bg : "#f9fafb",
                            cursor: "pointer",
                        }}
                    >
                        <Shield
                            size={20}
                            style={{ color: selected ? n.color : "#9ca3af" }}
                        />
                        <span
                            className="text-sm font-bold"
                            style={{ color: selected ? n.color : "#374151" }}
                        >
                            {n.label}
                        </span>
                        <span className="text-xs text-center" style={{ color: "#9ca3af" }}>
                            {n.description}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function OffreEditPage() {
    const { mutuelleId, offreId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [serverError, setServerError] = useState(null);
    const [mutuelleName, setMutuelleName] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isDirty },
    } = useForm({
        resolver: zodResolver(offreSchema),
        defaultValues: {
            nom: "",
            niveau: 2,
            prixMensuel: "",
            description: "",
            isActive: true,
        },
    });

    const niveauValue = watch("niveau");
    const selectedNiveau = NIVEAUX.find((n) => n.value === Number(niveauValue));

    // Fetch offre
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const [offreRes, mutuelleRes] = await Promise.all([
                    axiosClient.get(`/offres/${offreId}`),
                    axiosClient.get(`/mutuelles/${mutuelleId}`),
                ]);
                const offre = offreRes.data;
                reset({
                    nom: offre.nom ?? "",
                    niveau: offre.niveau ?? 2,
                    prixMensuel: offre.prixMensuel ?? "",
                    description: offre.description ?? "",
                    isActive: offre.isActive ?? true,
                });
                setMutuelleName(mutuelleRes.data.nom ?? "");
            } catch {
                setServerError("Impossible de charger l'offre.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [offreId, mutuelleId, reset]);

    const onSubmit = async (values) => {
        setSaving(true);
        setServerError(null);
        try {
            await axiosClient.put(`/mutuelles/${mutuelleId}/offres/${offreId}`, {
                ...values,
                mutuelleId: Number(mutuelleId),
            });
            setSuccess(true);
            setTimeout(() => navigate(`/mutuelles/${mutuelleId}`), 1500);
        } catch (err) {
            setServerError(err.response?.data?.message ?? "Une erreur est survenue.");
        } finally {
            setSaving(false);
        }
    };

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: "#f8fafc" }}>
                <div className="flex flex-col items-center gap-3">
                    <Loader2 size={32} className="animate-spin" style={{ color: "#6366f1" }} />
                    <p className="text-sm" style={{ color: "#6b7280" }}>Chargement de l'offre…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ background: "#f8fafc" }}>
            {/* Top bar */}
            <div
                className="sticky top-0 z-20 border-b px-6 py-3 flex items-center justify-between"
                style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
            >
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm font-medium transition-colors"
                    style={{ color: "#6b7280" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#111827")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#6b7280")}
                >
                    <ArrowLeft size={16} /> Retour
                </button>
                <div className="flex items-center gap-2">
                    <Tag size={16} style={{ color: "#6366f1" }} />
                    <span className="text-sm font-semibold" style={{ color: "#111827" }}>
                        Modifier l'offre
                    </span>
                </div>
                <div style={{ width: 80 }} />
            </div>

            <div className="max-w-2xl mx-auto px-4 py-10">
                {/* Header card */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl p-6 mb-6"
                    style={{
                        background: selectedNiveau
                            ? `linear-gradient(135deg, ${selectedNiveau.color} 0%, ${selectedNiveau.color}cc 100%)`
                            : "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
                    }}
                >
                    <p className="text-sm mb-0.5" style={{ color: "rgba(255,255,255,0.75)" }}>
                        {mutuelleName || "Mutuelle"} · Modification de l'offre
                    </p>
                    <h1 className="text-xl font-bold" style={{ color: "white" }}>
                        {watch("nom") || "Offre sans nom"}
                    </h1>
                    <div className="flex items-center gap-3 mt-3">
                        <span
                            className="text-xs font-semibold px-3 py-1 rounded-full"
                            style={{ background: "rgba(255,255,255,0.25)", color: "white" }}
                        >
                            {selectedNiveau?.label ?? "—"}
                        </span>
                        <span className="text-lg font-bold" style={{ color: "white" }}>
                            {watch("prixMensuel") ? `${watch("prixMensuel")} €/mois` : "—"}
                        </span>
                    </div>
                </motion.div>

                {/* Feedback banners */}
                <AnimatePresence>
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                            className="rounded-xl p-4 mb-5 flex items-center gap-3"
                            style={{ background: "#ecfdf5", border: "1px solid #6ee7b7" }}
                        >
                            <CheckCircle2 size={20} style={{ color: "#10b981" }} />
                            <span className="text-sm font-medium" style={{ color: "#065f46" }}>
                                Offre mise à jour avec succès !
                            </span>
                        </motion.div>
                    )}
                    {serverError && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                            className="rounded-xl p-4 mb-5 flex items-center gap-3"
                            style={{ background: "#fef2f2", border: "1px solid #fca5a5" }}
                        >
                            <AlertCircle size={20} style={{ color: "#ef4444" }} />
                            <span className="text-sm font-medium" style={{ color: "#7f1d1d" }}>{serverError}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Form card */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="rounded-2xl p-6 flex flex-col gap-5"
                    style={{
                        background: "#ffffff",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(99,102,241,0.06)",
                    }}
                >
                    {/* Nom */}
                    <Field label="Nom de l'offre" icon={Tag} error={errors.nom?.message}>
                        <input
                            {...register("nom")}
                            placeholder="Ex : Formule Confort"
                            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                            style={{
                                background: "#f9fafb",
                                border: "1.5px solid",
                                borderColor: errors.nom ? "#ef4444" : "#e5e7eb",
                                color: "#111827",
                            }}
                            onFocus={e => (e.target.style.borderColor = "#6366f1")}
                            onBlur={e => (e.target.style.borderColor = errors.nom ? "#ef4444" : "#e5e7eb")}
                        />
                    </Field>

                    {/* Niveau */}
                    <Field label="Niveau de couverture" icon={BarChart2} error={errors.niveau?.message}>
                        <NiveauSelector
                            value={niveauValue}
                            onChange={(val) => setValue("niveau", val, { shouldDirty: true })}
                        />
                    </Field>

                    {/* Prix mensuel */}
                    <Field
                        label="Prix mensuel (€)"
                        icon={DollarSign}
                        hint="Tarif de base sans options"
                        error={errors.prixMensuel?.message}
                    >
                        <div className="relative">
                            <input
                                {...register("prixMensuel")}
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="29.90"
                                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all pr-12"
                                style={{
                                    background: "#f9fafb",
                                    border: "1.5px solid",
                                    borderColor: errors.prixMensuel ? "#ef4444" : "#e5e7eb",
                                    color: "#111827",
                                }}
                                onFocus={e => (e.target.style.borderColor = "#6366f1")}
                                onBlur={e => (e.target.style.borderColor = errors.prixMensuel ? "#ef4444" : "#e5e7eb")}
                            />
                            <span
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium"
                                style={{ color: "#9ca3af" }}
                            >
                                €/mois
                            </span>
                        </div>
                    </Field>

                    {/* Description */}
                    <Field
                        label="Description"
                        icon={FileText}
                        hint="Optionnel — max 1000 caractères"
                        error={errors.description?.message}
                    >
                        <textarea
                            {...register("description")}
                            rows={4}
                            placeholder="Décrivez les points forts de cette offre…"
                            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all resize-none"
                            style={{
                                background: "#f9fafb",
                                border: "1.5px solid",
                                borderColor: errors.description ? "#ef4444" : "#e5e7eb",
                                color: "#111827",
                            }}
                            onFocus={e => (e.target.style.borderColor = "#6366f1")}
                            onBlur={e => (e.target.style.borderColor = errors.description ? "#ef4444" : "#e5e7eb")}
                        />
                    </Field>

                    {/* IsActive toggle */}
                    <div
                        className="flex items-center justify-between rounded-xl px-4 py-3"
                        style={{ background: "#f9fafb", border: "1.5px solid #e5e7eb" }}
                    >
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold" style={{ color: "#374151" }}>
                                Offre active
                            </span>
                            <span className="text-xs" style={{ color: "#9ca3af" }}>
                                Visible dans la comparaison d'offres
                            </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" {...register("isActive")} />
                            <div
                                className="w-11 h-6 rounded-full peer transition-all peer-checked:after:translate-x-5 after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow"
                                style={{ background: watch("isActive") ? "#6366f1" : "#d1d5db" }}
                            />
                        </label>
                    </div>

                    {/* Divider */}
                    <div style={{ height: 1, background: "#f3f4f6" }} />

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-3">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
                            style={{ background: "#f3f4f6", color: "#374151" }}
                            onMouseEnter={e => (e.currentTarget.style.background = "#e5e7eb")}
                            onMouseLeave={e => (e.currentTarget.style.background = "#f3f4f6")}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={saving || !isDirty}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
                            style={{
                                background: saving || !isDirty ? "#c7d2fe" : "#6366f1",
                                color: "white",
                                cursor: saving || !isDirty ? "not-allowed" : "pointer",
                            }}
                        >
                            {saving ? (
                                <><Loader2 size={16} className="animate-spin" /> Enregistrement…</>
                            ) : (
                                <><Save size={16} /> Enregistrer les modifications</>
                            )}
                        </button>
                    </div>
                </motion.form>
            </div>
        </div>
    );
}