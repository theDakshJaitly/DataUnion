'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { CometCard } from '@/components/ui/comet-card';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { useSupabase } from '@/components/providers/supabase-provider';
import {
    DEMO_DATA_SAMPLES,
    DATA_TYPE_OPTIONS,
    getDatasetAssignment,
    calculateQualityScore,
    calculateContributionValue,
} from '@/lib/mockContributionData';

type Step = 'type-select' | 'demo-select' | 'custom-input' | 'review-terms' | 'confirmation';

export default function ContributeData() {
    const router = useRouter();
    const { supabase, user } = useSupabase();
    const [step, setStep] = useState<Step>('type-select');
    const [dataType, setDataType] = useState<'text' | 'sensor' | 'image' | null>(null);
    const [mode, setMode] = useState<'demo' | 'custom' | null>(null);
    const [selectedSample, setSelectedSample] = useState<any>(null);
    const [customData, setCustomData] = useState('');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [consentGiven, setConsentGiven] = useState(false);
    const [loading, setLoading] = useState(false);
    const [contributionResult, setContributionResult] = useState<any>(null);

    const handleDataTypeSelect = (type: 'text' | 'sensor' | 'image', selectedMode: 'demo' | 'custom') => {
        setDataType(type);
        setMode(selectedMode);
        setStep(selectedMode === 'demo' ? 'demo-select' : 'custom-input');
    };

    const handleDemoSelect = (sample: any) => {
        setSelectedSample(sample);
        setStep('review-terms'); // Go to terms review instead of direct submission
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !dataType) return;

        setUploadedFile(file);

        // For images, create preview and convert to base64
        if (dataType === 'image') {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                setFilePreview(result);
                setCustomData(`[Image: ${file.name}] ${result.substring(0, 100)}...`);
            };
            reader.readAsDataURL(file);
        }

        // For text files, read content
        if (dataType === 'text') {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                setCustomData(result);
                setFilePreview(result.substring(0, 200));
            };
            reader.readAsText(file);
        }

        // For sensor/JSON files
        if (dataType === 'sensor') {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                setCustomData(result);
                setFilePreview(result.substring(0, 200));
            };
            reader.readAsText(file);
        }
    };

    const handleCustomSubmit = () => {
        if (!customData.trim() || !dataType) {
            alert('Please enter your data');
            return;
        }

        setStep('review-terms'); // Go to terms review
    };

    const handleSubmit = async (
        sampleData: string,
        type: string,
        targetDataset: string,
        isDemo: boolean
    ) => {
        setLoading(true);

        try {
            if (!user) {
                router.push('/contributor/login');
                return;
            }

            // Get or create contributor
            let { data: contributor } = await supabase
                .from('contributors')
                .select('*')
                .eq('auth_user_id', user.id)
                .maybeSingle();

            if (!contributor) {
                // Should have been created by dashboard, but just in case
                const { data: newContributor } = await supabase
                    .from('contributors')
                    .insert({
                        auth_user_id: user.id,
                        name: user.user_metadata?.full_name || user.email?.split('@')[0],
                        email: user.email,
                        total_earnings: 0
                    })
                    .select()
                    .single();
                contributor = newContributor;
            }

            if (!contributor) throw new Error('Failed to get contributor');

            // Get the target dataset
            const { data: dataset } = await supabase
                .from('datasets')
                .select('*')
                .eq('name', targetDataset)
                .single();

            if (!dataset) throw new Error('Dataset not found');

            // Calculate quality and value
            const quality = isDemo
                ? selectedSample?.estimatedValue ? 90 + Math.random() * 8 : calculateQualityScore(type, sampleData)
                : calculateQualityScore(type, sampleData);

            const value = isDemo
                ? selectedSample?.estimatedValue || calculateContributionValue(quality, type)
                : calculateContributionValue(quality, type);

            // Create data contribution
            const { data: contribution, error } = await supabase
                .from('data_contributions')
                .insert({
                    contributor_id: contributor.contributor_id,
                    dataset_id: dataset.dataset_id,
                    data_type: type,
                    sample_data: sampleData,
                    quality_score: quality,
                    contribution_value: value,
                })
                .select()
                .single();

            if (error) throw error;

            // Update dataset stats
            await supabase
                .from('datasets')
                .update({
                    total_contributions: dataset.total_contributions + 1,
                    contributor_count: dataset.contributor_count + 1,
                })
                .eq('dataset_id', dataset.dataset_id);

            setContributionResult({
                sample: sampleData,
                dataset: dataset.name,
                quality,
                value,
                datasetSize: dataset.total_contributions + 1,
                contributionId: contribution.contribution_id,
            });

            setStep('confirmation');
        } catch (error) {
            console.error('Error creating contribution:', error);
            alert('Error creating contribution. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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
                    <Link href="/contributor/dashboard" className="text-xl font-bold text-white tracking-tight">
                        DataUnion
                    </Link>
                    <Link href="/contributor/dashboard" className="text-sm text-white/50 hover:text-white transition-colors">
                        Back to Dashboard
                    </Link>
                </div>
            </header>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex justify-between text-xs uppercase tracking-wider text-white/40 mb-2 font-medium">
                        <span>Step {step === 'type-select' ? 1 : step === 'demo-select' || step === 'custom-input' ? 2 : step === 'review-terms' ? 3 : 4} of 4</span>
                        <span className="text-emerald-400">
                            {step === 'type-select' && 'Select Type'}
                            {(step === 'demo-select' || step === 'custom-input') && 'Input Data'}
                            {step === 'review-terms' && 'Review Terms'}
                            {step === 'confirmation' && 'Complete'}
                        </span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                        <div
                            className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)] transition-all duration-500 ease-out relative"
                            style={{
                                width: `${step === 'type-select' ? 25 :
                                    step === 'demo-select' || step === 'custom-input' ? 50 :
                                        step === 'review-terms' ? 75 : 100
                                    }%`
                            }}
                        >
                            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white/20 to-transparent"></div>
                        </div>
                    </div>
                </div>

                {/* Step 1: Data Type Selection */}
                {step === 'type-select' && (
                    <div>
                        <div className="mb-12">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                                CONTRIBUTE YOUR DATA
                            </h1>
                            <p className="text-white/50 text-lg">
                                Choose what type of data you want to contribute
                            </p>
                        </div>

                        <div className="space-y-8">
                            {DATA_TYPE_OPTIONS.map((option) => {
                                // Define icons based on type
                                const getIcon = (type: string) => {
                                    switch (type) {
                                        case 'text':
                                            return (
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            );
                                        case 'sensor':
                                            return (
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                </svg>
                                            );
                                        case 'image':
                                            return (
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            );
                                        default:
                                            return null;
                                    }
                                };

                                return (
                                    <div key={option.value} className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0 text-white/80">
                                                {getIcon(option.value)}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-bold text-white mb-2">
                                                    {option.label}
                                                </h3>
                                                <p className="text-white/50 text-sm">{option.description}</p>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <CometCard>
                                                <button
                                                    onClick={() => handleDataTypeSelect(option.value as any, 'demo')}
                                                    className="w-full text-left p-0 rounded-xl transition-all group"
                                                >
                                                    <BackgroundGradient
                                                        containerClassName="rounded-2xl [&>div.absolute]:rounded-[inherit]"
                                                        className="rounded-xl bg-zinc-900"
                                                        colors={["#064e3b", "#059669", "#10b981", "#34d399"]}
                                                    >
                                                        <div className="p-5">
                                                            <div className="flex items-start gap-3 mb-3">
                                                                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                    <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                                    </svg>
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="font-semibold text-white mb-1">Use Demo Sample</div>
                                                                    <div className="text-sm text-white/50">Quick contribution with pre-made data</div>
                                                                </div>
                                                            </div>
                                                            <div className="inline-flex items-center gap-2 text-xs font-medium text-white/40 group-hover:text-white/60 group-hover:translate-x-1 transition-all">
                                                                Select <span>→</span>
                                                            </div>
                                                        </div>
                                                    </BackgroundGradient>
                                                </button>
                                            </CometCard>

                                            <CometCard>
                                                <button
                                                    onClick={() => handleDataTypeSelect(option.value as any, 'custom')}
                                                    className="w-full text-left bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-white/30 transition-all group"
                                                >
                                                    <div className="flex items-start gap-3 mb-3">
                                                        <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                            </svg>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-semibold text-white mb-1">Upload Your Own</div>
                                                            <div className="text-sm text-white/50">Contribute your actual data</div>
                                                        </div>
                                                    </div>
                                                    <div className="inline-flex items-center gap-2 text-xs font-medium text-white/40 group-hover:text-white/60 group-hover:translate-x-1 transition-all">
                                                        Select <span>→</span>
                                                    </div>
                                                </button>
                                            </CometCard>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Step 2A: Demo Sample Selection */}
                {step === 'demo-select' && dataType && (
                    <div>
                        <button
                            onClick={() => setStep('type-select')}
                            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back
                        </button>

                        <div className="mb-12">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                                SELECT A DEMO SAMPLE
                            </h1>
                            <p className="text-white/50 text-lg">
                                Choose a pre-made {dataType} sample to contribute
                            </p>
                        </div>

                        <div className="grid gap-4">
                            {DEMO_DATA_SAMPLES[dataType as keyof typeof DEMO_DATA_SAMPLES]?.map((sample: any) => (
                                <CometCard key={sample.id}>
                                    <button
                                        onClick={() => handleDemoSelect(sample)}
                                        disabled={loading}
                                        className="w-full text-left bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-all disabled:opacity-50"
                                    >
                                        <div className="mb-3">
                                            <div className="text-white/40 text-xs mb-1">SAMPLE {dataType.toUpperCase()}</div>
                                            <div className="text-white font-mono text-sm bg-white/[0.02] p-3 rounded-lg">
                                                {sample.preview || sample.sample}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-white/50">Will be added to: {sample.targetDataset}</span>
                                            <span className="text-white font-semibold">~${sample.estimatedValue}</span>
                                        </div>
                                    </button>
                                </CometCard>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2B: Custom Input */}
                {step === 'custom-input' && dataType && (
                    <div>
                        <button
                            onClick={() => setStep('type-select')}
                            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back
                        </button>

                        <div className="mb-12">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                                ENTER YOUR {dataType.toUpperCase()}
                            </h1>
                            <p className="text-white/50 text-lg">
                                Contribute your own data sample
                            </p>
                        </div>

                        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6">
                            {dataType === 'text' && (
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">
                                        Your Text Sample
                                    </label>

                                    {/* File Upload Option */}
                                    <div className="mb-4">
                                        <label className="block cursor-pointer">
                                            <div className="flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-white/[0.02] border-2 border-dashed border-white/10 hover:border-white/30 transition-colors">
                                                <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <span className="text-white/70 text-sm">
                                                    {uploadedFile ? uploadedFile.name : 'Upload Text File (.txt)'}
                                                </span>
                                            </div>
                                            <input
                                                type="file"
                                                accept=".txt,.md,.csv"
                                                onChange={handleFileUpload}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>

                                    <div className="text-center text-white/30 text-xs mb-4">OR</div>

                                    {/* Manual Text Area */}
                                    <textarea
                                        value={customData}
                                        onChange={(e) => setCustomData(e.target.value)}
                                        placeholder="Enter your text data manually (e.g., social media post, comment, review)..."
                                        className="w-full h-32 px-4 py-3 rounded-lg bg-white/[0.02] border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 resize-none"
                                    />
                                </div>
                            )}

                            {dataType === 'sensor' && (
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">
                                        Sensor Data (JSON format)
                                    </label>

                                    {/* File Upload Option */}
                                    <div className="mb-4">
                                        <label className="block cursor-pointer">
                                            <div className="flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-white/[0.02] border-2 border-dashed border-white/10 hover:border-white/30 transition-colors">
                                                <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <span className="text-white/70 text-sm">
                                                    {uploadedFile ? uploadedFile.name : 'Upload JSON File (.json)'}
                                                </span>
                                            </div>
                                            <input
                                                type="file"
                                                accept=".json,.txt"
                                                onChange={handleFileUpload}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>

                                    <div className="text-center text-white/30 text-xs mb-4">OR</div>

                                    {/* Manual Input */}
                                    <textarea
                                        value={customData}
                                        onChange={(e) => setCustomData(e.target.value)}
                                        placeholder='{"latitude": 12.9716, "longitude": 77.5946, "speed": 45}'
                                        className="w-full h-32 px-4 py-3 rounded-lg bg-white/[0.02] border border-white/10 text-white placeholder:text-white/40 font-mono text-sm focus:outline-none focus:border-white/30 resize-none"
                                    />
                                    <p className="text-xs text-white/40 mt-2">Enter sensor readings in JSON format</p>
                                </div>
                            )}

                            {dataType === 'image' && (
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-4">
                                        Upload Medical Image
                                    </label>

                                    {/* File Upload */}
                                    <label className="block cursor-pointer mb-4">
                                        <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 rounded-lg bg-white/[0.02] border-2 border-dashed border-white/10 hover:border-white/30 transition-colors">
                                            <svg className="w-12 h-12 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <div className="text-center">
                                                <span className="text-white/70 text-sm block mb-1">
                                                    {uploadedFile ? uploadedFile.name : 'Click to upload image'}
                                                </span>
                                                <span className="text-white/40 text-xs">
                                                    PNG, JPG, JPEG (Max 10MB)
                                                </span>
                                            </div>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                        />
                                    </label>

                                    {/* Image Preview */}
                                    {filePreview && (
                                        <div className="bg-white/[0.02] rounded-lg p-4 mb-4">
                                            <div className="text-xs text-white/40 mb-2">PREVIEW</div>
                                            <img
                                                src={filePreview}
                                                alt="Upload preview"
                                                className="max-w-full h-48 object-contain rounded-lg bg-black/20"
                                            />
                                        </div>
                                    )}

                                    <p className="text-xs text-white/50">
                                        For demo purposes: Upload anonymized medical images (X-rays, MRI scans, CT scans)
                                    </p>
                                </div>
                            )}

                            <Button
                                onClick={handleCustomSubmit}
                                disabled={!customData.trim() || loading}
                                className="w-full"
                                size="lg"
                            >
                                {loading ? 'Processing...' : 'Review Terms'}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Review Usage Terms */}
                {step === 'review-terms' && (
                    <div>
                        <button
                            onClick={() => setStep(mode === 'demo' ? 'demo-select' : 'custom-input')}
                            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back
                        </button>

                        <div className="mb-12">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                                REVIEW USAGE TERMS
                            </h1>
                            <p className="text-white/50 text-lg">
                                Understand how your data can be used before giving consent
                            </p>
                        </div>

                        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-6">
                            <h2 className="text-xl font-bold text-white mb-6">Data Usage Agreement</h2>

                            <div className="space-y-6">
                                {/* Allowed Uses */}
                                <div>
                                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Allowed Uses
                                    </h3>
                                    <ul className="space-y-2 ml-7">
                                        <li className="flex items-start gap-2 text-white/60 text-sm">
                                            <span className="text-white/40 mt-0.5">•</span>
                                            Training AI/ML models for legitimate purposes
                                        </li>
                                        <li className="flex items-start gap-2 text-white/60 text-sm">
                                            <span className="text-white/40 mt-0.5">•</span>
                                            Research and analysis for public benefit
                                        </li>
                                        <li className="flex items-start gap-2 text-white/60 text-sm">
                                            <span className="text-white/40 mt-0.5">•</span>
                                            Product development and quality improvement
                                        </li>
                                        <li className="flex items-start gap-2 text-white/60 text-sm">
                                            <span className="text-white/40 mt-0.5">•</span>
                                            Educational and scientific purposes
                                        </li>
                                    </ul>
                                </div>

                                {/* Restrictions */}
                                <div className="pt-4 border-t border-white/5">
                                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Restricted Uses
                                    </h3>
                                    <ul className="space-y-2 ml-7">
                                        <li className="flex items-start gap-2 text-white/60 text-sm">
                                            <span className="text-white/40 mt-0.5">•</span>
                                            No re-identification of individuals
                                        </li>
                                        <li className="flex items-start gap-2 text-white/60 text-sm">
                                            <span className="text-white/40 mt-0.5">•</span>
                                            No sale to third parties without explicit consent
                                        </li>
                                        <li className="flex items-start gap-2 text-white/60 text-sm">
                                            <span className="text-white/40 mt-0.5">•</span>
                                            No use for surveillance or tracking
                                        </li>
                                        <li className="flex items-start gap-2 text-white/60 text-sm">
                                            <span className="text-white/40 mt-0.5">•</span>
                                            No discriminatory or harmful purposes
                                        </li>
                                    </ul>
                                </div>

                                {/* Data Retention */}
                                <div className="pt-4 border-t border-white/5">
                                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Data Retention
                                    </h3>
                                    <ul className="space-y-2 ml-7">
                                        <li className="flex items-start gap-2 text-white/60 text-sm">
                                            <span className="text-white/40 mt-0.5">•</span>
                                            Data retained for maximum 5 years or until consent is revoked
                                        </li>
                                        <li className="flex items-start gap-2 text-white/60 text-sm">
                                            <span className="text-white/40 mt-0.5">•</span>
                                            Can be deleted upon request at any time
                                        </li>
                                        <li className="flex items-start gap-2 text-white/60 text-sm">
                                            <span className="text-white/40 mt-0.5">•</span>
                                            Anonymization applied after licensing
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">
                            <Checkbox
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                label="I have read and accept the usage terms above"
                            />
                        </div>

                        <Button
                            onClick={() => {
                                if (!termsAccepted) {
                                    alert('Please accept the usage terms to continue');
                                    return;
                                }
                                // Prepare for submission
                                if (mode === 'demo' && selectedSample) {
                                    handleSubmit(selectedSample.sample, selectedSample.dataType, selectedSample.targetDataset, true);
                                } else if (mode === 'custom' && dataType) {
                                    const assignment = getDatasetAssignment(dataType, customData);
                                    handleSubmit(customData, dataType, assignment.dataset, false);
                                }
                            }}
                            disabled={!termsAccepted || loading}
                            className="w-full"
                            size="lg"
                        >
                            {loading ? 'Processing...' : 'Proceed to Submit'}
                        </Button>
                    </div>
                )

                }

                {/* Step 4: Confirmation */}
                {step === 'confirmation' && contributionResult && (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-white/5 rounded-full mx-auto mb-6 flex items-center justify-center">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <h1 className="text-4xl font-bold text-white mb-4">Contribution Added!</h1>
                        <p className="text-white/60 mb-8 max-w-md mx-auto">
                            Your data sample has been successfully added to a platform dataset
                        </p>

                        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8 max-w-2xl mx-auto text-left">
                            <div className="space-y-4">
                                <div>
                                    <div className="text-xs text-white/40 mb-1">YOUR SAMPLE</div>
                                    <div className="bg-white/[0.02] p-3 rounded-lg font-mono text-sm text-white/80">
                                        {contributionResult.sample.substring(0, 100)}
                                        {contributionResult.sample.length > 100 && '...'}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                    <div>
                                        <div className="text-xs text-white/40 mb-1">ADDED TO DATASET</div>
                                        <div className="font-semibold text-white">{contributionResult.dataset}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-white/40 mb-1">QUALITY SCORE</div>
                                        <div className="font-semibold text-white">{contributionResult.quality.toFixed(0)}%</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-white/40 mb-1">ESTIMATED VALUE</div>
                                        <div className="font-semibold text-white">${contributionResult.value.toFixed(2)}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-white/40 mb-1">DATASET SIZE</div>
                                        <div className="font-semibold text-white">{contributionResult.datasetSize.toLocaleString()} samples</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button onClick={() => router.push('/contributor/dashboard')} variant="primary">
                                View Dashboard
                            </Button>
                            <Button onClick={() => window.location.reload()} variant="secondary">
                                Contribute Another
                            </Button>
                            <Button onClick={() => router.push('/contributor/transparency')} variant="ghost">
                                View Transparency Log
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
