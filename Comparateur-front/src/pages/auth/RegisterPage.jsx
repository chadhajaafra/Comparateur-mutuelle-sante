import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './auth.css';

const ROLES = [
    { value: 1, label: 'Particulier', desc: 'Je cherche une mutuelle pour moi' },
    { value: 2, label: 'Assureur', desc: 'Je propose des offres de mutuelle' },
];

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        firstName: '', lastName: '', email: '',
        password: '', confirmPassword: '', role: 1,
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    const validateStep1 = () => {
        const e = {};
        if (!form.firstName.trim()) e.firstName = 'Prénom requis';
        if (!form.lastName.trim()) e.lastName = 'Nom requis';
        if (!form.email) e.email = 'Email requis';
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email invalide';
        return e;
    };

    const validateStep2 = () => {
        const e = {};
        if (!form.password) e.password = 'Mot de passe requis';
        else if (form.password.length < 8) e.password = 'Minimum 8 caractères';
        else if (!/[A-Z]/.test(form.password)) e.password = 'Au moins une majuscule';
        else if (!/[0-9]/.test(form.password)) e.password = 'Au moins un chiffre';
        if (form.password !== form.confirmPassword) e.confirmPassword = 'Les mots de passe ne correspondent pas';
        return e;
    };

    const handleNext = () => {
        const errs = validateStep1();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({});
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validateStep2();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setLoading(true);
        setServerError('');
        try {
            await register({
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                password: form.password,
                role: form.role,
            });
            navigate('/dashboard');
        } catch (err) {
            const data = err.response?.data;
            if (data?.errors) {
                const flat = {};
                Object.entries(data.errors).forEach(([k, v]) => { flat[k.toLowerCase()] = v[0]; });
                setErrors(flat);
            } else {
                setServerError(data?.title || 'Une erreur est survenue.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
        setErrors(er => ({ ...er, [e.target.name]: '' }));
    };

    return (
        <div className="auth-page">
            <div className="auth-left">
                <div className="auth-brand">
                    <span className="brand-icon">?</span>
                    <span className="brand-name">MutuelleComparateur</span>
                </div>
                <div className="auth-hero">
                    <h1>Rejoignez des milliers d'utilisateurs satisfaits</h1>
                    <p>Inscription gratuite, sans engagement. Comparez et souscrivez en toute confiance.</p>
                    <div className="steps-visual">
                        <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
                        <div className="step-line" />
                        <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
                    </div>
                </div>
            </div>

            <div className="auth-right">
                <div className="auth-card">
                    <div className="auth-card-header">
                        <h2>{step === 1 ? 'Créer un compte' : 'Sécurisez votre accès'}</h2>
                        <p>Déjà inscrit ? <Link to="/login">Se connecter</Link></p>
                    </div>

                    {serverError && <div className="alert alert-error">{serverError}</div>}

                    {step === 1 && (
                        <div>
                            {/* Sélection du rôle */}
                            <div className="role-selector">
                                {ROLES.map(r => (
                                    <div
                                        key={r.value}
                                        className={`role-card ${form.role === r.value ? 'selected' : ''}`}
                                        onClick={() => setForm(f => ({ ...f, role: r.value }))}
                                    >
                                        <span className="role-label">{r.label}</span>
                                        <span className="role-desc">{r.desc}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="field-row">
                                <div className="field">
                                    <label>Prénom</label>
                                    <input type="text" name="firstName" value={form.firstName}
                                        onChange={handleChange} placeholder="Jean"
                                        className={errors.firstName ? 'error' : ''} />
                                    {errors.firstName && <span className="field-error">{errors.firstName}</span>}
                                </div>
                                <div className="field">
                                    <label>Nom</label>
                                    <input type="text" name="lastName" value={form.lastName}
                                        onChange={handleChange} placeholder="Dupont"
                                        className={errors.lastName ? 'error' : ''} />
                                    {errors.lastName && <span className="field-error">{errors.lastName}</span>}
                                </div>
                            </div>

                            <div className="field">
                                <label>Email</label>
                                <input type="email" name="email" value={form.email}
                                    onChange={handleChange} placeholder="vous@example.com"
                                    className={errors.email ? 'error' : ''} />
                                {errors.email && <span className="field-error">{errors.email}</span>}
                            </div>

                            <button type="button" className="btn-primary" onClick={handleNext}>
                                Continuer ?
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="field">
                                <label>Mot de passe</label>
                                <input type="password" name="password" value={form.password}
                                    onChange={handleChange} placeholder="••••••••"
                                    className={errors.password ? 'error' : ''} />
                                {errors.password && <span className="field-error">{errors.password}</span>}
                                <div className="password-hints">
                                    {[
                                        { ok: form.password.length >= 8, label: '8 caractères minimum' },
                                        { ok: /[A-Z]/.test(form.password), label: 'Une majuscule' },
                                        { ok: /[0-9]/.test(form.password), label: 'Un chiffre' },
                                    ].map(h => (
                                        <span key={h.label} className={`hint ${h.ok ? 'ok' : ''}`}>
                                            {h.ok ? '?' : '?'} {h.label}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="field">
                                <label>Confirmer le mot de passe</label>
                                <input type="password" name="confirmPassword" value={form.confirmPassword}
                                    onChange={handleChange} placeholder="••••••••"
                                    className={errors.confirmPassword ? 'error' : ''} />
                                {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
                            </div>

                            <div className="btn-group">
                                <button type="button" className="btn-secondary" onClick={() => setStep(1)}>? Retour</button>
                                <button type="submit" className="btn-primary" disabled={loading}>
                                    {loading ? <span className="spinner-sm" /> : "S'inscrire"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}