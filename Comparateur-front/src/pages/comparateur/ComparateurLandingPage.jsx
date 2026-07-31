// src/pages/comparateur/ComparateurLandingPage.jsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Sparkles,
    MessageCircle,
    FileText,
    ListChecks,
    ShieldCheck,
    Zap,
    ArrowRight,
    Users,
    TrendingUp,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import PageTransition from "../../components/ui/PageTransition";

const METHODES = [
    {
        id: "wizard",
        icon: ListChecks,
        titre: "Formulaire guidé",
        description:
            "Réponds à quelques questions simples sur ton budget et tes besoins, étape par étape.",
        duree: "~2 min",
        route: "/comparateur/wizard",
        accent: "#7c3aed",
        gradient: "linear-gradient(135deg,#7c3aed,#a78bfa)",
    },
    {
        id: "assistant",
        icon: MessageCircle,
        titre: "Assistant IA",
        description:
            "Décris ta recherche en langage naturel, l'IA trouve les meilleures offres pour toi.",
        duree: "~30 sec",
        route: "/comparateur/assistant",
        accent: "#4f46e5",
        gradient: "linear-gradient(135deg,#4f46e5,#818cf8)",
        badge: "Nouveau",
    },
    {
        id: "contrat",
        icon: FileText,
        titre: "Analyser mon contrat",
        description:
            "Upload ton contrat actuel en PDF, l'IA le compare automatiquement à nos meilleures offres.",
        duree: "~1 min",
        route: "/comparateur/analyse-contrat",
        accent: "#059669",
        gradient: "linear-gradient(135deg,#059669,#34d399)",
        badge: "IA",
    },
];

const STATS = [
    { icon: Users, valeur: "12k+", label: "comparaisons réalisées" },
    { icon: ShieldCheck, valeur: "40+", label: "mutuelles partenaires" },
    { icon: TrendingUp, valeur: "22%", label: "d'économie moyenne" },
];

const REASSURANCES = [
    { icon: ShieldCheck, texte: "100% gratuit, sans engagement" },
    { icon: Zap, texte: "Résultats en quelques secondes" },
    { icon: Sparkles, texte: "Recommandations personnalisées" },
];

function BlobBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
                className="absolute -top-32 -left-20 w-[420px] h-[420px] rounded-full blur-3xl"
                style={{ background: "radial-gradient(circle,#7c3aed30,transparent 70%)" }}
                animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute top-20 -right-24 w-[380px] h-[380px] rounded-full blur-3xl"
                style={{ background: "radial-gradient(circle,#4f46e530,transparent 70%)" }}
                animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
                transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-0 left-1/3 w-[300px] h-[300px] rounded-full blur-3xl"
                style={{ background: "radial-gradient(circle,#05966930,transparent 70%)" }}
                animate={{ x: [0, 20, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>
    );
}

function MethodeCard({ methode, index, onClick }) {
    const Icon = methode.icon;
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 + index * 0.1, ease: "easeOut" }}
            whileHover={{ y: -6 }}
        >
            <Card onClick={onClick} className="p-6 h-full flex flex-col group relative overflow-hidden">
                {/* halo au survol */}
                <div
                    className="absolute -top-16 -right-16 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500"
                    style={{ background: methode.gradient }}
                />

                <div className="flex items-start justify-between relative">
                    <motion.div
                        whileHover={{ rotate: 8, scale: 1.05 }}
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                        style={{ background: methode.gradient }}
                    >
                        <Icon size={22} className="text-white" />
                    </motion.div>
                    {methode.badge && <Badge variant="primary">{methode.badge}</Badge>}
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-white mt-4 text-lg relative">
                    {methode.titre}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 flex-1 relative">
                    {methode.description}
                </p>

                <div className="flex items-center justify-between mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 relative">
                    <span className="text-xs font-medium text-slate-400">{methode.duree}</span>
                    <span
                        className="flex items-center gap-1 text-sm font-medium transition-transform group-hover:translate-x-1"
                        style={{ color: methode.accent }}
                    >
                        Commencer
                        <ArrowRight size={14} />
                    </span>
                </div>
            </Card>
        </motion.div>
    );
}

function StatItem({ stat, index }) {
    const Icon = stat.icon;
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            className="flex items-center gap-3"
        >
            <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(124,58,237,0.1)" }}
            >
                <Icon size={17} style={{ color: "#7c3aed" }} />
            </div>
            <div>
                <p className="text-lg font-bold text-slate-900 dark:text-white leading-none">
                    {stat.valeur}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
            </div>
        </motion.div>
    );
}

export default function ComparateurLandingPage() {
    const navigate = useNavigate();

    return (
        <PageTransition>
            <div className="relative">
                <BlobBackground />

                <div className="relative max-w-5xl mx-auto px-4 py-16 sm:py-20">
                    {/* HERO */}
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-14"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-medium mb-6"
                            style={{
                                background: "linear-gradient(135deg,#7c3aed10,#4f46e510)",
                                color: "#7c3aed",
                                border: "1px solid rgba(124,58,237,0.15)",
                            }}
                        >
                            <Sparkles size={14} />
                            Comparateur intelligent
                        </motion.div>

                        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                            Trouve ta mutuelle idéale,
                            <br />
                            <span
                                style={{
                                    background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                à ta façon
                            </span>
                        </h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-500 dark:text-slate-400 mt-5 max-w-xl mx-auto text-base sm:text-lg"
                        >
                            Trois façons simples de comparer les meilleures offres de mutuelle
                            santé, adaptées à ton profil et à ton budget.
                        </motion.p>

                        {/* STATS */}
                        <div className="flex flex-wrap justify-center gap-8 mt-10">
                            {STATS.map((stat, i) => (
                                <StatItem key={stat.label} stat={stat} index={i} />
                            ))}
                        </div>
                    </motion.div>

                    {/* METHODES */}
                    <div className="grid sm:grid-cols-3 gap-5">
                        {METHODES.map((methode, i) => (
                            <MethodeCard
                                key={methode.id}
                                methode={methode}
                                index={i}
                                onClick={() => navigate(methode.route)}
                            />
                        ))}
                    </div>

                    {/* REASSURANCES */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        className="flex flex-wrap justify-center gap-6 mt-14 pt-8 border-t border-slate-100 dark:border-slate-800"
                    >
                        {REASSURANCES.map((r, i) => {
                            const Icon = r.icon;
                            return (
                                <div
                                    key={i}
                                    className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"
                                >
                                    <Icon size={15} className="text-violet-500" />
                                    {r.texte}
                                </div>
                            );
                        })}
                    </motion.div>

                    {/* CTA SECONDAIRE */}
                    <div className="text-center mt-10">
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/comparateur/wizard")}
                            rightIcon={<ArrowRight size={15} />}
                        >
                            Ou parcourir toutes les offres directement
                        </Button>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}