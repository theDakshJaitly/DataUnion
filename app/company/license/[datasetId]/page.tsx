'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase';
import { distributeLicensePayout, calculatePayoutPreview } from '@/lib/payoutUtils';

type Step = 'use-case' | 'review' | 'confirm';

export default function LicenseDataset() {
    const router = useRouter();
    const params = useParams();
    const datasetId = params.datasetId as string;

    const [companyName, setCompanyName] = useState('');
    const [step, setStep] = useState<Step>('use-case');
    const [dataset, setDataset] = useState<any>(null);
    const [payoutPreview, setPayoutPreview] = useState<any>(null);
    const [intendedUse, setIntendedUse] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const name = localStorage.getItem('company_name');
        if (!name) {
            router.push('/company/login');
            return;
        }
        setCompanyName(name);
        fetchDataset();
    }, [datasetId, router]);

    const fetchDataset = async () => {
        try {
            const supabase = createClient();
            const { data } = await supabase
                .from('datasets')
                .select('*')
                .eq('dataset_id', datasetId)
                .single();

            if (data) {
                setDataset(data);
                const preview = await calculatePayoutPreview(datasetId, data.price_per_license || 0);
                setPayoutPreview(preview);
            }
        } catch (error) {
            console.error('Error fetching dataset:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLicense = async () => {
        if (!termsAccepted || !intendedUse.trim()) {
            alert('Please complete all fields and accept the terms');
            return;
        }

        setProcessing(true);

        try {
            const supabase = createClient();

            // 1. Get FIRST matching company by name (ordered by created_at)
            const { data: companies } = await supabase
                .from('companies')
                .select('*')
                .eq('name', companyName)
                .order('created_at', { ascending: true })
                .limit(1);

            let company = companies?.[0];

            if (!company) {
                const { data: newCompany } = await supabase
                    .from('companies')
                    .insert({ name: companyName, industry: 'Technology' })
                    .select()
                    .single();
                company = newCompany;
            }

            if (!company) {
                throw new Error('Failed to create/fetch company');
            }

            // 2. Create license record
            const { data: license, error: licenseError } = await supabase
                .from('licenses')
                .insert({
                    dataset_id: datasetId,
                    company_id: company.company_id,
                    intended_use: intendedUse,
                    price_paid: dataset.price_per_license,
                    licensed_at: new Date().toISOString(),
                })
                .select()
                .single();

            if (licenseError || !license) {
                throw new Error('Failed to create license');
            }

            // 3. Distribute payouts to contributors
            const payoutResult = await distributeLicensePayout(
                license.license_id,
                datasetId,
                dataset.price_per_license,
                companyName
            );

            if (!payoutResult.success) {
                console.error('Payout distribution failed:', payoutResult.error);
            }

            // 4. Update company total_spend
            await supabase
                .from('companies')
                .update({
                    total_spend: (company.total_spend || 0) + dataset.price_per_license,
                })
                .eq('company_id', company.company_id);

            // Success!
            router.push(`/company/license/success?id=${license.license_id}`);
        } catch (error) {
            console.error('Error licensing dataset:', error);
            alert('Failed to license dataset. Please try again.');
        } finally {
            setProcessing(false);
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
                            href={`/company/marketplace/${datasetId}`}
                            className="text-sm text-white/50 hover:text-white transition-colors"
                        >
                            ← Cancel
                        </Link>
                    </div>
                </div>
            </header>

            <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">
                {/* Progress Indicator */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        {['use-case', 'review', 'confirm'].map((s, idx) => (
                            <div key={s} className="flex items-center flex-1">
                                <div
                                    className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all ${step === s
                                        ? 'bg-white text-black'
                                        : idx < ['use-case', 'review', 'confirm'].indexOf(step)
                                            ? 'bg-white text-black'
                                            : 'bg-white/10 text-white/40'
                                        }`}
                                >
                                    <span className="text-xs font-bold">{idx + 1}</span>
                                </div>
                                {idx < 2 && (
                                    <div
                                        className={`flex-1 h-0.5 ${idx < ['use-case', 'review', 'confirm'].indexOf(step)
                                            ? 'bg-white'
                                            : 'bg-white/10'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                        LICENSE DATASET
                    </h1>
                    <p className="text-white/50">
                        {dataset.name}
                    </p>
                </div>

                {/* Step 1: Intended Use */}
                {step === 'use-case' && (
                    <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Specify Intended Use</h2>
                        <p className="text-white/60 mb-6">
                            Describe how you plan to use this dataset for consent compliance
                        </p>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-white/70 mb-2">
                                Intended Use Case
                            </label>
                            <select
                                value={intendedUse}
                                onChange={(e) => setIntendedUse(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-white/[0.02] border border-white/10 text-white focus:outline-none focus:border-white/30"
                            >
                                <option value="">Select a use case...</option>
                                <option value="AI Model Training">AI Model Training</option>
                                <option value="Research & Development">Research & Development</option>
                                <option value="Product Improvement">Product Improvement</option>
                                <option value="Data Analysis">Data Analysis</option>
                                <option value="Academic Research">Academic Research</option>
                            </select>
                        </div>

                        <Button
                            onClick={() => setStep('review')}
                            disabled={!intendedUse}
                            className="w-full"
                            size="lg"
                        >
                            Continue to Review
                        </Button>
                    </div>
                )}

                {/* Step 2: Review Terms */}
                {step === 'review' && (
                    <div>
                        <button
                            onClick={() => setStep('use-case')}
                            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back
                        </button>

                        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-6">
                            <h2 className="text-2xl font-bold text-white mb-6">License Agreement</h2>

                            <div className="space-y-6">
                                {/* Dataset Info */}
                                <div>
                                    <div className="text-sm text-white/40 mb-2">Dataset</div>
                                    <div className="flex items-center gap-2">
                                        <Badge>{dataset.data_type}</Badge>
                                        <span className="text-white font-semibold">{dataset.name}</span>
                                    </div>
                                </div>

                                {/* Intended Use */}
                                <div>
                                    <div className="text-sm text-white/40 mb-2">Intended Use</div>
                                    <div className="text-white">{intendedUse}</div>
                                </div>

                                {/* Pricing */}
                                <div className="pt-4 border-t border-white/5">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-white/70">License Fee</span>
                                        <span className="text-2xl font-bold text-white">
                                            ${dataset.price_per_license?.toLocaleString()}
                                        </span>
                                    </div>
                                    {payoutPreview && (
                                        <div className="text-xs text-white/40">
                                            ${payoutPreview.contributorPool.toLocaleString()} will be distributed
                                            to {payoutPreview.totalContributors} contributors
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Button onClick={() => setStep('confirm')} className="w-full" size="lg">
                            Continue to Confirmation
                        </Button>
                    </div>
                )}

                {/* Step 3: Final Confirmation */}
                {step === 'confirm' && (
                    <div>
                        <button
                            onClick={() => setStep('review')}
                            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back
                        </button>

                        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-6">
                            <h2 className="text-2xl font-bold text-white mb-6">Confirm License</h2>

                            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 mb-6">
                                <p className="text-white/80 text-sm leading-relaxed">
                                    By proceeding, you agree to use this dataset only for the stated purpose
                                    ("{intendedUse}") and in compliance with all consent boundaries. You acknowledge
                                    that ${payoutPreview?.contributorPool.toLocaleString()} will be automatically
                                    distributed to contributors.
                                </p>
                            </div>

                            <Checkbox
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                label="I accept the terms and conditions"
                            />
                        </div>

                        <Button
                            onClick={handleLicense}
                            disabled={!termsAccepted || processing}
                            className="w-full"
                            size="lg"
                        >
                            {processing ? 'Processing License...' : `Pay $${dataset.price_per_license?.toLocaleString()} & License Dataset`}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
