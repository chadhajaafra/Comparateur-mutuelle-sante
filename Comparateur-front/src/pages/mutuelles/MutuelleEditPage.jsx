import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
    Building2, Globe, FileText, Image, ArrowLeft,
    CheckCircle2, AlertCircle, Loader2, Save, Eye, EyeOff
} from "lucide-react";
import axiosClient from "../../api/axiosClient";

// ─── Zod Schema ───────────────────────────────────────────────────────────────
const mutuelleSchema = z.object({
    nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
    description: z.string().max(1000, "Maximum 1000 caractères").optional().or(z.literal("")),
    logo: z.string().url("URL invalide").optional().or(z.literal("")),
    siteWeb: z.string().url("URL invalide").optional().or(z.literal("")),
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

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MutuelleEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [serverError, setServerError] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isDirty },
    } = useForm({
        resolver: zodResolver(mutuelleSchema),
        defaultValues: { nom: "", description: "", logo: "", siteWeb: "", isActive: true },
    });

    const logoValue = watch("logo");

    // Fetch existing mutuelle
    useEffect(() => {
        async function fetchMutuelle() {
            setLoading(true);
            try {
                const { data } = await axiosClient.get(`/mutuelles/${id}`);
                reset({
                    nom: data.nom ?? "",
                    description: data.description ?? "",
                    logo: data.logo ?? "",
                    siteWeb: data.siteWeb ?? "",
                    isActive: data.isActive ?? true,
                });
                if (data.logo) setLogoPreview(data.logo);
            } catch {
                setServerError("Impossible de charger la mutuelle.");
            } finally {
                setLoading(false);
            }
        }
        fetchMutuelle();
    }, [id, reset]);

    // Live logo preview
    useEffect(() => {
        if (logoValue && logoValue.startsWith("http")) {
            setLogoPreview(logoValue);
        }
    }, [logoValue]);

    const onSubmit = async (values) => {
        setSaving(true);
        setServerError(null);
        try {
            await axiosClient.put(`/mutuelles/${id}`, values);
            setSuccess(true);
            setTimeout(() => navigate(`/mutuelles/${id}`), 1500);
        } catch (err) {
            setServerError(err.response?.data?.message ?? "Une erreur est survenue.");
        } finally {
            setSaving(false);
        }
    };

    // ── Loading skeleton ─────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: "#f8fafc" }}>
                <div className="flex flex-col items-center gap-3">
                    <Loader2 size={32} className="animate-spin" style={{ color: "#6366f1" }} />
                    <p className="text-sm" style={{ color: "#6b7280" }}>Chargement de la mutuelle…</p>
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
                    <Building2 size={16} style={{ color: "#6366f1" }} />
                    <span className="text-sm font-semibold" style={{ color: "#111827" }}>
                        Modifier la mutuelle
                    </span>
                </div>
                <div style={{ width: 80 }} />
            </div>

            <div className="max-w-2xl mx-auto px-4 py-10">
                {/* Header card */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl p-6 mb-6 flex items-center gap-4"
                    style={{ background: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)" }}
                >
                    {logoPreview ? (
                        <img
                            src={logoPreview}
                            alt="Logo"
                            className="w-16 h-16 rounded-xl object-contain"
                            style={{ background: "rgba(255,255,255,0.2)" }}
                            onError={() => setLogoPreview(null)}
                        />
                    ) : (
                        <div
                            className="w-16 h-16 rounded-xl flex items-center justify-center"
                            style={{ background: "rgba(255,255,255,0.2)" }}
                        >
                            <Building2 size={28} style={{ color: "white" }} />
                        </div>
                    )}
                    <div>
                        <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.75)" }}>
                            Modification
                        </p>
                        <h1 className="text-xl font-bold" style={{ color: "white" }}>
                            {watch("nom") || "Mutuelle sans nom"}
                        </h1>
                    </div>
                </motion.div>

                {/* Success banner */}
                <AnimatePresence>
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                            className="rounded-xl p-4 mb-5 flex items-center gap-3"
                            style={{ background: "#ecfdf5", border: "1px solid #6ee7b7" }}
                        >
                            <CheckCircle2 size={20} style={{ color: "#10b981" }} />
                            <span className="text-sm font-medium" style={{ color: "#065f46" }}>
                                Mutuelle mise à jour avec succès !
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
                    style={{ background: "#ffffff", boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(99,102,241,0.06)" }}
                >
                    {/* Nom */}
                    <Field label="Nom de la mutuelle" icon={Building2} error={errors.nom?.message}>
                        <input
                            {...register("nom")}
                            placeholder="Ex : Mutuelle Santé Plus"
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
                            placeholder="Décrivez la mutuelle, ses valeurs, sa couverture générale…"
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

                    {/* Logo */}
                    <Field
                        label="URL du logo"
                        icon={Image}
                        hint="URL https vers une image PNG/SVG"
                        error={errors.logo?.message}
                    >
                        <input
                            {...register("logo")}
                            placeholder="https://example.com/logo.png"
                            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                            style={{
                                background: "#f9fafb",
                                border: "1.5px solid",
                                borderColor: errors.logo ? "#ef4444" : "#e5e7eb",
                                color: "#111827",
                            }}
                            onFocus={e => (e.target.style.borderColor = "#6366f1")}
                            onBlur={e => (e.target.style.borderColor = errors.logo ? "#ef4444" : "#e5e7eb")}
                        />
                    </Field>

                    {/* Site web */}
                    <Field
                        label="Site web"
                        icon={Globe}
                        hint="URL du site officiel"
                        error={errors.siteWeb?.message}
                    >
                        <input
                            {...register("siteWeb")}
                            placeholder="https://mutuelle-exemple.fr"
                            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                            style={{
                                background: "#f9fafb",
                                border: "1.5px solid",
                                borderColor: errors.siteWeb ? "#ef4444" : "#e5e7eb",
                                color: "#111827",
                            }}
                            onFocus={e => (e.target.style.borderColor = "#6366f1")}
                            onBlur={e => (e.target.style.borderColor = errors.siteWeb ? "#ef4444" : "#e5e7eb")}
                        />
                    </Field>

                    {/* IsActive toggle */}
                    <div className="flex items-center justify-between rounded-xl px-4 py-3"
                        style={{ background: "#f9fafb", border: "1.5px solid #e5e7eb" }}>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold" style={{ color: "#374151" }}>
                                Mutuelle active
                            </span>
                            <span className="text-xs" style={{ color: "#9ca3af" }}>
                                Visible dans les recherches publiques
                            </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" {...register("isActive")} />
                            <div
                                className="w-11 h-6 rounded-full peer transition-all peer-checked:after:translate-x-5 after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow"
                                style={{
                                    background: watch("isActive") ? "#6366f1" : "#d1d5db",
                                }}
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