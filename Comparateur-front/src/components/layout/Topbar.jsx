import { MdNotifications, MdSearch } from 'react-icons/md';
import { useLocation } from 'react-router-dom';
import './Topbar.css';

const pageTitles = {
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
    const title = pageTitles[pathname] ?? 'Page';

    return (
        <header className="topbar">
            <h1 className="topbar__title">{title}</h1>
            <div className="topbar__search">
                <MdSearch size={16} color="#94a3b8" />
                <input placeholder="Rechercher..." />
            </div>
            <button className="topbar__notif">
                <MdNotifications size={20} />
                <span className="topbar__notif-dot" />
            </button>
        </header>
    );
}