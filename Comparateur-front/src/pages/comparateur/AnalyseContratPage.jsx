import { useState, useRef, useMemo } from "react";
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

// Icônes de classement pour le top 3 des alternatives
const RANK_STYLES = [
    { icon: Crown, color: "#f59e0b", bg: "linear-gradient(135deg,#fef3c7,#fde68a)" },
    { icon: Medal, color: "#94a3b8", bg: "linear-gradient(135deg,#f1f5f9,#e2e8f0)" },
    { icon: Award, color: "#c2703d", bg: "linear-gradient(135deg,#fde8d8,#fbd5b5)" },
];

function ScoreMini({ label, value }) {
    return (
        <div className="flex-1 min-w-[90px]">
            <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    {label}
                </span>
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    {value}%
                </span>
            </div>
            <ProgressBar value={value} />
        </div>
    );
}

function OffreAlternativeCard({ offre, index, prixActuel }) {
    const rank = RANK_STYLES[index];
    const RankIcon = rank?.icon;
    const delta = prixActuel ? offre.prixMensuel - prixActuel : null;
    const economise = delta !== null && delta < 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.08 }}
        >
            <Card className="p-0 overflow-hidden">
                <div className="p-5 sm:p-6">
                    {/* HEADER : rang, logo, nom, score global */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                            {rank ? (
                                <div
                                    className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                                    style={{ background: rank.bg }}
                                >
                                    <RankIcon size={20} style={{ color: rank.color }} />
                                </div>
                            ) : (
                                <div
                                    className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                                    style={{ background: "#f1f5f9" }}
                                >
                                    <Building2 size={18} className="text-slate-400" />
                                </div>
                            )}
                            <div className="min-w-0">
                                <p className="font-semibold text-slate-900 dark:text-white truncate">
                                    {offre.nom}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                    {offre.mutuelleNom} · {offre.niveauLabel}
                                </p>
                            </div>
                        </div>

                        <div className="text-right shrink-0">
                            <div
                                className="text-2xl font-bold"
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
                            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                                score
                            </p>
                        </div>
                    </div>

                    {/* PRIX + comparaison */}
                    <div className="flex items-center gap-3 mt-4">
                        <div className="flex items-center gap-1.5">
                            <Euro size={14} className="text-slate-400" />
                            <span className="text-lg font-bold text-slate-900 dark:text-white">
                                {offre.prixMensuel}€
                            </span>
                            <span className="text-xs text-slate-400">/mois</span>
                        </div>

                        {delta !== null && Math.abs(delta) > 0.01 && (
                            <Badge variant={economise ? "success" : "danger"}>
                                <span className="flex items-center gap-1">
                                    {economise ? <TrendingDown size={11} /> : <TrendingUp size={11} />}
                                    {economise ? "-" : "+"}
                                    {Math.abs(delta).toFixed(2)}€/mois
                                </span>
                            </Badge>
                        )}
                    </div>

                    {/* SOUS-SCORES */}
                    <div className="flex gap-3 mt-5">
                        <ScoreMini label="Prix" value={offre.scorePrix} />
                        <ScoreMini label="Niveau" value={offre.scoreNiveau} />
                        <ScoreMini label="Garanties" value={offre.scoreGaranties} />
                    </div>

                    {/* GARANTIES */}
                    {offre.garanties?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
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
                </div>

                {/* FOOTER CTA */}
                <button
                    className="w-full flex items-center justify-center gap-1.5 py-3 text-sm font-medium transition-colors"
                    style={{
                        background: "linear-gradient(135deg,#7c3aed08,#4f46e508)",
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

export default function AnalyseContratPage() {
    const [fichier, setFichier] = useState(null);
    const [loading, setLoading] = useState(false);
    const [erreur, setErreur] = useState(null);
    const [resultat, setResultat] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);

    const validerEtDefinir = (f) => {
        if (!f) return;
        if (f.type !== "application/pdf") {
            setErreur("Seuls les fichiers PDF sont acceptés.");
            return;
        }
        setFichier(f);
        setErreur(null);
        setResultat(null);
    };

    const handleFileChange = (e) => validerEtDefinir(e.target.files?.[0]);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        validerEtDefinir(e.dataTransfer.files?.[0]);
    };

    const handleAnalyser = async () => {
        if (!fichier) return;
        setLoading(true);
        setErreur(null);
        try {
            const data = await comparateurApi.analyserContrat(fichier);
            setResultat(data);
        } catch (err) {
            setErreur(
                err.response?.data?.message || "Erreur lors de l'analyse du contrat."
            );
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setFichier(null);
        setResultat(null);
        setErreur(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    // Calculs dérivés pour le résumé (mémoïsés pour éviter de recalculer à chaque render)
    const stats = useMemo(() => {
        if (!resultat || resultat.meilleuresAlternatives.length === 0) return null;

        const prixActuel = resultat.contratActuel.prixMensuel;
        const alternatives = resultat.meilleuresAlternatives;

        const meilleureOffre = alternatives[0]; // déjà triée par ScoreTotal desc côté backend

        const economies = prixActuel
            ? alternatives
                .map((o) => prixActuel - o.prixMensuel)
                .filter((delta) => delta > 0)
            : [];
        const economieMax = economies.length > 0 ? Math.max(...economies) : null;

        const meilleurScore = Math.max(...alternatives.map((o) => o.scoreTotal));

        return { meilleureOffre, economieMax, meilleurScore };
    }, [resultat]);

    return (
        <PageTransition>
            <div className="max-w-4xl mx-auto px-4 py-10">
                <PageHeader
                    title="Analyser mon contrat actuel"
                    description="Upload ton contrat de mutuelle en PDF — notre IA extrait les garanties et t'indique de meilleures alternatives en quelques secondes."
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

                {/* ZONE D'UPLOAD */}
                <Card className="p-6 sm:p-8">
                    <AnimatePresence mode="wait">
                        {!fichier ? (
                            <motion.label
                                key="dropzone"
                                htmlFor="pdf-upload"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragActive(true);
                                }}
                                onDragLeave={() => setDragActive(false)}
                                onDrop={handleDrop}
                                className="flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-12 cursor-pointer transition-all duration-300"
                                style={{
                                    borderColor: dragActive ? "#7c3aed" : "#e2e8f0",
                                    background: dragActive
                                        ? "linear-gradient(135deg,#7c3aed08,#4f46e508)"
                                        : "transparent",
                                }}
                            >
                                <motion.div
                                    animate={{ y: dragActive ? -4 : 0 }}
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                                    style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}
                                >
                                    <Upload size={26} className="text-white" />
                                </motion.div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                    Clique ou glisse ton PDF ici
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                    Format PDF uniquement · 10 Mo max
                                </p>
                                <input
                                    ref={inputRef}
                                    id="pdf-upload"
                                    type="file"
                                    accept="application/pdf"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </motion.label>
                        ) : (
                            <motion.div
                                key="filepreview"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center justify-between p-4 rounded-2xl"
                                style={{ background: "#f8fafc" }}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div
                                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}
                                    >
                                        <FileText size={18} className="text-white" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-slate-900 truncate">
                                            {fichier.name}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            {(fichier.size / 1024).toFixed(0)} Ko
                                        </p>
                                    </div>
                                </div>
                                {!loading && (
                                    <button
                                        onClick={reset}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {erreur && (
                        <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 mt-4 text-sm px-4 py-3 rounded-xl"
                            style={{ background: "#fef2f2", color: "#dc2626" }}
                        >
                            <AlertCircle size={16} className="shrink-0" />
                            {erreur}
                        </motion.div>
                    )}

                    <Button
                        className="mt-6 w-full"
                        onClick={handleAnalyser}
                        loading={loading}
                        disabled={!fichier || loading}
                        leftIcon={<Sparkles size={16} />}
                    >
                        {loading ? "Analyse en cours..." : "Analyser le contrat"}
                    </Button>
                </Card>

                {/* LOADING */}
                {loading && (
                    <div className="mt-8 space-y-4">
                        <Skeleton className="h-28 rounded-3xl" />
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Skeleton className="h-24 rounded-2xl" />
                            <Skeleton className="h-24 rounded-2xl" />
                            <Skeleton className="h-24 rounded-2xl" />
                        </div>
                        <div className="grid gap-4">
                            <Skeleton className="h-40 rounded-3xl" />
                            <Skeleton className="h-40 rounded-3xl" />
                        </div>
                    </div>
                )}

                {/* RESULTATS */}
                <AnimatePresence>
                    {resultat && !loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-10 space-y-8"
                        >
                            {/* CONTRAT DETECTE */}
                            <Card className="p-6 sm:p-7">
                                <div className="flex items-center gap-2 mb-5">
                                    <div
                                        className="w-8 h-8 rounded-xl flex items-center justify-center"
                                        style={{ background: "rgba(16,185,129,0.1)" }}
                                    >
                                        <CheckCircle2 size={16} style={{ color: "#059669" }} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white">
                                            Ton contrat actuel
                                        </h3>
                                        <p className="text-xs text-slate-400">Détecté automatiquement par l'IA</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3 mb-5">
                                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                                            Assureur
                                        </p>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                            {resultat.contratActuel.assureurNom ?? "Non détecté"}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                                            Prix mensuel
                                        </p>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                            {resultat.contratActuel.prixMensuel
                                                ? `${resultat.contratActuel.prixMensuel}€`
                                                : "Non détecté"}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                                            Niveau
                                        </p>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                            {resultat.contratActuel.niveauEstime ?? "Non détecté"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {resultat.contratActuel.garanties.map((g, i) => (
                                        <Badge key={i} variant="default">
                                            {g.nom}
                                            {g.tauxRemboursement ? ` — ${g.tauxRemboursement}%` : ""}
                                        </Badge>
                                    ))}
                                </div>
                            </Card>

                            {/* RESUME CHIFFRE */}
                            {stats && (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <StatCard
                                        title="Économie potentielle"
                                        value={
                                            stats.economieMax !== null
                                                ? `${stats.economieMax.toFixed(2)}€/mois`
                                                : "—"
                                        }
                                        icon={Wallet}
                                        trend={
                                            stats.economieMax !== null
                                                ? `+${(stats.economieMax * 12).toFixed(0)}€/an`
                                                : undefined
                                        }
                                    />
                                    <StatCard
                                        title="Meilleur score"
                                        value={`${stats.meilleurScore}/100`}
                                        icon={Trophy}
                                    />
                                    <StatCard
                                        title="Offre recommandée"
                                        value={stats.meilleureOffre.nom}
                                        icon={TrendingDown}
                                    />
                                </div>
                            )}

                            {/* ALTERNATIVES */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
                                            Meilleures alternatives
                                        </h3>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            Classées selon ton profil et tes garanties actuelles
                                        </p>
                                    </div>
                                    <Badge variant="primary">
                                        {resultat.meilleuresAlternatives.length} offres
                                    </Badge>
                                </div>

                                {resultat.meilleuresAlternatives.length > 0 ? (
                                    <div className="grid gap-4">
                                        {resultat.meilleuresAlternatives.map((offre, i) => (
                                            <OffreAlternativeCard
                                                key={offre.id}
                                                offre={offre}
                                                index={i}
                                                prixActuel={resultat.contratActuel.prixMensuel}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <Card className="p-0">
                                        <EmptyState
                                            title="Aucune alternative trouvée"
                                            description="Nous n'avons pas trouvé d'offre correspondant mieux à ton contrat actuel."
                                        />
                                    </Card>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </PageTransition>
    );
}