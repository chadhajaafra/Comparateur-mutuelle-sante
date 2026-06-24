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
import ComparateurPage from './pages/comparateur/ComparateurWizard';
import ComparaisonResultatPage from './pages/comparateur/ComparaisonResultatPage';
import { ThemeProvider } from './context/ThemeProvider';


export default function App() {
    return (
        <ThemeProvider>
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
                            <Rhttps://github.com/chadhajaafra/Comparateur-mutuelle-sante/pull/32/conflict?name=Comparateur-front%252Fsrc%252FApp.jsx&ancestor_oid=4611fdcb19526793c6e258fba088ad0691662dd2&base_oid=cf3effd8273c4312fe561d81bc87fdef96c80188&head_oid=40f27396e9cbb302efb5ba80a84ef369eb8ed9c3oute path="/mutuelles/nouvelle" element={<MutuelleFormPage />} />
                            <Route path="/mutuelles/:id" element={<MutuelleDetailPage />} />
                            <Route path="/mutuelles/:id/offres/nouvelle" element={<OffreFormPage />} />
                            <Route path="/mutuelles/:id/modifier" element={<MutuelleEditPage />} />
                            <Route path="/mutuelles/:mutuelleId/offres/:offreId/garanties/nouvelle" element={<AddGarantieToOffre />} />
                            <Route path="/mutuelles/:mutuelleId/offres/:offreId/modifier" element={<OffreEditPage />} />
                            <Route path="/garanties" element={<CatalogueGarantiesPage />} />
                            <Route path="/utilisateurs" element={<div className="page-title">Utilisateurs — à venir</div>} />
                            <Route path="/devis" element={<div className="page-title">Devis — à venir</div>} />
                            <Route path="/souscriptions" element={<div className="page-title">Souscriptions — à venir</div>} />
                            <Route path="/parametres" element={<div className="page-title">Paramètres — à venir</div>} />
                            <Route path="/comparateur" element={<ComparateurPage />} />
                            <Route path="/comparateur/resultat" element={<ComparaisonResultatPage />} />
                            </Route>
                        </Route>

                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
                </AuthProvider>
            </BrowserRouter>
        </ThemeProvider>
    );
}