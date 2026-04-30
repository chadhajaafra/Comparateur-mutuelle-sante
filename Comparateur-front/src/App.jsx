import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import { ForgotPasswordPage, ResetPasswordPage } from './pages/auth/PasswordPages';
import DashboardPage from './pages/DashboardPage';
import MutuellesPage from './pages/mutuelles/MutuellesPage';
import MutuelleDetailPage from './pages/mutuelles/MutuelleDetailPage';
import MutuelleFormPage from './pages/mutuelles/MutuelleFormPage';


export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Routes publiques */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />

                    {/* Routes protégées avec layout */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<AppLayout />}>
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/mutuelles" element={<MutuellesPage />} />
                            <Route path="/mutuelles/nouvelle" element={<MutuelleFormPage />} />
                            <Route path="/mutuelles/:id" element={<MutuelleDetailPage />} />
                            <Route path="/comparateur" element={<div className="page-title">Comparateur — à venir</div>} />
                            <Route path="/utilisateurs" element={<div className="page-title">Utilisateurs — à venir</div>} />
                            <Route path="/devis" element={<div className="page-title">Devis — à venir</div>} />
                            <Route path="/souscriptions" element={<div className="page-title">Souscriptions — à venir</div>} />
                            <Route path="/parametres" element={<div className="page-title">Paramètres — à venir</div>} />
                        </Route>
                    </Route>

                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}