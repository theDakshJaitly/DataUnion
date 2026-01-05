'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function ContributorOnboarding() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        } else {
            // Mark onboarding as complete
            localStorage.setItem('onboarding_complete', 'true');
            router.push('/contributor/dashboard');
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkip = () => {
        localStorage.setItem('onboarding_complete', 'true');
        router.push('/contributor/dashboard');
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
                                        ? 'bg-white text-black' // Completed
                                        : idx === currentStep - 1
                                            ? 'bg-white text-black border-2 border-white' // Current
                                            : 'bg-white/10 text-white/40 border border-white/20' // Upcoming
                                    }`}>
                                    {idx < currentStep - 1 ? (
                                        // Checkmark for completed steps
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        // Step number
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
                        {/* Step 1: What is a Data Union? */}
                        {currentStep === 1 && (
                            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-10 md:p-12">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                                        <svg className="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                                        WHAT IS A DATA UNION?
                                    </h1>
                                </div>

                                <p className="text-lg text-white/70 leading-relaxed mb-8">
                                    A Data Union is a collective framework where individuals maintain ownership and control of their data while enabling ethical, transparent access for AI companies and researchers.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <p className="text-white/60">
                                            <span className="text-white font-semibold">You own your data</span> - Complete control over what you share and with whom
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <p className="text-white/60">
                                            <span className="text-white font-semibold">Fair compensation</span> - Get paid when your data creates value
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <p className="text-white/60">
                                            <span className="text-white font-semibold">Full transparency</span> - See exactly how your data is being used
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: What Data Can Be Contributed? */}
                        {currentStep === 2 && (
                            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-10 md:p-12">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                                        <svg className="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                        </svg>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                                        WHAT DATA CAN BE CONTRIBUTED?
                                    </h1>
                                </div>

                                <p className="text-lg text-white/70 leading-relaxed mb-8">
                                    We accept various types of high-quality datasets across multiple domains:
                                </p>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                                    {[
                                        { name: 'Text Data', icon: '📝' },
                                        { name: 'Images', icon: '🖼️' },
                                        { name: 'Sensor Data', icon: '📡' },
                                        { name: 'Location', icon: '📍' },
                                        { name: 'Health Data', icon: '❤️' },
                                        { name: 'Social Media', icon: '💬' },
                                    ].map((type) => (
                                        <div
                                            key={type.name}
                                            className="bg-white/[0.02] border border-white/5 rounded-xl p-4 hover:border-white/20 transition-colors"
                                        >
                                            <div className="text-2xl mb-2">{type.icon}</div>
                                            <div className="text-sm font-medium text-white/80">{type.name}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                                    <p className="text-sm text-white/50">
                                        <span className="text-white font-semibold">Quality Matters:</span> All datasets are assessed for completeness, accuracy, and relevance. Higher quality data receives better compensation.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Step 3: How Consent Works */}
                        {currentStep === 3 && (
                            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-10 md:p-12">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                                        <svg className="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                                        HOW CONSENT WORKS
                                    </h1>
                                </div>

                                <p className="text-lg text-white/70 leading-relaxed mb-8">
                                    We take consent seriously. Here's how we protect your rights:
                                </p>

                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white font-bold">
                                            1
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold mb-1">Explicit Approval Required</h3>
                                            <p className="text-white/60 text-sm">
                                                You must explicitly opt-in to each data contribution. No hidden checkboxes or fine print.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white font-bold">
                                            2
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold mb-1">Revocable at Any Time</h3>
                                            <p className="text-white/60 text-sm">
                                                You can withdraw your consent whenever you want. Your data will be immediately removed from future licensing.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white font-bold">
                                            3
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold mb-1">Full Transparency</h3>
                                            <p className="text-white/60 text-sm">
                                                Every time your data is licensed, you'll see who, when, why, and how much was paid.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: How You're Compensated */}
                        {currentStep === 4 && (
                            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-10 md:p-12">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                                        <svg className="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                                        HOW YOU'RE COMPENSATED
                                    </h1>
                                </div>

                                <p className="text-lg text-white/70 leading-relaxed mb-8">
                                    Fair value distribution based on quality and usage:
                                </p>

                                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 mb-6">
                                    <div className="text-sm text-white/50 mb-4">Example Payout Breakdown:</div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/70">Dataset License Fee</span>
                                            <span className="text-white font-semibold">$150.00</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-white/50">Platform Fee (10%)</span>
                                            <span className="text-white/50">-$15.00</span>
                                        </div>
                                        <div className="border-t border-white/5 pt-3 flex justify-between items-center">
                                            <span className="text-white font-semibold">Your Earnings (90%)</span>
                                            <span className="text-white text-xl font-bold">$135.00</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <p className="text-white/60 text-sm">
                                            <span className="text-white font-semibold">Quality-based pricing</span> - Higher quality datasets earn more
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <p className="text-white/60 text-sm">
                                            <span className="text-white font-semibold">Instant payouts</span> - Receive compensation immediately after licensing
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <p className="text-white/60 text-sm">
                                            <span className="text-white font-semibold">Complete transparency</span> - See all transactions in your dashboard
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
                            {currentStep === totalSteps ? 'Get Started' : 'Next →'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
