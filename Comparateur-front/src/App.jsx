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
import OffreFormPage from './pages/mutuelles/OffreFormPage';
import AddGarantieToOffre from './pages/mutuelles/AddGarantieToOffre';
import CatalogueGarantiesPage from './pages/mutuelles/CatalogueGarantiesPage';
import MutuelleEditPage from './pages/mutuelles/MutuelleEditPage';
import OffreEditPage from './pages/mutuelles/OffreEditPage';
import ComparateurWizard from './pages/comparateur/ComparateurWizard';
import Comparaisonresultat from './pages/comparateur/Comparaisonresultat';
import AnalyseContratPage from './pages/comparateur/AnalyseContratPage';
import { ThemeProvider } from './context/ThemeProvider';
import AssistantChatPage from './pages/comparateur/AssistantChatPage';
import ComparateurLandingPage from './pages/comparateur/ComparateurLandingPage';

export default function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        {/* ─── ROUTES AUTH ─── */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />

                        {/* ─── MODULE COMPARATEUR — PUBLIC, sans sidebar admin, sans connexion ─── */}
                        <Route path="/comparateur" element={<ComparateurLandingPage />} />
                        <Route path="/comparateur/wizard" element={<ComparateurWizard />} />
                        <Route path="/comparateur/assistant" element={<AssistantChatPage />} />
                        <Route path="/comparateur/analyse-contrat" element={<AnalyseContratPage />} />
                        <Route path="/comparateur/resultat" element={<Comparaisonresultat />} />

                        {/* ─── ROUTES PROTEGEES — sidebar admin, connexion requise ─── */}
                        <Route element={<ProtectedRoute />}>
                            <Route element={<AppLayout />}>
                                <Route path="/dashboard" element={<DashboardPage />} />
                                <Route path="/mutuelles" element={<MutuellesPage />} />
                                <Route path="/mutuelles/:id" element={<MutuelleDetailPage />} />
                                <Route path="/mutuelles/nouvelle" element={<MutuelleFormPage />} />
                                <Route path="/mutuelles/:id/offres/nouvelle" element={<OffreFormPage />} />
                                <Route path="/mutuelles/:id/modifier" element={<MutuelleEditPage />} />
                                <Route path="/mutuelles/:mutuelleId/offres/:offreId/garanties/nouvelle" element={<AddGarantieToOffre />} />
                                <Route path="/mutuelles/:mutuelleId/offres/:offreId/modifier" element={<OffreEditPage />} />
                                <Route path="/garanties" element={<CatalogueGarantiesPage />} />
                                <Route path="/utilisateurs" element={<div className="page-title">Utilisateurs — à venir</div>} />
                                <Route path="/devis" element={<div className="page-title">Devis — à venir</div>} />
                                <Route path="/souscriptions" element={<div className="page-title">Souscriptions — à venir</div>} />
                                <Route path="/parametres" element={<div className="page-title">Paramètres — à venir</div>} />
                            </Route>
                        </Route>

                        <Route path="/" element={<Navigate to="/comparateur" replace />} />
                        <Route path="*" element={<Navigate to="/comparateur" replace />} />
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </ThemeProvider>
    );
}