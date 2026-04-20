import { useAuth } from "../hooks/useAuth";
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'DM Sans, sans-serif' }}>
            <header style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: '#0f172a' }}>
                    ⚕ MutuelleComparateur
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Bonjour, <strong style={{ color: '#0f172a' }}>{user?.firstName}</strong></span>
                    <button
                        onClick={handleLogout}
                        style={{ padding: '0.5rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', background: 'transparent', cursor: 'pointer', fontSize: '0.85rem', color: '#64748b' }}
                    >
                        Déconnexion
                    </button>
                </div>
            </header>
            <main style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: '2rem', color: '#0f172a', marginBottom: '1rem' }}>
                    Tableau de bord
                </h1>
                <p style={{ color: '#64748b' }}>Authentification réussie ✅ — Rôle : <strong>{user?.role}</strong></p>
            </main>
        </div>
    );
}