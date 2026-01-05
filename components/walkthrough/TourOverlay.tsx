'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WalkthroughStep } from '@/lib/walkthroughSteps';
import { Button } from '@/components/ui/button';

interface TourOverlayProps {
    step: WalkthroughStep;
    currentStepIndex: number;
    totalSteps: number;
    onNext: () => void;
    onPrev: () => void;
    onQuit: () => void;
}

export function TourOverlay({
    step,
    currentStepIndex,
    totalSteps,
    onNext,
    onPrev,
    onQuit,
}: TourOverlayProps) {
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateRect = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });

            if (step.targetId) {
                const element = document.getElementById(step.targetId);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    setTargetRect(rect);

                    // Scroll into view if needed
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    // If target not found, fallback to center
                    setTargetRect(null);
                }
            } else {
                setTargetRect(null);
            }
        };

        // Initial update
        updateRect();

        // Update on resize and scroll
        window.addEventListener('resize', updateRect);
        window.addEventListener('scroll', updateRect, true);

        // Small delay to allow DOM to settle
        const timer = setTimeout(updateRect, 100);

        return () => {
            window.removeEventListener('resize', updateRect);
            window.removeEventListener('scroll', updateRect, true);
            clearTimeout(timer);
        };
    }, [step]);

    // Calculate tooltip position
    const getTooltipPosition = () => {
        if (!targetRect) {
            return { top: '50%', left: '50%', x: '-50%', y: '-50%' };
        }

        const spacing = 20;
        const tooltipWidth = 320; // Approx width
        const tooltipHeight = 200; // Approx height

        let top = 0;
        let left = 0;
        let x = '0%';
        let y = '0%';

        switch (step.placement) {
            case 'top':
                top = targetRect.top - spacing;
                left = targetRect.left + targetRect.width / 2;
                x = '-50%';
                y = '-100%';
                break;
            case 'bottom':
                top = targetRect.bottom + spacing;
                left = targetRect.left + targetRect.width / 2;
                x = '-50%';
                y = '0%';
                break;
            case 'left':
                top = targetRect.top + targetRect.height / 2;
                left = targetRect.left - spacing;
                x = '-100%';
                y = '-50%';
                break;
            case 'right':
                top = targetRect.top + targetRect.height / 2;
                left = targetRect.right + spacing;
                x = '0%';
                y = '-50%';
                break;
            default: // Center or fallback
                top = targetRect.bottom + spacing;
                left = targetRect.left + targetRect.width / 2;
                x = '-50%';
                y = '0%';
        }

        // Boundary checks (simple clamp)
        // Note: Real production code would do smarter collision detection

        return { top, left, x, y };
    };

    const tooltipPos = getTooltipPosition();

    return (
        <div className="fixed inset-0 z-[100] pointer-events-none">
            {/* Dark Overlay with Cutout */}
            {targetRect ? (
                <svg className="absolute inset-0 w-full h-full text-black/50 fill-current transition-all duration-500 ease-in-out">
                    <defs>
                        <mask id="spotlight-mask">
                            <rect x="0" y="0" width="100%" height="100%" fill="white" />
                            <rect
                                x={targetRect.left - 5}
                                y={targetRect.top - 5}
                                width={targetRect.width + 10}
                                height={targetRect.height + 10}
                                rx="8"
                                fill="black"
                            />
                        </mask>
                    </defs>
                    <rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        mask="url(#spotlight-mask)"
                    />

                    {/* Highlight Border */}
                    <rect
                        x={targetRect.left - 5}
                        y={targetRect.top - 5}
                        width={targetRect.width + 10}
                        height={targetRect.height + 10}
                        rx="8"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        className="animate-pulse"
                    />
                </svg>
            ) : (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-500" />
            )}

            {/* Tooltip Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1, top: tooltipPos.top, left: tooltipPos.left, x: tooltipPos.x, y: tooltipPos.y }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="absolute pointer-events-auto w-[320px]"
                style={{
                    position: 'absolute',
                }}
            >
                <div className="bg-[#0A0A0A] border border-white/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                    {/* Glass effect background */}
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-xl"></div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-xs font-mono text-white/40 bg-white/5 px-2 py-1 rounded">
                                STEP {currentStepIndex + 1}/{totalSteps}
                            </span>
                            <button
                                onClick={onQuit}
                                className="text-white/30 hover:text-white transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                        <p className="text-white/60 text-sm leading-relaxed mb-6">
                            {step.description}
                        </p>

                        <div className="flex items-center justify-between gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onPrev}
                                disabled={currentStepIndex === 0}
                                className="text-white/50 hover:text-white"
                            >
                                Back
                            </Button>

                            {step.action === 'next' ? (
                                <Button
                                    onClick={onNext}
                                    className="bg-white text-black hover:bg-white/90"
                                >
                                    Next
                                </Button>
                            ) : (
                                <div className="text-xs text-white/40 italic flex items-center gap-2">
                                    <span className="animate-pulse">●</span> Click highlighted area
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
