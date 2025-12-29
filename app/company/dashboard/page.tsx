'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { CometCard } from '@/components/ui/comet-card';
import { createClient } from '@/lib/supabase';
import { StatCardSkeleton } from '@/components/ui/skeleton';

export default function CompanyDashboard() {
    const router = useRouter();
    const [companyName, setCompanyName] = useState('');
    const [licenses, setLicenses] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalLicenses: 0,
        totalSpend: 0,
        activeDatasets: 0,
        contributorsSupported: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const name = localStorage.getItem('company_name');
        if (!name) {
            router.push('/company/login');
            return;
        }

        setCompanyName(name);
        fetchDashboardData(name);

        // Refresh dashboard data when window regains focus (after licensing)
        const handleFocus = () => {
            fetchDashboardData(name);
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [router]);

    const fetchDashboardData = async (name: string) => {
        try {
            const supabase = createClient();

            // Get FIRST matching company by name (ordered by created_at)
            const { data: companies } = await supabase
                .from('companies')
                .select('*')
                .eq('name', name)
                .order('created_at', { ascending: true })
                .limit(1);

            let company = companies?.[0];

            if (!company) {
                const { data: newCompany } = await supabase
                    .from('companies')
                    .insert({ name, industry: 'Technology' })
                    .select()
                    .single();
                company = newCompany;
            }

            if (company) {
                // Fetch licenses
                const { data: licensesData } = await supabase
                    .from('licenses')
                    .select(`
            *,
            dataset:datasets (name, data_type, domain, total_contributions, contributor_count)
          `)
                    .eq('company_id', company.company_id)
                    .order('licensed_at', { ascending: false });

                setLicenses(licensesData || []);

                // Calculate stats
                const totalLicenses = licensesData?.length || 0;
                const totalSpend = company.total_spend || 0;
                const uniqueDatasets = new Set(licensesData?.map((l) => l.dataset_id)).size;

                // Get unique contributors across all licensed datasets
                const datasetIds = licensesData?.map((l) => l.dataset_id) || [];
                let contributorsSupported = 0;

                if (datasetIds.length > 0) {
                    const { data: contributions } = await supabase
                        .from('data_contributions')
                        .select('contributor_id')
                        .in('dataset_id', datasetIds);

                    contributorsSupported = new Set(contributions?.map((c) => c.contributor_id)).size;
                }

                setStats({
                    totalLicenses,
                    totalSpend,
                    activeDatasets: uniqueDatasets,
                    contributorsSupported,
                });
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black relative overflow-hidden">
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

                <header className="border-b border-white/5 bg-black/60 backdrop-blur-xl sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                        <Link href="/" className="text-xl font-bold text-white tracking-tight">
                            DataUnion
                        </Link>
                    </div>
                </header>

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                    <div className="mb-12">
                        <div className="h-12 w-96 bg-white/5 rounded-lg mb-3 animate-pulse"></div>
                        <div className="h-6 w-64 bg-white/5 rounded animate-pulse"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                    </div>
                </div>
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
                        COMPANY DASHBOARD
                    </h1>
                    <p className="text-white/50 text-lg">Welcome back, {companyName}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {/* Total Licenses */}
                    <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <span className="text-sm text-white/50">Total Licenses</span>
                        </div>
                        <div className="text-3xl font-bold text-white">{stats.totalLicenses}</div>
                    </div>

                    {/* Total Spend */}
                    <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-sm text-white/50">Total Spend</span>
                        </div>
                        <div className="text-3xl font-bold text-white">${stats.totalSpend.toLocaleString()}</div>
                    </div>

                    {/* Active Datasets */}
                    <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <span className="text-sm text-white/50">Active Datasets</span>
                        </div>
                        <div className="text-3xl font-bold text-white">{stats.activeDatasets}</div>
                    </div>

                    {/* Contributors Supported */}
                    <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <span className="text-sm text-white/50">Contributors Supported</span>
                        </div>
                        <div className="text-3xl font-bold text-white">{stats.contributorsSupported}</div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CometCard>
                            <Link
                                href="/company/marketplace"
                                className="block bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-all"
                            >
                                <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mb-4">
                                    <svg className="w-7 h-7 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Browse Marketplace</h3>
                                <p className="text-white/60 text-sm">Discover new datasets for your AI projects</p>
                            </Link>
                        </CometCard>

                        <CometCard>
                            <Link
                                href="/company/licenses"
                                className="block bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-all"
                            >
                                <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mb-4">
                                    <svg className="w-7 h-7 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">View License History</h3>
                                <p className="text-white/60 text-sm">See all your licensing activity</p>
                            </Link>
                        </CometCard>
                    </div>
                </div>

                {/* Recent Licenses */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Recent Licenses</h2>
                    {licenses.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-white/5 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No licenses yet</h3>
                            <p className="text-white/50 mb-6">Browse the marketplace to license your first dataset</p>
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
                                    className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Badge>{license.dataset?.data_type}</Badge>
                                                <h3 className="text-xl font-bold text-white">{license.dataset?.name}</h3>
                                            </div>
                                            <p className="text-white/50 text-sm mb-3">
                                                Intended Use: {license.intended_use}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-white/40">
                                                <span>Samples: {license.dataset?.total_contributions?.toLocaleString()}</span>
                                                <span>•</span>
                                                <span>Contributors: {license.dataset?.contributor_count}</span>
                                                <span>•</span>
                                                <span>Licensed: {formatDate(license.licensed_at)}</span>
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
        </div>
    );
}
