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
        badge: "IA",
    },
];

const REASSURANCES = [
    { icon: ShieldCheck, texte: "100% gratuit, sans engagement" },
    { icon: Zap, texte: "Résultats en quelques secondes" },
    { icon: Sparkles, texte: "Recommandations personnalisées" },
];

function MethodeCard({ methode, index, onClick }) {
    const Icon = methode.icon;
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.08 }}
        >
            <Card
                onClick={onClick}
                className="p-6 h-full flex flex-col group"
            >
                <div className="flex items-start justify-between">
                    <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ background: `${methode.accent}15` }}
                    >
                        <Icon size={22} style={{ color: methode.accent }} />
                    </div>
                    {methode.badge && <Badge variant="primary">{methode.badge}</Badge>}
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-white mt-4 text-lg">
                    {methode.titre}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 flex-1">
                    {methode.description}
                </p>

                <div className="flex items-center justify-between mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-medium text-slate-400">
                        {methode.duree}
                    </span>
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

export default function ComparateurLandingPage() {
    const navigate = useNavigate();

    return (
        <PageTransition>
            <div className="max-w-5xl mx-auto px-4 py-14">
                {/* HERO */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-medium mb-5"
                        style={{
                            background: "linear-gradient(135deg,#7c3aed10,#4f46e510)",
                            color: "#7c3aed",
                        }}
                    >
                        <Sparkles size={14} />
                        Comparateur intelligent
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
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

                    <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-xl mx-auto">
                        Trois façons simples de comparer les meilleures offres de mutuelle
                        santé, adaptées à ton profil et à ton budget.
                    </p>
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
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap justify-center gap-6 mt-12 pt-8 border-t border-slate-100 dark:border-slate-800"
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

                {/* CTA SECONDAIRE — voir les offres directement */}
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
        </PageTransition>
    );
}