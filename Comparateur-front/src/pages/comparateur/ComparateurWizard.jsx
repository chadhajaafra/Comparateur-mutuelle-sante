import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ─── Constantes ──────────────────────────────────────────────────────────────

const STEPS = [
    { id: 0, label: "Ma situation", icon: "👥" },
    { id: 1, label: "Mon profil", icon: "👤" },
    { id: 2, label: "Mes besoins", icon: "🛡️" },
];

const COUVERTURE_OPTIONS = [
    { value: "moi", label: "Moi seul(e)", icon: "🧍" },
    { value: "conjoint", label: "Moi + conjoint(e)", icon: "👫" },
    { value: "enfants", label: "Moi + enfant(s)", icon: "👨‍👧" },
    { value: "famille", label: "Famille entière", icon: "👨‍👩‍👧‍👦" },
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
    { id: 1, label: "Soins courants", icon: "🩺" },
    { id: 2, label: "Dentaire", icon: "🦷" },
    { id: 3, label: "Optique", icon: "👓" },
    { id: 4, label: "Hospitalisation", icon: "🏥" },
    { id: 5, label: "Maternité", icon: "🤱" },
    { id: 6, label: "Médecines douces", icon: "🌿" },
];

const NIVEAUX = [
    { value: 1, label: "Économique", desc: "L'essentiel à petit prix", color: "#059669", bg: "#d1fae5" },
    { value: 2, label: "Standard", desc: "Bon équilibre qualité/prix", color: "#7C3AED", bg: "#ede9fe" },
    { value: 3, label: "Premium", desc: "Couverture maximale", color: "#d97706", bg: "#fef3c7" },
];

// ─── Sous-composants ──────────────────────────────────────────────────────────

function ToggleButton({ selected, onClick, children, fullWidth = false }) {
    return (
        <button
            type="button"
            onClick={onClick}
            style={{
                flex: fullWidth ? "1 1 100%" : "1",
                padding: "12px 16px",
                borderRadius: "12px",
                border: selected ? "2px solid #7C3AED" : "1px solid #e2e8f0",
                background: selected ? "#f0ebfe" : "#f8fafc",
                color: selected ? "#7C3AED" : "#475569",
                fontWeight: selected ? "600" : "400",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.15s ease",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                minWidth: "100px",
            }}
        >
            {children}
        </button>
    );
}

function Label({ children }) {
    return (
        <div style={{
            fontSize: "12px",
            fontWeight: "600",
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "8px",
        }}>
            {children}
        </div>
    );
}

function Input({ ...props }) {
    return (
        <input
            {...props}
            style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                background: "#f8fafc",
                color: "#1e293b",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.15s",
                fontFamily: "inherit",
                ...props.style,
            }}
            onFocus={e => (e.target.style.borderColor = "#7C3AED")}
            onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
        />
    );
}

function Select({ children, ...props }) {
    return (
        <select
            {...props}
            style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                background: "#f8fafc",
                color: "#1e293b",
                fontSize: "14px",
                outline: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 14px center",
                paddingRight: "36px",
                ...props.style,
            }}
        >
            {children}
        </select>
    );
}

function PersonCard({ index, person, onRemove, onChange }) {
    const labels = ["Conjoint(e)", "Enfant 1", "Enfant 2", "Enfant 3", "Enfant 4"];
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "14px 16px",
                background: "#f8fafc",
                display: "flex",
                alignItems: "center",
                gap: "12px",
            }}
        >
            <div style={{
                width: "32px", height: "32px", borderRadius: "50%",
                background: "#ede9fe", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "14px", flexShrink: 0,
            }}>
                {index === 0 ? "💑" : "👶"}
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "13px", fontWeight: "500", color: "#475569", minWidth: "90px" }}>
                    {labels[index] || `Personne ${index + 1}`}
                </span>
                <Input
                    type="date"
                    value={person.dateNaissance}
                    onChange={e => onChange(index, e.target.value)}
                    style={{ flex: 1, minWidth: "160px" }}
                />
            </div>
            <button
                type="button"
                onClick={() => onRemove(index)}
                style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "#cbd5e1", fontSize: "18px", padding: "4px",
                    borderRadius: "6px", display: "flex", alignItems: "center",
                    transition: "color 0.15s",
                    flexShrink: 0,
                }}
                onMouseEnter={e => (e.target.style.color = "#ef4444")}
                onMouseLeave={e => (e.target.style.color = "#cbd5e1")}
            >
                ✕
            </button>
        </motion.div>
    );
}

// ─── Étape 1 — Situation ──────────────────────────────────────────────────────

function StepSituation({ data, onChange }) {
    const needsPersons = data.couverture !== "moi";

    const addPerson = () => {
        if (data.personnesSupp.length < 4) {
            onChange("personnesSupp", [...data.personnesSupp, { dateNaissance: "" }]);
        }
    };

    const removePerson = (idx) => {
        const next = data.personnesSupp.filter((_, i) => i !== idx);
        onChange("personnesSupp", next);
    };

    const updatePerson = (idx, val) => {
        const next = data.personnesSupp.map((p, i) => i === idx ? { ...p, dateNaissance: val } : p);
        onChange("personnesSupp", next);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Assuré actuellement */}
            <div>
                <Label>Êtes-vous déjà assuré(e) ?</Label>
                <div style={{ display: "flex", gap: "10px" }}>
                    <ToggleButton selected={data.assureActuellement === true} onClick={() => onChange("assureActuellement", true)}>
                        <span style={{ fontSize: "20px" }}>✅</span>
                        Oui, je suis assuré(e)
                    </ToggleButton>
                    <ToggleButton selected={data.assureActuellement === false} onClick={() => onChange("assureActuellement", false)}>
                        <span style={{ fontSize: "20px" }}>❌</span>
                        Non, pas encore
                    </ToggleButton>
                </div>
                <AnimatePresence mode="wait">
                    {data.assureActuellement !== null && (
                        <motion.div
                            key={String(data.assureActuellement)}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{
                                marginTop: "10px",
                                padding: "10px 14px",
                                borderRadius: "10px",
                                border: `1px solid ${data.assureActuellement ? "#6ee7b7" : "#fca5a5"}`,
                                background: data.assureActuellement ? "#ecfdf5" : "#fef2f2",
                                color: data.assureActuellement ? "#059669" : "#dc2626",
                                fontSize: "13px",
                            }}
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
                <Label>Qui souhaitez-vous assurer ?</Label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    {COUVERTURE_OPTIONS.map(opt => (
                        <ToggleButton
                            key={opt.value}
                            selected={data.couverture === opt.value}
                            onClick={() => onChange("couverture", opt.value)}
                        >
                            <span style={{ fontSize: "22px" }}>{opt.icon}</span>
                            <span style={{ fontSize: "13px" }}>{opt.label}</span>
                        </ToggleButton>
                    ))}
                </div>
            </div>

            {/* Personnes supplémentaires */}
            <AnimatePresence>
                {needsPersons && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ display: "flex", flexDirection: "column", gap: "10px", overflow: "hidden" }}
                    >
                        <Label>Dates de naissance des personnes à assurer</Label>
                        <AnimatePresence>
                            {data.personnesSupp.map((p, i) => (
                                <PersonCard
                                    key={i}
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
                                style={{
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    gap: "8px", padding: "11px",
                                    border: "1.5px dashed #c4b5fd", borderRadius: "12px",
                                    background: "none", color: "#7C3AED", fontSize: "13px",
                                    cursor: "pointer", transition: "all 0.15s",
                                    fontFamily: "inherit",
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = "#f5f3ff")}
                                onMouseLeave={e => (e.currentTarget.style.background = "none")}
                            >
                                <span style={{ fontSize: "16px" }}>+</span>
                                Ajouter une personne
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Date d'effet */}
            <div>
                <Label>Quand souhaitez-vous que votre contrat débute ?</Label>
                <Input
                    type="date"
                    value={data.dateEffet}
                    onChange={e => onChange("dateEffet", e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                />
            </div>
        </div>
    );
}

// ─── Étape 2 — Profil ────────────────────────────────────────────────────────

function StepProfil({ data, onChange }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Civilité */}
            <div>
                <Label>Civilité</Label>
                <div style={{ display: "flex", gap: "10px" }}>
                    <ToggleButton selected={data.civilite === "Mme"} onClick={() => onChange("civilite", "Mme")}>
                        Madame
                    </ToggleButton>
                    <ToggleButton selected={data.civilite === "M"} onClick={() => onChange("civilite", "M")}>
                        Monsieur
                    </ToggleButton>
                </div>
            </div>

            {/* Naissance + Code postal */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                    <Label>Votre date de naissance</Label>
                    <Input
                        type="date"
                        value={data.dateNaissance}
                        onChange={e => onChange("dateNaissance", e.target.value)}
                    />
                </div>
                <div>
                    <Label>Code postal</Label>
                    <Input
                        type="text"
                        placeholder="75001"
                        value={data.codePostal}
                        maxLength={5}
                        onChange={e => onChange("codePostal", e.target.value.replace(/\D/g, ""))}
                    />
                </div>
            </div>

            {/* Profession */}
            <div>
                <Label>Profession</Label>
                <Select value={data.profession} onChange={e => onChange("profession", e.target.value)}>
                    <option value="">Sélectionner votre profession...</option>
                    {PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </Select>
            </div>

            {/* Régime social */}
            <div>
                <Label>Régime social</Label>
                <Select value={data.regimeSocial} onChange={e => onChange("regimeSocial", e.target.value)}>
                    <option value="">Sélectionner votre régime...</option>
                    {REGIMES.map(r => <option key={r} value={r}>{r}</option>)}
                </Select>
            </div>

            {/* Conjoint si applicable */}
            {(data.couverture === "conjoint" || data.couverture === "famille") && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Label>Date de naissance du conjoint(e)</Label>
                    <Input
                        type="date"
                        value={data.dateNaissanceConjoint}
                        onChange={e => onChange("dateNaissanceConjoint", e.target.value)}
                    />
                </motion.div>
            )}
        </div>
    );
}

// ─── Étape 3 — Besoins ───────────────────────────────────────────────────────

function StepBesoins({ data, onChange }) {
    const toggleGarantie = (id) => {
        const current = data.typesGarantie;
        const next = current.includes(id)
            ? current.filter(g => g !== id)
            : [...current, id];
        onChange("typesGarantie", next);
    };

    const budgetLabel = (val) => {
        if (val <= 40) return "Offres économiques — couverture de base";
        if (val <= 80) return "Bon rapport qualité/prix — plusieurs options";
        if (val <= 150) return "Confort élevé — large choix de garanties";
        return "Couverture maximale — offres premium";
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Garanties */}
            <div>
                <Label>Soins qui vous tiennent à cœur</Label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {GARANTIES.map(g => {
                        const sel = data.typesGarantie.includes(g.id);
                        return (
                            <button
                                key={g.id}
                                type="button"
                                onClick={() => toggleGarantie(g.id)}
                                style={{
                                    display: "flex", alignItems: "center", gap: "7px",
                                    padding: "9px 16px", borderRadius: "999px",
                                    border: sel ? "2px solid #7C3AED" : "1px solid #e2e8f0",
                                    background: sel ? "#ede9fe" : "#f8fafc",
                                    color: sel ? "#7C3AED" : "#64748b",
                                    fontSize: "13px", fontWeight: sel ? "600" : "400",
                                    cursor: "pointer", transition: "all 0.15s",
                                    fontFamily: "inherit",
                                }}
                            >
                                <span>{g.icon}</span>
                                {g.label}
                                {sel && <span style={{ fontSize: "11px" }}>✓</span>}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Niveau */}
            <div>
                <Label>Niveau de couverture souhaité</Label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                    {NIVEAUX.map(n => {
                        const sel = data.niveauSouhaite === n.value;
                        return (
                            <button
                                key={n.value}
                                type="button"
                                onClick={() => onChange("niveauSouhaite", n.value)}
                                style={{
                                    padding: "16px 10px", borderRadius: "12px",
                                    border: sel ? `2px solid ${n.color}` : "1px solid #e2e8f0",
                                    background: sel ? n.bg : "#f8fafc",
                                    color: sel ? n.color : "#64748b",
                                    cursor: "pointer", textAlign: "center",
                                    transition: "all 0.15s", fontFamily: "inherit",
                                    display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
                                }}
                            >
                                <span style={{ fontSize: "24px" }}>
                                    {n.value === 1 ? "🌱" : n.value === 2 ? "⚡" : "✨"}
                                </span>
                                <div style={{ fontSize: "13px", fontWeight: "600" }}>{n.label}</div>
                                <div style={{ fontSize: "11px", opacity: 0.8 }}>{n.desc}</div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Budget */}
            <div>
                <Label>Budget mensuel maximum</Label>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px" }}>
                    <input
                        type="range"
                        min={20}
                        max={300}
                        step={5}
                        value={data.budgetMax}
                        onChange={e => onChange("budgetMax", parseInt(e.target.value))}
                        style={{ flex: 1, accentColor: "#7C3AED", cursor: "pointer" }}
                    />
                    <div style={{ textAlign: "right", minWidth: "80px" }}>
                        <div style={{ fontSize: "24px", fontWeight: "700", color: "#7C3AED" }}>
                            {data.budgetMax} €
                        </div>
                        <div style={{ fontSize: "11px", color: "#94a3b8" }}>par mois</div>
                    </div>
                </div>
                <div style={{
                    padding: "12px 16px", borderRadius: "10px",
                    background: "#f0ebfe", border: "1px solid #c4b5fd",
                    fontSize: "13px", color: "#5b21b6",
                    display: "flex", alignItems: "center", gap: "8px",
                }}>
                    <span>💡</span>
                    {budgetLabel(data.budgetMax)}
                </div>
            </div>
        </div>
    );
}

// ─── Composant principal ──────────────────────────────────────────────────────

const INITIAL_STATE = {
    // Étape 1
    assureActuellement: null,
    couverture: "moi",
    personnesSupp: [],
    dateEffet: new Date().toISOString().split("T")[0],
    // Étape 2
    civilite: "Mme",
    dateNaissance: "",
    codePostal: "",
    profession: "",
    regimeSocial: "",
    dateNaissanceConjoint: "",
    // Étape 3
    typesGarantie: [1, 4],
    niveauSouhaite: 2,
    budgetMax: 80,
};

export default function ComparateurWizard() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [data, setData] = useState(INITIAL_STATE);

    const onChange = (key, value) => setData(prev => ({ ...prev, [key]: value }));

    const canNext = () => {
        if (step === 0) return data.assureActuellement !== null && data.dateEffet;
        if (step === 1) return data.dateNaissance && data.profession && data.regimeSocial;
        return data.typesGarantie.length > 0;
    };

    const handleNext = () => {
        if (step < STEPS.length - 1) setStep(s => s + 1);
        else handleSubmit();
    };

    const handleSubmit = () => {
        // Construire les critères pour la page résultats
        const criteres = {
            budgetMax: data.budgetMax,
            niveauSouhaite: data.niveauSouhaite,
            typesGarantie: data.typesGarantie,
        };
        const profil = {
            civilite: data.civilite,
            dateNaissance: data.dateNaissance,
            codePostal: data.codePostal,
            profession: data.profession,
            regimeSocial: data.regimeSocial,
            couverture: data.couverture,
            assureActuellement: data.assureActuellement,
            personnesSupp: data.personnesSupp,
            dateEffet: data.dateEffet,
        };
        navigate("/comparateur/resultats", { state: { criteres, profil } });
    };

    const slideVariants = {
        enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
    };

    const [direction, setDirection] = useState(1);

    const goNext = () => { setDirection(1); handleNext(); };
    const goPrev = () => { setDirection(-1); setStep(s => s - 1); };


    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f8fafc 0%, #f0ebfe 100%)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "40px 16px 60px",
        }}>
            <div style={{ width: "100%", maxWidth: "580px", display: "flex", flexDirection: "column", gap: "28px" }}>

                {/* En-tête */}
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "28px", fontWeight: "700", color: "#1e293b", marginBottom: "6px" }}>
                        Comparez et économisez 💜
                    </div>
                    <div style={{ fontSize: "15px", color: "#64748b" }}>
                        3 étapes pour trouver la mutuelle idéale
                    </div>
                </div>

                {/* Barre de progression */}
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                        {STEPS.map((s, i) => (
                            <div key={s.id} style={{
                                display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", flex: 1,
                                cursor: i <= step ? "pointer" : "default",
                            }} onClick={() => i < step && setStep(i)}>
                                <div style={{
                                    width: "36px", height: "36px", borderRadius: "50%",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: i < step ? "16px" : "14px",
                                    background: i < step ? "#7C3AED" : i === step ? "#ede9fe" : "#e2e8f0",
                                    color: i < step ? "#fff" : i === step ? "#7C3AED" : "#94a3b8",
                                    border: i === step ? "2px solid #7C3AED" : "2px solid transparent",
                                    fontWeight: "600",
                                    transition: "all 0.3s",
                                }}>
                                    {i < step ? "✓" : s.icon}
                                </div>
                                <div style={{
                                    fontSize: "11px",
                                    color: i === step ? "#7C3AED" : i < step ? "#475569" : "#94a3b8",
                                    fontWeight: i === step ? "600" : "400",
                                    textAlign: "center",
                                }}>
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ height: "4px", background: "#e2e8f0", borderRadius: "999px", overflow: "hidden" }}>
                        <motion.div
                            style={{ height: "100%", background: "#7C3AED", borderRadius: "999px" }}
                            initial={false}
                            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                    </div>
                </div>

                {/* Carte principale */}
                <div style={{
                    background: "#fff",
                    borderRadius: "20px",
                    boxShadow: "0 4px 24px rgba(124,58,237,0.08)",
                    padding: "32px",
                    overflow: "hidden",
                    position: "relative",
                }}>
                    {/* Titre de l'étape */}
                    <div style={{ marginBottom: "24px" }}>
                        <div style={{ fontSize: "11px", fontWeight: "600", color: "#7C3AED", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "4px" }}>
                            Étape {step + 1} sur {STEPS.length}
                        </div>
                        <div style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b" }}>
                            {STEPS[step].label}
                        </div>
                    </div>

                    {/* Contenu animé */}
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={step}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.25, ease: "easeOut" }}
                        >
                            {step === 0 && <StepSituation data={data} onChange={onChange} />}
                            {step === 1 && <StepProfil data={data} onChange={onChange} />}
                            {step === 2 && <StepBesoins data={data} onChange={onChange} />}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "32px",
                        paddingTop: "24px",
                        borderTop: "1px solid #f1f5f9",
                    }}>
                        <button
                            type="button"
                            onClick={goPrev}
                            style={{
                                display: "flex", alignItems: "center", gap: "6px",
                                padding: "10px 20px", borderRadius: "10px",
                                border: "1px solid #e2e8f0", background: "none",
                                color: "#64748b", fontSize: "14px", cursor: "pointer",
                                fontFamily: "inherit", transition: "all 0.15s",
                                visibility: step === 0 ? "hidden" : "visible",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
                        >
                            ← Retour
                        </button>

                        <button
                            type="button"
                            onClick={goNext}
                            disabled={!canNext()}
                            style={{
                                display: "flex", alignItems: "center", gap: "8px",
                                padding: "13px 32px", borderRadius: "12px",
                                border: "none",
                                background: canNext() ? "#7C3AED" : "#e2e8f0",
                                color: canNext() ? "#fff" : "#94a3b8",
                                fontSize: "15px", fontWeight: "600",
                                cursor: canNext() ? "pointer" : "not-allowed",
                                fontFamily: "inherit", transition: "all 0.2s",
                            }}
                            onMouseEnter={e => { if (canNext()) e.currentTarget.style.background = "#6d28d9"; }}
                            onMouseLeave={e => { if (canNext()) e.currentTarget.style.background = "#7C3AED"; }}
                        >
                            {step === STEPS.length - 1 ? "Voir mes offres 🔍" : "Continuer →"}
                        </button>
                    </div>
                </div>

                {/* Badges de confiance */}
                <div style={{ display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap" }}>
                    {["🔒 Données sécurisées", "⚡ Résultats en 30s", "🆓 100% gratuit"].map(t => (
                        <span key={t} style={{ fontSize: "12px", color: "#94a3b8" }}>{t}</span>
                    ))}
                </div>

            </div>
        </div>
    );
}