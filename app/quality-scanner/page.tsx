// Quality Scanner Demo Page
'use client';

import { QualityScanner } from '@/components/quality/QualityScanner';

export default function QualityScannerPage() {
    return (
        <div className="min-h-screen bg-black">
            {/* Background gradient */}
            <div className="fixed inset-0 bg-gradient-to-br from-cyan-950/20 via-black to-blue-950/20" />

            {/* Grid pattern */}
            <div className="fixed inset-0 opacity-[0.02]">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, #fff 1px, transparent 1px),
                            linear-gradient(to bottom, #fff 1px, transparent 1px)
                        `,
                        backgroundSize: '60px 60px',
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 py-12">
                <QualityScanner />
            </div>

            {/* Info Footer */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 pb-12">
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-white">About Project Vector</h3>
                    <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-400">
                        <div>
                            <h4 className="text-white font-semibold mb-2">🧠 Client-Side AI</h4>
                            <p>
                                Runs entirely in your browser using WebAssembly. The 384-dimensional embedding model
                                (all-MiniLM-L6-v2) processes text locally without server uploads.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-2">🔒 Privacy First</h4>
                            <p>
                                Your data never leaves your device. All semantic analysis, vector computations,
                                and scoring happen on your machine.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-2">⚡ Web Workers</h4>
                            <p>
                                Heavy AI inference runs off the main thread, keeping the UI responsive even
                                during complex semantic analysis.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-2">📊 4-Pillar Scoring</h4>
                            <p>
                                Evaluates Domain Relevance (35%), Semantic Coherence (35%), Entity Density (20%),
                                and Novelty (10%) for comprehensive quality assessment.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
