'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CometCard } from '@/components/ui/comet-card';
import { Checkbox } from '@/components/ui/checkbox';

interface ContributeFlowViewProps {
    stepId: string;
    onAction: (action: string) => void;
}

export function ContributeFlowView({ stepId, onAction }: ContributeFlowViewProps) {
    // Internal state to mimic the flow based on the current step
    const [viewState, setViewState] = useState<'type' | 'upload' | 'terms' | 'success'>('type');

    useEffect(() => {
        if (stepId === 'contribute-type') setViewState('type');
        if (stepId === 'contribute-upload') setViewState('upload');
        if (stepId === 'contribute-terms') setViewState('terms');
        if (stepId === 'contribute-submit') setViewState('terms'); // Still on terms page, just highlighting submit
    }, [stepId]);

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

            <header className="border-b border-white/5 bg-black/60 backdrop-blur-xl sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="text-xl font-bold text-white tracking-tight">DataUnion</div>
                </div>
            </header>

            <div className="relative z-0 max-w-4xl mx-auto px-6 py-12">
                {viewState === 'type' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-12">
                            <h1 className="text-4xl font-bold text-white mb-3">CONTRIBUTE YOUR DATA</h1>
                            <p className="text-white/50 text-lg">Choose what type of data you want to contribute</p>
                        </div>

                        <div id="type-selection" className="grid gap-4">
                            <CometCard>
                                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 flex items-center gap-4 cursor-pointer hover:bg-white/[0.05]">
                                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Medical Image</h3>
                                        <p className="text-white/50 text-sm">X-Rays, MRI, CT Scans</p>
                                    </div>
                                </div>
                            </CometCard>
                        </div>
                    </div>
                )}

                {viewState === 'upload' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-12">
                            <h1 className="text-4xl font-bold text-white mb-3">UPLOAD DATA</h1>
                            <p className="text-white/50 text-lg">Select a file to upload</p>
                        </div>

                        <div id="demo-select" className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 text-center cursor-pointer hover:border-white/30 transition-all">
                            <div className="w-16 h-16 bg-white/5 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Use Demo Sample</h3>
                            <p className="text-white/40 text-sm">Chest X-Ray (Anonymized)</p>
                        </div>
                    </div>
                )}

                {viewState === 'terms' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-12">
                            <h1 className="text-4xl font-bold text-white mb-3">REVIEW TERMS</h1>
                            <p className="text-white/50 text-lg">Explicit consent is required</p>
                        </div>

                        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 mb-6">
                            <h3 className="text-xl font-bold text-white mb-4">Data Usage Agreement</h3>
                            <ul className="space-y-3 text-white/60 text-sm">
                                <li className="flex gap-2">✓ Allowed: AI Training</li>
                                <li className="flex gap-2">✓ Allowed: Research</li>
                                <li className="flex gap-2 text-red-400">✕ Forbidden: Re-identification</li>
                            </ul>
                        </div>

                        <div id="terms-checkbox" className="mb-8 p-4 bg-white/[0.05] rounded-xl">
                            <Checkbox
                                checked={stepId === 'contribute-submit'}
                                label="I have read and accept the usage terms"
                                readOnly
                            />
                        </div>

                        <div id="btn-submit">
                            <Button className="w-full" size="lg">Submit Contribution</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
