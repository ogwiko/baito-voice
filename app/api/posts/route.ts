import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { shopName, location, originalContent, filteredContent, tone, rating } = body;

        // Basic validation
        if (!shopName || !originalContent || !filteredContent || !tone || !rating) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // 1. Check if shop exists, or create it
        // Note: In a real app, we might want to use Google Places API to verify
        const { data: existingShop } = await supabase
            .from('shops')
            .select('id')
            .eq('name', shopName)
            .single();

        let shopId = existingShop?.id;

        if (!shopId) {
            const { data: newShop, error: shopError } = await supabase
                .from('shops')
                .insert({
                    name: shopName,
                    location: location || '未設定',
                })
                .select()
                .single();

            if (shopError) throw shopError;
            shopId = newShop.id;
        }

        // 2. Create Post
        const { data: post, error: postError } = await supabase
            .from('posts')
            .insert({
                shop_name: shopName,
                shop_id: shopId,
                original_content: originalContent,
                filtered_content: filteredContent,
                tone_type: tone,
                rating: rating,
            })
            .select()
            .single();

        if (postError) throw postError;

        return NextResponse.json({ success: true, post });
    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json(
            { error: 'Failed to save post' },
            { status: 500 }
        );
    }
}
