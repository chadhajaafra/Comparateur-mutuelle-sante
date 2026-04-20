import { useState } from 'react';
import { Link } from 'react-router-dom';
import authApi from '../../api/authApi';
import './auth.css';

// ?? Forgot Password ????????????????????????????????????????????????????????
export function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) { setError('Email requis'); return; }
        setLoading(true);
        try {
            await authApi.forgotPassword(email);
            setSent(true);
        } catch {
            setSent(true); // Même message pour ne pas révéler si l'email existe
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page auth-page--centered">
            <div className="auth-card auth-card--solo">
                <div className="auth-brand-inline">
                    <span className="brand-icon">?</span>
                    <span className="brand-name">MutuelleComparateur</span>
                </div>

                {!sent ? (
                    <>
                        <div className="auth-card-header">
                            <h2>Mot de passe oublié ?</h2>
                            <p>Entrez votre email pour recevoir un lien de réinitialisation.</p>
                        </div>
                        {error && <div className="alert alert-error">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="field">
                                <label>Email</label>
                                <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
                                    placeholder="vous@example.com" />
                            </div>
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? <span className="spinner-sm" /> : 'Envoyer le lien'}
                            </button>
                        </form>
                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                            <Link to="/login" className="back-link">? Retour à la connexion</Link>
                        </div>
                    </>
                ) : (
                    <div className="success-state">
                        <div className="success-icon">??</div>
                        <h2>Email envoyé !</h2>
                        <p>Si cette adresse est associée à un compte, vous recevrez un lien dans quelques minutes.</p>
                        <Link to="/login" className="btn-primary" style={{ display: 'inline-block', marginTop: '1.5rem' }}>
                            Retour à la connexion
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

// ?? Reset Password ?????????????????????????????????????????????????????????
export function ResetPasswordPage() {
    const token = new URLSearchParams(window.location.search).get('token') || '';
    const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const validate = () => {
        const e = {};
        if (form.newPassword.length < 8) e.newPassword = 'Minimum 8 caractères';
        else if (!/[A-Z]/.test(form.newPassword)) e.newPassword = 'Au moins une majuscule';
        else if (!/[0-9]/.test(form.newPassword)) e.newPassword = 'Au moins un chiffre';
        if (form.newPassword !== form.confirmPassword) e.confirmPassword = 'Les mots de passe ne correspondent pas';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setLoading(true);
        try {
            await authApi.resetPassword({ token, ...form });
            setSuccess(true);
        } catch (err) {
            setServerError(err.response?.data?.title || 'Lien invalide ou expiré.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
        setErrors(er => ({ ...er, [e.target.name]: '' }));
    };

    return (
        <div className="auth-page auth-page--centered">
            <div className="auth-card auth-card--solo">
                <div className="auth-brand-inline">
                    <span className="brand-icon">?</span>
                    <span className="brand-name">MutuelleComparateur</span>
                </div>

                {!success ? (
                    <>
                        <div className="auth-card-header">
                            <h2>Nouveau mot de passe</h2>
                            <p>Choisissez un mot de passe sécurisé.</p>
                        </div>
                        {serverError && <div className="alert alert-error">{serverError}</div>}
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="field">
                                <label>Nouveau mot de passe</label>
                                <input type="password" name="newPassword" value={form.newPassword}
                                    onChange={handleChange} placeholder="••••••••"
                                    className={errors.newPassword ? 'error' : ''} />
                                {errors.newPassword && <span className="field-error">{errors.newPassword}</span>}
                                <div className="password-hints">
                                    {[
                                        { ok: form.newPassword.length >= 8, label: '8 caractères' },
                                        { ok: /[A-Z]/.test(form.newPassword), label: 'Majuscule' },
                                        { ok: /[0-9]/.test(form.newPassword), label: 'Chiffre' },
                                    ].map(h => (
                                        <span key={h.label} className={`hint ${h.ok ? 'ok' : ''}`}>
                                            {h.ok ? '?' : '?'} {h.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="field">
                                <label>Confirmer</label>
                                <input type="password" name="confirmPassword" value={form.confirmPassword}
                                    onChange={handleChange} placeholder="••••••••"
                                    className={errors.confirmPassword ? 'error' : ''} />
                                {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
                            </div>
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? <span className="spinner-sm" /> : 'Réinitialiser'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="success-state">
                        <div className="success-icon">?</div>
                        <h2>Mot de passe mis à jour !</h2>
                        <p>Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
                        <Link to="/login" className="btn-primary" style={{ display: 'inline-block', marginTop: '1.5rem' }}>
                            Se connecter
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}