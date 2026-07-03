import { useLocation } from "react-router-dom";
import { Bell, Search, Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const titles = {
    "/dashboard": "Dashboard",
    "/utilisateurs": "Utilisateurs",
    "/mutuelles": "Mutuelles",
    "/comparateur": "Comparateur",
    "/AnalyseContratPage": "Comparateur IA",
    "/souscriptions": "Souscriptions",
    "/garanties": "Garanties",
};

export default function Topbar() {
    const { pathname } = useLocation();
    const { theme, toggleTheme } = useTheme();

    const title = titles[pathname] || "Dashboard";

    return (
        <header className="sticky top-0 z-50 px-6 pt-4">
            <div className="flex items-center justify-between
                bg-white/60 dark:bg-slate-900/60
                backdrop-blur-xl
                border border-slate-200 dark:border-slate-800
                rounded-2xl
                px-5 py-3
                shadow-sm">

                {/* TITLE */}
                <div>
                    <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {title}
                    </h1>
                </div>

                {/* SEARCH */}
                <div className="hidden md:flex items-center gap-2
                    bg-slate-100/60 dark:bg-slate-800/60
                    px-3 py-2 rounded-xl w-80
                    border border-transparent
                    focus-within:border-violet-400 transition">

                    <Search size={16} className="text-slate-400" />
                    <input
                        placeholder="Rechercher..."
                        className="bg-transparent text-sm outline-none w-full
                        text-slate-700 dark:text-slate-200"
                    />
                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-2">

                    {/* THEME */}
                    <button
                        onClick={toggleTheme}
                        className="w-10 h-10 flex items-center justify-center
                        rounded-xl
                        bg-slate-100 dark:bg-slate-800
                        hover:bg-slate-200 dark:hover:bg-slate-700
                        transition"
                    >
                        {theme === "dark" ? (
                            <Sun size={18} className="text-yellow-400" />
                        ) : (
                            <Moon size={18} className="text-slate-600" />
                        )}
                    </button>

                    {/* NOTIF */}
                    <button className="relative w-10 h-10 flex items-center justify-center
                        rounded-xl
                        bg-slate-100 dark:bg-slate-800
                        hover:bg-slate-200 dark:hover:bg-slate-700
                        transition">

                        <Bell size={18} className="text-slate-600 dark:text-slate-300" />

                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                    </button>

                </div>
            </div>
        </header>
    );
}