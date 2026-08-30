import { useState, useEffect } from 'react';
import { Creator } from '@/types/creators';
import { fetchCreators } from '@/services/creatorsService';

let isInitialLoad = true;

export const useCreators = () => {
    const [creatorsData, setCreatorsData] = useState<Creator[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                let forceShuffle = false;
                
                if (isInitialLoad) {
                    isInitialLoad = false;
                    const urlParams = new URLSearchParams(window.location.search);
                    const page = Number(urlParams.get('page')) || 1;
                    if (page === 1) {
                        forceShuffle = true;
                    }
                }
                
                const data = await fetchCreators(forceShuffle);
                setCreatorsData(data);
            } catch (err) {
                setError('Failed to fetch creators data');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return {
        creatorsData,
        loading,
        error
    };
};