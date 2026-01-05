'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Vortex } from '@/components/ui/vortex';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ContributorLogin() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!name.trim()) {
            setError('Name is required');
            return;
        }

        if (name.trim().length < 2) {
            setError('Name must be at least 2 characters');
            return;
        }

        setLoading(true);

        // Store name in localStorage
        localStorage.setItem('contributor_name', name.trim());

        // Check if user has completed onboarding
        const onboardingComplete = localStorage.getItem('onboarding_complete');

        // Redirect accordingly
        setTimeout(() => {
            if (onboardingComplete === 'true') {
                router.push('/contributor/dashboard');
            } else {
                router.push('/contributor/onboarding');
            }
        }, 300);
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
                                    Enter your name to access your data contribution dashboard
                                </p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-6">
                                <Input
                                    label="Your Name"
                                    type="text"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    error={error}
                                    autoFocus
                                />

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    className="w-full"
                                    disabled={loading}
                                >
                                    {loading ? 'Signing in...' : 'Continue'}
                                </Button>
                            </form>

                            <div className="mt-6 pt-6 border-t border-white/5">
                                <p className="text-xs text-white/40 text-center">
                                    First time here? You'll be guided through a quick onboarding
                                </p>
                            </div>
                        </div>

                        {/* Info Card */}
                        <div className="mt-6 bg-white/[0.01] backdrop-blur-sm border border-white/5 rounded-xl p-4">
                            <p className="text-xs text-white/40 text-center">
                                This is a prototype. No authentication required.
                            </p>
                        </div>
                    </div>
                </Vortex>
            </div>
        </div>
    );
}
