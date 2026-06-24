import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, X, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import { useComparateur } from '../../hooks/useComparateur';
import { motion } from 'framer-motion';


const TYPES_GARANTIE = [
    { id: 1, label: 'Santé générale' }, { id: 2, label: 'Dentaire' },
    { id: 3, label: 'Optique' }, { id: 4, label: 'Hospitalisation' },
    { id: 5, label: 'Maternité' }, { id: 6, label: 'Médecines douces' },
];

const NIVEAUX = { 1: { label: 'Éco', color: '#15803d' }, 2: { label: 'Standard', color: '#b45309' }, 3: { label: 'Premium', color: '#7e22ce' } };

function CellValue({ offres, accessor, render }) {
    return (
        <>
            {offres.map(o => (
                <td key={o.id} className="px-4 py-3 text-center text-sm"
                    style={{ color: '#0f172a', borderLeft: '1px solid #f1f5f9' }}>
                    {render ? render(accessor(o), o) : accessor(o)}
                </td>
            ))}
        </>
    );
}

export default function ComparaisonResultatPage() {
    const navigate = useNavigate();
    const { session, retirerOffre, viderSession } = useComparateur();
    const tableRef = useRef(null);

    const offres = session?.offres ?? [];

    const exportPDF = async () => {
        const { default: html2pdf } = await import('html2pdf.js');
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

    if (offres.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4"
                style={{ background: '#f8fafc' }}>
                <p className="text-sm" style={{ color: '#64748b' }}>Aucune offre sélectionnée.</p>
                <button onClick={() => navigate('/comparateur')}
                    className="px-4 py-2 rounded-xl text-sm font-semibold"
                    style={{ background: '#1d4ed8', color: '#fff' }}>
                    Retour au comparateur
                </button>
            </div>
        );
    }

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
                    <div className="flex items-center gap-3">
                        <button
                            onClick={async () => { await viderSession(); navigate('/comparateur'); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                            style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                            <Trash2 size={14} /> Vider
                        </button>
                        <button onClick={exportPDF}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
                            style={{
                                background: '#1d4ed8', color: '#fff',
                                boxShadow: '0 2px 8px rgba(29,78,216,0.25)'
                            }}>
                            <Download size={14} /> Exporter PDF
                        </button>
                    </div>
                </div>

                <h1 className="text-xl font-bold mb-6" style={{ color: '#0f172a' }}>
                    Comparaison de {offres.length} offre{offres.length > 1 ? 's' : ''}
                </h1>

                {/* Table */}
                <div ref={tableRef} className="rounded-2xl overflow-hidden"
                    style={{
                        background: '#ffffff', border: '1.5px solid #e2e8f0',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide"
                                    style={{ color: '#94a3b8', width: 160 }}>Critère</th>
                                {offres.map(o => (
                                    <th key={o.id} className="px-4 py-4 text-center"
                                        style={{ borderLeft: '1px solid #e2e8f0' }}>
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-sm font-bold" style={{ color: '#0f172a' }}>{o.nom}</span>
                                            <span className="text-xs" style={{ color: '#64748b' }}>{o.mutuelleNom}</span>
                                            <button onClick={() => retirerOffre(o.id)}
                                                className="text-xs flex items-center gap-1 mt-1 transition-colors"
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
                            {/* Score */}
                            <Row label="Score global" offres={offres} render={(o) => {
                                const c = o.scoreTotal >= 75 ? '#15803d' : o.scoreTotal >= 50 ? '#1d4ed8' : '#b45309';
                                return (
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-2xl font-black tabular-nums" style={{ color: c }}>
                                            {o.scoreTotal}
                                        </span>
                                        <div className="w-full h-1.5 rounded-full overflow-hidden"
                                            style={{ background: '#f1f5f9', maxWidth: 80 }}>
                                            <div className="h-full rounded-full" style={{ width: `${o.scoreTotal}%`, background: c }} />
                                        </div>
                                    </div>
                                );
                            }} />

                            {/* Prix */}
                            <Row label="Prix mensuel" offres={offres} render={(o) => (
                                <span className="text-lg font-black" style={{ color: '#0f172a' }}>
                                    {o.prixMensuel}€
                                </span>
                            )} />

                            {/* Niveau */}
                            <Row label="Niveau" offres={offres} render={(o) => {
                                const cfg = NIVEAUX[o.niveau];
                                return (
                                    <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                                        style={{ background: cfg.color + '15', color: cfg.color }}>
                                        {cfg.label}
                                    </span>
                                );
                            }} />

                            {/* Garanties par type */}
                            <tr style={{ borderTop: '2px solid #f1f5f9' }}>
                                <td colSpan={offres.length + 1} className="px-4 py-2">
                                    <span className="text-xs font-bold uppercase tracking-wide"
                                        style={{ color: '#94a3b8' }}>Garanties</span>
                                </td>
                            </tr>
                            {TYPES_GARANTIE.map(type => (
                                <Row key={type.id} label={type.label} offres={offres} render={(o) => {
                                    const g = o.garanties.find(g => g.type === type.label || g.nom === type.label);
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
            </div>
        </div>
    );
}

function Row({ label, offres, render }) {
    return (
        <tr style={{ borderTop: '1px solid #f1f5f9' }}
            onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <td className="px-4 py-3 text-xs font-semibold" style={{ color: '#64748b' }}>{label}</td>
            {offres.map(o => (
                <td key={o.id} className="px-4 py-3 text-center"
                    style={{ borderLeft: '1px solid #f1f5f9' }}>
                    {render(o)}
                </td>
            ))}
        </tr>
    );
}