// store/publicHousesStore.ts
import { create } from 'zustand';
import axios from 'axios';

export interface PublicHouse {
    id: number;
    name: string;
    city: string;
    sauna: boolean;
    indoor_swimming_pool: boolean;
    outdoor_swimming_pool: boolean;
    billiards: boolean;
    district: string;
    country: string;
    description: string;
    region: string;
    image1: string | null;
    contact: string;
    week_day_price: number;
    wifi: boolean;
    pool: boolean;
    price?: string;
    location?: string;
}

interface State {
    houses: PublicHouse[];
    fetchApprovedHouses: () => Promise<void>;
}

export const usePublicHousesStore = create<State>((set) => ({
    houses: [],
    fetchApprovedHouses: async () => {
        const { data } = await axios.get('http://10.0.2.2:8000/dacha/');
        const approved = data.filter((d: any) => d.is_verified === 'verified');
        set({
            houses: data
                .filter(d => d.is_verified === 'verified')
                .map(d => ({
                    ...d,
                    price: `${d.week_day_price} сум`,
                    location: `${d.region}, ${d.city}`,
                })),
        });
        console.log('FETCHED DACHA:', data);
        console.log('APPROVED:', approved);

    },

}));
