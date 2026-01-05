'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Vortex } from '@/components/ui/vortex';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSupabase } from '@/components/providers/supabase-provider';

export default function ContributorLogin() {
    const { supabase } = useSupabase();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback?next=/contributor/onboarding`,
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email');
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback?next=/contributor/onboarding`,
            },
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage('Check your email for the magic link!');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-[0.03]">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
              linear-gradient(to right, #fff 1px, transparent 1px),
              linear-gradient(to bottom, #fff 1px, transparent 1px)
            `,
                        backgroundSize: '60px 60px',
                    }}
                ></div>
            </div>

            {/* Vortex Background */}
            <div className="absolute inset-0">
                <Vortex
                    backgroundColor="black"
                    rangeY={800}
                    particleCount={100}
                    baseHue={0}
                    className="flex items-center justify-center w-full h-full"
                >
                    <div className="relative z-10 w-full max-w-md mx-auto px-6">
                        {/* Back to Home */}
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 group"
                        >
                            <svg
                                className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>
                            Back to Home
                        </Link>

                        {/* Login Card */}
                        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10">
                            <div className="mb-8">
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                                    CONTRIBUTOR PORTAL
                                </h1>
                                <p className="text-white/50 leading-relaxed">
                                    Sign in to access your data contribution dashboard
                                </p>
                            </div>

                            <div className="space-y-4">
                                <Button
                                    onClick={handleGoogleLogin}
                                    variant="outline"
                                    size="lg"
                                    className="w-full relative flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 border-none"
                                    disabled={loading}
                                >
                                    {/* Google Icon */}
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    Continue with Google
                                </Button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-white/10" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-black px-2 text-white/40">Or continue with email</span>
                                    </div>
                                </div>

                                <form onSubmit={handleEmailLogin} className="space-y-4">
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        error={error}
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                                    />
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        className="w-full"
                                        disabled={loading}
                                    >
                                        {loading ? 'Sending...' : 'Send Magic Link'}
                                    </Button>
                                </form>
                            </div>

                            {message && (
                                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-sm text-green-400 text-center">
                                    {message}
                                </div>
                            )}

                            <div className="mt-6 pt-6 border-t border-white/5">
                                <p className="text-xs text-white/40 text-center">
                                    You will be redirected to the dashboard after login
                                </p>
                            </div>
                        </div>
                    </div>
                </Vortex>
            </div>
        </div>
    );
}
