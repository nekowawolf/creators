import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Creator } from '@/types/creators';
import { fetchCreators } from '@/services/creatorsService';
import Fuse from 'fuse.js';

let isInitialLoad = true;

export const useCreators = () => {
    const searchParams = useSearchParams();
    const [creatorsData, setCreatorsData] = useState<Creator[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState(searchParams.get('search') || searchParams.get('q') || '');
    const [suggestion, setSuggestion] = useState<string | null>(null);

    useEffect(() => {
        const query = searchParams.get('search') || searchParams.get('q') || '';
        setSearch(query);
    }, [searchParams]);

    useEffect(() => {
        if (!search || creatorsData.length === 0) {
            setSuggestion(null);
            return;
        }

        const exactMatchExists = creatorsData.some(c => 
            c.name.toLowerCase().includes(search.toLowerCase())
        );

        if (exactMatchExists) {
            setSuggestion(null);
            return;
        }

        const fuse = new Fuse(creatorsData, {
            keys: ['name'],
            threshold: 0.4,
        });

        const results = fuse.search(search);
        if (results.length > 0) {
            const bestMatch = results[0].item.name;
            if (bestMatch.toLowerCase() !== search.toLowerCase()) {
                setSuggestion(bestMatch);
            } else {
                setSuggestion(null);
            }
        } else {
            setSuggestion(null);
        }
    }, [search, creatorsData]);

    const handleSuggestionClick = (newQuery: string) => {
        setSearch(newQuery);
    };

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
        error,
        search,
        setSearch,
        suggestion,
        handleSuggestionClick
    };
};