'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Vortex } from '@/components/ui/vortex';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CompanyLogin() {
    const router = useRouter();
    const [companyName, setCompanyName] = useState('');

    useEffect(() => {
        // Check if already logged in
        const existingCompany = localStorage.getItem('company_name');
        if (existingCompany) {
            // Check if onboarding is complete
            const onboardingComplete = localStorage.getItem('company_onboarding_complete');
            if (onboardingComplete === 'true') {
                router.push('/company/dashboard');
            } else {
                router.push('/company/onboarding');
            }
        }
    }, [router]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (companyName.trim()) {
            localStorage.setItem('company_name', companyName.trim());

            // Check if onboarding is complete
            const onboardingComplete = localStorage.getItem('company_onboarding_complete');
            if (onboardingComplete === 'true') {
                router.push('/company/dashboard');
            } else {
                router.push('/company/onboarding');
            }
        }
    };

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            <Vortex
                backgroundColor="black"
                rangeY={800}
                particleCount={100}
                baseHue={0}
                className="absolute inset-0"
            />

            <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
                <div className="w-full max-w-md">
                    <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
                                COMPANY ACCESS
                            </h1>
                            <p className="text-white/50">
                                License ethical, consented datasets for AI training
                            </p>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label htmlFor="companyName" className="block text-sm font-medium text-white/70 mb-2">
                                    Company Name
                                </label>
                                <Input
                                    id="companyName"
                                    type="text"
                                    placeholder="Enter your organization name"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>

                            <Button type="submit" className="w-full" size="lg">
                                Access Marketplace
                            </Button>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-white/5">
                            <p className="text-center text-sm text-white/40">
                                Are you a data contributor?{' '}
                                <a href="/contributor/login" className="text-white/70 hover:text-white transition-colors">
                                    Switch to Contributor
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Back to Home */}
                    <div className="mt-6 text-center">
                        <a href="/" className="text-sm text-white/50 hover:text-white transition-colors">
                            ← Back to Home
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
