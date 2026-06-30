import { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Download, X, CheckCircle2, XCircle, Trash2, Plus } from 'lucide-react';
import { useComparateur } from '../../hooks/useComparateur';
import comparateurApi from '../../api/comparateurApi';

const TYPES_GARANTIE = [
    { id: 1, label: 'Santé générale' }, { id: 2, label: 'Dentaire' },
    { id: 3, label: 'Optique' }, { id: 4, label: 'Hospitalisation' },
    { id: 5, label: 'Maternité' }, { id: 6, label: 'Médecines douces' },
];

const NIVEAUX = {
    1: { label: 'Éco', color: '#15803d' },
    2: { label: 'Standard', color: '#b45309' },
    3: { label: 'Premium', color: '#7e22ce' },
};

function Row({ label, offres, render }) {
    return (
        <tr
            style={{ borderTop: '1px solid #f1f5f9' }}
            onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
            <td className="px-4 py-3 text-xs font-semibold" style={{ color: '#64748b' }}>{label}</td>
            {offres.map(o => (
                <td key={o.id} className="px-4 py-3 text-center" style={{ borderLeft: '1px solid #f1f5f9' }}>
                    {render(o)}
                </td>
            ))}
        </tr>
    );
}

export default function ComparaisonResultatPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const tableRef = useRef(null);
    const { ajouterOffre, retirerOffre, isInSession, nbOffres, viderSession } = useComparateur();

    // Critères transmis par le Wizard
    const criteres = location.state?.criteres ?? {};

    const [offres, setOffres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ── Charger les résultats de recherche au montage ──────────────────────
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await comparateurApi.rechercher({
                    budgetMax: criteres.budgetMax || undefined,
                    niveauSouhaite: criteres.niveauSouhaite || undefined,
                    typesGarantie: criteres.typesGarantie ?? [],
                    page: 1,
                    pageSize: 20,
                });
                setOffres(data.items ?? []);
            } catch (e) {
                setError('Impossible de charger les offres.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const exportPDF = async () => {
        const { default: html2pdf } = await import('html2pdf.js/dist/html2pdf.bundle.min.js');
        html2pdf()
            .set({
                margin: [10, 10],
                filename: 'comparaison-mutuelles.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
            })
            .from(tableRef.current)
            .save();
    };

    // ── Offres sélectionnées pour le tableau de comparaison ───────────────
    const offresSelectionnees = offres.filter(o => isInSession(o.id));

    // ── États ─────────────────────────────────────────────────────────────
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8fafc' }}>
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
                <p className="text-sm" style={{ color: '#64748b' }}>Recherche des meilleures offres…</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#f8fafc' }}>
            <p className="text-sm" style={{ color: '#ef4444' }}>{error}</p>
            <button onClick={() => navigate('/comparateur')}
                className="px-4 py-2 rounded-xl text-sm font-semibold"
                style={{ background: '#1d4ed8', color: '#fff' }}>
                Retour
            </button>
        </div>
    );

    if (offres.length === 0) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#f8fafc' }}>
            <p className="text-sm" style={{ color: '#64748b' }}>Aucune offre trouvée pour ces critères.</p>
            <button onClick={() => navigate('/comparateur')}
                className="px-4 py-2 rounded-xl text-sm font-semibold"
                style={{ background: '#1d4ed8', color: '#fff' }}>
                Modifier mes critères
            </button>
        </div>
    );

    return (
        <div className="min-h-screen" style={{ background: '#f8fafc' }}>
            <div className="max-w-6xl mx-auto px-4 py-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <button onClick={() => navigate('/comparateur')}
                        className="flex items-center gap-2 text-sm font-medium"
                        style={{ color: '#64748b' }}>
                        <ArrowLeft size={16} /> Retour
                    </button>
                    {offresSelectionnees.length > 0 && (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={async () => { await viderSession(); }}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
                                style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                                <Trash2 size={14} /> Vider
                            </button>
                            <button onClick={exportPDF}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
                                style={{ background: '#1d4ed8', color: '#fff' }}>
                                <Download size={14} /> Exporter PDF
                            </button>
                        </div>
                    )}
                </div>

                {/* Liste des offres trouvées */}
                <h2 className="text-lg font-bold mb-4" style={{ color: '#0f172a' }}>
                    {offres.length} offre{offres.length > 1 ? 's' : ''} trouvée{offres.length > 1 ? 's' : ''}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                    {offres.map(o => {
                        const added = isInSession(o.id);
                        const scoreColor = o.scoreTotal >= 75 ? '#15803d' : o.scoreTotal >= 50 ? '#1d4ed8' : '#b45309';
                        return (
                            <div key={o.id} className="rounded-2xl p-4"
                                style={{
                                    background: '#fff',
                                    border: added ? '2px solid #1d4ed8' : '1.5px solid #e2e8f0',
                                }}>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="font-bold text-sm" style={{ color: '#0f172a' }}>{o.nom}</p>
                                        <p className="text-xs" style={{ color: '#64748b' }}>{o.mutuelleNom}</p>
                                    </div>
                                    <span className="text-xl font-black tabular-nums" style={{ color: scoreColor }}>
                                        {o.scoreTotal}
                                    </span>
                                </div>
                                <p className="text-2xl font-black mb-3" style={{ color: '#0f172a' }}>
                                    {o.prixMensuel}€ <span className="text-xs font-normal" style={{ color: '#94a3b8' }}>/mois</span>
                                </p>
                                <button
                                    onClick={() => added ? retirerOffre(o.id) : ajouterOffre(o.id)}
                                    disabled={!added && nbOffres >= 3}
                                    className="w-full h-9 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                                    style={{
                                        background: added ? '#eff6ff' : nbOffres >= 3 ? '#f1f5f9' : '#1d4ed8',
                                        color: added ? '#1d4ed8' : nbOffres >= 3 ? '#94a3b8' : '#fff',
                                        border: added ? '1.5px solid #bfdbfe' : 'none',
                                        cursor: !added && nbOffres >= 3 ? 'not-allowed' : 'pointer',
                                    }}>
                                    {added
                                        ? <><CheckCircle2 size={13} /> Dans la comparaison</>
                                        : <><Plus size={13} /> Ajouter à la comparaison</>}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Tableau de comparaison — visible seulement si ≥2 offres sélectionnées */}
                {offresSelectionnees.length >= 2 && (
                    <>
                        <h2 className="text-lg font-bold mb-4" style={{ color: '#0f172a' }}>
                            Comparaison côte à côte
                        </h2>
                        <div ref={tableRef} className="rounded-2xl overflow-hidden"
                            style={{ background: '#fff', border: '1.5px solid #e2e8f0' }}>
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                        <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide"
                                            style={{ color: '#94a3b8', width: 160 }}>Critère</th>
                                        {offresSelectionnees.map(o => (
                                            <th key={o.id} className="px-4 py-4 text-center"
                                                style={{ borderLeft: '1px solid #e2e8f0' }}>
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="text-sm font-bold" style={{ color: '#0f172a' }}>{o.nom}</span>
                                                    <span className="text-xs" style={{ color: '#64748b' }}>{o.mutuelleNom}</span>
                                                    <button onClick={() => retirerOffre(o.id)}
                                                        className="text-xs flex items-center gap-1 mt-1"
                                                        style={{ color: '#94a3b8' }}
                                                        onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                                                        onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>
                                                        <X size={12} /> Retirer
                                                    </button>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <Row label="Score global" offres={offresSelectionnees} render={o => {
                                        const c = o.scoreTotal >= 75 ? '#15803d' : o.scoreTotal >= 50 ? '#1d4ed8' : '#b45309';
                                        return <span className="text-2xl font-black" style={{ color: c }}>{o.scoreTotal}</span>;
                                    }} />
                                    <Row label="Prix mensuel" offres={offresSelectionnees} render={o => (
                                        <span className="text-lg font-black" style={{ color: '#0f172a' }}>{o.prixMensuel}€</span>
                                    )} />
                                    <Row label="Niveau" offres={offresSelectionnees} render={o => {
                                        const cfg = NIVEAUX[o.niveau];
                                        return (
                                            <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                                                style={{ background: cfg.color + '15', color: cfg.color }}>
                                                {cfg.label}
                                            </span>
                                        );
                                    }} />
                                    <tr style={{ borderTop: '2px solid #f1f5f9' }}>
                                        <td colSpan={offresSelectionnees.length + 1} className="px-4 py-2">
                                            <span className="text-xs font-bold uppercase tracking-wide" style={{ color: '#94a3b8' }}>
                                                Garanties
                                            </span>
                                        </td>
                                    </tr>
                                    {TYPES_GARANTIE.map(type => (
                                        <Row key={type.id} label={type.label} offres={offresSelectionnees} render={o => {
                                            const g = o.garanties.find(g => g.type === type.label);
                                            if (!g) return <XCircle size={16} style={{ color: '#e2e8f0', margin: '0 auto' }} />;
                                            return (
                                                <div className="flex flex-col items-center gap-0.5">
                                                    <CheckCircle2 size={14} style={{ color: '#15803d' }} />
                                                    <span className="text-xs font-bold" style={{ color: '#0f172a' }}>
                                                        {g.tauxRemboursement}%
                                                    </span>
                                                    {g.plafond && (
                                                        <span className="text-[10px]" style={{ color: '#94a3b8' }}>
                                                            {g.plafond}€/an
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        }} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {offresSelectionnees.length === 1 && (
                    <p className="text-sm text-center mt-4" style={{ color: '#94a3b8' }}>
                        Ajoutez au moins une autre offre pour voir la comparaison côte à côte.
                    </p>
                )}
            </div>
        </div>
    );
}