'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { CometCard } from '@/components/ui/comet-card';
import { createClient } from '@/lib/supabase';
import { StatCardSkeleton } from '@/components/ui/skeleton';

type FilterType = 'all' | 'text' | 'sensor' | 'image';

export default function DatasetMarketplace() {
    const router = useRouter();
    const [companyName, setCompanyName] = useState('');
    const [datasets, setDatasets] = useState<any[]>([]);
    const [filteredDatasets, setFilteredDatasets] = useState<any[]>([]);
    const [filter, setFilter] = useState<FilterType>('all');
    const [sortBy, setSortBy] = useState<'quality' | 'price' | 'size'>('quality');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const name = localStorage.getItem('company_name');
        if (!name) {
            router.push('/company/login');
            return;
        }
        setCompanyName(name);
        fetchDatasets();
    }, [router]);

    const fetchDatasets = async () => {
        try {
            const supabase = createClient();
            const { data } = await supabase
                .from('datasets')
                .select('*')
                .order('created_at', { ascending: false });

            setDatasets(data || []);
            setFilteredDatasets(data || []);
        } catch (error) {
            console.error('Error fetching datasets:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filtered = datasets;

        // Apply filter
        if (filter !== 'all') {
            filtered = filtered.filter((d) => d.data_type === filter);
        }

        // Apply sorting
        filtered = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'quality':
                    return (b.quality_score || 0) - (a.quality_score || 0);
                case 'price':
                    return (a.price_per_license || 0) - (b.price_per_license || 0);
                case 'size':
                    return (b.total_contributions || 0) - (a.total_contributions || 0);
                default:
                    return 0;
            }
        });

        setFilteredDatasets(filtered);
    }, [filter, sortBy, datasets]);

    const getBadgeStyles = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'mobility':
            case 'sensor':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'finance':
            case 'financial':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'healthcare':
            case 'medical':
                return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            case 'image':
            case 'vision':
                return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'text':
            case 'language':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            default:
                return 'bg-white/[0.05] text-white/70 border-white/10';
        }
    };

    const getQualityColor = (score: number) => {
        if (score >= 90) return 'text-emerald-400';
        if (score >= 70) return 'text-yellow-400';
        return 'text-rose-400';
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                            href="/company/dashboard"
                            className="text-sm text-white/70 hover:text-white transition-colors"
                        >
                            Dashboard
                        </Link>
                    </div>
                </div>
            </header>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                        DATASET MARKETPLACE
                    </h1>
                    <p className="text-white/50 text-lg">
                        Browse ethically sourced, consented datasets for AI training
                    </p>
                </div>

                {/* Filters & Sorting */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    {/* Type Filters */}
                    <div className="flex gap-3 flex-wrap">
                        {[
                            { id: 'all' as FilterType, label: 'All Types' },
                            { id: 'text' as FilterType, label: 'Text' },
                            { id: 'sensor' as FilterType, label: 'Sensor' },
                            { id: 'image' as FilterType, label: 'Image' },
                        ].map((filterOption) => (
                            <button
                                key={filterOption.id}
                                onClick={() => setFilter(filterOption.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === filterOption.id
                                    ? 'bg-white text-black'
                                    : 'bg-white/[0.02] text-white/60 hover:bg-white/[0.05] border border-white/10'
                                    }`}
                            >
                                {filterOption.label}
                            </button>
                        ))}
                    </div>

                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-white/50">Sort by:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="px-4 py-2 rounded-lg text-sm bg-white/[0.02] border border-white/10 text-white focus:outline-none focus:border-white/30"
                        >
                            <option value="quality">Quality (High to Low)</option>
                            <option value="price">Price (Low to High)</option>
                            <option value="size">Size (Most Samples)</option>
                        </select>
                    </div>
                </div>

                {/* Dataset Grid */}
                {filteredDatasets.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-white/5 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No datasets found</h3>
                        <p className="text-white/50">Try adjusting your filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDatasets.map((dataset) => (
                            <CometCard key={dataset.dataset_id}>
                                <Link
                                    href={`/company/marketplace/${dataset.dataset_id}`}
                                    className="block bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-sky-500/30 hover:shadow-[0_0_20px_rgba(56,189,248,0.1)] transition-all h-full group relative overflow-hidden"
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <Badge className={getBadgeStyles(dataset.data_type)}>{dataset.data_type}</Badge>
                                        <div className="text-right">
                                            <div className="text-xs text-white/40">Quality</div>
                                            <div className={`text-lg font-bold ${getQualityColor(dataset.quality_score || 0)}`}>
                                                {dataset.quality_score?.toFixed(0) || 'N/A'}%
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dataset Name */}
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">{dataset.name}</h3>
                                    <p className="text-sm text-white/60 mb-4 line-clamp-2">{dataset.description}</p>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 mb-4">
                                        <div>
                                            <div className="text-xs text-white/40">Samples</div>
                                            <div className="text-white font-semibold">
                                                {dataset.total_contributions?.toLocaleString() || 0}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-white/40">Contributors</div>
                                            <div className="text-white font-semibold">{dataset.contributor_count || 0}</div>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <div>
                                            <div className="text-xs text-white/40 mb-1">License Fee</div>
                                            <div className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                                                ${dataset.price_per_license?.toLocaleString() || 0}
                                            </div>
                                        </div>
                                        <div className="text-xs text-white/40">
                                            Licensed {dataset.times_licensed || 0}×
                                        </div>
                                    </div>

                                    {/* Hover CTA */}
                                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-end justify-center">
                                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-sky-500/20">
                                            License Now
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </span>
                                    </div>
                                </Link>
                            </CometCard>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
