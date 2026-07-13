import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import PageHeader from "../../components/ui/PageHeader";
import PageTransition from "../../components/ui/PageTransition";
import Skeleton from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";
import comparateurApi from "../../api/comparateurApi";
import { /*Wallet, Shield,*/ Layers } from "lucide-react";

const SUGGESTIONS = [
    "Mutuelle famille, budget 80€/mois",
    "Bon remboursement dentaire et optique",
    "Formule Premium pour senior",
];
const NIVEAU_STYLES = {
    Eco: { bg: "rgba(100,116,139,0.1)", color: "#64748b" },
    Standard: { bg: "rgba(124,58,237,0.1)", color: "#7c3aed" },
    Premium: { bg: "rgba(217,119,6,0.1)", color: "#d97706" },
};

function Bubble({ role, contenu, index }) {
    const isUser = role === "user";
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.03 }}
            className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
        >
            <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                style={{
                    background: isUser
                        ? "#f1f5f9"
                        : "linear-gradient(135deg,#7c3aed,#4f46e5)",
                }}
            >
                {isUser ? (
                    <User size={14} className="text-slate-500" />
                ) : (
                    <Bot size={14} className="text-white" />
                )}
            </div>
            <div
                className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isUser
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
function TypingBubble() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
        >
            <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}
            >
                <Bot size={14} className="text-white" />
            </div>
            <div
                className="px-4 py-3 rounded-2xl flex items-center gap-1"
                style={{ background: "linear-gradient(135deg,#7c3aed12,#4f46e512)" }}
            >
                {[0, 1, 2].map((i) => (
                    <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "#7c3aed" }}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                    />
                ))}
            </div>
        </motion.div>
    );
}

function OffreMiniCard({ offre, index }) {
    const niveauStyle = NIVEAU_STYLES[offre.niveauLabel] || NIVEAU_STYLES.Standard;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.06 }}
        >
            <Card className="p-4 sm:p-5">
                {/* HEADER */}
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-white truncate">
                            {offre.nom}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {offre.mutuelleNom}
                        </p>
                    </div>
                    <div
                        className="text-lg font-bold shrink-0"
                        style={{
                            color:
                                offre.scoreTotal >= 75
                                    ? "#059669"
                                    : offre.scoreTotal >= 50
                                        ? "#d97706"
                                        : "#dc2626",
                        }}
                    >
                        {offre.scoreTotal}
                    </div>
                </div>

                {/* PRIX + NIVEAU */}
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span className="flex items-center gap-1 text-sm font-semibold text-slate-900 dark:text-white">
                        <Wallet size={13} className="text-slate-400" />
                        {offre.prixMensuel}€
                        <span className="text-xs font-normal text-slate-400">/mois</span>
                    </span>

                    <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium"
                        style={{ background: niveauStyle.bg, color: niveauStyle.color }}
                    >
                        <Layers size={11} />
                        {offre.niveauLabel}
                    </span>
                </div>

                {/* GARANTIES */}
                {offre.garanties?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        {offre.garanties.map((g) => (
                            <span
                                key={g.garantieId}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium"
                                style={{
                                    background: g.matchCritere
                                        ? "rgba(124,58,237,0.08)"
                                        : "rgba(148,163,184,0.1)",
                                    color: g.matchCritere ? "#7c3aed" : "#64748b",
                                }}
                            >
                                <Shield size={10} />
                                {g.nom}
                                {g.tauxRemboursement ? ` ${g.tauxRemboursement}%` : ""}
                            </span>
                        ))}
                    </div>
                )}
            </Card>
        </motion.div>
    );
}

export default function AssistantChatPage() {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            contenu:
                "Bonjour ! Décris-moi ce que tu cherches (budget, niveau de couverture, garanties importantes) et je te trouve les meilleures offres.",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [offres, setOffres] = useState([]);
    const [criteresComplets, setCriteresComplets] = useState(false);
    const [derniersCriteres, setDerniersCriteres] = useState(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const envoyerMessage = async (texte) => {
        if (!texte.trim() || loading) return;
        const userMsg = { role: "user", contenu: texte };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const historique = messages.map((m) => ({ role: m.role, contenu: m.contenu }));
            const data = await comparateurApi.assistantChat(userMsg.contenu, historique);
            setMessages((prev) => [...prev, { role: "assistant", contenu: data.reponseAssistant }]);
            setOffres(data.offresCorrespondantes || []);
            setCriteresComplets(data.criteresComplets);
            setDerniersCriteres(data.criteresExtraits);
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", contenu: "Désolé, une erreur est survenue. Réessaie dans un instant." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const aDesCriteresPartiels = () => {
        if (!derniersCriteres) return false;
        return (
            derniersCriteres.budgetMax != null ||
            derniersCriteres.niveauSouhaite != null ||
            (derniersCriteres.typesGarantie && derniersCriteres.typesGarantie.length > 0)
        );
    };

    const chercherQuandMeme = async () => {
        if (!derniersCriteres) return;
        setLoading(true);
        try {
            const data = await comparateurApi.rechercherPartiel(derniersCriteres);
            setOffres(data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageTransition>
            <div className="max-w-2xl mx-auto px-4 py-10">
                <PageHeader
                    title="Assistant de recherche"
                    description="Discute avec l'IA pour trouver ta mutuelle idéale, sans remplir de formulaire."
                    action={
                        <div
                            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-medium"
                            style={{
                                background: "linear-gradient(135deg,#7c3aed10,#4f46e510)",
                                color: "#7c3aed",
                            }}
                        >
                            <Sparkles size={14} />
                            Propulsé par l'IA
                        </div>
                    }
                />

                {/* FENETRE DE CHAT */}
                <Card className="p-0 overflow-hidden">
                    <div
                        className="px-5 py-4 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800"
                        style={{ background: "linear-gradient(135deg,#7c3aed06,#4f46e506)" }}
                    >
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}
                        >
                            <MessageCircle size={16} className="text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                Assistant Comparateur
                            </p>
                            <p className="text-xs text-slate-400">En ligne · Réponse instantanée</p>
                        </div>
                    </div>

                    <div className="p-5 h-[380px] overflow-y-auto space-y-4">
                        {messages.map((m, i) => (
                            <Bubble key={i} role={m.role} contenu={m.contenu} index={i} />
                        ))}
                        <AnimatePresence>{loading && <TypingBubble />}</AnimatePresence>
                        <div ref={scrollRef} />
                    </div>

                    {/* SUGGESTIONS RAPIDES — affichées seulement au tout début */}
                    {messages.length === 1 && (
                        <div className="px-5 pb-4 flex flex-wrap gap-2">
                            {SUGGESTIONS.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => envoyerMessage(s)}
                                    className="text-xs px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-violet-300 hover:text-violet-600 transition-colors"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && envoyerMessage(input)}
                            placeholder="Écris ta demande..."
                            disabled={loading}
                            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 hover:border-violet-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-500/20 outline-none transition-all duration-300"
                        />
                        <button
                            onClick={() => envoyerMessage(input)}
                            disabled={loading || !input.trim()}
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 shrink-0"
                            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}
                        >
                            <Send size={17} />
                        </button>
                    </div>
                </Card>

                {/* LIEN "voir quand meme" */}
                {!criteresComplets && aDesCriteresPartiels() && !loading && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={chercherQuandMeme}
                        className="flex items-center gap-1.5 text-sm font-medium mt-4 mx-auto"
                        style={{ color: "#7c3aed" }}
                    >
                        Voir les résultats avec les infos actuelles
                        <ArrowRight size={14} />
                    </motion.button>
                )}

                {/* RESULTATS */}
                <AnimatePresence>
                    {offres.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Sparkles size={16} className="text-violet-500" />
                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                        Offres correspondantes
                                    </h3>
                                </div>
                                <Badge variant="primary">{offres.length} résultats</Badge>
                            </div>

                            <div className="grid gap-3">
                                {offres.map((o, i) => (
                                    <OffreMiniCard key={o.id} offre={o} index={i} />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {offres.length === 0 && criteresComplets && !loading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
                            <Card className="p-0">
                                <EmptyState
                                    title="Aucune offre trouvée"
                                    description="Essaie d'élargir ton budget ou tes critères de recherche."
                                />
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </PageTransition>
    );
}