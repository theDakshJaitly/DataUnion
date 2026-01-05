'use client';

import { Badge } from '@/components/ui/badge';
import { CometCard } from '@/components/ui/comet-card';

export function CompanyDashboardView() {
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
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-white/50">NeuroTech AI</span>
                    </div>
                </div>
            </header>

            <div className="relative z-0 max-w-7xl mx-auto px-6 py-12">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                        COMPANY DASHBOARD
                    </h1>
                    <p className="text-white/50 text-lg">Welcome back, NeuroTech AI</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
                        <div className="text-sm text-white/50 mb-2">Total Licenses</div>
                        <div className="text-3xl font-bold text-white">12</div>
                    </div>
                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
                        <div className="text-sm text-white/50 mb-2">Total Spend</div>
                        <div className="text-3xl font-bold text-white">$45,200</div>
                    </div>
                </div>

                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div id="btn-marketplace">
                            <CometCard>
                                <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-all cursor-pointer">
                                    <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mb-4">
                                        <svg className="w-7 h-7 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Browse Marketplace</h3>
                                    <p className="text-white/60 text-sm">Discover new datasets</p>
                                </div>
                            </CometCard>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
