// src/pages/comparateur/ComparateurWizardPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users, Zap, CheckCircle2,
    User,
    Shield,
    Check,
    ChevronRight,
    ChevronLeft,
    CalendarDays,
    MapPin,
    BriefcaseBusiness,
    HeartPulse,
    Wallet,
    Sparkles,
    Plus,
    X,
    LockKeyhole,
    Clock3,
    CircleHelp,
} from "lucide-react";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import PageTransition from "../../components/ui/PageTransition";

const STEPS = [
    { id: 0, label: "Ma situation", icon: Users, short: "Situation" },
    { id: 1, label: "Mon profil", icon: User, short: "Profil" },
    { id: 2, label: "Mes besoins", icon: Shield, short: "Besoins" },
];

const COUVERTURE_OPTIONS = [
    { value: "moi", label: "Moi seul(e)", icon: "🧍", desc: "Une couverture individuelle" },
    { value: "conjoint", label: "Moi + conjoint(e)", icon: "👫", desc: "Deux personnes" },
    { value: "enfants", label: "Moi + enfant(s)", icon: "👨‍👧", desc: "Avec vos enfants" },
    { value: "famille", label: "Famille entière", icon: "👨‍👩‍👧‍👦", desc: "Toute la famille" },
];

const PROFESSIONS = [
    "Salarié(e) du secteur privé",
    "Fonctionnaire / agent public",
    "Indépendant(e) / TNS",
    "Étudiant(e)",
    "Retraité(e)",
    "Sans emploi",
];

const REGIMES = [
    "Régime général (salarié)",
    "Régime agricole (MSA)",
    "Régime des indépendants (SSI)",
    "Régime des fonctionnaires",
    "Régime étudiant",
    "Alsace-Moselle",
];

const GARANTIES = [
    { id: 1, label: "Soins courants", icon: "🩺", desc: "Consultations et soins" },
    { id: 2, label: "Dentaire", icon: "🦷", desc: "Couronnes et soins dentaires" },
    { id: 3, label: "Optique", icon: "👓", desc: "Lunettes et lentilles" },
    { id: 4, label: "Hospitalisation", icon: "🏥", desc: "Séjours et interventions" },
    { id: 5, label: "Maternité", icon: "🤱", desc: "Grossesse et naissance" },
    { id: 6, label: "Médecines douces", icon: "🌿", desc: "Ostéopathie, etc." },
];

const NIVEAUX = [
    {
        value: 1,
        label: "Économique",
        desc: "L'essentiel",
        emoji: "🌱",
        color: "#059669",
        bg: "#d1fae5",
    },
    {
        value: 2,
        label: "Standard",
        desc: "Qualité / prix",
        emoji: "⚡",
        color: "#7C3AED",
        bg: "#ede9fe",
    },
    {
        value: 3,
        label: "Premium",
        desc: "Couverture max",
        emoji: "✨",
        color: "#d97706",
        bg: "#fef3c7",
    },
];

const INITIAL_STATE = {
    assureActuellement: null,
    couverture: "moi",
    personnesSupp: [],
    dateEffet: new Date().toISOString().split("T")[0],
    civilite: "Mme",
    dateNaissance: "",
    codePostal: "",
    profession: "",
    regimeSocial: "",
    dateNaissanceConjoint: "",
    typesGarantie: [1, 4],
    niveauSouhaite: 2,
    budgetMax: 80,
};

function FieldLabel({ children, icon: Icon }) {
    return (
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            {Icon && <Icon size={13} />}
            {children}
        </div>
    );
}

function SelectField({ value, onChange, children, placeholder }) {
    return (
        <select
            value={value}
            onChange={onChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-all duration-300 hover:border-violet-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-500/20 outline-none appearance-none cursor-pointer text-sm"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 14px center",
                paddingRight: "36px",
            }}
        >
            {placeholder && <option value="">{placeholder}</option>}
            {children}
        </select>
    );
}

function SelectCard({ selected, onClick, icon, title, description }) {
    return (
        <motion.button
            type="button"
            onClick={onClick}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            className={`relative text-left p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${selected
                    ? "border-violet-500 bg-violet-50 dark:bg-violet-500/10 shadow-md shadow-violet-500/10"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-violet-300"
                }`}
        >
            {selected && (
                <motion.div
                    layoutId="selected-check"
                    className="absolute top-3 right-3 w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center"
                >
                    <Check size={13} strokeWidth={3} />
                </motion.div>
            )}

            <div className="text-2xl mb-2">{icon}</div>
            <div
                className={`text-sm font-bold ${selected
                        ? "text-violet-700 dark:text-violet-300"
                        : "text-slate-700 dark:text-slate-200"
                    }`}
            >
                {title}
            </div>
            <div className="text-xs text-slate-400 mt-1 pr-5">
                {description}
            </div>
        </motion.button>
    );
}

function PersonCard({ index, person, onRemove, onChange }) {
    const labels = ["Conjoint(e)", "Enfant 1", "Enfant 2", "Enfant 3", "Enfant 4"];

    return (
        <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.22 }}
            className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 overflow-hidden"
        >
            <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center text-sm flex-shrink-0">
                {index === 0 ? "💑" : "👶"}
            </div>

            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 min-w-[90px]">
                {labels[index] || `Personne ${index + 1}`}
            </span>

            <div className="flex-1">
                <Input
                    type="date"
                    value={person.dateNaissance}
                    onChange={(e) => onChange(index, e.target.value)}
                />
            </div>

            <button
                type="button"
                onClick={() => onRemove(index)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                aria-label="Supprimer"
            >
                <X size={16} />
            </button>
        </motion.div>
    );
}

function StepSituation({ data, onChange }) {
    const needsPersons = data.couverture !== "moi";

    const addPerson = () => {
        if (data.personnesSupp.length < 4) {
            onChange("personnesSupp", [
                ...data.personnesSupp,
                { dateNaissance: "" },
            ]);
        }
    };

    const removePerson = (idx) =>
        onChange(
            "personnesSupp",
            data.personnesSupp.filter((_, i) => i !== idx)
        );

    const updatePerson = (idx, val) =>
        onChange(
            "personnesSupp",
            data.personnesSupp.map((p, i) =>
                i === idx ? { ...p, dateNaissance: val } : p
            )
        );

    return (
        <div className="flex flex-col gap-7">
            <div>
                <FieldLabel>Êtes-vous déjà assuré(e) ?</FieldLabel>

                <div className="grid grid-cols-2 gap-3">
                    {[
                        {
                            value: true,
                            icon: "✓",
                            title: "Oui",
                            desc: "Je suis déjà assuré(e)",
                        },
                        {
                            value: false,
                            icon: "＋",
                            title: "Non",
                            desc: "Pas encore assuré(e)",
                        },
                    ].map((option) => (
                        <SelectCard
                            key={String(option.value)}
                            selected={data.assureActuellement === option.value}
                            onClick={() =>
                                onChange("assureActuellement", option.value)
                            }
                            icon={option.icon}
                            title={option.title}
                            description={option.desc}
                        />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {data.assureActuellement !== null && (
                        <motion.div
                            key={String(data.assureActuellement)}
                            initial={{ opacity: 0, y: -6, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, y: -6, height: 0 }}
                            className={`mt-3 px-4 py-3 rounded-xl text-sm border ${data.assureActuellement
                                    ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400"
                                    : "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400"
                                }`}
                        >
                            {data.assureActuellement
                                ? "✓ Continuité de couverture : nous rechercherons des offres adaptées à votre situation."
                                : "💡 Nous rechercherons des offres adaptées à une première couverture."}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div>
                <FieldLabel icon={Users}>Qui souhaitez-vous assurer ?</FieldLabel>

                <div className="grid grid-cols-2 gap-3">
                    {COUVERTURE_OPTIONS.map((opt) => (
                        <SelectCard
                            key={opt.value}
                            selected={data.couverture === opt.value}
                            onClick={() => onChange("couverture", opt.value)}
                            icon={opt.icon}
                            title={opt.label}
                            description={opt.desc}
                        />
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {needsPersons && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <FieldLabel icon={Users}>
                            Personnes supplémentaires
                        </FieldLabel>

                        <div className="flex flex-col gap-3">
                            <AnimatePresence>
                                {data.personnesSupp.map((p, i) => (
                                    <PersonCard
                                        key={`${i}-${p.dateNaissance}`}
                                        index={i}
                                        person={p}
                                        onRemove={removePerson}
                                        onChange={updatePerson}
                                    />
                                ))}
                            </AnimatePresence>

                            {data.personnesSupp.length < 4 && (
                                <button
                                    type="button"
                                    onClick={addPerson}
                                    className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-violet-200 dark:border-violet-500/30 text-violet-600 dark:text-violet-400 text-sm font-medium hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-colors"
                                >
                                    <Plus size={16} />
                                    Ajouter une personne
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div>
                <Input
                    label="Quand souhaitez-vous que votre contrat débute ?"
                    type="date"
                    value={data.dateEffet}
                    onChange={(e) => onChange("dateEffet", e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                />
            </div>
        </div>
    );
}

function StepProfil({ data, onChange }) {
    const avecConjoint =
        data.couverture === "conjoint" || data.couverture === "famille";

    return (
        <div className="flex flex-col gap-7">
            <div>
                <FieldLabel icon={User}>Civilité</FieldLabel>

                <div className="grid grid-cols-2 gap-3">
                    <SelectCard
                        selected={data.civilite === "Mme"}
                        onClick={() => onChange("civilite", "Mme")}
                        icon="👩"
                        title="Madame"
                        description="Mme"
                    />
                    <SelectCard
                        selected={data.civilite === "M"}
                        onClick={() => onChange("civilite", "M")}
                        icon="👨"
                        title="Monsieur"
                        description="M"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                    label="Votre date de naissance"
                    type="date"
                    value={data.dateNaissance}
                    onChange={(e) =>
                        onChange("dateNaissance", e.target.value)
                    }
                />

                <Input
                    label="Code postal"
                    type="text"
                    placeholder="75001"
                    value={data.codePostal}
                    maxLength={5}
                    onChange={(e) =>
                        onChange(
                            "codePostal",
                            e.target.value.replace(/\D/g, "")
                        )
                    }
                />
            </div>

            <div>
                <FieldLabel icon={BriefcaseBusiness}>Profession</FieldLabel>
                <SelectField
                    value={data.profession}
                    onChange={(e) => onChange("profession", e.target.value)}
                    placeholder="Sélectionner votre profession..."
                >
                    {PROFESSIONS.map((p) => (
                        <option key={p} value={p}>
                            {p}
                        </option>
                    ))}
                </SelectField>
            </div>

            <div>
                <FieldLabel icon={HeartPulse}>Régime social</FieldLabel>
                <SelectField
                    value={data.regimeSocial}
                    onChange={(e) => onChange("regimeSocial", e.target.value)}
                    placeholder="Sélectionner votre régime..."
                >
                    {REGIMES.map((r) => (
                        <option key={r} value={r}>
                            {r}
                        </option>
                    ))}
                </SelectField>
            </div>

            <AnimatePresence>
                {avecConjoint && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -8, height: 0 }}
                    >
                        <Input
                            label="Date de naissance du/de la conjoint(e)"
                            type="date"
                            value={data.dateNaissanceConjoint}
                            onChange={(e) =>
                                onChange(
                                    "dateNaissanceConjoint",
                                    e.target.value
                                )
                            }
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid sm:grid-cols-3 gap-3">
                {[
                    { icon: CalendarDays, text: "Profil personnalisé" },
                    { icon: MapPin, text: "Offres selon votre zone" },
                    { icon: LockKeyhole, text: "Données protégées" },
                ].map(({ icon: Icon, text }) => (
                    <div
                        key={text}
                        className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 dark:text-slate-400"
                    >
                        <Icon size={15} className="text-violet-500" />
                        {text}
                    </div>
                ))}
            </div>
        </div>
    );
}

function StepBesoins({ data, onChange }) {
    const toggle = (id) => {
        const curr = data.typesGarantie;
        onChange(
            "typesGarantie",
            curr.includes(id)
                ? curr.filter((g) => g !== id)
                : [...curr, id]
        );
    };

    const budgetLabel = (val) => {
        if (val <= 40) return "Offres économiques — couverture de base";
        if (val <= 80) return "Bon rapport qualité/prix — plusieurs options";
        if (val <= 150) return "Confort élevé — large choix de garanties";
        return "Couverture maximale — offres premium";
    };

    return (
        <div className="flex flex-col gap-7">
            <div>
                <div className="flex items-end justify-between mb-3">
                    <FieldLabel icon={HeartPulse}>
                        Soins qui vous tiennent à cœur
                    </FieldLabel>
                    <span className="text-xs text-slate-400">
                        {data.typesGarantie.length} sélectionné(s)
                    </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {GARANTIES.map((g) => {
                        const selected = data.typesGarantie.includes(g.id);

                        return (
                            <motion.button
                                key={g.id}
                                type="button"
                                onClick={() => toggle(g.id)}
                                whileHover={{ y: -3 }}
                                whileTap={{ scale: 0.98 }}
                                className={`relative p-4 rounded-2xl border-2 text-left transition-all ${selected
                                        ? "border-violet-500 bg-violet-50 dark:bg-violet-500/10"
                                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-violet-300"
                                    }`}
                            >
                                {selected && (
                                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center">
                                        <Check size={11} />
                                    </div>
                                )}

                                <div className="text-2xl">{g.icon}</div>
                                <div
                                    className={`text-sm font-bold mt-2 ${selected
                                            ? "text-violet-700 dark:text-violet-300"
                                            : "text-slate-700 dark:text-slate-200"
                                        }`}
                                >
                                    {g.label}
                                </div>
                                <div className="text-[10px] text-slate-400 mt-1">
                                    {g.desc}
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            <div>
                <FieldLabel icon={Sparkles}>
                    Niveau de couverture souhaité
                </FieldLabel>

                <div className="grid grid-cols-3 gap-3">
                    {NIVEAUX.map((n) => {
                        const selected = data.niveauSouhaite === n.value;

                        return (
                            <motion.button
                                key={n.value}
                                type="button"
                                onClick={() =>
                                    onChange("niveauSouhaite", n.value)
                                }
                                whileHover={{ y: -3 }}
                                whileTap={{ scale: 0.98 }}
                                className={`relative flex flex-col items-center gap-1.5 py-5 px-3 rounded-2xl border-2 text-center transition-all ${selected
                                        ? "border-violet-500 bg-violet-50 dark:bg-violet-500/10 shadow-md shadow-violet-500/10"
                                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-violet-300"
                                    }`}
                            >
                                {selected && (
                                    <div className="absolute top-2 right-2">
                                        <Check
                                            size={14}
                                            className="text-violet-600"
                                        />
                                    </div>
                                )}

                                <span className="text-2xl">{n.emoji}</span>
                                <span
                                    className={`text-sm font-bold ${selected
                                            ? "text-violet-700 dark:text-violet-300"
                                            : "text-slate-700 dark:text-slate-200"
                                        }`}
                                >
                                    {n.label}
                                </span>
                                <span className="text-xs text-slate-400">
                                    {n.desc}
                                </span>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-3">
                    <FieldLabel icon={Wallet}>
                        Budget mensuel maximum
                    </FieldLabel>

                    <motion.div
                        key={data.budgetMax}
                        initial={{ scale: 1.08, opacity: 0.6 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-2xl font-bold text-violet-600 dark:text-violet-400"
                    >
                        {data.budgetMax} €
                    </motion.div>
                </div>

                <input
                    type="range"
                    min={20}
                    max={300}
                    step={5}
                    value={data.budgetMax}
                    onChange={(e) =>
                        onChange("budgetMax", parseInt(e.target.value))
                    }
                    className="w-full cursor-pointer"
                    style={{ accentColor: "#7C3AED" }}
                />

                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>20 €</span>
                    <span>150 €</span>
                    <span>300 €</span>
                </div>

                <motion.div
                    key={budgetLabel(data.budgetMax)}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 px-4 py-3 rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 text-sm text-violet-700 dark:text-violet-300 flex items-center gap-2"
                >
                    <CircleHelp size={16} />
                    {budgetLabel(data.budgetMax)}
                </motion.div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-500/10 dark:to-indigo-500/10 border border-violet-100 dark:border-violet-500/20">
                <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                        <Sparkles size={17} className="text-violet-600" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            Dernière étape !
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Nous allons utiliser ces critères pour vous proposer
                            les offres les plus pertinentes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ComparateurWizardPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [data, setData] = useState(INITIAL_STATE);
    const [direction, setDirection] = useState(1);

    const onChange = (key, value) =>
        setData((prev) => ({ ...prev, [key]: value }));

    const canNext = () => {
        if (step === 0) {
            return data.assureActuellement !== null && data.dateEffet;
        }

        if (step === 1) {
            return (
                data.dateNaissance &&
                data.profession &&
                data.regimeSocial
            );
        }

        return data.typesGarantie.length > 0;
    };

    const handleSubmit = () => {
        navigate("/comparateur/resultat");
    };

    const goNext = () => {
        setDirection(1);

        if (step < STEPS.length - 1) {
            setStep((s) => s + 1);
        } else {
            handleSubmit();
        }
    };

    const goPrev = () => {
        setDirection(-1);
        setStep((s) => Math.max(0, s - 1));
    };

    const goToStep = (index) => {
        if (index < step) {
            setDirection(-1);
            setStep(index);
        }
    };

    const slideVariants = {
        enter: (d) => ({
            x: d > 0 ? 45 : -45,
            opacity: 0,
            scale: 0.98,
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (d) => ({
            x: d > 0 ? -45 : 45,
            opacity: 0,
            scale: 0.98,
        }),
    };

    const progress = ((step + 1) / STEPS.length) * 100;
    const StepIcon = STEPS[step].icon;

    return (
        <PageTransition>
            <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 dark:from-slate-950 dark:via-slate-950 dark:to-violet-950/20 overflow-hidden">
                <motion.div
                    className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(circle,#7c3aed22,transparent 70%)",
                    }}
                    animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                <motion.div
                    className="absolute top-1/3 -right-40 w-[450px] h-[450px] rounded-full blur-3xl pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(circle,#4f46e518,transparent 70%)",
                    }}
                    animate={{ x: [0, -25, 0], y: [0, 30, 0] }}
                    transition={{
                        duration: 14,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                <div className="relative w-full max-w-[720px] mx-auto px-4 py-8 sm:py-12">
                    <motion.div
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-8"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 text-violet-600 dark:text-violet-400 text-xs font-semibold mb-4">
                            <Sparkles size={13} />
                            Comparateur intelligent
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                            Comparez et économisez
                        </h1>

                        <p className="text-slate-500 dark:text-slate-400 mt-2">
                            3 étapes simples pour trouver une mutuelle adaptée
                        </p>
                    </motion.div>

                    <div className="mb-6">
                        <div className="relative flex justify-between">
                            <div className="absolute top-5 left-[12%] right-[12%] h-1 bg-slate-200 dark:bg-slate-800 rounded-full" />

                            <motion.div
                                className="absolute top-5 left-[12%] h-1 bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full origin-left"
                                initial={{ width: 0 }}
                                animate={{
                                    width: `${Math.max(0, progress - 33.333)}%`,
                                }}
                                transition={{ duration: 0.45, ease: "easeOut" }}
                                style={{ maxWidth: "76%" }}
                            />

                            {STEPS.map((s, i) => {
                                const Icon = s.icon;
                                const done = i < step;
                                const active = i === step;

                                return (
                                    <button
                                        key={s.id}
                                        type="button"
                                        onClick={() => goToStep(i)}
                                        disabled={i >= step}
                                        className="relative z-10 flex flex-col items-center gap-2 w-1/3 disabled:cursor-default"
                                    >
                                        <motion.div
                                            animate={{
                                                scale: active ? 1.08 : 1,
                                            }}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${done
                                                    ? "bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-500/20"
                                                    : active
                                                        ? "bg-white dark:bg-slate-900 border-violet-500 text-violet-600 shadow-lg shadow-violet-500/15"
                                                        : "bg-slate-100 dark:bg-slate-800 border-transparent text-slate-400"
                                                }`}
                                        >
                                            {done ? (
                                                <Check
                                                    size={16}
                                                    strokeWidth={2.5}
                                                />
                                            ) : (
                                                <Icon size={16} />
                                            )}
                                        </motion.div>

                                        <span
                                            className={`text-xs font-semibold ${active
                                                    ? "text-violet-600 dark:text-violet-400"
                                                    : done
                                                        ? "text-slate-600 dark:text-slate-300"
                                                        : "text-slate-400"
                                                }`}
                                        >
                                            <span className="hidden sm:inline">
                                                {s.label}
                                            </span>
                                            <span className="sm:hidden">
                                                {s.short}
                                            </span>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <Card className="p-0 overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-black/20">
                        <div className="p-5 sm:p-7 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        key={step}
                                        initial={{ scale: 0.7, rotate: -10, opacity: 0 }}
                                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="w-11 h-11 rounded-2xl bg-violet-100 dark:bg-violet-500/15 flex items-center justify-center"
                                    >
                                        <StepIcon
                                            size={19}
                                            className="text-violet-600 dark:text-violet-400"
                                        />
                                    </motion.div>

                                    <div>
                                        <div className="text-[11px] font-bold text-violet-500 uppercase tracking-wider">
                                            Étape {step + 1} sur {STEPS.length}
                                        </div>
                                        <div className="text-lg font-bold text-slate-900 dark:text-white">
                                            {STEPS[step].label}
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
                                    <Clock3 size={13} />
                                    Environ 2 min
                                </div>
                            </div>
                        </div>

                        <div className="p-5 sm:p-7 bg-white dark:bg-slate-900">
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={step}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        duration: 0.28,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                >
                                    {step === 0 && (
                                        <StepSituation
                                            data={data}
                                            onChange={onChange}
                                        />
                                    )}

                                    {step === 1 && (
                                        <StepProfil
                                            data={data}
                                            onChange={onChange}
                                        />
                                    )}

                                    {step === 2 && (
                                        <StepBesoins
                                            data={data}
                                            onChange={onChange}
                                        />
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="flex items-center justify-between gap-3 p-5 sm:p-7 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/30">
                            <Button
                                variant="outline"
                                onClick={goPrev}
                                leftIcon={<ChevronLeft size={16} />}
                                style={{
                                    visibility:
                                        step === 0 ? "hidden" : "visible",
                                }}
                            >
                                Retour
                            </Button>

                            <div className="text-xs text-slate-400 hidden sm:block">
                                {canNext()
                                    ? "Prêt à continuer"
                                    : "Complète les informations requises"}
                            </div>

                            <Button
                                variant="primary"
                                onClick={goNext}
                                disabled={!canNext()}
                                rightIcon={<ChevronRight size={16} />}
                            >
                                {step === STEPS.length - 1
                                    ? "Voir mes offres"
                                    : "Continuer"}
                            </Button>
                        </div>
                    </Card>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center justify-center gap-x-6 gap-y-3 flex-wrap mt-6"
                    >
                        {[
                            {
                                icon: LockKeyhole,
                                text: "Données sécurisées",
                            },
                            {
                                icon: Zap,
                                text: "Résultats rapides",
                            },
                            {
                                icon: CheckCircle2,
                                text: "100% gratuit",
                            },
                        ].map(({ icon: Icon, text }) => (
                            <div
                                key={text}
                                className="flex items-center gap-2 text-xs text-slate-400"
                            >
                                <Icon
                                    size={14}
                                    className="text-violet-500"
                                />
                                {text}
                            </div>
                        ))}
                    </motion.div>

                    <div className="text-center mt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/comparateur")}
                            className="text-xs text-slate-400 hover:text-violet-600 transition-colors"
                        >
                            ← Retour au comparateur
                        </button>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}