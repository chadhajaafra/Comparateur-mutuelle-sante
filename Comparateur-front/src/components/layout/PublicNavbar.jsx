// src/components/layout/PublicNavbar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Shield, LogIn } from "lucide-react";
import Button from "../ui/Button";

const LIENS = [
    { label: "Accueil", path: "/comparateur" },
    { label: "Assistant IA", path: "/comparateur/assistant" },
    { label: "Analyser mon contrat", path: "/comparateur/analyse-contrat" },
];

export default function PublicNavbar() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-950/70 border-b border-slate-100 dark:border-slate-800">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/comparateur" className="flex items-center gap-2">
                    <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}
                    >
                        <Shield size={16} className="text-white" />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">
                        Comparateur<span style={{ color: "#7c3aed" }}>Mutuelle</span>
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-1">
                    {LIENS.map((lien) => {
                        const actif = location.pathname === lien.path;
                        return (
                            <Link
                                key={lien.path}
                                to={lien.path}
                                className="relative px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                                style={{ color: actif ? "#7c3aed" : "#64748b" }}
                            >
                                {lien.label}
                                {actif && (
                                    <span
                                        className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                                        style={{ background: "#7c3aed" }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<LogIn size={14} />}
                    onClick={() => navigate("/login")}
                >
                    Connexion
                </Button>
            </div>
        </header>
    );
}