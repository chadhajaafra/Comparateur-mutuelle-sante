
import { motion } from "framer-motion";
import PageHeader from "../../components/ui/PageHeader";
import {
    ArrowRight,
    Bot,
    Check,
    CheckCircle2,
    FileCheck2,
    FileText,
    Heart,
    HeartPulse,
    ListChecks,
    MessageCircle,
    Search,
    Shield,
    ShieldCheck,
    Sparkles,
    Star,
    TrendingDown,
    Users,
    Wallet,
    Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import PageTransition from "../../components/ui/PageTransition";

const METHODES = [
    {
        id: "wizard",
        icon: ListChecks,
        titre: "Formulaire guidé",
        description:
            "Réponds à quelques questions simples sur ta situation, tes besoins et ton budget.",
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
            "Décris simplement ce que tu recherches et notre IA t'aide à trouver les offres adaptées.",
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
            "Importe ton contrat actuel et découvre comment il se compare aux autres offres.",
        duree: "~1 min",
        route: "/comparateur/analyse-contrat",
        accent: "#059669",
        gradient: "linear-gradient(135deg,#059669,#34d399)",
        badge: "IA",
    },
];

const STATS = [
    { icon: Users, value: "12k+", label: "comparaisons réalisées" },
    { icon: ShieldCheck, value: "40+", label: "offres partenaires" },
    { icon: TrendingDown, value: "22%", label: "économie moyenne" },
];

const FEATURES = [
    {
        icon: Zap,
        title: "Rapide",
        description:
            "Quelques minutes suffisent pour obtenir des recommandations adaptées.",
    },
    {
        icon: ShieldCheck,
        title: "Sécurisé",
        description:
            "Tes informations sont utilisées pour personnaliser ta comparaison.",
    },
    {
        icon: Wallet,
        title: "Économique",
        description:
            "Compare plusieurs offres selon tes besoins et ton budget.",
    },
    {
        icon: Sparkles,
        title: "Personnalisé",
        description:
            "Les résultats prennent en compte ton profil et tes priorités.",
    },
];

const REASSURANCES = [
    "100% gratuit",
    "Sans engagement",
    "Résultats rapides",
    "Recommandations personnalisées",
];

function AnimatedBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
                className="absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full blur-3xl"
                style={{
                    background:
                        "radial-gradient(circle,#7c3aed30,transparent 70%)",
                }}
                animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute top-20 -right-48 w-[600px] h-[600px] rounded-full blur-3xl"
                style={{
                    background:
                        "radial-gradient(circle,#4f46e525,transparent 70%)",
                }}
                animate={{ x: [0, -50, 0], y: [0, 40, 0], scale: [1, 1.08, 1] }}
                transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-[20%] left-[40%] w-[400px] h-[400px] rounded-full blur-3xl"
                style={{
                    background:
                        "radial-gradient(circle,#10b98118,transparent 70%)",
                }}
                animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>
    );
}

function HeroIllustration() {
    return (
        <div className="relative w-full max-w-[540px] h-[470px] mx-auto">
            <motion.div
                className="absolute inset-16 rounded-full blur-3xl"
                style={{
                    background:
                        "radial-gradient(circle,#7c3aed30,#4f46e525,transparent 70%)",
                }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
                className="absolute left-1/2 top-1/2 w-[360px] h-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-200/60 dark:border-violet-500/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />

            <motion.div
                className="absolute left-1/2 top-1/2 w-[280px] h-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-indigo-200 dark:border-indigo-500/20"
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />

            <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[290px]"
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div className="rounded-[30px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl p-5">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-11 h-11 rounded-2xl flex items-center justify-center"
                                style={{
                                    background:
                                        "linear-gradient(135deg,#7c3aed,#4f46e5)",
                                }}
                            >
                                <HeartPulse size={23} className="text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                    Mutuelle recommandée
                                </p>
                                <p className="text-xs text-slate-400">
                                    Analyse personnalisée
                                </p>
                            </div>
                        </div>
                        <CheckCircle2 size={22} className="text-emerald-500" />
                    </div>

                    <div className="rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/40 dark:to-indigo-950/40 p-4">
                        <p className="text-xs text-slate-400">
                            Offre la plus adaptée
                        </p>
                        <div className="flex items-end justify-between mt-1">
                            <div>
                                <span className="text-3xl font-bold text-slate-900 dark:text-white">
                                    39,90€
                                </span>
                                <span className="text-xs text-slate-400 ml-1">
                                    / mois
                                </span>
                            </div>
                            <span className="text-xs font-bold text-emerald-600">
                                -22%
                            </span>
                        </div>
                    </div>

                    <div className="mt-5 space-y-3">
                        {["Hospitalisation", "Soins courants", "Optique & dentaire"].map(
                            (item, index) => (
                                <motion.div
                                    key={item}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + index * 0.15 }}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2
                                            size={15}
                                            className="text-emerald-500"
                                        />
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            {item}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-semibold text-emerald-600">
                                        Inclus
                                    </span>
                                </motion.div>
                            )
                        )}
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-slate-400">
                                Compatibilité
                            </span>
                            <span className="text-xs font-bold text-violet-600">
                                94%
                            </span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500"
                                initial={{ width: 0 }}
                                animate={{ width: "94%" }}
                                transition={{ delay: 0.7, duration: 1 }}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                className="absolute top-8 right-0 sm:right-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl p-3"
                animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center">
                        <TrendingDown size={19} className="text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400">
                            Économie estimée
                        </p>
                        <p className="text-sm font-bold text-emerald-600">
                            127€ / an
                        </p>
                    </div>
                </div>
            </motion.div>

            <motion.div
                className="absolute bottom-10 left-0 sm:left-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl p-3"
                animate={{ y: [0, 10, 0], rotate: [0, -2, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                            background:
                                "linear-gradient(135deg,#4f46e5,#818cf8)",
                        }}
                    >
                        <Bot size={19} className="text-white" />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400">
                            Assistant IA
                        </p>
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Analyse terminée
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                className="absolute top-32 left-3 w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-lg flex items-center justify-center"
                animate={{ y: [0, -12, 0], rotate: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
            >
                <FileCheck2 size={21} className="text-violet-600" />
            </motion.div>

            <motion.div
                className="absolute bottom-24 right-4 w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-lg flex items-center justify-center"
                animate={{ y: [0, 12, 0], rotate: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
            >
                <Heart size={20} className="text-rose-500" fill="currentColor" />
            </motion.div>
        </div>
    );
}

function Stat({ item, index }) {
    const Icon = item.icon;
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3"
        >
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center">
                <Icon size={17} className="text-violet-600 dark:text-violet-400" />
            </div>
            <div>
                <p className="font-bold text-slate-900 dark:text-white">
                    {item.value}
                </p>
                <p className="text-[11px] text-slate-400">{item.label}</p>
            </div>
        </motion.div>
    );
}

function MethodeCard({ methode, index, onClick }) {
    const Icon = methode.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
        >
            <Card
                onClick={onClick}
                className="h-full p-6 relative overflow-hidden cursor-pointer group"
            >
                <div
                    className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                    style={{ background: methode.gradient }}
                />

                <div className="relative">
                    <div className="flex justify-between items-start">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 8 }}
                            className="w-13 h-13 rounded-2xl flex items-center justify-center"
                            style={{ background: methode.gradient }}
                        >
                            <Icon size={22} className="text-white" />
                        </motion.div>

                        {methode.badge && (
                            <Badge variant="primary">{methode.badge}</Badge>
                        )}
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                        {methode.titre}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                        {methode.description}
                    </p>

                    <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-xs text-slate-400">
                            {methode.duree}
                        </span>
                        <span
                            className="flex items-center gap-1 text-sm font-semibold group-hover:translate-x-1 transition-transform"
                            style={{ color: methode.accent }}
                        >
                            Commencer <ArrowRight size={14} />
                        </span>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}

function FeatureCard({ feature, index }) {
    const Icon = feature.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ y: -5 }}
            className="text-center"
        >
            <div className="mx-auto w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center mb-4">
                <Icon size={21} className="text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">
                {feature.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {feature.description}
            </p>
        </motion.div>
    );
}

export default function ComparateurLandingPage() {
    const navigate = useNavigate();

    return (
        <PageTransition>
            <div className="relative min-h-screen bg-white dark:bg-slate-950 overflow-hidden">
                <PageHeader />

                <AnimatedBackground />

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
                    <section className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[680px] py-12 lg:py-16">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                            className="text-center lg:text-left"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 text-violet-600 dark:text-violet-400 text-xs font-semibold"
                            >
                                <Sparkles size={14} />
                                Comparateur intelligent
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            </motion.div>

                            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-[58px] font-bold tracking-tight leading-[1.05] text-slate-900 dark:text-white">
                                Ta mutuelle.
                                <br />
                                <span
                                    style={{
                                        background:
                                            "linear-gradient(135deg,#7c3aed,#4f46e5)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    Ton choix.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-xl mx-auto lg:mx-0 text-base sm:text-lg leading-relaxed text-slate-500 dark:text-slate-400">
                                Compare les offres de mutuelle santé adaptées à
                                ton profil, tes besoins et ton budget.
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 mt-8">
                                <Button
                                    onClick={() => navigate("/comparateur/wizard")}
                                    rightIcon={<ArrowRight size={17} />}
                                >
                                    Commencer ma comparaison
                                </Button>

                                <Button
                                    variant="ghost"
                                    onClick={() => navigate("/comparateur/assistant")}
                                >
                                    <Bot size={16} />
                                    Tester l'IA
                                </Button>
                            </div>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2 mt-6">
                                {REASSURANCES.map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-center gap-1.5 text-xs text-slate-400"
                                    >
                                        <Check size={13} className="text-emerald-500" />
                                        {item}
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-7 mt-9">
                                {STATS.map((item, index) => (
                                    <Stat key={item.label} item={item} index={index} />
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: 30 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.15 }}
                        >
                            <HeroIllustration />
                        </motion.div>
                    </section>

                    <section className="py-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-10"
                        >
                            <div className="inline-flex items-center gap-2 text-xs font-bold text-violet-600 dark:text-violet-400 mb-3">
                                <span className="w-8 h-px bg-violet-300" />
                                COMMENT ÇA MARCHE ?
                                <span className="w-8 h-px bg-violet-300" />
                            </div>

                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                                Choisis ta façon de comparer
                            </h2>

                            <p className="max-w-xl mx-auto mt-3 text-slate-500 dark:text-slate-400">
                                Trois méthodes simples selon la manière dont tu
                                souhaites trouver ta mutuelle.
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-5">
                            {METHODES.map((methode, index) => (
                                <MethodeCard
                                    key={methode.id}
                                    methode={methode}
                                    index={index}
                                    onClick={() => navigate(methode.route)}
                                />
                            ))}
                        </div>
                    </section>

                    <section className="py-16">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-violet-600 via-indigo-600 to-indigo-700 p-8 sm:p-12"
                        >
                            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
                            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-purple-300/10 blur-3xl" />

                            <div className="relative grid md:grid-cols-2 gap-10 items-center">
                                <div className="text-white">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-semibold">
                                        <Sparkles size={13} />
                                        Intelligence artificielle
                                    </div>

                                    <h2 className="mt-5 text-3xl sm:text-4xl font-bold leading-tight">
                                        Et si tu laissais l'IA chercher pour toi ?
                                    </h2>

                                    <p className="mt-4 text-sm sm:text-base text-violet-100 leading-relaxed">
                                        Décris simplement ta situation et ce que
                                        tu recherches. L'assistant t'aide à
                                        identifier les offres pertinentes.
                                    </p>

                                    <button
                                        onClick={() => navigate("/comparateur/assistant")}
                                        className="mt-7 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-violet-700 font-semibold text-sm hover:bg-violet-50 transition-colors"
                                    >
                                        Parler à l'assistant
                                        <ArrowRight size={16} />
                                    </button>
                                </div>

                                <div className="relative">
                                    <motion.div
                                        animate={{ y: [0, -8, 0] }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                        className="max-w-[360px] mx-auto rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-4"
                                    >
                                        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                                <Bot size={20} className="text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white">
                                                    Assistant Comparateur
                                                </p>
                                                <div className="flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                                                    <span className="text-[10px] text-violet-100">
                                                        En ligne
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-4">
                                            <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-white/20 px-3 py-2 text-xs text-white">
                                                Je cherche une mutuelle familiale
                                                avec une bonne couverture dentaire.
                                            </div>
                                            <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-3 py-3 text-xs text-slate-700">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Sparkles size={13} className="text-violet-600" />
                                                    <span className="font-semibold">
                                                        Je peux t'aider !
                                                    </span>
                                                </div>
                                                Je vais rechercher les offres
                                                correspondant à tes priorités.
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </section>

                    <section className="py-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <div className="inline-flex items-center gap-2 text-xs font-bold text-violet-600 dark:text-violet-400 mb-3">
                                <span className="w-8 h-px bg-violet-300" />
                                POURQUOI NOUS ?
                                <span className="w-8 h-px bg-violet-300" />
                            </div>

                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                                Une comparaison pensée pour toi
                            </h2>
                        </motion.div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {FEATURES.map((feature, index) => (
                                <FeatureCard
                                    key={feature.title}
                                    feature={feature}
                                    index={index}
                                />
                            ))}
                        </div>
                    </section>

                    <section className="py-20">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.97 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative text-center overflow-hidden rounded-[32px] border border-violet-100 dark:border-violet-500/20 bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-violet-950/30 dark:via-slate-900 dark:to-indigo-950/30 p-10 sm:p-14"
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-40 bg-violet-300/20 blur-3xl rounded-full" />

                            <div className="relative">
                                <motion.div
                                    animate={{ rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 5, repeat: Infinity }}
                                    className="mx-auto w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center"
                                >
                                    <Search size={25} className="text-violet-600" />
                                </motion.div>

                                <h2 className="mt-6 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                                    Prêt à trouver ta mutuelle ?
                                </h2>

                                <p className="max-w-lg mx-auto mt-3 text-slate-500 dark:text-slate-400">
                                    Commence ta comparaison gratuitement et
                                    découvre les offres qui correspondent à tes
                                    besoins.
                                </p>

                                <Button
                                    onClick={() => navigate("/comparateur/wizard")}
                                    rightIcon={<ArrowRight size={17} />}
                                    className="mt-7"
                                >
                                    Commencer maintenant
                                </Button>

                                <div className="flex justify-center items-center gap-1 mt-5">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star
                                            key={i}
                                            size={13}
                                            className="text-amber-400"
                                            fill="currentColor"
                                        />
                                    ))}
                                    <span className="text-xs text-slate-400 ml-2">
                                        Une expérience simple et personnalisée
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </section>

                    <div className="pb-10 flex flex-wrap justify-center gap-x-8 gap-y-3">
                        {[
                            { icon: Shield, text: "Données sécurisées" },
                            { icon: Zap, text: "Réponse rapide" },
                            { icon: HeartPulse, text: "Pensé pour tes besoins" },
                        ].map((item) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={item.text}
                                    className="flex items-center gap-2 text-xs text-slate-400"
                                >
                                    <Icon size={14} className="text-violet-500" />
                                    {item.text}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}