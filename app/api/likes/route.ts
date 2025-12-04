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
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
