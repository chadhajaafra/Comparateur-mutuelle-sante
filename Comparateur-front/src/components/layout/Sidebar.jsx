import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
    MdDashboard, MdPeople, MdHealthAndSafety,
    MdCompare, MdDescription, MdAssignment,
    MdSettings, MdLogout
} from 'react-icons/md';
import './Sidebar.css';

const navItems = [
    {
        section: 'Principal',
        items: [
            { to: '/dashboard', icon: <MdDashboard />, label: 'Dashboard' },
            { to: '/utilisateurs', icon: <MdPeople />, label: 'Utilisateurs' },
            { to: '/mutuelles', icon: <MdHealthAndSafety />, label: 'Mutuelles' },
            { to: '/comparateur', icon: <MdCompare />, label: 'Comparateur' },
        ]
    },
    {
        section: 'Gestion',
        items: [
            { to: '/devis', icon: <MdDescription />, label: 'Devis' },
            { to: '/souscriptions', icon: <MdAssignment />, label: 'Souscriptions' },
        ]
    },
    {
        section: 'Compte',
        items: [
            { to: '/parametres', icon: <MdSettings />, label: 'Paramètres' },
        ]
    }
];

export default function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const initials = user
        ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
        : 'U';

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar__logo">
                <div className="sidebar__logo-icon">M</div>
                <div>
                    <div className="sidebar__logo-name">Mutuelle</div>
                    <div className="sidebar__logo-sub">Comparateur</div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="sidebar__nav">
                {navItems.map(group => (
                    <div key={group.section} className="sidebar__group">
                        <span className="sidebar__section">{group.section}</span>
                        {group.items.map(item => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    `sidebar__item ${isActive ? 'sidebar__item--active' : ''}`
                                }
                            >
                                <span className="sidebar__icon">{item.icon}</span>
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>

            {/* User + logout */}
            <div className="sidebar__footer">
                <div className="sidebar__user">
                    <div className="sidebar__avatar">{initials}</div>
                    <div className="sidebar__user-info">
                        <div className="sidebar__user-name">{user?.firstName} {user?.lastName}</div>
                        <div className="sidebar__user-role">{user?.role}</div>
                    </div>
                </div>
                <button className="sidebar__logout" onClick={handleLogout} title="Se déconnecter">
                    <MdLogout size={18} />
                </button>
            </div>
        </aside>
    );
}