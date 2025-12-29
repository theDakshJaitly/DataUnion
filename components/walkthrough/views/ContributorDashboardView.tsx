'use client';

import { CometCard } from '@/components/ui/comet-card';
import { Badge } from '@/components/ui/badge';

interface ContributorDashboardViewProps {
    stats: {
        earnings: number;
        contributions: number;
        quality: number;
    };
    recentActivity: any[];
}

export function ContributorDashboardView({ stats, recentActivity }: ContributorDashboardViewProps) {
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
            <header className="border-b border-white/5 bg-black/60 backdrop-blur-xl sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="text-xl font-bold text-white tracking-tight">
                        DataUnion
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge variant="default">Demo User</Badge>
                    </div>
                </div>
            </header>

            <div className="relative z-0 max-w-7xl mx-auto px-6 py-12">
                {/* Welcome Section */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                        Welcome back, Demo User
                    </h1>
                    <p className="text-white/50 text-lg">
                        Here's an overview of your data contributions and earnings
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {/* Total Contributions */}
                    <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                </svg>
                            </div>
                            <div className="text-sm text-white/50 font-medium">Total Contributions</div>
                        </div>
                        <div className="text-3xl font-bold text-white">{stats.contributions}</div>
                    </div>

                    {/* Avg Quality Score */}
                    <div id="stat-quality" className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </div>
                            <div className="text-sm text-white/50 font-medium">Avg Quality</div>
                        </div>
                        <div className="text-3xl font-bold text-white">{stats.quality}%</div>
                    </div>

                    {/* Total Earnings */}
                    <div id="stat-earnings" className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-500">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-sm text-white/50 font-medium">Total Earnings</div>
                        </div>
                        <div className="text-3xl font-bold text-white transition-all duration-1000">
                            ${stats.earnings.toFixed(2)}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div id="btn-contribute">
                            <CometCard>
                                <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all group cursor-pointer">
                                    <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mb-4">
                                        <svg className="w-7 h-7 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Contribute New Data</h3>
                                    <p className="text-white/50 text-sm mb-4">
                                        Share your data sample and start earning
                                    </p>
                                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 group-hover:text-white group-hover:translate-x-2 transition-all">
                                        Get Started <span>→</span>
                                    </div>
                                </div>
                            </CometCard>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
