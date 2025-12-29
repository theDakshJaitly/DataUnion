'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase';

export default function LicenseHistory() {
    const router = useRouter();
    const [companyName, setCompanyName] = useState('');
    const [licenses, setLicenses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const name = localStorage.getItem('company_name');
        if (!name) {
            router.push('/company/login');
            return;
        }

        setCompanyName(name);
        fetchLicenses(name);
    }, [router]);

    const fetchLicenses = async (name: string) => {
        try {
            const supabase = createClient();

            // Get company
            const { data: companies } = await supabase
                .from('companies')
                .select('*')
                .eq('name', name)
                .order('created_at', { ascending: true })
                .limit(1);

            const company = companies?.[0];

            if (company) {
                // Fetch all licenses
                const { data: licensesData } = await supabase
                    .from('licenses')
                    .select(`
            *,
            dataset:datasets (name, data_type, domain, total_contributions, contributor_count)
          `)
                    .eq('company_id', company.company_id)
                    .order('licensed_at', { ascending: false });

                setLicenses(licensesData || []);
            }
        } catch (error) {
            console.error('Error fetching licenses:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
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

            {/* Header */}
            <header className="border-b border-white/5 bg-black/60 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold text-white tracking-tight">
                        DataUnion
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/company/dashboard"
                            className="text-sm text-white/50 hover:text-white transition-colors"
                        >
                            ← Dashboard
                        </Link>
                        <span className="text-sm text-white/50">{companyName}</span>
                        <Link
                            href="/company/marketplace"
                            className="text-sm text-white/70 hover:text-white transition-colors"
                        >
                            Marketplace
                        </Link>
                    </div>
                </div>
            </header>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                        LICENSE HISTORY
                    </h1>
                    <p className="text-white/50 text-lg">Complete record of all your dataset licenses</p>
                </div>

                {/* Licenses List */}
                {licenses.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-white/5 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No licenses yet</h3>
                        <p className="text-white/50 mb-6">Start by licensing datasets from the marketplace</p>
                        <Link
                            href="/company/marketplace"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-colors"
                        >
                            Browse Marketplace
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {licenses.map((license) => (
                            <div
                                key={license.license_id}
                                className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Badge>{license.dataset?.data_type}</Badge>
                                            <h3 className="text-xl font-bold text-white">{license.dataset?.name}</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <div className="text-xs text-white/40 mb-1">Intended Use</div>
                                                <div className="text-white/80">{license.intended_use}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-white/40 mb-1">Licensed On</div>
                                                <div className="text-white/80">{formatDate(license.licensed_at)}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 text-xs text-white/40">
                                            <span>Samples: {license.dataset?.total_contributions?.toLocaleString()}</span>
                                            <span>•</span>
                                            <span>Contributors: {license.dataset?.contributor_count}</span>
                                            <span>•</span>
                                            <span>License ID: {license.license_id.substring(0, 8)}...</span>
                                        </div>
                                    </div>

                                    <div className="text-right ml-6">
                                        <div className="text-xs text-white/40 mb-1">Amount Paid</div>
                                        <div className="text-2xl font-bold text-white">
                                            ${license.price_paid?.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
