// Payout distribution utilities

import { createClient } from './supabase';

export interface PayoutDistribution {
    contributionId: string;
    contributorId: string;
    contributorName: string;
    amount: number;
    weight: number;
}

/**
 * Distributes license fee to all contributors of a dataset
 * Using weighted proportional distribution based on quality scores
 * 
 * Formula: 
 * - Contribution Weight = Quality Score × 1.0
 * - Total Weight = Sum of all contribution weights
 * - Share = (Contribution Weight / Total Weight) × Contributor Pool (90%)
 */
export async function distributeLicensePayout(
    licenseId: string,
    datasetId: string,
    licenseFee: number,
    companyName: string
): Promise<{ success: boolean; distributions: PayoutDistribution[]; error?: string }> {
    try {
        const supabase = createClient();

        // 1. Get all contributions for this dataset
        const { data: contributions, error: contribError } = await supabase
            .from('data_contributions')
            .select(`
        contribution_id,
        contributor_id,
        quality_score,
        contributor:contributors (name)
      `)
            .eq('dataset_id', datasetId);

        if (contribError || !contributions || contributions.length === 0) {
            return {
                success: false,
                distributions: [],
                error: 'No contributions found for dataset',
            };
        }

        // 2. Calculate contributor pool (90% of license fee)
        const platformFee = licenseFee * 0.10;
        const contributorPool = licenseFee * 0.90;

        // 3. Calculate total weight (sum of all quality scores)
        const totalWeight = contributions.reduce(
            (sum, contrib) => sum + contrib.quality_score,
            0
        );

        // 4. Calculate each contributor's share and create payout records
        const distributions: PayoutDistribution[] = [];
        const payoutPromises = contributions.map(async (contribution) => {
            const weight = contribution.quality_score;
            const share = (weight / totalWeight) * contributorPool;

            // Create payout record
            const { error: payoutError } = await supabase.from('payout_records').insert({
                contribution_id: contribution.contribution_id,
                contributor_id: contribution.contributor_id,
                dataset_id: datasetId,
                license_id: licenseId,
                amount: share,
                payout_date: new Date().toISOString(),
            });

            if (payoutError) {
                console.error('Error creating payout record:', payoutError);
                return null;
            }

            // Update contributor total_earnings with direct SELECT + UPDATE
            const { data: contributor } = await supabase
                .from('contributors')
                .select('total_earnings')
                .eq('contributor_id', contribution.contributor_id)
                .single();

            if (contributor) {
                const newTotal = (contributor.total_earnings || 0) + share;
                await supabase
                    .from('contributors')
                    .update({ total_earnings: newTotal })
                    .eq('contributor_id', contribution.contributor_id);
            }

            // Handle potential array or object for contributor relation
            const contributorData = contribution.contributor as any;
            const contributorName = Array.isArray(contributorData)
                ? contributorData[0]?.name
                : contributorData?.name;

            distributions.push({
                contributionId: contribution.contribution_id,
                contributorId: contribution.contributor_id,
                contributorName: contributorName || 'Unknown',
                amount: share,
                weight,
            });

            return share;
        });

        await Promise.all(payoutPromises);

        // 5. Update dataset times_licensed counter
        const { data: dataset } = await supabase
            .from('datasets')
            .select('times_licensed')
            .eq('dataset_id', datasetId)
            .single();

        if (dataset) {
            await supabase
                .from('datasets')
                .update({ times_licensed: dataset.times_licensed + 1 })
                .eq('dataset_id', datasetId);
        }

        return {
            success: true,
            distributions,
        };
    } catch (error) {
        console.error('Error in distributeLicensePayout:', error);
        return {
            success: false,
            distributions: [],
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Calculate payout preview without actually creating records
 */
export async function calculatePayoutPreview(
    datasetId: string,
    licenseFee: number
): Promise<{ totalContributors: number; contributorPool: number; platformFee: number; avgPayout: number }> {
    const supabase = createClient();

    const { data: contributions } = await supabase
        .from('data_contributions')
        .select('quality_score')
        .eq('dataset_id', datasetId);

    const contributorCount = contributions?.length || 0;
    const platformFee = licenseFee * 0.10;
    const contributorPool = licenseFee * 0.90;
    const avgPayout = contributorCount > 0 ? contributorPool / contributorCount : 0;

    return {
        totalContributors: contributorCount,
        contributorPool,
        platformFee,
        avgPayout,
    };
}
