// Demo data samples for individual contributions
// Each sample represents ONE piece of data from ONE contributor

export const DEMO_DATA_SAMPLES = {
    text: [
        {
            id: 'text-1',
            sample: 'Traffic is really heavy on MG Road this morning. Bumper to bumper since 8 AM. #BangaloreTraffic',
            dataType: 'text',
            targetDataset: 'Social Sentiment Dataset',
            estimatedValue: 2.50,
        },
        {
            id: 'text-2',
            sample: 'Just had an amazing experience with the new metro line! Clean, fast, and affordable. Highly recommend!',
            dataType: 'text',
            targetDataset: 'Social Sentiment Dataset',
            estimatedValue: 2.80,
        },
        {
            id: 'text-3',
            sample: 'Concerned about air quality today. AQI is showing 180+ in my area. Stay safe everyone.',
            dataType: 'text',
            targetDataset: 'Social Sentiment Dataset',
            estimatedValue: 2.30,
        },
    ],
    sensor: [
        {
            id: 'sensor-1',
            sample: '{"latitude": 12.9716, "longitude": 77.5946, "speed": 45, "timestamp": "2024-01-15T08:30:00Z"}',
            dataType: 'sensor',
            targetDataset: 'Urban Mobility Dataset',
            estimatedValue: 3.20,
            preview: 'GPS: 12.9716, 77.5946 | Speed: 45 km/h',
        },
        {
            id: 'sensor-2',
            sample: '{"temperature": 28.5, "humidity": 65, "energy_consumption": 2.4, "timestamp": "2024-01-15T14:00:00Z"}',
            dataType: 'sensor',
            targetDataset: 'IoT Smart Home Dataset',
            estimatedValue: 1.80,
            preview: 'Temp: 28.5°C | Humidity: 65% | Energy: 2.4 kWh',
        },
        {
            id: 'sensor-3',
            sample: '{"latitude": 12.2958, "longitude": 76.6394, "speed": 32, "timestamp": "2024-01-15T09:15:00Z"}',
            dataType: 'sensor',
            targetDataset: 'Urban Mobility Dataset',
            estimatedValue: 3.00,
            preview: 'GPS: 12.2958, 76.6394 | Speed: 32 km/h',
        },
    ],
    image: [
        {
            id: 'image-1',
            sample: 'data:image/placeholder', // In real app, would be base64 or uploaded
            dataType: 'image',
            targetDataset: 'Medical Imaging Dataset',
            estimatedValue: 8.50,
            preview: 'Chest X-Ray (Anonymized)',
        },
        {
            id: 'image-2',
            sample: 'data:image/placeholder',
            dataType: 'image',
            targetDataset: 'Medical Imaging Dataset',
            estimatedValue: 9.20,
            preview: 'MRI Scan (Anonymized)',
        },
    ],
};

// Data type options for selection
export const DATA_TYPE_OPTIONS = [
    {
        value: 'text',
        label: 'Text Sample',
        description: 'Social media posts, comments, reviews',
        examples: ['Tweets', 'Reviews', 'Comments'],
    },
    {
        value: 'sensor',
        label: 'Sensor Reading',
        description: 'GPS coordinates, IoT data, environmental sensors',
        examples: ['GPS data', 'Temperature', 'Energy usage'],
    },
    {
        value: 'image',
        label: 'Image Upload',
        description: 'Anonymized medical scans, photos',
        examples: ['X-rays', 'MRI scans', 'CT scans'],
    },
];

// Helper to get dataset assignment based on data type and content
export const getDatasetAssignment = (dataType: string, sample: string) => {
    // Simple logic - in production could use NLP/classification
    const lowerSample = sample.toLowerCase();

    if (dataType === 'text') {
        return {
            dataset: 'Social Sentiment Dataset',
            reason: 'Text content identified as social media/sentiment data',
        };
    }

    if (dataType === 'sensor') {
        // Check if it contains GPS/mobility keywords
        if (lowerSample.includes('latitude') || lowerSample.includes('longitude') || lowerSample.includes('speed')) {
            return {
                dataset: 'Urban Mobility Dataset',
                reason: 'GPS/mobility sensor data detected',
            };
        }
        // Otherwise IoT/smart home
        return {
            dataset: 'IoT Smart Home Dataset',
            reason: 'Smart home sensor data detected',
        };
    }

    if (dataType === 'image') {
        return {
            dataset: 'Medical Imaging Dataset',
            reason: 'Medical image data identified',
        };
    }

    return {
        dataset: 'Social Sentiment Dataset',
        reason: 'Default dataset assignment',
    };
};

// Calculate quality score based on data characteristics
export const calculateQualityScore = (dataType: string, sample: string): number => {
    let baseScore = 85;

    // Simple quality heuristics
    if (dataType === 'text') {
        const wordCount = sample.split(' ').length;
        if (wordCount >= 10) baseScore += 5;
        if (wordCount >= 20) baseScore += 3;
    }

    if (dataType === 'sensor') {
        try {
            JSON.parse(sample);
            baseScore += 5; // Valid JSON
        } catch {
            baseScore -= 10; // Invalid format
        }
    }

    // Add random variance (±5)
    const variance = Math.random() * 10 - 5;
    return Math.min(98, Math.max(70, baseScore + variance));
};

// Calculate estimated value based on quality
export const calculateContributionValue = (quality: number, dataType: string): number => {
    const baseValues = {
        text: 2.50,
        sensor: 3.00,
        image: 8.00,
    };

    const baseValue = baseValues[dataType as keyof typeof baseValues] || 2.00;
    const qualityMultiplier = quality / 90; // Normalize around 90%

    return parseFloat((baseValue * qualityMultiplier).toFixed(2));
};
