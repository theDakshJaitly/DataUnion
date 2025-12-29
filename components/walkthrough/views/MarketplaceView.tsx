'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function MarketplaceView() {
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
                    <div className="text-sm text-white/50">Marketplace</div>
                </div>
            </header>

            <div className="relative z-0 max-w-7xl mx-auto px-6 py-12">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-3">DATASET MARKETPLACE</h1>
                    <p className="text-white/50 text-lg">Verified, high-quality datasets for AI training</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Target Dataset */}
                    <div id="dataset-card-medical" className="bg-white/[0.05] border border-white/20 rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-bl-xl">
                            NEW
                        </div>
                        <div className="mb-4">
                            <Badge className="mb-2">Medical Imaging</Badge>
                            <h3 className="text-xl font-bold text-white">Chest X-Ray Collection</h3>
                            <p className="text-white/50 text-sm mt-2">
                                5,000+ anonymized chest x-rays with radiologist annotations.
                            </p>
                        </div>

                        <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
                            <div>
                                <div className="text-xs text-white/40">PRICE</div>
                                <div className="text-lg font-bold text-white">$2,500</div>
                            </div>
                            <div id="btn-license">
                                <Button size="sm" className="bg-white text-black hover:bg-white/90">
                                    License Now
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Other Datasets (Dimmed) */}
                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 opacity-50">
                        <div className="mb-4">
                            <Badge variant="outline" className="mb-2">Text</Badge>
                            <h3 className="text-xl font-bold text-white">Customer Reviews Sentiment</h3>
                        </div>
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <Button size="sm" variant="outline" disabled>View Details</Button>
                        </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 opacity-50">
                        <div className="mb-4">
                            <Badge variant="outline" className="mb-2">Sensor</Badge>
                            <h3 className="text-xl font-bold text-white">IoT Traffic Data</h3>
                        </div>
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <Button size="sm" variant="outline" disabled>View Details</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
