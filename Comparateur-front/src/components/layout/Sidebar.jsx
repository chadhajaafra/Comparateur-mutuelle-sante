import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
    LayoutDashboard, Users, ShieldPlus, GitCompare,
    FileText, ClipboardList, Settings, LogOut
} from 'lucide-react';

const nav = [
    {
        section: 'Principal',
        items: [
            { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { to: '/utilisateurs', icon: Users, label: 'Utilisateurs' },
            { to: '/mutuelles', icon: ShieldPlus, label: 'Mutuelles' },
            { to: '/comparateur', icon: GitCompare, label: 'Comparateur' },
        ],
    },
    {
        section: 'Gestion',
        items: [
            { to: '/devis', icon: FileText, label: 'Devis' },
            { to: '/souscriptions', icon: ClipboardList, label: 'Souscriptions' },
        ],
    },
    {
        section: 'Compte',
        items: [
            { to: '/parametres', icon: Settings, label: 'Paramètres' },
        ],
    },
];

export default function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const initials = user
        ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
        : 'U';

    return (
        <aside className="w-56 min-h-screen bg-slate-900 flex flex-col sticky top-0 h-screen">

            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-700/50">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">M</span>
                </div>
                <div>
                    <div className="text-white text-xs font-semibold leading-tight">Mutuelle</div>
                    <div className="text-slate-500 text-[10px]">Comparateur</div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-4">
                {nav.map(group => (
                    <div key={group.section}>
                        <p className="px-3 mb-1 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                            {group.section}
                        </p>
                        {group.items.map(({ to, icon: Icon, label }) => (
                            <NavLink key={to} to={to}
                                className={({ isActive }) =>
                                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all mb-0.5 ` +
                                    (isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200')
                                }
                            >
                                <Icon size={16} />
                                {label}
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>

            {/* User + logout */}
            <div className="border-t border-slate-700/50 p-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-slate-200 text-xs font-medium truncate">
                            {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-slate-500 text-[10px] truncate">{user?.role}</p>
                    </div>
                    <button
                        onClick={async () => { await logout(); navigate('/login'); }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-all"
                        title="Se déconnecter"
                    >
                        <LogOut size={14} />
                    </button>
                </div>
            </div>
        </aside>
    );
}