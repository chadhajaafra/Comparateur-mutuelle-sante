import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import authApi from '../../api/authApi';
import AuthLayout from '../../components/layout/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

// ── Forgot Password ─────────────────────────────────────────────────────────
export function ForgotPasswordPage() {
    const [sent, setSent] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(z.object({ email: z.string().email('Email invalide') })),
    });

    const onSubmit = async ({ email }) => {
        try { await authApi.forgotPassword(email); } finally { setSent(true); }
    };

    return (
        <AuthLayout title="Mot de passe oublié ?" subtitle="Entrez votre email pour recevoir un lien de réinitialisation.">
            {!sent ? (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <Input label="Email" type="email" placeholder="vous@example.com"
                        error={errors.email?.message} {...register('email')} />
                    <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
                        Envoyer le lien
                    </Button>
                    <Link to="/login" className="text-center text-sm text-slate-500 hover:text-slate-700">
                        ← Retour à la connexion
                    </Link>
                </form>
            ) : (
                <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} className="text-green-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Email envoyé !</h3>
                    <p className="text-slate-500 text-sm mb-6">
                        Si cette adresse est associée à un compte, vous recevrez un lien dans quelques minutes.
                    </p>
                    <Link to="/login">
                        <Button variant="outline" className="w-full">Retour à la connexion</Button>
                    </Link>
                </motion.div>
            )}
        </AuthLayout>
    );
}

// ── Reset Password ──────────────────────────────────────────────────────────
export function ResetPasswordPage() {
    const token = new URLSearchParams(window.location.search).get('token') || '';
    const [success, setSuccess] = useState(false);

    const schema = z.object({
        newPassword: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
        confirmPassword: z.string(),
    }).refine(d => d.newPassword === d.confirmPassword, {
        message: 'Les mots de passe ne correspondent pas',
        path: ['confirmPassword'],
    });

    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data) => {
        try {
            await authApi.resetPassword({ token, ...data });
            setSuccess(true);
        } catch {
            setError('root', { message: 'Lien invalide ou expiré.' });
        }
    };

    return (
        <AuthLayout title="Nouveau mot de passe" subtitle="Choisissez un mot de passe sécurisé.">
            {!success ? (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {errors.root && (
                        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">⚠ {errors.root.message}</div>
                    )}
                    <Input label="Nouveau mot de passe" type="password" placeholder="••••••••"
                        error={errors.newPassword?.message} {...register('newPassword')} />
                    <Input label="Confirmer" type="password" placeholder="••••••••"
                        error={errors.confirmPassword?.message} {...register('confirmPassword')} />
                    <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
                        Réinitialiser
                    </Button>
                </form>
            ) : (
                <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} className="text-green-500" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Mot de passe mis à jour !</h3>
                    <p className="text-slate-500 text-sm mb-6">Vous pouvez maintenant vous connecter.</p>
                    <Link to="/login"><Button className="w-full">Se connecter</Button></Link>
                </motion.div>
            )}
        </AuthLayout>
    );
}