export type ToneType = 'business' | 'mild' | 'humor';

export interface Post {
    id: string;
    shop_name: string;
    shop_id?: string;
    original_content: string;
    filtered_content: string;
    tone_type: ToneType;
    rating: number;
    likes?: number;
    created_at: string;
}

export interface Shop {
    id: string;
    name: string;
    location: string;
    lat?: number;
    lng?: number;
    average_rating: number;
}
