
export type WalkthroughStep = {
    id: string;
    view: 'contributor-dashboard' | 'contribute-flow' | 'company-dashboard' | 'marketplace' | 'intro';
    targetId?: string; // ID of the element to highlight
    title: string;
    description: string;
    placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
    action?: 'next' | 'click-target'; // 'click-target' means user must click the highlighted element to proceed
};

export const WALKTHROUGH_STEPS: WalkthroughStep[] = [
    {
        id: 'intro',
        view: 'intro',
        title: 'Welcome to DataUnion',
        description: 'This guided tour will show you how DataUnion connects data contributors with AI companies in a transparent, ethical economy.',
        placement: 'center',
        action: 'next',
    },
    {
        id: 'contributor-intro',
        view: 'contributor-dashboard',
        title: 'Contributor Dashboard',
        description: 'We start as a Data Contributor. This dashboard gives you full visibility into your data assets and earnings.',
        placement: 'center',
        action: 'next',
    },
    {
        id: 'stats-earnings',
        view: 'contributor-dashboard',
        targetId: 'stat-earnings',
        title: 'Track Your Earnings',
        description: 'See exactly how much you\'ve earned from your data licenses. Payments are instant and transparent.',
        placement: 'bottom',
        action: 'next',
    },
    {
        id: 'stats-quality',
        view: 'contributor-dashboard',
        targetId: 'stat-quality',
        title: 'Quality Score',
        description: 'Higher quality data earns more. Our system automatically scores every contribution.',
        placement: 'bottom',
        action: 'next',
    },
    {
        id: 'action-contribute',
        view: 'contributor-dashboard',
        targetId: 'btn-contribute',
        title: 'Contribute Data',
        description: 'Let\'s add a new dataset to the platform. Click here to start.',
        placement: 'right',
        action: 'click-target',
    },
    // Contribute Flow
    {
        id: 'contribute-type',
        view: 'contribute-flow',
        targetId: 'type-selection',
        title: 'Select Data Type',
        description: 'You can contribute various types of data. For this demo, we\'ll choose "Medical Image".',
        placement: 'right',
        action: 'click-target',
    },
    {
        id: 'contribute-upload',
        view: 'contribute-flow',
        targetId: 'demo-select',
        title: 'Upload Data',
        description: 'We\'ll use a pre-anonymized demo sample for this walkthrough.',
        placement: 'left',
        action: 'click-target',
    },
    {
        id: 'contribute-terms',
        view: 'contribute-flow',
        targetId: 'terms-checkbox',
        title: 'Explicit Consent',
        description: 'You must review and accept usage terms. You retain ownership and can revoke consent later.',
        placement: 'top',
        action: 'click-target',
    },
    {
        id: 'contribute-submit',
        view: 'contribute-flow',
        targetId: 'btn-submit',
        title: 'Submit Contribution',
        description: 'Once submitted, your data is encrypted and added to the marketplace.',
        placement: 'top',
        action: 'click-target',
    },
    // Switch to Company
    {
        id: 'switch-to-company',
        view: 'company-dashboard',
        title: 'Switching Roles',
        description: 'Now, let\'s switch to the perspective of an AI Company looking for high-quality datasets.',
        placement: 'center',
        action: 'next',
    },
    {
        id: 'company-marketplace',
        view: 'company-dashboard',
        targetId: 'btn-marketplace',
        title: 'Access Marketplace',
        description: 'Companies can browse verified, consented datasets. Let\'s find some data.',
        placement: 'right',
        action: 'click-target',
    },
    // Marketplace
    {
        id: 'marketplace-browse',
        view: 'marketplace',
        targetId: 'dataset-card-medical',
        title: 'Verified Datasets',
        description: 'Here is the Medical Imaging dataset we just contributed to. It has high quality scores.',
        placement: 'right',
        action: 'next',
    },
    {
        id: 'marketplace-buy',
        view: 'marketplace',
        targetId: 'btn-license',
        title: 'License Data',
        description: 'Companies can license this data instantly. Smart contracts handle the payment distribution.',
        placement: 'left',
        action: 'click-target',
    },
    // Back to Contributor
    {
        id: 'switch-back',
        view: 'contributor-dashboard',
        title: 'Back to Contributor',
        description: 'Let\'s see what happened on the contributor\'s side after the purchase.',
        placement: 'center',
        action: 'next',
    },
    {
        id: 'final-earnings',
        view: 'contributor-dashboard',
        targetId: 'stat-earnings',
        title: 'Instant Payment',
        description: 'Look! Your earnings have increased immediately. This is the power of the Data Union.',
        placement: 'bottom',
        action: 'next',
    },
    {
        id: 'finish',
        view: 'contributor-dashboard',
        title: 'Tour Complete',
        description: 'You\'ve seen the full cycle: Contribute -> License -> Earn. Ready to join?',
        placement: 'center',
        action: 'next', // Or 'finish'
    }
];
