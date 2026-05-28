import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    let body: any;
    try {
        body = await request.json();
    } catch (e) {
        return NextResponse.json(
            { error: 'Invalid JSON request' },
            { status: 400 }
        );
    }

    const { shopName, location, originalContent, filteredContent, tone, rating, wage, tags } = body;

    try {
        // Basic validation
        if (!shopName || !originalContent || !filteredContent || !tone || !rating) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // 1. Check if shop exists, or create it
        const { data: existingShop } = await supabase
            .from('shops')
            .select('id')
            .eq('name', shopName)
            .single();

        let shopId = existingShop?.id;

        if (!shopId) {
            // モックジオコーディング（場所名から簡易緯度経度を割り当て）
            let lat = 35.6812;
            let lng = 139.7671;

            if (location) {
                const loc = location.trim();
                if (loc.includes('渋谷')) {
                    lat = 35.6580 + (Math.random() - 0.5) * 0.005;
                    lng = 139.7016 + (Math.random() - 0.5) * 0.005;
                } else if (loc.includes('新宿')) {
                    lat = 35.6896 + (Math.random() - 0.5) * 0.005;
                    lng = 139.6993 + (Math.random() - 0.5) * 0.005;
                } else if (loc.includes('池袋')) {
                    lat = 35.7289 + (Math.random() - 0.5) * 0.005;
                    lng = 139.7103 + (Math.random() - 0.5) * 0.005;
                } else if (loc.includes('秋葉原')) {
                    lat = 35.6983 + (Math.random() - 0.5) * 0.005;
                    lng = 139.7730 + (Math.random() - 0.5) * 0.005;
                } else if (loc.includes('六本木')) {
                    lat = 35.6628 + (Math.random() - 0.5) * 0.005;
                    lng = 139.7315 + (Math.random() - 0.5) * 0.005;
                } else if (loc.includes('横浜')) {
                    lat = 35.4437 + (Math.random() - 0.5) * 0.01;
                    lng = 139.6380 + (Math.random() - 0.5) * 0.01;
                } else if (loc.includes('大阪') || loc.includes('梅田')) {
                    lat = 34.7024 + (Math.random() - 0.5) * 0.01;
                    lng = 135.4959 + (Math.random() - 0.5) * 0.01;
                } else if (loc.includes('京都')) {
                    lat = 35.0116 + (Math.random() - 0.5) * 0.01;
                    lng = 135.7681 + (Math.random() - 0.5) * 0.01;
                } else {
                    // デフォルトは東京駅周辺のランダム値
                    lat = 35.6812 + (Math.random() - 0.5) * 0.04;
                    lng = 139.7671 + (Math.random() - 0.5) * 0.04;
                }
            } else {
                lat = 35.6812 + (Math.random() - 0.5) * 0.04;
                lng = 139.7671 + (Math.random() - 0.5) * 0.04;
            }

            const { data: newShop, error: shopError } = await supabase
                .from('shops')
                .insert({
                    name: shopName,
                    location: location || '未設定',
                    lat,
                    lng,
                })
                .select()
                .single();

            if (shopError) throw shopError;
            shopId = newShop.id;
        }

        // 2. Create Post
        const parsedWage = wage ? parseInt(String(wage), 10) : null;
        const { data: post, error: postError } = await supabase
            .from('posts')
            .insert({
                shop_name: shopName,
                shop_id: shopId,
                original_content: originalContent,
                filtered_content: filteredContent,
                tone_type: tone,
                rating: rating,
                wage: isNaN(Number(parsedWage)) ? null : parsedWage,
                tags: Array.isArray(tags) ? tags : [],
            })
            .select()
            .single();

        if (postError) throw postError;

        return NextResponse.json({ success: true, post });
    } catch (error) {
        console.error('Database Error:', error);
        
        // Fallback for Demo mode when Supabase is not connected
        const isPlaceholderUrl = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
        const isFetchError = String(error).includes('fetch failed') || String(error).includes('getaddrinfo');
        
        if (isPlaceholderUrl || isFetchError) {
            console.log('Falling back to demo mode post response');
            const parsedWage = wage ? parseInt(String(wage), 10) : null;
            const mockPost = {
                id: "mock-" + Math.random().toString(36).substring(2, 9),
                created_at: new Date().toISOString(),
                shop_name: shopName,
                rating: rating,
                tone_type: tone,
                wage: isNaN(Number(parsedWage)) ? null : parsedWage,
                tags: Array.isArray(tags) ? tags : [],
                filtered_content: filteredContent,
                original_content: originalContent,
                shops: {
                    id: "shop-" + Math.random().toString(36).substring(2, 9),
                    name: shopName,
                    location: location || '未設定',
                    average_rating: rating,
                    lat: 35.6812,
                    lng: 139.7671
                }
            };
            return NextResponse.json({ success: true, post: mockPost, isDemo: true });
        }

        return NextResponse.json(
            { error: 'Failed to save post' },
            { status: 500 }
        );
    }
}
