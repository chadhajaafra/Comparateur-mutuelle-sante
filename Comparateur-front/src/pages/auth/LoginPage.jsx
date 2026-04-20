import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './auth.css';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const e = {};
        if (!form.email) e.email = 'Email requis';
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email invalide';
        if (!form.password) e.password = 'Mot de passe requis';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setLoading(true);
        setServerError('');
        try {
            const data = await login(form.email, form.password);
            if (data.role === 'Administrateur') navigate('/admin/dashboard');
            else if (data.role === 'Assureur') navigate('/assureur/dashboard');
            else navigate('/dashboard');
        } catch (err) {
            setServerError(err.response?.data?.title || 'Identifiants incorrects.');
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
                    <h1>Trouvez la mutuelle idéale pour vous</h1>
                    <p>Comparez des centaines d'offres en quelques secondes et économisez sur votre santé.</p>
                    <div className="auth-stats">
                        <div className="stat"><span className="stat-num">200+</span><span className="stat-label">Mutuelles</span></div>
                        <div className="stat"><span className="stat-num">98%</span><span className="stat-label">Satisfaction</span></div>
                        <div className="stat"><span className="stat-num">0€</span><span className="stat-label">Commission</span></div>
                    </div>
                </div>
            </div>

            <div className="auth-right">
                <div className="auth-card">
                    <div className="auth-card-header">
                        <h2>Connexion</h2>
                        <p>Pas encore de compte ? <Link to="/register">S'inscrire</Link></p>
                    </div>

                    {serverError && <div className="alert alert-error">{serverError}</div>}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="field">
                            <label>Email</label>
                            <input
                                type="email" name="email" value={form.email}
                                onChange={handleChange} placeholder="vous@example.com"
                                className={errors.email ? 'error' : ''}
                            />
                            {errors.email && <span className="field-error">{errors.email}</span>}
                        </div>

                        <div className="field">
                            <label>
                                Mot de passe
                                <Link to="/forgot-password" className="forgot-link">Mot de passe oublié ?</Link>
                            </label>
                            <input
                                type="password" name="password" value={form.password}
                                onChange={handleChange} placeholder="••••••••"
                                className={errors.password ? 'error' : ''}
                            />
                            {errors.password && <span className="field-error">{errors.password}</span>}
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? <span className="spinner-sm" /> : 'Se connecter'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}