'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DynamicBackground } from '@/components/landing/dynamic-background';
import { NoiseOverlay } from '@/components/ui/noise-overlay';

type Theme = 'magma' | 'emerald' | 'blue';

export default function Home() {
    const [activeTheme, setActiveTheme] = useState<Theme>('magma');

    // Arrow Icon Component for reuse
    const ArrowIcon = ({ className }: { className?: string }) => (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="square" strokeLinejoin="miter" />
        </svg>
    );

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black text-white font-sans selection:bg-red-500/30">
            <DynamicBackground theme={activeTheme} />
            <NoiseOverlay />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6">
                <div className="flex items-center gap-3">
                    <Image
                        src="/logo.png"
                        alt="DataUnion Logo"
                        width={40}
                        height={40}
                        className="rounded-md"
                        priority
                    />
                    <span className="text-xl font-bold tracking-tighter text-white mix-blend-difference">DataUnion</span>
                </div>
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide opacity-80 mix-blend-difference">
                    <Link href="/about" className="hover:text-white/80 transition-colors">MANIFESTO</Link>
                    <Link href="/research" className="hover:text-white/80 transition-colors">RESEARCH</Link>
                    <Link href="/contact" className="hover:text-white/80 transition-colors">CONTACT</Link>
                </nav>
            </header>

            {/* Sub-Header / Tagline (Moved to Top Right) */}
            <div className="fixed top-24 right-8 z-40 hidden md:block text-right pointer-events-none mix-blend-difference">
                <p className="text-xs font-mono text-white/40 uppercase tracking-widest leading-relaxed">
                    Building the future of<br />Consented Intelligence.
                </p>
            </div>

            {/* Massive Staggered Hero Tagline */}
            <div className="absolute inset-0 z-0 hidden md:flex flex-col justify-center px-20 pointer-events-none select-none overflow-hidden pb-32">
                <h1 className="text-[10vw] font-space-grotesk font-light text-white/40 tracking-tighter leading-none self-start transform -translate-y-16">
                    OWN
                </h1>
                <div className="self-end flex items-start gap-[2vw] transform -translate-y-4">
                    <h1 className="text-[10vw] font-space-grotesk font-light text-white/40 tracking-tighter leading-none">
                        YOUR
                    </h1>
                    <h1 className="text-[10vw] font-space-grotesk font-light text-white/40 tracking-tighter leading-none pt-[2vw]">
                        DATA
                    </h1>
                </div>
            </div>

            {/* Main Content Grid */}
            <main className="relative z-10 grid h-screen w-full grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">

                {/* 1. Contributor Panel (Emerald) */}
                <Link
                    href="/contributor/login"
                    className="group relative flex flex-col justify-end p-8 md:p-12 hover:bg-white/[0.02] transition-colors duration-500"
                    onMouseEnter={() => setActiveTheme('emerald')}
                    onMouseLeave={() => setActiveTheme('magma')}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="relative z-10">
                        <div className="mb-4 overflow-hidden">
                            <span className="inline-block px-3 py-1 text-xs font-bold tracking-widest uppercase border border-white/20 rounded-full text-white/60 group-hover:border-emerald-500/50 group-hover:text-emerald-400 transition-colors">
                                For Humans
                            </span>
                        </div>
                        <div className="flex items-start justify-between">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4 group-hover:translate-x-2 transition-transform duration-500">
                                Monetize<br />Your Data.
                            </h2>
                            <ArrowIcon className="w-8 h-8 md:w-12 md:h-12 text-white/50 group-hover:text-emerald-400 group-hover:translate-x-2 group-hover:-translate-y-2 transition-all duration-500" />
                        </div>
                        <p className="text-lg text-white/50 max-w-xs group-hover:text-white/80 transition-colors">
                            Join the ethical data economy. Control your digital footprint and earn fair rewards.
                        </p>

                        <div className="mt-8 flex items-center gap-2 text-emerald-500 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                            <span className="text-sm font-bold tracking-widest uppercase">Start Contributing</span>
                        </div>
                    </div>
                </Link>

                {/* 2. Company Panel (Blue) */}
                <Link
                    href="/company/login"
                    className="group relative flex flex-col justify-end p-8 md:p-12 hover:bg-white/[0.02] transition-colors duration-500"
                    onMouseEnter={() => setActiveTheme('blue')}
                    onMouseLeave={() => setActiveTheme('magma')}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="relative z-10">
                        <div className="mb-4 overflow-hidden">
                            <span className="inline-block px-3 py-1 text-xs font-bold tracking-widest uppercase border border-white/20 rounded-full text-white/60 group-hover:border-blue-500/50 group-hover:text-blue-400 transition-colors">
                                For AI Labs
                            </span>
                        </div>
                        <div className="flex items-start justify-between">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4 group-hover:translate-x-2 transition-transform duration-500">
                                Access<br />Ethical Data.
                            </h2>
                            <ArrowIcon className="w-8 h-8 md:w-12 md:h-12 text-white/50 group-hover:text-blue-400 group-hover:translate-x-2 group-hover:-translate-y-2 transition-all duration-500" />
                        </div>
                        <p className="text-lg text-white/50 max-w-xs group-hover:text-white/80 transition-colors">
                            License high-quality, consented datasets for training next-gen models.
                        </p>

                        <div className="mt-8 flex items-center gap-2 text-blue-500 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                            <span className="text-sm font-bold tracking-widest uppercase">Browse Marketplace</span>
                        </div>
                    </div>
                </Link>

                {/* 3. Walkthrough Panel (Magma/Default) */}
                <Link
                    href="/walkthrough"
                    className="group relative flex flex-col justify-end p-8 md:p-12 hover:bg-white/[0.02] transition-colors duration-500"
                    onMouseEnter={() => setActiveTheme('magma')}
                    onMouseLeave={() => setActiveTheme('magma')}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="relative z-10">
                        <div className="mb-4 overflow-hidden">
                            <span className="inline-block px-3 py-1 text-xs font-bold tracking-widest uppercase border border-white/20 rounded-full text-white/60 group-hover:border-red-500/50 group-hover:text-red-400 transition-colors">
                                Demo
                            </span>
                        </div>
                        <div className="flex items-start justify-between">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4 group-hover:translate-x-2 transition-transform duration-500">
                                See How<br />It Works.
                            </h2>
                            <ArrowIcon className="w-8 h-8 md:w-12 md:h-12 text-white/50 group-hover:text-red-400 group-hover:translate-x-2 group-hover:-translate-y-2 transition-all duration-500" />
                        </div>
                        <p className="text-lg text-white/50 max-w-xs group-hover:text-white/80 transition-colors">
                            Experience the full end-to-end flow of the DataUnion platform.
                        </p>

                        <div className="mt-8 flex items-center gap-2 text-red-500 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                            <span className="text-sm font-bold tracking-widest uppercase">Start Tour</span>
                        </div>
                    </div>
                </Link>
            </main>
        </div>
    );
}
