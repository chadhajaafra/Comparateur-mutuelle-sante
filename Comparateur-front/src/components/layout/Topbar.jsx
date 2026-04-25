import { useLocation } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';

const titles = {
    '/dashboard': 'Dashboard',
    '/utilisateurs': 'Utilisateurs',
    '/mutuelles': 'Mutuelles',
    '/comparateur': 'Comparateur',
    '/devis': 'Devis',
    '/souscriptions': 'Souscriptions',
    '/parametres': 'Paramètres',
};

export default function Topbar() {
    const { pathname } = useLocation();

    return (
        <header className="h-14 bg-white border-b border-slate-200 flex items-center gap-4 px-6 sticky top-0 z-10">
            <h1 className="text-base font-semibold text-slate-900 flex-1">
                {titles[pathname] ?? 'Page'}
            </h1>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 h-9 w-56">
                <Search size={14} className="text-slate-400" />
                <input
                    placeholder="Rechercher..."
                    className="bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none w-full"
                />
            </div>
            <button className="relative w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-all">
                <Bell size={16} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
        </header>
    );
}