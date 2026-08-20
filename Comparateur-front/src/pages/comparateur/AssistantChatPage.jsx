import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Send,
    Sparkles,
    Bot,
    User,
    Wallet,
    Shield,
    ArrowRight,
    MessageCircle,
    Layers,
    Check,
    Crown,
    Medal,
    Award,
    TrendingDown,
    TrendingUp,
    BarChart3,
    Search,
    RotateCcw,
    AlertCircle,
    CheckCircle2,
    Zap,
    SlidersHorizontal,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import PageHeader from "../../components/ui/PageHeader";
import PageTransition from "../../components/ui/PageTransition";
import comparateurApi from "../../api/comparateurApi";

/* =========================================================
   CONSTANTES
========================================================= */

const SUGGESTIONS = [
    {
        label: "Famille · 80€/mois",
        text: "Je cherche une mutuelle famille avec un budget de 80€/mois",
        icon: User,
    },
    {
        label: "Dentaire & optique",
        text: "Je veux un bon remboursement dentaire et optique",
        icon: Shield,
    },
    {
        label: "Formule Premium",
        text: "Je cherche une formule Premium adaptée à un senior",
        icon: Crown,
    },
];

const NIVEAU_STYLES = {
    Eco: {
        bg: "rgba(100,116,139,0.1)",
        color: "#64748b",
    },
    Standard: {
        bg: "rgba(124,58,237,0.1)",
        color: "#7c3aed",
    },
    Premium: {
        bg: "rgba(217,119,6,0.1)",
        color: "#d97706",
    },
};

/* =========================================================
   HELPERS
========================================================= */

function getScoreColor(score) {
    if (score >= 80) return "#059669";
    if (score >= 60) return "#d97706";
    return "#dc2626";
}

function getScoreLabel(score) {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Très bon";
    if (score >= 50) return "Correct";
    return "Faible";
}

function formatPrice(value) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
        return "—";
    }

    return `${Number(value).toFixed(2)}€`;
}

/* =========================================================
   MESSAGE BUBBLE
========================================================= */

function Bubble({ role, contenu, index }) {
    const isUser = role === "user";

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 10,
                x: isUser ? 10 : -10,
            }}
            animate={{
                opacity: 1,
                y: 0,
                x: 0,
            }}
            transition={{
                duration: 0.25,
                delay: Math.min(index * 0.03, 0.15),
            }}
            className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""
                }`}
        >
            {/* AVATAR */}

            <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                style={{
                    background: isUser
                        ? "#f1f5f9"
                        : "linear-gradient(135deg,#7c3aed,#4f46e5)",
                }}
            >
                {isUser ? (
                    <User
                        size={15}
                        className="text-slate-500"
                    />
                ) : (
                    <Bot
                        size={15}
                        className="text-white"
                    />
                )}
            </div>

            {/* MESSAGE */}

            <div
                className={`max-w-[82%] sm:max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${isUser
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                        : "bg-violet-50 dark:bg-violet-500/15 text-slate-900 dark:text-white"
                    }`}
                style={{
                    borderTopRightRadius: isUser ? "6px" : "1rem",
                    borderTopLeftRadius: isUser ? "1rem" : "6px",
                }}
            >
                {contenu}
            </div>
        </motion.div>
    );
}

/* =========================================================
   TYPING
========================================================= */

function TypingBubble() {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 10,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            className="flex gap-3"
        >
            <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{
                    background:
                        "linear-gradient(135deg,#7c3aed,#4f46e5)",
                }}
            >
                <Bot
                    size={15}
                    className="text-white"
                />
            </div>

            <div
                className="px-4 py-3 rounded-2xl flex items-center gap-1.5"
                style={{
                    background:
                        "linear-gradient(135deg,#7c3aed12,#4f46e512)",
                }}
            >
                {[0, 1, 2].map((i) => (
                    <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                            background: "#7c3aed",
                        }}
                        animate={{
                            opacity: [0.3, 1, 0.3],
                            y: [0, -2, 0],
                        }}
                        transition={{
                            duration: 1.1,
                            repeat: Infinity,
                            delay: i * 0.15,
                        }}
                    />
                ))}
            </div>
        </motion.div>
    );
}

/* =========================================================
   CRITERES
========================================================= */

function CriteresPanel({ criteres }) {
    if (!criteres) return null;

    const items = [];

    if (criteres.budgetMax != null) {
        items.push({
            label: "Budget max",
            value: `${criteres.budgetMax}€/mois`,
            icon: Wallet,
        });
    }

    if (criteres.niveauSouhaite) {
        items.push({
            label: "Niveau",
            value: criteres.niveauSouhaite,
            icon: Layers,
        });
    }

    if (
        Array.isArray(criteres.typesGarantie) &&
        criteres.typesGarantie.length > 0
    ) {
        items.push({
            label: "Garanties",
            value: criteres.typesGarantie.join(", "),
            icon: Shield,
        });
    }

    if (items.length === 0) return null;

    return (
        <motion.div
            initial={{
                opacity: 0,
                height: 0,
            }}
            animate={{
                opacity: 1,
                height: "auto",
            }}
            className="mt-4"
        >
            <div className="flex items-center gap-2 mb-2">
                <SlidersHorizontal
                    size={14}
                    className="text-violet-500"
                />

                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Critères détectés
                </span>
            </div>

            <div className="flex flex-wrap gap-2">
                {items.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.label}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-50 dark:bg-violet-500/10 text-xs"
                        >
                            <Icon
                                size={12}
                                className="text-violet-500"
                            />

                            <span className="text-slate-400">
                                {item.label} :
                            </span>

                            <span className="font-semibold text-violet-700 dark:text-violet-300">
                                {item.value}
                            </span>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}

/* =========================================================
   OFFER MINI CARD
========================================================= */

function OffreMiniCard({ offre, index, isBest = false }) {
    const niveauStyle =
        NIVEAU_STYLES[offre.niveauLabel] ||
        NIVEAU_STYLES.Standard;

    const score = Number(offre.scoreTotal) || 0;

    const RankIcon =
        index === 0
            ? Crown
            : index === 1
                ? Medal
                : index === 2
                    ? Award
                    : null;

    return (
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
                duration: 0.35,
                delay: index * 0.07,
            }}
        >
            <Card
                className={`p-0 overflow-hidden transition-all duration-300 ${isBest
                        ? "ring-1 ring-violet-200 shadow-lg"
                        : "hover:shadow-md"
                    }`}
            >
                {/* BEST HEADER */}

                {isBest && (
                    <div
                        className="px-4 py-2.5 flex items-center gap-2"
                        style={{
                            background:
                                "linear-gradient(90deg,#f5f3ff,#faf5ff)",
                        }}
                    >
                        <Crown
                            size={14}
                            className="text-amber-500"
                        />

                        <span className="text-[11px] font-bold uppercase tracking-wider text-violet-700">
                            Meilleure correspondance
                        </span>
                    </div>
                )}

                <div className="p-5">
                    {/* HEADER */}

                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                            <div
                                className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                                style={{
                                    background: isBest
                                        ? "linear-gradient(135deg,#fef3c7,#fde68a)"
                                        : "#f1f5f9",
                                }}
                            >
                                {RankIcon ? (
                                    <RankIcon
                                        size={19}
                                        className={
                                            index === 0
                                                ? "text-amber-500"
                                                : index === 1
                                                    ? "text-slate-400"
                                                    : "text-orange-500"
                                        }
                                    />
                                ) : (
                                    <Shield
                                        size={18}
                                        className="text-slate-400"
                                    />
                                )}
                            </div>

                            <div className="min-w-0">
                                <p className="font-semibold text-slate-900 dark:text-white truncate">
                                    {offre.nom}
                                </p>

                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                    {offre.mutuelleNom ||
                                        "Mutuelle"}
                                </p>
                            </div>
                        </div>

                        {/* SCORE */}

                        <div className="text-right shrink-0">
                            <div
                                className="text-2xl font-bold"
                                style={{
                                    color: getScoreColor(
                                        score
                                    ),
                                }}
                            >
                                {score}
                            </div>

                            <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                                /100
                            </p>
                        </div>
                    </div>

                    {/* SCORE LABEL */}

                    <div className="flex items-center gap-2 mt-3">
                        <span
                            className="text-xs font-semibold"
                            style={{
                                color: getScoreColor(score),
                            }}
                        >
                            {getScoreLabel(score)}
                        </span>

                        <div className="h-1 flex-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{
                                    width: `${Math.min(
                                        score,
                                        100
                                    )}%`,
                                }}
                                transition={{
                                    duration: 0.7,
                                    delay: index * 0.07,
                                }}
                                className="h-full rounded-full"
                                style={{
                                    background:
                                        getScoreColor(
                                            score
                                        ),
                                }}
                            />
                        </div>
                    </div>

                    {/* PRICE */}

                    <div className="flex items-center gap-2 mt-4 flex-wrap">
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white">
                            <Wallet
                                size={13}
                                className="text-slate-400"
                            />

                            {formatPrice(
                                offre.prixMensuel
                            )}

                            <span className="text-xs font-normal text-slate-400">
                                /mois
                            </span>
                        </span>

                        <span
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium"
                            style={{
                                background:
                                    niveauStyle.bg,
                                color: niveauStyle.color,
                            }}
                        >
                            <Layers size={11} />
                            {offre.niveauLabel ||
                                "Standard"}
                        </span>
                    </div>

                    {/* GUARANTEES */}

                    {offre.garanties?.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 mb-2.5">
                                <Shield
                                    size={13}
                                    className="text-violet-500"
                                />

                                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                    Garanties
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                                {offre.garanties
                                    .slice(0, 6)
                                    .map((g, i) => (
                                        <span
                                            key={
                                                g.garantieId ??
                                                i
                                            }
                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium"
                                            style={{
                                                background:
                                                    g.matchCritere
                                                        ? "rgba(124,58,237,0.08)"
                                                        : "rgba(148,163,184,0.1)",
                                                color: g.matchCritere
                                                    ? "#7c3aed"
                                                    : "#64748b",
                                            }}
                                        >
                                            {g.matchCritere ? (
                                                <Check
                                                    size={10}
                                                />
                                            ) : (
                                                <Shield
                                                    size={10}
                                                />
                                            )}

                                            {g.nom ||
                                                "Garantie"}

                                            {g.tauxRemboursement
                                                ? ` ${g.tauxRemboursement}%`
                                                : ""}
                                        </span>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* CTA */}

                    <button
                        type="button"
                        className="w-full mt-5 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-violet-50 dark:hover:bg-violet-500/10"
                        style={{
                            color: "#7c3aed",
                        }}
                    >
                        Voir le détail
                        <ArrowRight size={14} />
                    </button>
                </div>
            </Card>
        </motion.div>
    );
}

/* =========================================================
   RESULT SUMMARY
========================================================= */

function ResultsSummary({ offres, criteres }) {
    if (!offres?.length) return null;

    const best = offres[0];

    const prix = Number(best?.prixMensuel);

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
        >
            <Card className="overflow-hidden">
                <div
                    className="p-5 sm:p-6"
                    style={{
                        background:
                            "linear-gradient(135deg,rgba(124,58,237,0.06),rgba(79,70,229,0.03))",
                    }}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles
                            size={15}
                            className="text-violet-500"
                        />

                        <span className="text-xs font-bold uppercase tracking-wider text-violet-600">
                            Recommandation IA
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                {best.nom}
                            </h3>

                            <p className="text-sm text-slate-500 mt-1">
                                {best.mutuelleNom ||
                                    "Mutuelle"}{" "}
                                ·{" "}
                                {best.niveauLabel ||
                                    "Standard"}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-3">
                                <Badge variant="success">
                                    Score {best.scoreTotal}/100
                                </Badge>

                                <span className="text-xs font-medium text-slate-500">
                                    Meilleure correspondance
                                </span>
                            </div>
                        </div>

                        <div className="sm:text-right">
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {formatPrice(prix)}
                            </p>

                            <p className="text-xs text-slate-400">
                                / mois
                            </p>
                        </div>
                    </div>
                </div>

                {criteres && (
                    <div className="px-5 sm:px-6 py-4 border-t border-slate-100 dark:border-slate-800">
                        <CriteresPanel
                            criteres={criteres}
                        />
                    </div>
                )}
            </Card>
        </motion.div>
    );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function AssistantChatPage() {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            contenu:
                "Bonjour ! 👋 Décris-moi ce que tu recherches : ton budget, le niveau de couverture souhaité et les garanties importantes pour toi. Je vais analyser les offres et te proposer les plus adaptées.",
        },
    ]);

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [offres, setOffres] = useState([]);
    const [criteresComplets, setCriteresComplets] =
        useState(false);
    const [derniersCriteres, setDerniersCriteres] =
        useState(null);
    const [erreur, setErreur] = useState(null);

    const scrollRef = useRef(null);
    const textareaRef = useRef(null);

    /* =====================================================
       AUTO SCROLL
    ===================================================== */

    useEffect(() => {
        scrollRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, loading]);

    /* =====================================================
       AUTO RESIZE
    ===================================================== */

    useEffect(() => {
        const textarea = textareaRef.current;

        if (!textarea) return;

        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(
            textarea.scrollHeight,
            120
        )}px`;
    }, [input]);

    /* =====================================================
       SEND
    ===================================================== */

    const envoyerMessage = async (texte) => {
        const message = texte.trim();

        if (!message || loading) return;

        const userMsg = {
            role: "user",
            contenu: message,
        };

        setMessages((prev) => [
            ...prev,
            userMsg,
        ]);

        setInput("");
        setErreur(null);
        setLoading(true);

        try {
            const historique = messages.map((m) => ({
                role: m.role,
                contenu: m.contenu,
            }));

            const data =
                await comparateurApi.assistantChat(
                    userMsg.contenu,
                    historique
                );

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    contenu:
                        data?.reponseAssistant ||
                        "Je n'ai pas pu générer une réponse.",
                },
            ]);

            setOffres(
                Array.isArray(
                    data?.offresCorrespondantes
                )
                    ? data.offresCorrespondantes
                    : []
            );

            setCriteresComplets(
                Boolean(data?.criteresComplets)
            );

            setDerniersCriteres(
                data?.criteresExtraits || null
            );
        } catch (err) {
            console.error(err);

            setErreur(
                "Impossible de contacter l'assistant pour le moment."
            );

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    contenu:
                        "Désolé, une erreur est survenue. Vérifie ta connexion puis réessaie.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       PARTIAL SEARCH
    ===================================================== */

    const aDesCriteresPartiels = useMemo(() => {
        if (!derniersCriteres) return false;

        return (
            derniersCriteres.budgetMax != null ||
            derniersCriteres.niveauSouhaite != null ||
            (Array.isArray(
                derniersCriteres.typesGarantie
            ) &&
                derniersCriteres.typesGarantie.length >
                0)
        );
    }, [derniersCriteres]);

    const chercherQuandMeme = async () => {
        if (!derniersCriteres || loading) return;

        setLoading(true);
        setErreur(null);

        try {
            const data =
                await comparateurApi.rechercherPartiel(
                    derniersCriteres
                );

            setOffres(
                Array.isArray(data) ? data : []
            );
        } catch (err) {
            console.error(err);

            setErreur(
                "Impossible de rechercher les offres avec ces critères."
            );
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       RESET
    ===================================================== */

    const recommencer = () => {
        setMessages([
            {
                role: "assistant",
                contenu:
                    "Bonjour ! 👋 Décris-moi ce que tu recherches : ton budget, le niveau de couverture souhaité et les garanties importantes pour toi. Je vais analyser les offres et te proposer les plus adaptées.",
            },
        ]);

        setInput("");
        setLoading(false);
        setOffres([]);
        setCriteresComplets(false);
        setDerniersCriteres(null);
        setErreur(null);
    };

    /* =====================================================
       KEYBOARD
    ===================================================== */

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            envoyerMessage(input);
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <PageTransition>
            <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10">
                {/* =================================================
                    HEADER
                ================================================= */}

                <PageHeader
                    title="Assistant de recherche"
                    description="Décris simplement tes besoins et laisse l'IA trouver les offres les plus adaptées."
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

                {/* =================================================
                    CHAT
                ================================================= */}

                <Card className="p-0 overflow-hidden shadow-sm">
                    {/* CHAT HEADER */}

                    <div
                        className="px-5 py-4 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800"
                        style={{
                            background:
                                "linear-gradient(135deg,#7c3aed06,#4f46e506)",
                        }}
                    >
                        <div className="relative">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{
                                    background:
                                        "linear-gradient(135deg,#7c3aed,#4f46e5)",
                                }}
                            >
                                <MessageCircle
                                    size={17}
                                    className="text-white"
                                />
                            </div>

                            <span className="absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                        </div>

                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                Assistant Comparateur
                            </p>

                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-xs text-emerald-600 font-medium">
                                    En ligne
                                </span>

                                <span className="text-slate-300">
                                    ·
                                </span>

                                <span className="text-xs text-slate-400">
                                    Assistant intelligent
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={recommencer}
                            className="ml-auto w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                            title="Nouvelle recherche"
                        >
                            <RotateCcw size={15} />
                        </button>
                    </div>

                    {/* MESSAGES */}

                    <div className="p-5 sm:p-6 h-[430px] overflow-y-auto space-y-4 bg-white dark:bg-slate-950">
                        {messages.map((m, i) => (
                            <Bubble
                                key={i}
                                role={m.role}
                                contenu={m.contenu}
                                index={i}
                            />
                        ))}

                        <AnimatePresence>
                            {loading && (
                                <TypingBubble />
                            )}
                        </AnimatePresence>

                        <div ref={scrollRef} />
                    </div>

                    {/* SUGGESTIONS */}

                    {messages.length === 1 &&
                        !loading && (
                            <div className="px-5 sm:px-6 pb-4">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                                    Suggestions
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    {SUGGESTIONS.map(
                                        (suggestion) => {
                                            const Icon =
                                                suggestion.icon;

                                            return (
                                                <button
                                                    key={
                                                        suggestion.label
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        envoyerMessage(
                                                            suggestion.text
                                                        )
                                                    }
                                                    className="flex items-center gap-2 text-left p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-violet-300 hover:bg-violet-50/50 dark:hover:bg-violet-500/10 transition-all group"
                                                >
                                                    <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-violet-100 flex items-center justify-center shrink-0">
                                                        <Icon
                                                            size={
                                                                13
                                                            }
                                                            className="text-slate-500 group-hover:text-violet-600"
                                                        />
                                                    </div>

                                                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                                        {
                                                            suggestion.label
                                                        }
                                                    </span>
                                                </button>
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                        )}

                    {/* ERROR */}

                    <AnimatePresence>
                        {erreur && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    height: 0,
                                }}
                                animate={{
                                    opacity: 1,
                                    height: "auto",
                                }}
                                exit={{
                                    opacity: 0,
                                    height: 0,
                                }}
                                className="px-5"
                            >
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 text-xs">
                                    <AlertCircle
                                        size={14}
                                    />

                                    <span>
                                        {erreur}
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* INPUT */}

                    <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
                        <div className="flex items-end gap-2">
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) =>
                                    setInput(
                                        e.target.value
                                    )
                                }
                                onKeyDown={
                                    handleKeyDown
                                }
                                placeholder="Ex. Je cherche une mutuelle à moins de 70€ avec une bonne couverture dentaire..."
                                disabled={loading}
                                rows={1}
                                className="flex-1 resize-none px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 hover:border-violet-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-500/20 outline-none transition-all duration-300 max-h-[120px]"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    envoyerMessage(
                                        input
                                    )
                                }
                                disabled={
                                    loading ||
                                    !input.trim()
                                }
                                className="w-12 h-12 rounded-xl flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 shrink-0"
                                style={{
                                    background:
                                        "linear-gradient(135deg,#7c3aed,#4f46e5)",
                                }}
                                title="Envoyer"
                            >
                                {loading ? (
                                    <motion.div
                                        animate={{
                                            rotate: 360,
                                        }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                    >
                                        <Sparkles
                                            size={17}
                                        />
                                    </motion.div>
                                ) : (
                                    <Send size={17} />
                                )}
                            </button>
                        </div>

                        <p className="text-[10px] text-slate-400 mt-2 px-1">
                            Entrée pour envoyer ·
                            Maj + Entrée pour une
                            nouvelle ligne
                        </p>
                    </div>
                </Card>

                {/* =================================================
                    PARTIAL SEARCH
                ================================================= */}

                {!criteresComplets &&
                    aDesCriteresPartiels &&
                    !loading && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: -5,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            className="mt-4"
                        >
                            <button
                                type="button"
                                onClick={
                                    chercherQuandMeme
                                }
                                className="w-full p-4 rounded-2xl border border-violet-100 bg-violet-50/50 flex items-center gap-3 text-left hover:bg-violet-50 transition-colors"
                            >
                                <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                                    <Search
                                        size={15}
                                        className="text-violet-600"
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-violet-800">
                                        Rechercher avec les
                                        critères actuels
                                    </p>

                                    <p className="text-xs text-violet-600/70 mt-0.5">
                                        Je peux déjà te
                                        proposer des offres
                                        même si tous les
                                        critères ne sont pas
                                        renseignés.
                                    </p>
                                </div>

                                <ArrowRight
                                    size={16}
                                    className="text-violet-500 shrink-0"
                                />
                            </button>
                        </motion.div>
                    )}

                {/* =================================================
                    RESULTS
                ================================================= */}

                <AnimatePresence>
                    {offres.length > 0 && (
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
                                duration: 0.4,
                            }}
                            className="mt-8 space-y-5"
                        >
                            {/* SUMMARY */}

                            <ResultsSummary
                                offres={offres}
                                criteres={
                                    derniersCriteres
                                }
                            />

                            {/* RESULTS HEADER */}

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Sparkles
                                            size={16}
                                            className="text-violet-500"
                                        />

                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                                            Offres
                                            correspondantes
                                        </h3>
                                    </div>

                                    <p className="text-xs text-slate-400 mt-1">
                                        Classées selon leur
                                        correspondance avec
                                        tes critères.
                                    </p>
                                </div>

                                <Badge variant="primary">
                                    {offres.length}{" "}
                                    résultats
                                </Badge>
                            </div>

                            {/* OFFER LIST */}

                            <div className="grid gap-4">
                                {offres.map(
                                    (offre, i) => (
                                        <OffreMiniCard
                                            key={
                                                offre.id ??
                                                `offre-${i}`
                                            }
                                            offre={offre}
                                            index={i}
                                            isBest={
                                                i === 0
                                            }
                                        />
                                    )
                                )}
                            </div>

                            {/* DISCLAIMER */}

                            <div className="flex items-start gap-2 text-[11px] text-slate-400 px-1 pt-1">
                                <BarChart3
                                    size={13}
                                    className="shrink-0 mt-0.5"
                                />

                                <p>
                                    Les résultats sont
                                    classés selon les
                                    critères détectés
                                    par l'assistant. Ils
                                    peuvent évoluer selon
                                    les informations
                                    fournies.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* NO RESULTS */}

                    {offres.length === 0 &&
                        criteresComplets &&
                        !loading && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                }}
                                animate={{
                                    opacity: 1,
                                }}
                                className="mt-8"
                            >
                                <Card className="p-0">
                                    <div className="p-2">
                                        <div className="flex flex-col items-center text-center p-7">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                                                <Search
                                                    size={20}
                                                    className="text-slate-400"
                                                />
                                            </div>

                                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                                Aucune offre
                                                trouvée
                                            </h3>

                                            <p className="text-sm text-slate-400 mt-1 max-w-md">
                                                Essaie
                                                d'élargir ton
                                                budget ou
                                                d'assouplir
                                                certains
                                                critères.
                                            </p>

                                            <button
                                                type="button"
                                                onClick={
                                                    recommencer
                                                }
                                                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-700"
                                            >
                                                Nouvelle
                                                recherche
                                                <ArrowRight
                                                    size={
                                                        14
                                                    }
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        )}
                </AnimatePresence>

                {/* =================================================
                    BOTTOM CTA
                ================================================= */}

                {offres.length > 0 && (
                    <motion.div
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        className="flex justify-center pt-8 pb-5"
                    >
                        <button
                            type="button"
                            onClick={recommencer}
                            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-violet-600 transition-colors"
                        >
                            <RotateCcw size={14} />
                            Faire une nouvelle recherche
                        </button>
                    </motion.div>
                )}
            </div>
        </PageTransition>
    );
}