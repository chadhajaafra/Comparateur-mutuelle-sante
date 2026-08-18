import { useState, useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload,
    FileText,
    AlertCircle,
    CheckCircle2,
    X,
    Sparkles,
    TrendingDown,
    TrendingUp,
    Crown,
    Medal,
    Award,
    Shield,
    Euro,
    Building2,
    ArrowRight,
    Trophy,
    Wallet,
    Lock,
    Search,
    BarChart3,
    Check,
    Zap,
    CircleDollarSign,
    ChevronDown,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import PageTransition from "../../components/ui/PageTransition";
import Skeleton from "../../components/ui/Skeleton";
import Badge from "../../components/ui/Badge";
import ProgressBar from "../../components/ui/ProgressBar";
import StatCard from "../../components/ui/StatCard";
import EmptyState from "../../components/ui/EmptyState";
import comparateurApi from "../../api/comparateurApi";

/* =========================================================
   CONSTANTES
========================================================= */

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const RANK_STYLES = [
    {
        icon: Crown,
        color: "#f59e0b",
        bg: "linear-gradient(135deg,#fef3c7,#fde68a)",
    },
    {
        icon: Medal,
        color: "#94a3b8",
        bg: "linear-gradient(135deg,#f1f5f9,#e2e8f0)",
    },
    {
        icon: Award,
        color: "#c2703d",
        bg: "linear-gradient(135deg,#fde8d8,#fbd5b5)",
    },
];

/* =========================================================
   HELPERS
========================================================= */

const formatPrix = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
        return "—";
    }

    return `${Number(value).toFixed(2)}€`;
};

const getScoreColor = (score) => {
    if (score >= 80) return "#059669";
    if (score >= 60) return "#d97706";
    return "#dc2626";
};

const getScoreLabel = (score) => {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Très bon";
    if (score >= 50) return "Correct";
    return "À améliorer";
};

/* =========================================================
   SCORE MINI
========================================================= */

function ScoreMini({ label, value }) {
    const safeValue = Math.max(0, Math.min(100, Number(value) || 0));

    return (
        <div className="flex-1 min-w-[90px]">
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    {label}
                </span>

                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    {safeValue}%
                </span>
            </div>

            <ProgressBar value={safeValue} />
        </div>
    );
}

/* =========================================================
   ANALYSIS PROGRESS
========================================================= */

function AnalysisProgress() {
    const [step, setStep] = useState(0);

    const steps = [
        {
            icon: FileText,
            label: "Lecture du document",
        },
        {
            icon: Search,
            label: "Extraction des garanties",
        },
        {
            icon: BarChart3,
            label: "Comparaison des offres",
        },
        {
            icon: Sparkles,
            label: "Calcul des recommandations",
        },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setStep((current) => {
                if (current >= steps.length - 1) {
                    return current;
                }

                return current + 1;
            });
        }, 1800);

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
        >
            <Card className="p-6 sm:p-8 overflow-hidden">
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        animate={{
                            rotate: [0, 5, -5, 0],
                            scale: [1, 1.04, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                        style={{
                            background:
                                "linear-gradient(135deg,#7c3aed,#4f46e5)",
                        }}
                    >
                        <Sparkles size={27} className="text-white" />
                    </motion.div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        Analyse de votre contrat
                    </h3>

                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Notre moteur analyse votre contrat et recherche les
                        meilleures alternatives.
                    </p>
                </div>

                <div className="mt-8 space-y-3">
                    {steps.map((item, index) => {
                        const Icon = item.icon;
                        const completed = index < step;
                        const current = index === step;

                        return (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-3"
                            >
                                <div
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${completed
                                            ? "bg-emerald-100 text-emerald-600"
                                            : current
                                                ? "text-white"
                                                : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                                        }`}
                                    style={
                                        current
                                            ? {
                                                background:
                                                    "linear-gradient(135deg,#7c3aed,#4f46e5)",
                                            }
                                            : undefined
                                    }
                                >
                                    {completed ? (
                                        <Check size={16} />
                                    ) : (
                                        <Icon size={16} />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <p
                                        className={`text-sm font-medium ${completed || current
                                                ? "text-slate-900 dark:text-white"
                                                : "text-slate-400"
                                            }`}
                                    >
                                        {item.label}
                                    </p>
                                </div>

                                {current && (
                                    <motion.div
                                        className="flex gap-1"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                                    </motion.div>
                                )}

                                {completed && (
                                    <CheckCircle2
                                        size={17}
                                        className="text-emerald-500"
                                    />
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                <div className="mt-7">
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full rounded-full"
                            style={{
                                background:
                                    "linear-gradient(90deg,#7c3aed,#4f46e5)",
                            }}
                            animate={{
                                width: `${Math.min(
                                    ((step + 1) / steps.length) * 100,
                                    95
                                )}%`,
                            }}
                            transition={{ duration: 0.6 }}
                        />
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}

/* =========================================================
   CONTRAT ACTUEL
========================================================= */

function ContratActuelCard({ contrat }) {
    const garanties = contrat?.garanties || [];

    return (
        <Card className="p-6 sm:p-7">
            <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                            background: "rgba(16,185,129,0.1)",
                        }}
                    >
                        <CheckCircle2
                            size={19}
                            className="text-emerald-600"
                        />
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                            Votre contrat actuel
                        </h3>

                        <p className="text-xs text-slate-400 mt-0.5">
                            Détecté automatiquement par l'IA
                        </p>
                    </div>
                </div>

                <Badge variant="success">Analysé</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                        Assureur
                    </p>

                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {contrat?.assureurNom || "Non détecté"}
                    </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                        Prix mensuel
                    </p>

                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {formatPrix(contrat?.prixMensuel)}
                    </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                        Niveau
                    </p>

                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {contrat?.niveauEstime || "Non détecté"}
                    </p>
                </div>
            </div>

            {garanties.length > 0 ? (
                <>
                    <div className="flex items-center gap-2 mb-3">
                        <Shield size={15} className="text-violet-500" />

                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Garanties détectées
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {garanties.map((g, i) => (
                            <Badge key={g.garantieId ?? i} variant="default">
                                {g.nom || "Garantie"}
                                {g.tauxRemboursement
                                    ? ` — ${g.tauxRemboursement}%`
                                    : ""}
                            </Badge>
                        ))}
                    </div>
                </>
            ) : (
                <p className="text-sm text-slate-400">
                    Aucune garantie détaillée détectée.
                </p>
            )}
        </Card>
    );
}

/* =========================================================
   SUMMARY HERO
========================================================= */

function AnalysisSummary({ stats, contrat }) {
    if (!stats) return null;

    const economie = stats.economieMax;
    const meilleureOffre = stats.meilleureOffre;

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
        >
            <Card className="overflow-hidden">
                <div
                    className="relative p-6 sm:p-8"
                    style={{
                        background:
                            "linear-gradient(135deg,rgba(124,58,237,0.06),rgba(79,70,229,0.03))",
                    }}
                >
                    <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-violet-200/20 blur-3xl pointer-events-none" />

                    <div className="relative">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                                <CheckCircle2
                                    size={16}
                                    className="text-emerald-600"
                                />
                            </div>

                            <span className="text-sm font-semibold text-emerald-700">
                                Analyse terminée
                            </span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-7 items-center">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                                    Votre contrat peut être optimisé.
                                </h2>

                                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
                                    Nous avons comparé votre contrat avec les
                                    offres disponibles et identifié une
                                    alternative potentiellement plus
                                    intéressante.
                                </p>

                                {meilleureOffre && (
                                    <div className="flex flex-wrap items-center gap-2 mt-5">
                                        <span className="text-xs text-slate-400">
                                            Offre recommandée :
                                        </span>

                                        <span className="font-semibold text-sm text-slate-900 dark:text-white">
                                            {meilleureOffre.nom}
                                        </span>

                                        <Badge variant="success">
                                            Score {meilleureOffre.scoreTotal}/100
                                        </Badge>
                                    </div>
                                )}
                            </div>

                            <div className="lg:min-w-[230px]">
                                <div className="rounded-3xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-2 text-emerald-600 mb-2">
                                        <CircleDollarSign size={18} />

                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                            Économie potentielle
                                        </span>
                                    </div>

                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                        {economie !== null
                                            ? `${economie.toFixed(2)}€`
                                            : "—"}
                                    </p>

                                    <p className="text-xs text-slate-400 mt-1">
                                        par mois
                                        {economie !== null
                                            ? ` · ${(economie * 12).toFixed(
                                                0
                                            )}€/an`
                                            : ""}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="p-5 sm:border-r border-slate-100 dark:border-slate-800">
                        <p className="text-xs text-slate-400 mb-1">
                            Contrat actuel
                        </p>

                        <p className="font-semibold text-slate-900 dark:text-white">
                            {formatPrix(contrat?.prixMensuel)}
                            <span className="text-xs font-normal text-slate-400">
                                {" "}
                                / mois
                            </span>
                        </p>
                    </div>

                    <div className="p-5 sm:border-r border-slate-100 dark:border-slate-800">
                        <p className="text-xs text-slate-400 mb-1">
                            Meilleur score
                        </p>

                        <p
                            className="font-bold"
                            style={{
                                color: getScoreColor(stats.meilleurScore),
                            }}
                        >
                            {stats.meilleurScore}/100
                        </p>
                    </div>

                    <div className="p-5">
                        <p className="text-xs text-slate-400 mb-1">
                            Offres comparées
                        </p>

                        <p className="font-semibold text-slate-900 dark:text-white">
                            {stats.nombreAlternatives}
                            <span className="text-xs font-normal text-slate-400">
                                {" "}
                                alternatives
                            </span>
                        </p>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}

/* =========================================================
   COMPARISON
========================================================= */

function ComparisonCard({ contrat, offre }) {
    if (!offre) return null;

    const prixActuel = Number(contrat?.prixMensuel);
    const prixOffre = Number(offre?.prixMensuel);

    const economie =
        Number.isFinite(prixActuel) && Number.isFinite(prixOffre)
            ? prixActuel - prixOffre
            : null;

    const actuelGaranties = contrat?.garanties || [];
    const nouvelleGaranties = offre?.garanties || [];

    return (
        <Card className="p-6 sm:p-7">
            <div className="flex items-center gap-3 mb-6">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                        background: "rgba(124,58,237,0.1)",
                    }}
                >
                    <BarChart3 size={19} className="text-violet-600" />
                </div>

                <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                        Pourquoi cette offre ?
                    </h3>

                    <p className="text-xs text-slate-400 mt-0.5">
                        Comparaison avec votre contrat actuel
                    </p>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="grid grid-cols-3 bg-slate-50 dark:bg-slate-800/50">
                    <div className="p-3 text-xs font-semibold text-slate-500">
                        Critère
                    </div>

                    <div className="p-3 text-xs font-semibold text-slate-500 text-center">
                        Actuel
                    </div>

                    <div className="p-3 text-xs font-semibold text-violet-600 text-center">
                        Recommandé
                    </div>
                </div>

                <div className="grid grid-cols-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="p-3 text-sm text-slate-600 dark:text-slate-400">
                        Prix / mois
                    </div>

                    <div className="p-3 text-sm font-semibold text-slate-900 dark:text-white text-center">
                        {formatPrix(prixActuel)}
                    </div>

                    <div className="p-3 text-sm font-bold text-emerald-600 text-center">
                        {formatPrix(prixOffre)}
                    </div>
                </div>

                <div className="grid grid-cols-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="p-3 text-sm text-slate-600 dark:text-slate-400">
                        Score
                    </div>

                    <div className="p-3 text-sm font-semibold text-slate-700 text-center">
                        —
                    </div>

                    <div
                        className="p-3 text-sm font-bold text-center"
                        style={{
                            color: getScoreColor(offre.scoreTotal),
                        }}
                    >
                        {offre.scoreTotal}/100
                    </div>
                </div>

                <div className="grid grid-cols-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="p-3 text-sm text-slate-600 dark:text-slate-400">
                        Niveau
                    </div>

                    <div className="p-3 text-sm font-medium text-slate-700 dark:text-slate-300 text-center">
                        {contrat?.niveauEstime || "—"}
                    </div>

                    <div className="p-3 text-sm font-medium text-slate-900 dark:text-white text-center">
                        {offre?.niveauLabel || "—"}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingDown
                            size={16}
                            className="text-emerald-600"
                        />

                        <span className="text-xs font-semibold text-emerald-700">
                            Économie
                        </span>
                    </div>

                    <p className="text-lg font-bold text-emerald-700">
                        {economie !== null && economie > 0
                            ? `${economie.toFixed(2)}€/mois`
                            : "Pas d'économie"}
                    </p>

                    {economie !== null && economie > 0 && (
                        <p className="text-xs text-emerald-600 mt-1">
                            Soit {(economie * 12).toFixed(0)}€ par an
                        </p>
                    )}
                </div>

                <div className="p-4 rounded-2xl bg-violet-50 border border-violet-100">
                    <div className="flex items-center gap-2 mb-2">
                        <Shield size={16} className="text-violet-600" />

                        <span className="text-xs font-semibold text-violet-700">
                            Garanties
                        </span>
                    </div>

                    <p className="text-lg font-bold text-violet-700">
                        {nouvelleGaranties.length}
                    </p>

                    <p className="text-xs text-violet-600 mt-1">
                        garanties dans l'offre
                    </p>
                </div>
            </div>

            {nouvelleGaranties.length > 0 && (
                <div className="mt-6">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
                        Garanties de l'offre recommandée
                    </p>

                    <div className="space-y-2">
                        {nouvelleGaranties.slice(0, 6).map((g, index) => {
                            const correspondance = actuelGaranties.some(
                                (a) =>
                                    a.nom &&
                                    g.nom &&
                                    a.nom.toLowerCase() ===
                                    g.nom.toLowerCase()
                            );

                            return (
                                <div
                                    key={g.garantieId ?? index}
                                    className="flex items-center justify-between gap-3 py-2"
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                                            <Check
                                                size={13}
                                                className="text-emerald-600"
                                            />
                                        </div>

                                        <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
                                            {g.nom || "Garantie"}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        {g.tauxRemboursement && (
                                            <span className="text-xs font-semibold text-slate-500">
                                                {g.tauxRemboursement}%
                                            </span>
                                        )}

                                        {!correspondance && (
                                            <Badge variant="success">
                                                Améliorée
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </Card>
    );
}

/* =========================================================
   RECOMMENDED OFFER
========================================================= */

function RecommendedOfferCard({ offre, prixActuel }) {
    if (!offre) return null;

    const delta =
        prixActuel !== null && prixActuel !== undefined
            ? Number(offre.prixMensuel) - Number(prixActuel)
            : null;

    const economise = delta !== null && delta < 0;
    const economieMensuelle = economise ? Math.abs(delta) : null;

    const garanties = offre.garanties || [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div
                className="relative rounded-[28px] p-[1px] overflow-hidden"
                style={{
                    background:
                        "linear-gradient(135deg,#f59e0b,#7c3aed,#4f46e5)",
                }}
            >
                <Card className="rounded-[27px] overflow-hidden">
                    <div
                        className="px-6 py-3 flex items-center gap-2"
                        style={{
                            background:
                                "linear-gradient(90deg,#fffbeb,#f5f3ff)",
                        }}
                    >
                        <Crown size={15} className="text-amber-500" />

                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                            Notre recommandation
                        </span>

                        <span className="ml-auto text-xs font-semibold text-violet-600">
                            Meilleur choix
                        </span>
                    </div>

                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                            <div className="flex items-start gap-4 min-w-0">
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                                    style={{
                                        background:
                                            "linear-gradient(135deg,#fef3c7,#fde68a)",
                                    }}
                                >
                                    <Crown
                                        size={25}
                                        className="text-amber-500"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate">
                                        {offre.nom}
                                    </h3>

                                    <p className="text-sm text-slate-500 mt-1 truncate">
                                        {offre.mutuelleNom || "Mutuelle"}{" "}
                                        {offre.niveauLabel
                                            ? `· ${offre.niveauLabel}`
                                            : ""}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-2 mt-3">
                                        <Badge variant="success">
                                            Score {offre.scoreTotal}/100
                                        </Badge>

                                        <span
                                            className="text-xs font-semibold"
                                            style={{
                                                color: getScoreColor(
                                                    offre.scoreTotal
                                                ),
                                            }}
                                        >
                                            {getScoreLabel(offre.scoreTotal)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:text-right shrink-0">
                                <div className="flex items-baseline gap-1 lg:justify-end">
                                    <Euro
                                        size={17}
                                        className="text-slate-400"
                                    />

                                    <span className="text-3xl font-bold text-slate-900 dark:text-white">
                                        {formatPrix(offre.prixMensuel)}
                                    </span>

                                    <span className="text-xs text-slate-400">
                                        /mois
                                    </span>
                                </div>

                                {economieMensuelle !== null && (
                                    <div className="flex items-center gap-1.5 mt-1 lg:justify-end text-emerald-600">
                                        <TrendingDown size={14} />

                                        <span className="text-sm font-semibold">
                                            -{economieMensuelle.toFixed(2)}€/mois
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-7">
                            <ScoreMini
                                label="Prix"
                                value={offre.scorePrix}
                            />

                            <ScoreMini
                                label="Niveau"
                                value={offre.scoreNiveau}
                            />

                            <ScoreMini
                                label="Garanties"
                                value={offre.scoreGaranties}
                            />
                        </div>

                        {garanties.length > 0 && (
                            <div className="mt-7 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
                                    Principales garanties
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {garanties.slice(0, 6).map((g, index) => (
                                        <div
                                            key={g.garantieId ?? index}
                                            className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
                                        >
                                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                                <Check
                                                    size={11}
                                                    className="text-emerald-600"
                                                />
                                            </div>

                                            <span className="truncate">
                                                {g.nom || "Garantie"}

                                                {g.tauxRemboursement
                                                    ? ` · ${g.tauxRemboursement}%`
                                                    : ""}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-7 p-4 rounded-2xl bg-violet-50 border border-violet-100">
                            <div className="flex items-start gap-3">
                                <Zap
                                    size={17}
                                    className="text-violet-600 mt-0.5 shrink-0"
                                />

                                <div>
                                    <p className="text-sm font-semibold text-violet-800">
                                        Pourquoi cette offre ?
                                    </p>

                                    <p className="text-xs text-violet-700/80 mt-1 leading-relaxed">
                                        Elle offre actuellement le meilleur
                                        compromis entre prix, niveau de
                                        couverture et garanties parmi les
                                        alternatives analysées.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Button
                            className="w-full mt-6"
                            rightIcon={<ArrowRight size={16} />}
                        >
                            Voir le détail de l'offre
                        </Button>
                    </div>
                </Card>
            </div>
        </motion.div>
    );
}

/* =========================================================
   ALTERNATIVE CARD
========================================================= */

function OffreAlternativeCard({ offre, index, prixActuel }) {
    const rank = RANK_STYLES[index];
    const RankIcon = rank?.icon;

    const delta =
        prixActuel !== null && prixActuel !== undefined
            ? Number(offre.prixMensuel) - Number(prixActuel)
            : null;

    const economise = delta !== null && delta < 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.35,
                delay: index * 0.08,
            }}
        >
            <Card className="p-0 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                            {rank ? (
                                <div
                                    className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                                    style={{
                                        background: rank.bg,
                                    }}
                                >
                                    <RankIcon
                                        size={20}
                                        style={{
                                            color: rank.color,
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-slate-100 dark:bg-slate-800">
                                    <Building2
                                        size={18}
                                        className="text-slate-400"
                                    />
                                </div>
                            )}

                            <div className="min-w-0">
                                <p className="font-semibold text-slate-900 dark:text-white truncate">
                                    {offre.nom}
                                </p>

                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                    {offre.mutuelleNom || "Mutuelle"}
                                    {offre.niveauLabel
                                        ? ` · ${offre.niveauLabel}`
                                        : ""}
                                </p>
                            </div>
                        </div>

                        <div className="text-right shrink-0">
                            <div
                                className="text-2xl font-bold"
                                style={{
                                    color: getScoreColor(
                                        offre.scoreTotal || 0
                                    ),
                                }}
                            >
                                {offre.scoreTotal ?? "—"}
                            </div>

                            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                                /100
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-5">
                        <div className="flex items-center gap-1.5">
                            <Euro size={14} className="text-slate-400" />

                            <span className="text-lg font-bold text-slate-900 dark:text-white">
                                {formatPrix(offre.prixMensuel)}
                            </span>

                            <span className="text-xs text-slate-400">
                                /mois
                            </span>
                        </div>

                        {delta !== null && Math.abs(delta) > 0.01 && (
                            <Badge
                                variant={
                                    economise ? "success" : "danger"
                                }
                            >
                                <span className="flex items-center gap-1">
                                    {economise ? (
                                        <TrendingDown size={11} />
                                    ) : (
                                        <TrendingUp size={11} />
                                    )}

                                    {economise ? "-" : "+"}
                                    {Math.abs(delta).toFixed(2)}€/mois
                                </span>
                            </Badge>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-5">
                        <ScoreMini
                            label="Prix"
                            value={offre.scorePrix}
                        />

                        <ScoreMini
                            label="Niveau"
                            value={offre.scoreNiveau}
                        />

                        <ScoreMini
                            label="Garanties"
                            value={offre.scoreGaranties}
                        />
                    </div>

                    {offre.garanties?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
                            {offre.garanties.slice(0, 6).map((g, i) => (
                                <span
                                    key={g.garantieId ?? i}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium"
                                    style={{
                                        background: g.matchCritere
                                            ? "rgba(124,58,237,0.08)"
                                            : "rgba(148,163,184,0.1)",
                                        color: g.matchCritere
                                            ? "#7c3aed"
                                            : "#64748b",
                                    }}
                                >
                                    <Shield size={10} />

                                    {g.nom || "Garantie"}

                                    {g.tauxRemboursement
                                        ? ` ${g.tauxRemboursement}%`
                                        : ""}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    className="w-full flex items-center justify-center gap-1.5 py-3 text-sm font-medium transition-colors hover:bg-violet-50"
                    style={{
                        background:
                            "linear-gradient(135deg,#7c3aed08,#4f46e508)",
                        color: "#7c3aed",
                    }}
                >
                    Voir le détail de l'offre
                    <ArrowRight size={14} />
                </button>
            </Card>
        </motion.div>
    );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function AnalyseContratPage() {
    const [fichier, setFichier] = useState(null);  
    const [loading, setLoading] = useState(false);
    const [erreur, setErreur] = useState(null);
    const [resultat, setResultat] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const inputRef = useRef(null);

    /* -----------------------------------------------------
       VALIDATION FICHIER
    ----------------------------------------------------- */

    const validerEtDefinir = (f) => {
        if (!f) return;

        if (
            f.type !== "application/pdf" &&
            !f.name?.toLowerCase().endsWith(".pdf")
        ) {
            setErreur("Seuls les fichiers PDF sont acceptés.");
            setFichier(null);
            return;
        }

        if (f.size > MAX_FILE_SIZE) {
            setErreur("Le fichier ne doit pas dépasser 10 Mo.");
            setFichier(null);
            return;
        }

        setFichier(f);
        setErreur(null);
        setResultat(null);
    };

    const handleFileChange = (e) => {
        validerEtDefinir(e.target.files?.[0]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);

        validerEtDefinir(e.dataTransfer.files?.[0]);
    };

    /* -----------------------------------------------------
       ANALYSE
    ----------------------------------------------------- */

    const handleAnalyser = async () => {
        if (!fichier || loading) return;

        setLoading(true);
        setErreur(null);
        setResultat(null);

        try {
            const data = await comparateurApi.analyserContrat(fichier);

            if (!data) {
                throw new Error("Aucun résultat reçu.");
            }

            setResultat(data);
        } catch (err) {
            setErreur(
                err?.response?.data?.message ||
                err?.message ||
                "Erreur lors de l'analyse du contrat."
            );
        } finally {
            setLoading(false);
        }
    };

    /* -----------------------------------------------------
       RESET
    ----------------------------------------------------- */

    const reset = () => {
        setFichier(null);
        setResultat(null);
        setErreur(null);
        setDragActive(false);

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    /* -----------------------------------------------------
       STATS
    ----------------------------------------------------- */

    const stats = useMemo(() => {
        if (!resultat) return null;

        const contratActuel = resultat.contratActuel || {};

        const alternatives = Array.isArray(
            resultat.meilleuresAlternatives
        )
            ? [...resultat.meilleuresAlternatives]
            : [];

        if (alternatives.length === 0) {
            return {
                meilleureOffre: null,
                economieMax: null,
                meilleurScore: 0,
                nombreAlternatives: 0,
                alternatives: [],
            };
        }

        const alternativesTriees = alternatives.sort(
            (a, b) => (b.scoreTotal || 0) - (a.scoreTotal || 0)
        );

        const prixActuel = Number(contratActuel.prixMensuel);

        const economies = alternativesTriees
            .map((offre) => {
                const prix = Number(offre.prixMensuel);

                if (
                    !Number.isFinite(prixActuel) ||
                    !Number.isFinite(prix)
                ) {
                    return null;
                }

                return prixActuel - prix;
            })
            .filter((delta) => delta !== null && delta > 0);

        const economieMax =
            economies.length > 0 ? Math.max(...economies) : null;

        const meilleurScore = Math.max(
            ...alternativesTriees.map((o) => Number(o.scoreTotal) || 0)
        );

        return {
            meilleureOffre: alternativesTriees[0],
            economieMax,
            meilleurScore,
            nombreAlternatives: alternativesTriees.length,
            alternatives: alternativesTriees,
        };
    }, [resultat]);

    /* -----------------------------------------------------
       RENDER
    ----------------------------------------------------- */

    return (
        <PageTransition>
            <div className="max-w-5xl mx-auto px-4 py-8 sm:py-10">
                {/* =====================================================
                    HEADER
                ===================================================== */}

                <PageHeader
                    title="Analyser mon contrat actuel"
                    description="Importez votre contrat de mutuelle et découvrez en quelques secondes les offres les plus intéressantes pour vous."
                    action={
                        <div
                            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold"
                            style={{
                                background:
                                    "linear-gradient(135deg,#7c3aed10,#4f46e510)",
                                color: "#7c3aed",
                            }}
                        >
                            <Sparkles size={14} />
                            Propulsé par l'IA
                        </div>
                    }
                />

                {/* =====================================================
                    UPLOAD
                ===================================================== */}

                {!resultat && (
                    <Card className="p-5 sm:p-7">
                        <AnimatePresence mode="wait">
                            {!fichier ? (
                                <motion.div
                                    key="dropzone"
                                    initial={{
                                        opacity: 0,
                                        scale: 0.98,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        scale: 0.98,
                                    }}
                                >
                                    <label
                                        htmlFor="pdf-upload"
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            setDragActive(true);
                                        }}
                                        onDragEnter={(e) => {
                                            e.preventDefault();
                                            setDragActive(true);
                                        }}
                                        onDragLeave={() =>
                                            setDragActive(false)
                                        }
                                        onDrop={handleDrop}
                                        className="relative flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-10 sm:p-14 cursor-pointer transition-all duration-300"
                                        style={{
                                            borderColor: dragActive
                                                ? "#7c3aed"
                                                : "#e2e8f0",

                                            background: dragActive
                                                ? "linear-gradient(135deg,#7c3aed08,#4f46e508)"
                                                : "transparent",
                                        }}
                                    >
                                        <motion.div
                                            animate={{
                                                y: dragActive ? -6 : 0,
                                                scale: dragActive
                                                    ? 1.05
                                                    : 1,
                                            }}
                                            transition={{
                                                duration: 0.25,
                                            }}
                                            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                                            style={{
                                                background:
                                                    "linear-gradient(135deg,#7c3aed,#4f46e5)",
                                            }}
                                        >
                                            <Upload
                                                size={27}
                                                className="text-white"
                                            />
                                        </motion.div>

                                        <p className="text-base font-semibold text-slate-900 dark:text-white text-center">
                                            {dragActive
                                                ? "Déposez votre contrat ici"
                                                : "Déposez votre contrat ici"}
                                        </p>

                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 text-center">
                                            ou cliquez pour sélectionner un
                                            fichier
                                        </p>

                                        <div className="flex flex-wrap justify-center gap-2 mt-5">
                                            <span className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-500">
                                                PDF uniquement
                                            </span>

                                            <span className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-500">
                                                10 Mo maximum
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 mt-6 text-xs text-slate-400">
                                            <Lock size={13} />
                                            Votre document est traité de
                                            manière sécurisée
                                        </div>

                                        <input
                                            ref={inputRef}
                                            id="pdf-upload"
                                            type="file"
                                            accept="application/pdf,.pdf"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="filepreview"
                                    initial={{
                                        opacity: 0,
                                        scale: 0.98,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                    }}
                                    exit={{
                                        opacity: 0,
                                    }}
                                >
                                    <div className="rounded-3xl border border-violet-100 bg-violet-50/50 p-5">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div
                                                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                                    style={{
                                                        background:
                                                            "linear-gradient(135deg,#7c3aed,#4f46e5)",
                                                    }}
                                                >
                                                    <FileText
                                                        size={19}
                                                        className="text-white"
                                                    />
                                                </div>

                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle2
                                                            size={14}
                                                            className="text-emerald-500 shrink-0"
                                                        />

                                                        <p className="text-xs font-semibold text-emerald-600">
                                                            Contrat
                                                            sélectionné
                                                        </p>
                                                    </div>

                                                    <p className="text-sm font-semibold text-slate-900 truncate mt-1">
                                                        {fichier.name}
                                                    </p>

                                                    <p className="text-xs text-slate-400 mt-0.5">
                                                        {(
                                                            fichier.size /
                                                            1024
                                                        ).toFixed(0)}{" "}
                                                        Ko
                                                    </p>
                                                </div>
                                            </div>

                                            {!loading && (
                                                <button
                                                    type="button"
                                                    onClick={reset}
                                                    className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                                                    aria-label="Supprimer le fichier"
                                                >
                                                    <X size={17} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* ERREUR */}

                        <AnimatePresence>
                            {erreur && (
                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        y: -6,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        y: -6,
                                    }}
                                    className="flex items-start gap-2 mt-4 text-sm px-4 py-3 rounded-xl"
                                    style={{
                                        background: "#fef2f2",
                                        color: "#dc2626",
                                    }}
                                >
                                    <AlertCircle
                                        size={16}
                                        className="shrink-0 mt-0.5"
                                    />

                                    <span>{erreur}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {!loading && (
                            <Button
                                className="mt-6 w-full"
                                onClick={handleAnalyser}
                                disabled={!fichier}
                                leftIcon={<Sparkles size={16} />}
                            >
                                Analyser mon contrat
                            </Button>
                        )}
                    </Card>
                )}

                {/* =====================================================
                    LOADING
                ===================================================== */}

                {loading && <AnalysisProgress />}

                {/* =====================================================
                    RESULTATS
                ===================================================== */}

                <AnimatePresence>
                    {resultat && !loading && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 15,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                duration: 0.45,
                            }}
                            className="mt-8 space-y-8"
                        >
                            {/* RESUME */}

                            <AnalysisSummary
                                stats={stats}
                                contrat={resultat.contratActuel}
                            />

                            {/* CONTRAT ACTUEL */}

                            <ContratActuelCard
                                contrat={resultat.contratActuel}
                            />

                            {/* STATS */}

                            {stats && stats.nombreAlternatives > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <StatCard
                                        title="Économie potentielle"
                                        value={
                                            stats.economieMax !== null
                                                ? `${stats.economieMax.toFixed(
                                                    2
                                                )}€/mois`
                                                : "—"
                                        }
                                        icon={Wallet}
                                        trend={
                                            stats.economieMax !== null
                                                ? `+${(
                                                    stats.economieMax * 12
                                                ).toFixed(0)}€/an`
                                                : undefined
                                        }
                                    />

                                    <StatCard
                                        title="Meilleur score"
                                        value={`${stats.meilleurScore}/100`}
                                        icon={Trophy}
                                    />

                                    <StatCard
                                        title="Offres analysées"
                                        value={stats.nombreAlternatives}
                                        icon={BarChart3}
                                    />
                                </div>
                            )}

                            {/* RECOMMANDATION */}

                            {stats?.meilleureOffre && (
                                <>
                                    <RecommendedOfferCard
                                        offre={stats.meilleureOffre}
                                        prixActuel={
                                            resultat.contratActuel
                                                ?.prixMensuel
                                        }
                                    />

                                    <ComparisonCard
                                        contrat={resultat.contratActuel}
                                        offre={stats.meilleureOffre}
                                    />
                                </>
                            )}

                            {/* ALTERNATIVES */}

                            <div>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-xl">
                                            Autres alternatives
                                        </h3>

                                        <p className="text-sm text-slate-400 mt-1">
                                            Les offres suivantes ont également
                                            été identifiées comme intéressantes.
                                        </p>
                                    </div>

                                    <Badge variant="primary">
                                        {stats?.nombreAlternatives || 0} offres
                                    </Badge>
                                </div>

                                {stats?.alternatives?.length > 1 ? (
                                    <div className="grid gap-4">
                                        {stats.alternatives
                                            .slice(1)
                                            .map((offre, i) => (
                                                <OffreAlternativeCard
                                                    key={
                                                        offre.id ??
                                                        `offre-${i}`
                                                    }
                                                    offre={offre}
                                                    index={i + 1}
                                                    prixActuel={
                                                        resultat.contratActuel
                                                            ?.prixMensuel
                                                    }
                                                />
                                            ))}
                                    </div>
                                ) : (
                                    <Card className="p-0">
                                        <EmptyState
                                            title={
                                                stats?.alternatives?.length ===
                                                    1
                                                    ? "Une seule offre recommandée"
                                                    : "Aucune alternative trouvée"
                                            }
                                            description={
                                                stats?.alternatives?.length ===
                                                    1
                                                    ? "L'offre recommandée est actuellement la meilleure correspondance trouvée."
                                                    : "Nous n'avons pas trouvé d'offre correspondant mieux à votre contrat actuel."
                                            }
                                        />
                                    </Card>
                                )}
                            </div>

                            {/* FOOTER */}

                            <div className="flex flex-col items-center text-center pt-2 pb-6">
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <Sparkles size={13} />
                                    Analyse générée à partir de votre contrat
                                </div>

                                <p className="text-[11px] text-slate-400 mt-2 max-w-lg">
                                    Les résultats sont indicatifs et dépendent
                                    des informations détectées dans votre
                                    document et des offres disponibles.
                                </p>

                                <button
                                    type="button"
                                    onClick={reset}
                                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-700"
                                >
                                    Analyser un autre contrat
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* =====================================================
                    SKELETON FALLBACK
                ===================================================== */}

                {loading && (
                    <div className="hidden mt-8 space-y-4">
                        <Skeleton className="h-28 rounded-3xl" />

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Skeleton className="h-24 rounded-2xl" />
                            <Skeleton className="h-24 rounded-2xl" />
                            <Skeleton className="h-24 rounded-2xl" />
                        </div>

                        <Skeleton className="h-72 rounded-3xl" />
                    </div>
                )}
            </div>
        </PageTransition>
    );
}