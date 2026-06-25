import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Users, User, Shield, Check, ChevronRight, ChevronLeft } from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import ProgressBar from "../../components/ui/ProgressBar";
import PageTransition from "../../components/ui/PageTransition";

// ─── Constants ────────────────────────────────────────────────────────────────
const STEPS = [
    { id: 0, label: "Ma situation", icon: Users },
    { id: 1, label: "Mon profil", icon: User },
    { id: 2, label: "Mes besoins", icon: Shield },
];

const COUVERTURE_OPTIONS = [
    { value: "moi", label: "Moi seul(e)", icon: "🧍" },
    { value: "conjoint", label: "Moi + conjoint(e)", icon: "👫" },
    { value: "enfants", label: "Moi + enfant(s)", icon: "👨‍👧" },
    { value: "famille", label: "Famille entière", icon: "👨‍👩‍👧‍👦" },
];

const PROFESSIONS = [
    "Salarié(e) du secteur privé", "Fonctionnaire / agent public",
    "Indépendant(e) / TNS", "Étudiant(e)", "Retraité(e)", "Sans emploi",
];

const REGIMES = [
    "Régime général (salarié)", "Régime agricole (MSA)",
    "Régime des indépendants (SSI)", "Régime des fonctionnaires",
    "Régime étudiant", "Alsace-Moselle",
];

const GARANTIES = [
    { id: 1, label: "Soins courants", icon: "🩺" },
    { id: 2, label: "Dentaire", icon: "🦷" },
    { id: 3, label: "Optique", icon: "👓" },
    { id: 4, label: "Hospitalisation", icon: "🏥" },
    { id: 5, label: "Maternité", icon: "🤱" },
    { id: 6, label: "Médecines douces", icon: "🌿" },
];

const NIVEAUX = [
    { value: 1, label: "Économique", desc: "L'essentiel", emoji: "🌱", color: "#059669", bg: "#d1fae5" },
    { value: 2, label: "Standard", desc: "Qualité / prix", emoji: "⚡", color: "#7C3AED", bg: "#ede9fe" },
    { value: 3, label: "Premium", desc: "Couverture max", emoji: "✨", color: "#d97706", bg: "#fef3c7" },
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

// ─── ToggleButton ─────────────────────────────────────────────────────────────
function ToggleButton({ selected, onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
        flex flex-col items-center gap-2 p-4 rounded-2xl border-2 text-sm font-semibold
        transition-all duration-200 cursor-pointer flex-1
        ${selected
                    ? "border-violet-500 bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-violet-300"
                }
      `}
        >
            {children}
        </button>
    );
}

// ─── FieldLabel ───────────────────────────────────────────────────────────────
function FieldLabel({ children }) {
    return (
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            {children}
        </div>
    );
}

// ─── SelectField ──────────────────────────────────────────────────────────────
function SelectField({ value, onChange, children, placeholder }) {
    return (
        <select
            value={value}
            onChange={onChange}
            className="
        w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700
        bg-white dark:bg-slate-900 text-slate-900 dark:text-white
        transition-all duration-300 hover:border-violet-300 focus:border-violet-500
        focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-500/20 outline-none
        appearance-none cursor-pointer text-sm
      "
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

// ─── PersonCard ───────────────────────────────────────────────────────────────
function PersonCard({ index, person, onRemove, onChange }) {
    const labels = ["Conjoint(e)", "Enfant 1", "Enfant 2", "Enfant 3", "Enfant 4"];
    return (
        <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
            className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
        >
            <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center text-sm flex-shrink-0">
                {index === 0 ? "💑" : "👶"}
            </div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 min-w-[90px]">
                {labels[index] || `Personne ${index + 1}`}
            </span>
            <div className="flex-1">
                <Input
                    type="date"
                    value={person.dateNaissance}
                    onChange={e => onChange(index, e.target.value)}
                />
            </div>
            <button
                type="button"
                onClick={() => onRemove(index)}
                className="text-slate-300 hover:text-red-400 transition-colors text-lg px-1 flex-shrink-0"
            >
                ✕
            </button>
        </motion.div>
    );
}

// ─── STEP 1 — Situation ───────────────────────────────────────────────────────
function StepSituation({ data, onChange }) {
    const needsPersons = data.couverture !== "moi";

    const addPerson = () => {
        if (data.personnesSupp.length < 4)
            onChange("personnesSupp", [...data.personnesSupp, { dateNaissance: "" }]);
    };
    const removePerson = (idx) =>
        onChange("personnesSupp", data.personnesSupp.filter((_, i) => i !== idx));
    const updatePerson = (idx, val) =>
        onChange("personnesSupp", data.personnesSupp.map((p, i) => i === idx ? { ...p, dateNaissance: val } : p));

    return (
        <div className="flex flex-col gap-6">
            {/* Assuré actuellement */}
            <div>
                <FieldLabel>Êtes-vous déjà assuré(e) ?</FieldLabel>
                <div className="flex gap-3">
                    <ToggleButton selected={data.assureActuellement === true} onClick={() => onChange("assureActuellement", true)}>
                        <span className="text-xl">✅</span> Oui, je suis assuré(e)
                    </ToggleButton>
                    <ToggleButton selected={data.assureActuellement === false} onClick={() => onChange("assureActuellement", false)}>
                        <span className="text-xl">❌</span> Non, pas encore
                    </ToggleButton>
                </div>
                <AnimatePresence mode="wait">
                    {data.assureActuellement !== null && (
                        <motion.div
                            key={String(data.assureActuellement)}
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                            className={`mt-3 px-4 py-3 rounded-xl text-sm border ${data.assureActuellement
                                    ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400"
                                    : "bg-red-50 border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400"
                                }`}
                        >
                            {data.assureActuellement
                                ? "✓ Continuité de couverture garantie — pas de délai de carence."
                                : "⚠ Un délai de carence peut s'appliquer selon les offres choisies."}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Qui assurer */}
            <div>
                <FieldLabel>Qui souhaitez-vous assurer ?</FieldLabel>
                <div className="grid grid-cols-2 gap-3">
                    {COUVERTURE_OPTIONS.map(opt => (
                        <ToggleButton key={opt.value} selected={data.couverture === opt.value}
                            onClick={() => onChange("couverture", opt.value)}>
                            <span className="text-2xl">{opt.icon}</span>
                            <span className="text-xs">{opt.label}</span>
                        </ToggleButton>
                    ))}
                </div>
            </div>

            {/* Personnes supplémentaires */}
            <AnimatePresence>
                {needsPersons && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }} className="overflow-hidden flex flex-col gap-3">
                        <FieldLabel>Dates de naissance des personnes à assurer</FieldLabel>
                        <AnimatePresence>
                            {data.personnesSupp.map((p, i) => (
                                <PersonCard key={i} index={i} person={p} onRemove={removePerson} onChange={updatePerson} />
                            ))}
                        </AnimatePresence>
                        {data.personnesSupp.length < 4 && (
                            <button type="button" onClick={addPerson}
                                className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-violet-200 dark:border-violet-500/30 text-violet-600 dark:text-violet-400 text-sm font-medium hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-colors"
                            >
                                <span className="text-base">+</span> Ajouter une personne
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Date d'effet */}
            <div>
                <Input
                    label="Quand souhaitez-vous que votre contrat débute ?"
                    type="date"
                    value={data.dateEffet}
                    onChange={e => onChange("dateEffet", e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                />
            </div>
        </div>
    );
}

// ─── STEP 2 — Profil ──────────────────────────────────────────────────────────
function StepProfil({ data, onChange }) {
    const avecConjoint = data.couverture === "conjoint" || data.couverture === "famille";

    return (
        <div className="flex flex-col gap-6">
            {/* Civilité */}
            <div>
                <FieldLabel>Civilité</FieldLabel>
                <div className="flex gap-3">
                    <ToggleButton selected={data.civilite === "Mme"} onClick={() => onChange("civilite", "Mme")}>
                        Madame
                    </ToggleButton>
                    <ToggleButton selected={data.civilite === "M"} onClick={() => onChange("civilite", "M")}>
                        Monsieur
                    </ToggleButton>
                </div>
            </div>

            {/* Naissance + Code postal */}
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Votre date de naissance"
                    type="date"
                    value={data.dateNaissance}
                    onChange={e => onChange("dateNaissance", e.target.value)}
                />
                <Input
                    label="Code postal"
                    type="text"
                    placeholder="75001"
                    value={data.codePostal}
                    maxLength={5}
                    onChange={e => onChange("codePostal", e.target.value.replace(/\D/g, ""))}
                />
            </div>

            {/* Profession */}
            <div>
                <FieldLabel>Profession</FieldLabel>
                <SelectField value={data.profession} onChange={e => onChange("profession", e.target.value)}
                    placeholder="Sélectionner votre profession...">
                    {PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </SelectField>
            </div>

            {/* Régime social */}
            <div>
                <FieldLabel>Régime social</FieldLabel>
                <SelectField value={data.regimeSocial} onChange={e => onChange("regimeSocial", e.target.value)}
                    placeholder="Sélectionner votre régime...">
                    {REGIMES.map(r => <option key={r} value={r}>{r}</option>)}
                </SelectField>
            </div>

            {/* Conjoint */}
            <AnimatePresence>
                {avecConjoint && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Input
                            label="Date de naissance du/de la conjoint(e)"
                            type="date"
                            value={data.dateNaissanceConjoint}
                            onChange={e => onChange("dateNaissanceConjoint", e.target.value)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── STEP 3 — Besoins ────────────────────────────────────────────────────────
function StepBesoins({ data, onChange }) {
    const toggle = (id) => {
        const curr = data.typesGarantie;
        onChange("typesGarantie", curr.includes(id) ? curr.filter(g => g !== id) : [...curr, id]);
    };

    const budgetLabel = (val) => {
        if (val <= 40) return "Offres économiques — couverture de base";
        if (val <= 80) return "Bon rapport qualité/prix — plusieurs options";
        if (val <= 150) return "Confort élevé — large choix de garanties";
        return "Couverture maximale — offres premium";
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Garanties */}
            <div>
                <FieldLabel>Soins qui vous tiennent à cœur</FieldLabel>
                <div className="flex flex-wrap gap-2">
                    {GARANTIES.map(g => {
                        const sel = data.typesGarantie.includes(g.id);
                        return (
                            <button key={g.id} type="button" onClick={() => toggle(g.id)}
                                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium
                  border-2 transition-all duration-200 cursor-pointer
                  ${sel
                                        ? "border-violet-500 bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300"
                                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-violet-300"
                                    }
                `}
                            >
                                <span>{g.icon}</span>
                                {g.label}
                                {sel && <Check size={13} />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Niveau */}
            <div>
                <FieldLabel>Niveau de couverture souhaité</FieldLabel>
                <div className="grid grid-cols-3 gap-3">
                    {NIVEAUX.map(n => {
                        const sel = data.niveauSouhaite === n.value;
                        return (
                            <button key={n.value} type="button" onClick={() => onChange("niveauSouhaite", n.value)}
                                className={`
                  flex flex-col items-center gap-1.5 py-4 px-3 rounded-2xl
                  border-2 text-center transition-all duration-200 cursor-pointer
                  ${sel
                                        ? "border-violet-500 bg-violet-50 dark:bg-violet-500/10"
                                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-violet-300"
                                    }
                `}
                            >
                                <span className="text-2xl">{n.emoji}</span>
                                <span className={`text-sm font-bold ${sel ? "text-violet-700 dark:text-violet-300" : "text-slate-700 dark:text-slate-200"}`}>
                                    {n.label}
                                </span>
                                <span className="text-xs text-slate-400">{n.desc}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Budget */}
            <div>
                <FieldLabel>Budget mensuel maximum</FieldLabel>
                <div className="flex items-center gap-4 mb-3">
                    <input
                        type="range" min={20} max={300} step={5}
                        value={data.budgetMax}
                        onChange={e => onChange("budgetMax", parseInt(e.target.value))}
                        className="flex-1 cursor-pointer"
                        style={{ accentColor: "#7C3AED" }}
                    />
                    <div className="text-right min-w-[80px]">
                        <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                            {data.budgetMax} €
                        </div>
                        <div className="text-xs text-slate-400">par mois</div>
                    </div>
                </div>
                <div className="px-4 py-3 rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 text-sm text-violet-700 dark:text-violet-300 flex items-center gap-2">
                    <span>💡</span> {budgetLabel(data.budgetMax)}
                </div>
            </div>
        </div>
    );
}

// ─── Main Wizard ──────────────────────────────────────────────────────────────
export default function ComparateurWizard() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [data, setData] = useState(INITIAL_STATE);
    const [direction, setDirection] = useState(1);

    const onChange = (key, value) => setData(prev => ({ ...prev, [key]: value }));

    const canNext = () => {
        if (step === 0) return data.assureActuellement !== null && data.dateEffet;
        if (step === 1) return data.dateNaissance && data.profession && data.regimeSocial;
        return data.typesGarantie.length > 0;
    };

    const handleSubmit = () => {
        navigate("/comparateur/resultat", {
            state: {
                criteres: { budgetMax: data.budgetMax, niveauSouhaite: data.niveauSouhaite, typesGarantie: data.typesGarantie },
                profil: {
                    civilite: data.civilite, dateNaissance: data.dateNaissance, codePostal: data.codePostal,
                    profession: data.profession, regimeSocial: data.regimeSocial, couverture: data.couverture,
                    assureActuellement: data.assureActuellement, personnesSupp: data.personnesSupp,
                    dateEffet: data.dateEffet
                },
            },
        });
    };

    const goNext = () => {
        setDirection(1);
        if (step < STEPS.length - 1) setStep(s => s + 1);
        else handleSubmit();
    };
    const goPrev = () => { setDirection(-1); setStep(s => s - 1); };

    const slideVariants = {
        enter: (d) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (d) => ({ x: d > 0 ? -40 : 40, opacity: 0 }),
    };

    const progress = ((step + 1) / STEPS.length) * 100;
    const StepIcon = STEPS[step].icon;

    return (
        <PageTransition>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50 dark:from-slate-950 dark:to-slate-900 flex items-start justify-center px-4 py-10">
                <div className="w-full max-w-[580px] flex flex-col gap-6">

                    {/* Header */}
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            Comparez et économisez 💜
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            3 étapes pour trouver la mutuelle idéale
                        </p>
                    </div>

                    {/* Progress steps */}
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between">
                            {STEPS.map((s, i) => {
                                const Icon = s.icon;
                                const done = i < step;
                                const active = i === step;
                                return (
                                    <div key={s.id}
                                        className="flex flex-col items-center gap-1.5 flex-1 cursor-pointer"
                                        onClick={() => i < step && setStep(i)}
                                    >
                                        <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                      border-2 transition-all duration-300
                      ${done ? "bg-violet-600 border-violet-600 text-white"
                                                : active ? "bg-violet-50 dark:bg-violet-500/10 border-violet-500 text-violet-600 dark:text-violet-400"
                                                    : "bg-slate-100 dark:bg-slate-800 border-transparent text-slate-400"}
                    `}>
                                            {done ? <Check size={16} strokeWidth={2.5} /> : <Icon size={15} />}
                                        </div>
                                        <span className={`text-xs font-medium ${active ? "text-violet-600 dark:text-violet-400"
                                                : done ? "text-slate-600 dark:text-slate-300" : "text-slate-400"
                                            }`}>
                                            {s.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <ProgressBar value={progress} />
                    </div>

                    {/* Card */}
                    <Card className="p-8">
                        {/* Step title */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center">
                                <StepIcon size={18} className="text-violet-600 dark:text-violet-400" />
                            </div>
                            <div>
                                <div className="text-xs font-semibold text-violet-500 uppercase tracking-wider">
                                    Étape {step + 1} sur {STEPS.length}
                                </div>
                                <div className="text-lg font-bold text-slate-900 dark:text-white">
                                    {STEPS[step].label}
                                </div>
                            </div>
                        </div>

                        {/* Animated step content */}
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={step}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter" animate="center" exit="exit"
                                transition={{ duration: 0.22, ease: "easeOut" }}
                            >
                                {step === 0 && <StepSituation data={data} onChange={onChange} />}
                                {step === 1 && <StepProfil data={data} onChange={onChange} />}
                                {step === 2 && <StepBesoins data={data} onChange={onChange} />}
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation */}
                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <Button
                                variant="outline"
                                onClick={goPrev}
                                leftIcon={<ChevronLeft size={16} />}
                                style={{ visibility: step === 0 ? "hidden" : "visible" }}
                            >
                                Retour
                            </Button>
                            <Button
                                variant="primary"
                                onClick={goNext}
                                disabled={!canNext()}
                                rightIcon={<ChevronRight size={16} />}
                            >
                                {step === STEPS.length - 1 ? "Voir mes offres 🔍" : "Continuer"}
                            </Button>
                        </div>
                    </Card>

                    {/* Trust badges */}
                    <div className="flex items-center justify-center gap-6 flex-wrap">
                        {["🔒 Données sécurisées", "⚡ Résultats en 30s", "🆓 100% gratuit"].map(t => (
                            <span key={t} className="text-xs text-slate-400">{t}</span>
                        ))}
                    </div>

                </div>
            </div>
        </PageTransition>
    );
}