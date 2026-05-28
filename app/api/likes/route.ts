import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const { postId } = await request.json();

        if (!postId) {
            return NextResponse.json(
                { error: 'Post ID is required' },
                { status: 400 }
            );
        }

        const isPlaceholderUrl = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
        
        if (isPlaceholderUrl) {
            console.log('Falling back to demo mode for likes increment');
            // Mock success response with a random updated like count
            return NextResponse.json({ likes: Math.floor(Math.random() * 10) + 1, isDemo: true });
        }

        // Call the RPC function to increment likes atomically
        // This assumes the 'increment_likes' function exists in Supabase
        const { error } = await supabase.rpc('increment_likes', { post_id: postId });

        if (error) {
            console.error('Supabase RPC Error:', error);
            return NextResponse.json(
                { error: 'Failed to increment likes' },
                { status: 500 }
            );
        }

        // Fetch the updated count to return
        const { data: post, error: fetchError } = await supabase
            .from('posts')
            .select('likes')
            .eq('id', postId)
            .single();

        if (fetchError) {
            return NextResponse.json(
                { error: 'Failed to fetch updated likes' },
                { status: 500 }
            );
        }

        return NextResponse.json({ likes: post.likes });
    } catch (error) {
        console.error('API Error:', error);
        
        const isPlaceholderUrl = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
        const isFetchError = String(error).includes('fetch failed') || String(error).includes('getaddrinfo');
        
        if (isPlaceholderUrl || isFetchError) {
            return NextResponse.json({ likes: Math.floor(Math.random() * 10) + 1, isDemo: true });
        }

        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
