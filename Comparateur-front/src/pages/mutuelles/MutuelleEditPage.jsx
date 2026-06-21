import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Globe,
  FileText,
  Image,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
} from "lucide-react";

import axiosClient from "../../api/axiosClient";

// ─── Schema ─────────────────────────────
const mutuelleSchema = z.object({
  nom: z.string().min(2).max(100),
  description: z.string().max(1000).optional().or(z.literal("")),
  logo: z.string().url().optional().or(z.literal("")),
  siteWeb: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean(),
});

// ─── Field Component (clean SaaS style) ─────────────────────────────
function Field({ label, hint, error, children, icon: Icon }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2">
        {Icon && <Icon size={14} className="text-violet-500" />}
        {label}
      </label>

      {children}

      {hint && !error && (
        <p className="text-xs text-slate-400">{hint}</p>
      )}

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-red-500 flex items-center gap-1"
          >
            <AlertCircle size={12} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Page ─────────────────────────────
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
    defaultValues: {
      nom: "",
      description: "",
      logo: "",
      siteWeb: "",
      isActive: true,
    },
  });

  const logoValue = watch("logo");
  const isActive = watch("isActive");

  // FETCH
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

        setLogoPreview(data.logo);
      } catch {
        setServerError("Impossible de charger la mutuelle.");
      } finally {
        setLoading(false);
      }
    }

    fetchMutuelle();
  }, [id, reset]);

  // LOGO PREVIEW
  useEffect(() => {
    if (logoValue?.startsWith("http")) {
      setLogoPreview(logoValue);
    }
  }, [logoValue]);

  const onSubmit = async (values) => {
    setSaving(true);
    setServerError(null);

    try {
      await axiosClient.put(`/mutuelles/${id}`, values);
      setSuccess(true);
      setTimeout(() => navigate(`/mutuelles/${id}`), 1200);
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Erreur serveur"
      );
    } finally {
      setSaving(false);
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* TOP BAR */}
      <div className="sticky top-0 z-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft size={16} />
          Retour
        </button>

        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-white">
          <Building2 size={16} className="text-violet-500" />
          Modifier mutuelle
        </div>

        <div />
      </div>

      {/* CONTENT */}
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">

        {/* HERO */}
        <div className="rounded-2xl p-5 flex items-center gap-4 bg-gradient-to-r from-violet-600 to-indigo-500 text-white">

          {logoPreview ? (
            <img
              src={logoPreview}
              className="w-14 h-14 rounded-xl bg-white/20 object-contain"
              alt=""
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
              <Building2 />
            </div>
          )}

          <div>
            <p className="text-xs text-white/70">Modification</p>
            <h1 className="text-lg font-bold">
              {watch("nom") || "Mutuelle"}
            </h1>
          </div>
        </div>

        {/* ALERTS */}
        <AnimatePresence>
          {success && (
            <motion.div className="p-4 rounded-xl bg-green-500/10 text-green-600 flex items-center gap-2">
              <CheckCircle2 size={16} />
              Sauvegarde réussie
            </motion.div>
          )}

          {serverError && (
            <motion.div className="p-4 rounded-xl bg-red-500/10 text-red-600 flex items-center gap-2">
              <AlertCircle size={16} />
              {serverError}
            </motion.div>
          )}
        </AnimatePresence>

        {/* FORM */}
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5"
        >

          <Field label="Nom" icon={Building2} error={errors.nom?.message}>
            <input
              {...register("nom")}
              className="input"
            />
          </Field>

          <Field label="Description" icon={FileText}>
            <textarea
              rows={4}
              {...register("description")}
              className="input"
            />
          </Field>

          <Field label="Logo" icon={Image}>
            <input {...register("logo")} className="input" />
          </Field>

          <Field label="Site web" icon={Globe}>
            <input {...register("siteWeb")} className="input" />
          </Field>

          {/* TOGGLE */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
            <span className="text-sm text-slate-700 dark:text-slate-200">
              Mutuelle active
            </span>

            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only" {...register("isActive")} />
              <div className={`w-11 h-6 rounded-full transition ${isActive ? "bg-violet-600" : "bg-slate-300"}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow transform transition ${isActive ? "translate-x-5" : "translate-x-0"}`} />
              </div>
            </label>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 h-10 rounded-xl bg-slate-100 dark:bg-slate-800"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={saving || !isDirty}
              className="flex-1 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" /> : <Save size={16} />}
              Sauvegarder
            </button>
          </div>

        </motion.form>
      </div>
    </div>
  );
}