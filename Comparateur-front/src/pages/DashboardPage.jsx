import { MdPeople, MdHealthAndSafety, MdDescription, MdAssignment } from 'react-icons/md';
import './DashboardPage.css';

const stats = [
    { label: 'Utilisateurs', value: '1 284', trend: '+12%', icon: <MdPeople size={22} />, color: '#2563eb' },
    { label: 'Mutuelles', value: '48', trend: '+3', icon: <MdHealthAndSafety size={22} />, color: '#16a34a' },
    { label: 'Devis générés', value: '327', trend: '+18%', icon: <MdDescription size={22} />, color: '#d97706' },
    { label: 'Souscriptions', value: '89', trend: '+7%', icon: <MdAssignment size={22} />, color: '#7c3aed' },
];

const mutuelles = [
    { nom: 'Harmonie Santé', garantie: 'Complète', prix: '89 €', statut: 'Actif' },
    { nom: 'MGEN Plus', garantie: 'Standard', prix: '64 €', statut: 'Actif' },
    { nom: 'Malakoff Pro', garantie: 'Premium', prix: '124 €', statut: 'Nouveau' },
    { nom: 'Swiss Life', garantie: 'Eco', prix: '42 €', statut: 'En cours' },
];

const statusClass = { 'Actif': 'badge-success', 'Nouveau': 'badge-info', 'En cours': 'badge-warning' };

export default function DashboardPage() {
    return (
        <div>
            <p className="page-title">Bonjour 👋</p>
            <p className="page-sub">Voici un aperçu de votre plateforme aujourd'hui.</p>

            {/* Stats */}
            <div className="dash-stats">
                {stats.map(s => (
                    <div key={s.label} className="card dash-stat">
                        <div className="dash-stat__icon" style={{ background: s.color + '18', color: s.color }}>
                            {s.icon}
                        </div>
                        <div>
                            <div className="dash-stat__label">{s.label}</div>
                            <div className="dash-stat__value">{s.value}</div>
                            <div className="dash-stat__trend">{s.trend} ce mois</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="card">
                <div className="dash-table-head">
                    <span className="dash-table-title">Dernières mutuelles</span>
                </div>
                <table className="dash-table">
                    <thead>
                        <tr>
                            <th>Mutuelle</th><th>Garantie</th><th>Prix / mois</th><th>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mutuelles.map(m => (
                            <tr key={m.nom}>
                                <td>{m.nom}</td>
                                <td>{m.garantie}</td>
                                <td>{m.prix}</td>
                                <td><span className={`badge ${statusClass[m.statut]}`}>{m.statut}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}