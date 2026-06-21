import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import AuthLayout from '../../components/layout/AuthLayout';
import { Button } from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { motion } from 'framer-motion';

const schema = z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(1, 'Mot de passe requis'),
});

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [show] = useState(false);
    const [serverError, setServerError] = useState('');

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data) => {
        setServerError('');
        try {
            const result = await login(data.email, data.password);
            if (result.role === 'Administrateur') navigate('/dashboard');
            else if (result.role === 'Assureur') navigate('/dashboard');
            else navigate('/dashboard');
        } catch (err) {
            setServerError(err.response?.data?.title || 'Email ou mot de passe incorrect.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 flex items-center justify-center px-4">

            <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-violet-100 flex items-center justify-center text-3xl">
                            🔐
                        </div>

                        <h1 className="text-3xl font-bold text-slate-800">
                            Welcome Back
                        </h1>

                        <p className="text-slate-500 mt-2">
                            Sign in to continue
                        </p>
                    </div>

                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-3 mb-6">

                        <button
                            type="button"
                            className="h-12 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center gap-2 transition-all"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </button>

                        <button
                            type="button"
                            className="h-12 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center gap-2 transition-all"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2">
                                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
                                <rect x="2" y="9" width="4" height="12" />
                                <circle cx="4" cy="4" r="2" />
                            </svg>
                            LinkedIn
                        </button>

                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex-1 h-px bg-slate-200"></div>
                        <span className="text-xs text-slate-400">
                            OR CONTINUE WITH EMAIL
                        </span>
                        <div className="flex-1 h-px bg-slate-200"></div>
                    </div>

                    {/* Error */}
                    {serverError && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600"
                        >
                            {serverError}
                        </motion.div>
                    )}

                    {/* Form */}
                    <motion.form
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5"
                    >

                        <div className="relative">
                            <Mail
                                size={18}
                                className="absolute left-3 top-[42px] text-slate-400"
                            />

                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="you@example.com"
                                error={errors.email?.message}
                                className="pl-10"
                                {...register('email')}
                            />
                        </div>

                        <div className="relative">
                            <Lock
                                size={18}
                                className="absolute left-3 top-[42px] text-slate-400"
                            />

                            <Input
                                label="Password"
                                type={show ? 'text' : 'password'}
                                placeholder="••••••••"
                                error={errors.password?.message}
                                className="pl-10 pr-10"
                                {...register('password')}
                            />
                            <br />
                            <div className="
                                flex
                                items-center
                                gap-2
                                text-xs
                                text-slate-500
                            ">
                                <span className="text-green-500">
                                    ●
                                </span>

                                Secure encrypted connection
                            </div>
                            <button
                                type="button"
                                className="absolute right-3 top-[42px] text-slate-400"
                            >
                                {show ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <div className="flex items-center justify-between">

                            <label className="
                                flex
                                items-center
                                gap-2
                                text-sm
                                text-slate-600
                            ">
                                <input
                                    type="checkbox"
                                    className="
                                            rounded
                                            border-slate-300
                                            text-violet-600
                                            focus:ring-violet-500
                                        "
                                />

                                Remember me
                            </label>

                            <Link
                                to="/forgot-password"
                                className="
                                    text-sm
                                    text-violet-600
                                    hover:text-violet-700
                                "
                            >
                                Forgot password?
                            </Link>

                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            loading={isSubmitting}
                            className="w-full"
                        >
                            Sign In
                        </Button>

                    </motion.form>

                    {/* Footer */}
                    <div className="text-center mt-6 text-sm text-slate-500">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-semibold text-violet-600 hover:text-violet-700"
                        >
                            Sign Up
                        </Link>
                    </div>

                </div>
            </motion.div>

        </div>
    );
    }