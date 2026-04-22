import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { User, Building2, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import AuthLayout from '../../components/layout/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const step1Schema = z.object({
    firstName: z.string().min(1, 'Prénom requis'),
    lastName: z.string().min(1, 'Nom requis'),
    email: z.string().email('Email invalide'),
});

const step2Schema = z.object({
    password: z.string()
        .min(8, 'Minimum 8 caractères')
        .regex(/[A-Z]/, 'Au moins une majuscule')
        .regex(/[0-9]/, 'Au moins un chiffre'),
    confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
});

const ROLES = [
    { value: 1, label: 'Particulier', desc: 'Je cherche une mutuelle', icon: User },
    { value: 2, label: 'Assureur', desc: 'Je propose des offres', icon: Building2 },
    { value: 3, label: 'Admin', desc: 'Gestion de la plateforme', icon: Shield },
];

export default function RegisterPage() {
    const { register: authRegister } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [role, setRole] = useState(1);
    const [step1Data, setStep1Data] = useState(null);
    const [serverError, setServerError] = useState('');

    const form1 = useForm({ resolver: zodResolver(step1Schema) });
    const form2 = useForm({ resolver: zodResolver(step2Schema) });

    const onStep1 = (data) => { setStep1Data(data); setStep(2); };

    const onStep2 = async (data) => {
        setServerError('');
        try {
            await authRegister({ ...step1Data, password: data.password, role });
            navigate('/dashboard');
        } catch (err) {
            setServerError(err.response?.data?.title || 'Une erreur est survenue.');
        }
    };

    const hints = [
        { ok: form2.watch('password')?.length >= 8, label: '8 caractères' },
        { ok: /[A-Z]/.test(form2.watch('password') ?? ''), label: 'Majuscule' },
        { ok: /[0-9]/.test(form2.watch('password') ?? ''), label: 'Chiffre' },
    ];

    return (
        <AuthLayout
            title={step === 1 ? 'Créer un compte' : 'Sécurisez votre accès'}
            subtitle={<>Déjà inscrit ? <Link to="/login" className="text-blue-600 font-medium hover:underline">Se connecter</Link></>}
        >
            {/* Indicateur d'étapes */}
            <div className="flex items-center gap-2 mb-8">
                {[1, 2].map(s => (
                    <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${s === step ? 'flex-1 bg-blue-600' : s < step ? 'flex-1 bg-blue-300' : 'w-8 bg-slate-200'}`} />
                ))}
                <span className="text-xs text-slate-400 ml-1">{step}/2</span>
            </div>

            {serverError && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
                    ⚠ {serverError}
                </motion.div>
            )}

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.form key="step1"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        onSubmit={form1.handleSubmit(onStep1)} className="flex flex-col gap-4">

                        {/* Choix du rôle */}
                        <div>
                            <p className="text-sm font-medium text-slate-700 mb-3">Je suis…</p>
                            <div className="grid grid-cols-3 gap-2">
                                {ROLES.map(r => {
                                    const Icon = r.icon;
                                    return (
                                        <button key={r.value} type="button" onClick={() => setRole(r.value)}
                                            className={`p-3 rounded-xl border text-center transition-all ${role === r.value ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                                            <Icon size={20} className={`mx-auto mb-1 ${role === r.value ? 'text-blue-600' : 'text-slate-400'}`} />
                                            <div className={`text-xs font-semibold ${role === r.value ? 'text-blue-700' : 'text-slate-700'}`}>{r.label}</div>
                                            <div className="text-[10px] text-slate-400 leading-tight">{r.desc}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Input label="Prénom" placeholder="Jean" error={form1.formState.errors.firstName?.message} {...form1.register('firstName')} />
                            <Input label="Nom" placeholder="Dupont" error={form1.formState.errors.lastName?.message}  {...form1.register('lastName')} />
                        </div>
                        <Input label="Email" type="email" placeholder="vous@example.com" error={form1.formState.errors.email?.message} {...form1.register('email')} />

                        <Button type="submit" size="lg" className="w-full mt-2">Continuer →</Button>
                    </motion.form>
                )}

                {step === 2 && (
                    <motion.form key="step2"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        onSubmit={form2.handleSubmit(onStep2)} className="flex flex-col gap-4">

                        <Input label="Mot de passe" type="password" placeholder="••••••••"
                            error={form2.formState.errors.password?.message} {...form2.register('password')} />

                        <div className="flex gap-3">
                            {hints.map(h => (
                                <span key={h.label} className={`text-xs flex items-center gap-1 transition-colors ${h.ok ? 'text-green-600' : 'text-slate-400'}`}>
                                    <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] ${h.ok ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300'}`}>
                                        {h.ok ? '✓' : ''}
                                    </span>
                                    {h.label}
                                </span>
                            ))}
                        </div>

                        <Input label="Confirmer le mot de passe" type="password" placeholder="••••••••"
                            error={form2.formState.errors.confirmPassword?.message} {...form2.register('confirmPassword')} />

                        <div className="grid grid-cols-2 gap-3 mt-2">
                            <Button type="button" variant="outline" size="lg" onClick={() => setStep(1)}>← Retour</Button>
                            <Button type="submit" size="lg" loading={form2.formState.isSubmitting}>S'inscrire</Button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>
        </AuthLayout>
    );
}