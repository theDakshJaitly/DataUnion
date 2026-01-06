// React Hook for Text Valuation using Web Worker
// Manages worker lifecycle, state, and communication

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type {
    ValuationRequest,
    ValuationResult,
    ValuationProgress,
    ValuationError,
    ModelReady,
} from '../ai/valuation.worker';

export interface ValuationState {
    isReady: boolean;
    isProcessing: boolean;
    progress: number;
    progressMessage: string;
    result: ValuationResult | null;
    error: string | null;
}

export interface UseTextValuationReturn extends ValuationState {
    valuate: (text: string) => Promise<ValuationResult | null>;
    reset: () => void;
}

/**
 * Hook for managing text valuation with Web Worker
 * Handles model loading, processing, and state management
 */
export function useTextValuation(): UseTextValuationReturn {
    const [state, setState] = useState<ValuationState>({
        isReady: false,
        isProcessing: false,
        progress: 0,
        progressMessage: '',
        result: null,
        error: null,
    });

    const workerRef = useRef<Worker | null>(null);
    const requestIdRef = useRef<number>(0);
    const resolveRef = useRef<((result: ValuationResult | null) => void) | null>(null);

    // Initialize worker
    useEffect(() => {
        // Create worker
        try {
            workerRef.current = new Worker(
                new URL('../ai/valuation.worker.ts', import.meta.url),
                { type: 'module' }
            );

            // Set up message handler
            workerRef.current.onmessage = (
                event: MessageEvent<ValuationResult | ValuationProgress | ValuationError | ModelReady>
            ) => {
                const message = event.data;

                switch (message.type) {
                    case 'ready':
                        setState(prev => ({
                            ...prev,
                            isReady: true,
                            progressMessage: 'Model loaded and ready',
                        }));
                        break;

                    case 'progress':
                        setState(prev => ({
                            ...prev,
                            progress: message.progress,
                            progressMessage: message.message,
                        }));
                        break;

                    case 'result':
                        setState(prev => ({
                            ...prev,
                            isProcessing: false,
                            progress: 100,
                            progressMessage: 'Analysis complete',
                            result: message,
                            error: null,
                        }));
                        // Resolve the promise
                        if (resolveRef.current) {
                            resolveRef.current(message);
                            resolveRef.current = null;
                        }
                        break;

                    case 'error':
                        setState(prev => ({
                            ...prev,
                            isProcessing: false,
                            progress: 0,
                            progressMessage: '',
                            error: message.error,
                        }));
                        // Resolve with null on error
                        if (resolveRef.current) {
                            resolveRef.current(null);
                            resolveRef.current = null;
                        }
                        break;
                }
            };

            // Handle worker errors
            workerRef.current.onerror = (error) => {
                console.error('Worker error:', error);
                setState(prev => ({
                    ...prev,
                    isProcessing: false,
                    error: 'Worker encountered an error',
                }));
                // Resolve with null on error
                if (resolveRef.current) {
                    resolveRef.current(null);
                    resolveRef.current = null;
                }
            };

            // Initialize the model
            workerRef.current.postMessage({ type: 'init' });

            // Show cold start message
            setState(prev => ({
                ...prev,
                progressMessage: 'Downloading Neural Engine (23MB)... This may take a moment on first load.',
            }));

        } catch (error) {
            console.error('Failed to create worker:', error);
            setState(prev => ({
                ...prev,
                error: 'Failed to initialize valuation engine',
            }));
        }

        // Cleanup
        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
                workerRef.current = null;
            }
        };
    }, []);

    // Valuate text function - now returns a Promise
    const valuate = useCallback(async (text: string): Promise<ValuationResult | null> => {
        if (!workerRef.current) {
            setState(prev => ({
                ...prev,
                error: 'Worker not initialized',
            }));
            return null;
        }

        if (!state.isReady) {
            setState(prev => ({
                ...prev,
                error: 'Model not ready yet. Please wait for initialization.',
            }));
            return null;
        }

        if (!text || text.trim().length === 0) {
            setState(prev => ({
                ...prev,
                error: 'No text provided for analysis',
            }));
            return null;
        }

        // Create a promise that will be resolved when the result comes back
        return new Promise<ValuationResult | null>((resolve) => {
            // Store the resolve function
            resolveRef.current = resolve;

            // Reset state and start processing
            const requestId = `req_${++requestIdRef.current}`;

            setState(prev => ({
                ...prev,
                isProcessing: true,
                progress: 0,
                progressMessage: 'Starting analysis...',
                result: null,
                error: null,
            }));

            // Send request to worker
            const request: ValuationRequest = {
                text,
                requestId,
            };

            workerRef.current!.postMessage(request);
        });
    }, [state.isReady]);

    // Reset function
    const reset = useCallback(() => {
        setState(prev => ({
            ...prev,
            isProcessing: false,
            progress: 0,
            progressMessage: prev.isReady ? 'Ready' : 'Loading...',
            result: null,
            error: null,
        }));
    }, []);

    return {
        ...state,
        valuate,
        reset,
    };
}
