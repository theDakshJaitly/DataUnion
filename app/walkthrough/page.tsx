'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WALKTHROUGH_STEPS } from '@/lib/walkthroughSteps';
import { TourOverlay } from '@/components/walkthrough/TourOverlay';
import { ContributorDashboardView } from '@/components/walkthrough/views/ContributorDashboardView';
import { ContributeFlowView } from '@/components/walkthrough/views/ContributeFlowView';
import { CompanyDashboardView } from '@/components/walkthrough/views/CompanyDashboardView';
import { MarketplaceView } from '@/components/walkthrough/views/MarketplaceView';
import { AnimatePresence, motion } from 'framer-motion';

export default function WalkthroughPage() {
    const router = useRouter();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [stats, setStats] = useState({
        earnings: 124.50,
        contributions: 12,
        quality: 94
    });

    const currentStep = WALKTHROUGH_STEPS[currentStepIndex];

    // Handle "Next" logic
    const handleNext = () => {
        if (currentStepIndex < WALKTHROUGH_STEPS.length - 1) {
            setCurrentStepIndex(prev => prev + 1);

            // Simulate earnings update on the final step
            if (WALKTHROUGH_STEPS[currentStepIndex + 1].id === 'final-earnings') {
                setStats(prev => ({
                    ...prev,
                    earnings: prev.earnings + 25.00, // Add simulated payment
                    contributions: prev.contributions + 1
                }));
            }
        } else {
            // Finish
            router.push('/');
        }
    };

    const handlePrev = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);

            // Revert earnings if going back from final step
            if (currentStep.id === 'final-earnings') {
                setStats(prev => ({
                    ...prev,
                    earnings: prev.earnings - 25.00,
                    contributions: prev.contributions - 1
                }));
            }
        }
    };

    // Handle clicks on highlighted elements
    useEffect(() => {
        const handleGlobalClick = (e: MouseEvent) => {
            if (currentStep.action === 'click-target' && currentStep.targetId) {
                const target = document.getElementById(currentStep.targetId);
                if (target && (target === e.target || target.contains(e.target as Node))) {
                    // Clicked the target!
                    handleNext();
                }
            }
        };

        window.addEventListener('click', handleGlobalClick);
        return () => window.removeEventListener('click', handleGlobalClick);
    }, [currentStepIndex, currentStep]);


    // Render the appropriate view based on the step
    const renderView = () => {
        switch (currentStep.view) {
            case 'intro':
                return (
                    <div className="min-h-screen flex items-center justify-center bg-black">
                        <div className="text-center">
                            <h1 className="text-6xl font-bold text-white mb-4">DataUnion Walkthrough</h1>
                            <p className="text-white/50">Loading tour...</p>
                        </div>
                    </div>
                );
            case 'contributor-dashboard':
                return <ContributorDashboardView stats={stats} recentActivity={[]} />;
            case 'contribute-flow':
                return <ContributeFlowView stepId={currentStep.id} onAction={() => { }} />;
            case 'company-dashboard':
                return <CompanyDashboardView />;
            case 'marketplace':
                return <MarketplaceView />;
            default:
                return null;
        }
    };

    return (
        <div className="relative min-h-screen bg-black">
            {/* The underlying view */}
            <div className="transition-opacity duration-500">
                {renderView()}
            </div>

            {/* The Tour Overlay */}
            <TourOverlay
                step={currentStep}
                currentStepIndex={currentStepIndex}
                totalSteps={WALKTHROUGH_STEPS.length}
                onNext={handleNext}
                onPrev={handlePrev}
                onQuit={() => router.push('/')}
            />
        </div>
    );
}
