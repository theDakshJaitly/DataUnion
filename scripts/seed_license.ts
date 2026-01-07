
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase credentials. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
    console.log('Seeding mock license...');

    // 1. Get a dataset
    const { data: datasets, error: dsError } = await supabase.from('datasets').select('dataset_id').limit(1);
    if (dsError || !datasets || datasets.length === 0) {
        console.error('No datasets found or error:', dsError);
        return;
    }
    const datasetId = datasets[0].dataset_id;
    console.log('Found Dataset:', datasetId);

    // 2. Get a company
    const { data: companies, error: coError } = await supabase.from('companies').select('company_id').limit(1);
    if (coError || !companies || companies.length === 0) {
        console.error('No companies found or error:', coError);
        return;
    }
    const companyId = companies[0].company_id;
    console.log('Found Company:', companyId);

    // 3. Insert License
    const { data, error } = await supabase.from('licenses').insert({
        dataset_id: datasetId,
        company_id: companyId,
        intended_use: 'Training LLM for Medical Diagnosis',
        price_paid: 5000.00,
        licensed_at: new Date().toISOString()
    }).select();

    if (error) {
        console.error('Error inserting license:', error);
    } else {
        console.log('License inserted successfully:', data);
    }
}

seed();
