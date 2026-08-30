import { Creator } from '@/types/creators';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchCreators = async (forceShuffle: boolean = false): Promise<Creator[]> => {
    try {
        const fullUrl = `${API_BASE_URL}/creators`;
        console.log('Fetching Creators from:', fullUrl);

        const response = await fetch(fullUrl);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText} (URL: ${fullUrl})`);
        }
        
        const data = await response.json();
        const fetchedData = Array.isArray(data) ? data : (data.data || []);

        let resultData: Creator[] = fetchedData;

        if (typeof sessionStorage !== 'undefined') {
            const cachedOrderStr = sessionStorage.getItem('creatorsOrder');
            if (cachedOrderStr && !forceShuffle) {
                try {
                    const cachedOrder: string[] = JSON.parse(cachedOrderStr);
                    const orderMap = new Map<string, number>(cachedOrder.map((id, index) => [id, index]));
                    resultData.sort((a, b) => {
                        const aIdx = orderMap.has(a._id) ? orderMap.get(a._id)! : 99999;
                        const bIdx = orderMap.has(b._id) ? orderMap.get(b._id)! : 99999;
                        return aIdx - bIdx;
                    });
                } catch (e) {
                    console.error('Failed to parse cached order', e);
                }
            } else {
                for (let i = resultData.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [resultData[i], resultData[j]] = [resultData[j], resultData[i]];
                }
                const order = resultData.map(t => t._id);
                sessionStorage.setItem('creatorsOrder', JSON.stringify(order));
            }
        }

        return resultData;
    } catch (error) {
        console.error('Error fetching creators:', error);
        throw error;
    }
};