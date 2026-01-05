'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSupabase } from '@/components/providers/supabase-provider';

export function ProfileSetupModal({
    isOpen,
    onComplete,
    currentName
}: {
    isOpen: boolean;
    onComplete: (name: string) => void;
    currentName?: string
}) {
    const { supabase, user } = useSupabase();
    const [displayName, setDisplayName] = useState(currentName || '');
    const [ageGroup, setAgeGroup] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!displayName || !ageGroup) return;

        setLoading(true);
        try {
            // Update contributor profile
            const { error } = await supabase
                .from('contributors')
                .update({
                    name: displayName
                    // age_group not in schema, ignoring or would need metadata update
                })
                .eq('auth_user_id', user?.id);

            if (error) {
                console.error('Error updating profile:', error);
                throw error;
            }

            onComplete(displayName);
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Blur Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

            {/* Modal Content */}
            <div className="relative z-10 w-full max-w-md bg-[#18181b] border border-white/10 rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Complete Your Profile</h2>
                    <p className="text-white/50 text-sm">
                        We need a few more details to personalize your experience.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">
                            What should we call you?
                        </label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                            placeholder="Enter your display name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">
                            Your Age Group
                        </label>
                        <div className="relative">
                            <select
                                value={ageGroup}
                                onChange={(e) => setAgeGroup(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:border-white/30 transition-colors cursor-pointer"
                                required
                            >
                                <option value="" disabled className="bg-[#18181b]">Select your age group</option>
                                <option value="18-24" className="bg-[#18181b]">18-24</option>
                                <option value="25-34" className="bg-[#18181b]">25-34</option>
                                <option value="35-44" className="bg-[#18181b]">35-44</option>
                                <option value="45-54" className="bg-[#18181b]">45-54</option>
                                <option value="55-64" className="bg-[#18181b]">55-64</option>
                                <option value="65+" className="bg-[#18181b]">65+</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={!displayName || !ageGroup || loading}
                        variant="primary"
                        className="w-full"
                    >
                        {loading ? 'Saving...' : 'Get Started'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
