'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase';

import { Suspense } from 'react';

function LicenseSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const licenseId = searchParams.get('id');

    const [license, setLicense] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!licenseId) {
            router.push('/company/marketplace');
            return;
        }

        fetchLicense();
    }, [licenseId, router]);

    const fetchLicense = async () => {
        try {
            const supabase = createClient();
            const { data } = await supabase
                .from('licenses')
                .select(`
          *,
          dataset:datasets (name, data_type, domain)
        `)
                .eq('license_id', licenseId)
                .single();

            setLicense(data);
        } catch (error) {
            console.error('Error fetching license:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white/50">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
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

            <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
                <div className="max-w-2xl w-full">
                    <div className="text-center py-12">
                        {/* Success Icon */}
                        <div className="w-24 h-24 bg-white/5 rounded-full mx-auto mb-6 flex items-center justify-center">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                            LICENSE CONFIRMED!
                        </h1>
                        <p className="text-white/60 mb-8 max-w-md mx-auto">
                            Dataset has been successfully licensed. Payouts have been distributed to all contributors.
                        </p>

                        {/* License Details */}
                        {license && (
                            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8 text-left">
                                <h2 className="text-xl font-bold text-white mb-6">License Details</h2>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-start pb-4 border-b border-white/5">
                                        <div className="text-white/50 text-sm">Dataset</div>
                                        <div className="text-white font-semibold text-right">
                                            {license.dataset?.name}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-start pb-4 border-b border-white/5">
                                        <div className="text-white/50 text-sm">License ID</div>
                                        <div className="text-white font-mono text-sm">
                                            {license.license_id.substring(0, 8)}...
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-start pb-4 border-b border-white/5">
                                        <div className="text-white/50 text-sm">Intended Use</div>
                                        <div className="text-white text">{license.intended_use}</div>
                                    </div>

                                    <div className="flex justify-between items-start pt-4">
                                        <div className="text-white/50 text-sm">Amount Paid</div>
                                        <div className="text-2xl font-bold text-white">
                                            ${license.price_paid?.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button onClick={() => router.push('/company/dashboard')} size="lg">
                                View Dashboard
                            </Button>
                            <Button
                                onClick={() => router.push('/company/marketplace')}
                                variant="secondary"
                                size="lg"
                            >
                                License Another Dataset
                            </Button>
                        </div>

                        {/* Help Text */}
                        <p className="text-white/40 text-sm mt-8">
                            You can view this license and all your licensing history in your{' '}
                            <Link href="/company/dashboard" className="text-white/60 hover:text-white">
                                dashboard
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LicenseSuccess() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white/50">Loading...</div>
            </div>
        }>
            <LicenseSuccessContent />
        </Suspense>
    );
}
