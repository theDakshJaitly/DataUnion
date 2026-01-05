'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function CompanyOnboarding() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        } else {
            // Mark onboarding as complete
            localStorage.setItem('company_onboarding_complete', 'true');
            router.push('/company/dashboard');
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkip = () => {
        localStorage.setItem('company_onboarding_complete', 'true');
        router.push('/company/dashboard');
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

            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Progress Indicator */}
                <div className="w-full max-w-2xl mx-auto px-6 pt-8 pb-4">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-white">Step {currentStep} of {totalSteps}</span>
                        <button
                            onClick={handleSkip}
                            className="text-sm text-white/50 hover:text-white transition-colors"
                        >
                            Skip to Dashboard →
                        </button>
                    </div>

                    {/* Visual Progress Steps */}
                    <div className="flex items-center gap-3">
                        {[...Array(totalSteps)].map((_, idx) => (
                            <div key={idx} className="flex items-center flex-1">
                                {/* Step Circle */}
                                <div className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${idx < currentStep
                                        ? 'bg-white text-black'
                                        : idx === currentStep - 1
                                            ? 'bg-white text-black border-2 border-white'
                                            : 'bg-white/10 text-white/40 border border-white/20'
                                    }`}>
                                    {idx < currentStep - 1 ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <span className="text-xs font-bold">{idx + 1}</span>
                                    )}
                                </div>

                                {/* Connector Line */}
                                {idx < totalSteps - 1 && (
                                    <div className={`flex-1 h-0.5 transition-all duration-300 ${idx < currentStep - 1 ? 'bg-white' : 'bg-white/10'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex items-center justify-center px-6 py-12">
                    <div className="w-full max-w-3xl">
                        {/* Step 1: How Datasets Are Structured */}
                        {currentStep === 1 && (
                            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-10 md:p-12">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                                        <svg className="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                                        HOW DATASETS ARE STRUCTURED
                                    </h1>
                                </div>

                                <p className="text-lg text-white/70 leading-relaxed mb-8">
                                    Datasets on DataUnion are aggregated from individual contributor samples, ensuring diversity and quality at scale.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <p className="text-white/60">
                                            <span className="text-white font-semibold">Individual Contributions</span> - Each dataset contains samples from multiple contributors
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <p className="text-white/60">
                                            <span className="text-white font-semibold">Quality Scoring</span> - All contributions are assessed for quality and completeness
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <p className="text-white/60">
                                            <span className="text-white font-semibold">Rich Metadata</span> - Domain, type, size, and quality metrics for informed decisions
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: How Licensing Works */}
                        {currentStep === 2 && (
                            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-10 md:p-12">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                                        <svg className="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                                        HOW LICENSING WORKS
                                    </h1>
                                </div>

                                <p className="text-lg text-white/70 leading-relaxed mb-8">
                                    Simple, transparent licensing with instant access and automatic contributor compensation:
                                </p>

                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white font-bold">
                                            1
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold mb-1">Browse & Select</h3>
                                            <p className="text-white/60 text-sm">
                                                Explore datasets filtered by domain, type, quality, and price
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white font-bold">
                                            2
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold mb-1">Specify Intended Use</h3>
                                            <p className="text-white/60 text-sm">
                                                Declare how you'll use the data for consent compliance
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white font-bold">
                                            3
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold mb-1">Automatic Distribution</h3>
                                            <p className="text-white/60 text-sm">
                                                90% of license fee automatically distributed to all contributors
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: How Consent Is Enforced */}
                        {currentStep === 3 && (
                            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-10 md:p-12">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                                        <svg className="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                                        HOW CONSENT IS ENFORCED
                                    </h1>
                                </div>

                                <p className="text-lg text-white/70 leading-relaxed mb-8">
                                    Every piece of data is backed by explicit contributor consent with clear boundaries:
                                </p>

                                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 mb-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <div>
                                                <div className="text-white font-semibold mb-1">Allowed Uses</div>
                                                <div className="text-white/60 text-sm">AI/ML training, research, product development</div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            <div>
                                                <div className="text-white font-semibold mb-1">Prohibited Uses</div>
                                                <div className="text-white/60 text-sm">Surveillance, re-identification, discrimination</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-sm text-white/50 bg-white/[0.02] border border-white/5 rounded-lg p-4">
                                    All licensing events are logged and visible to contributors in their transparency dashboard
                                </p>
                            </div>
                        )}

                        {/* Step 4: How Compliance Is Guaranteed */}
                        {currentStep === 4 && (
                            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-10 md:p-12">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                                        <svg className="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                        </svg>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                                        HOW COMPLIANCE IS GUARANTEED
                                    </h1>
                                </div>

                                <p className="text-lg text-white/70 leading-relaxed mb-8">
                                    Complete audit trails and accountability for responsible AI development:
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <p className="text-white/60">
                                            <span className="text-white font-semibold">Unique Audit IDs</span> - Every license has a traceable reference number
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <p className="text-white/60">
                                            <span className="text-white font-semibold">Usage Logging</span> - All licensing events permanently recorded
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <p className="text-white/60">
                                            <span className="text-white font-semibold">Transparent Payouts</span> - Contributors see exactly who licensed their data and when
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <div className="w-full max-w-2xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between gap-4">
                        <Button
                            variant="secondary"
                            onClick={handlePrevious}
                            disabled={currentStep === 1}
                            className={currentStep === 1 ? 'invisible' : ''}
                        >
                            ← Previous
                        </Button>

                        <Button
                            variant="primary"
                            onClick={handleNext}
                            className="min-w-[140px]"
                        >
                            {currentStep === totalSteps ? 'Access Marketplace' : 'Next →'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
