'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase';
import { calculatePayoutPreview } from '@/lib/payoutUtils';

export default function DatasetDetail() {
    const router = useRouter();
    const params = useParams();
    const datasetId = params.id as string;

    const [dataset, setDataset] = useState<any>(null);
    const [payoutPreview, setPayoutPreview] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const name = localStorage.getItem('company_name');
        if (!name) {
            router.push('/company/login');
            return;
        }

        fetchDatasetDetails();
    }, [datasetId, router]);

    const fetchDatasetDetails = async () => {
        try {
            const supabase = createClient();

            // Fetch dataset
            const { data: datasetData } = await supabase
                .from('datasets')
                .select('*')
                .eq('dataset_id', datasetId)
                .single();

            if (datasetData) {
                setDataset(datasetData);

                // Calculate payout preview
                const preview = await calculatePayoutPreview(
                    datasetId,
                    datasetData.price_per_license || 0
                );
                setPayoutPreview(preview);
            }
        } catch (error) {
            console.error('Error fetching dataset:', error);
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

    if (!dataset) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white/50">Dataset not found</div>
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
                            href="/company/marketplace"
                            className="text-sm text-white/50 hover:text-white transition-colors"
                        >
                            ← Back to Marketplace
                        </Link>
                    </div>
                </div>
            </header>

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
                {/* Dataset Header */}
                <div className="mb-12">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <Badge>{dataset.data_type}</Badge>
                                <span className="text-white/40">•</span>
                                <span className="text-white/60 text-sm">{dataset.domain}</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                                {dataset.name}
                            </h1>
                            <p className="text-white/60 text-lg">{dataset.description}</p>
                        </div>

                        <div className="text-right ml-8">
                            <div className="text-sm text-white/40 mb-1">Quality Score</div>
                            <div className="text-5xl font-bold text-white">
                                {dataset.quality_score?.toFixed(0) || 'N/A'}%
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <div className="text-white/40 text-sm mb-2">Total Samples</div>
                        <div className="text-3xl font-bold text-white">
                            {dataset.total_contributions?.toLocaleString() || 0}
                        </div>
                    </div>

                    <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <div className="text-white/40 text-sm mb-2">Contributors</div>
                        <div className="text-3xl font-bold text-white">
                            {dataset.contributor_count || 0}
                        </div>
                    </div>

                    <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <div className="text-white/40 text-sm mb-2">Times Licensed</div>
                        <div className="text-3xl font-bold text-white">
                            {dataset.times_licensed || 0}
                        </div>
                    </div>

                    <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <div className="text-white/40 text-sm mb-2">Avg Quality</div>
                        <div className="text-3xl font-bold text-white">
                            {dataset.quality_score?.toFixed(0) || 0}%
                        </div>
                    </div>
                </div>

                {/* Usage Terms */}
                <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Consent & Usage Terms</h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Allowed Uses */}
                        <div>
                            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Allowed Uses
                            </h3>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2 text-white/60 text-sm">
                                    <span className="text-white/40 mt-0.5">•</span>
                                    AI/ML model training
                                </li>
                                <li className="flex items-start gap-2 text-white/60 text-sm">
                                    <span className="text-white/40 mt-0.5">•</span>
                                    Research and analysis
                                </li>
                                <li className="flex items-start gap-2 text-white/60 text-sm">
                                    <span className="text-white/40 mt-0.5">•</span>
                                    Product development
                                </li>
                            </ul>
                        </div>

                        {/* Restricted Uses */}
                        <div>
                            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Prohibited Uses
                            </h3>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2 text-white/60 text-sm">
                                    <span className="text-white/40 mt-0.5">•</span>
                                    Re-identification attempts
                                </li>
                                <li className="flex items-start gap-2 text-white/60 text-sm">
                                    <span className="text-white/40 mt-0.5">•</span>
                                    Surveillance applications
                                </li>
                                <li className="flex items-start gap-2 text-white/60 text-sm">
                                    <span className="text-white/40 mt-0.5">•</span>
                                    Discriminatory purposes
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Pricing & Payout Breakdown */}
                <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Pricing & Payout Distribution</h2>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b border-white/5">
                            <span className="text-white/70">License Fee</span>
                            <span className="text-3xl font-bold text-white">
                                ${dataset.price_per_license?.toLocaleString() || 0}
                            </span>
                        </div>

                        {payoutPreview && (
                            <>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-white/50">Platform Fee (10%)</span>
                                    <span className="text-white/50">
                                        -${payoutPreview.platformFee.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                    <div>
                                        <div className="text-white font-semibold">Contributor Pool (90%)</div>
                                        <div className="text-white/50 text-xs mt-1">
                                            Distributed to {payoutPreview.totalContributors} contributors
                                        </div>
                                    </div>
                                    <span className="text-2xl font-bold text-white">
                                        ${payoutPreview.contributorPool.toLocaleString()}
                                    </span>
                                </div>

                                <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4 mt-4">
                                    <div className="text-xs text-white/40 mb-1">Avg Payout Per Contributor</div>
                                    <div className="text-lg font-semibold text-white">
                                        ~${payoutPreview.avgPayout.toFixed(2)}
                                    </div>
                                    <div className="text-xs text-white/30 mt-1">
                                        *Actual amounts vary based on contribution quality
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* License Button */}
                <div className="flex gap-4">
                    <Button
                        onClick={() => router.push(`/company/license/${datasetId}`)}
                        className="flex-1"
                        size="lg"
                    >
                        License This Dataset
                    </Button>
                    <Button
                        onClick={() => router.push('/company/marketplace')}
                        variant="secondary"
                        size="lg"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
}
