import { ShieldCheck, TrendingUp, Star } from 'lucide-react';
import { motion } from "framer-motion";

const features = [
    { icon: ShieldCheck, text: '200+ mutuelles comparées en temps réel' },
    { icon: TrendingUp, text: 'Économisez jusqu\'à 40% sur votre santé' },
    { icon: Star, text: '100% indépendant, aucune commission' },
];

export default function AuthLayout({ children, title, subtitle }) {
    return (
        <div className="min-h-screen flex">

            {/* Panneau gauche */}
            <div className="hidden lg:flex lg:w-[45%] bg-slate-900 flex-col justify-between p-10 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5"
                    style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #6366f1 0%, transparent 40%)' }} />

                {/* Logo */}
                <div className="flex items-center gap-3 relative z-10">
                    <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">M</span>
                    </div>
                    <div>
                        <div className="text-white font-semibold text-sm">MutuelleComparateur</div>
                        <div className="text-slate-500 text-xs">Plateforme de comparaison</div>
                    </div>
                </div>

                {/* Hero */}
                <div className="relative z-10">
                    <h1 className="text-white text-3xl font-bold leading-tight mb-4">
                        Trouvez la mutuelle<br />
                        <span className="text-blue-400">idéale pour vous</span>
                    </h1>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8">
                        Comparez des centaines d'offres en quelques secondes et économisez sur votre santé.
                    </p>
                    <div className="flex flex-col gap-4">
                        {features.map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                                    <Icon size={15} className="text-blue-400" />
                                </div>
                                <span className="text-slate-300 text-sm">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="flex gap-8 relative z-10">
                    {[['200+', 'Mutuelles'], ['98%', 'Satisfaction'], ['0€', 'Commission']].map(([val, lab]) => (
                        <div key={lab}>
                            <div className="text-white font-bold text-xl">{val}</div>
                            <div className="text-slate-500 text-xs">{lab}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Panneau droit */}
            <div className="flex-1 flex items-center justify-center p-6 bg-white">
                <motion.div
                    className="w-full max-w-md"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                    {/* Logo mobile */}
                    <div className="flex items-center gap-2 mb-8 lg:hidden">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">M</span>
                        </div>
                        <span className="font-semibold text-slate-900">MutuelleComparateur</span>
                    </div>

                    {title && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-1">{title}</h2>
                            {subtitle && <p className="text-slate-500 text-sm">{subtitle}</p>}
                        </div>
                    )}

                    {children}
                </motion.div>
            </div>
        </div>
    );
}