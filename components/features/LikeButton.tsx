'use client';

import { useState } from 'react';
import { ThumbsUp } from 'lucide-react';

interface LikeButtonProps {
    postId: string;
    initialLikes: number;
}

export default function LikeButton({ postId, initialLikes }: LikeButtonProps) {
    const [likes, setLikes] = useState(initialLikes);
    const [hasLiked, setHasLiked] = useState(false);

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent Link navigation if inside a Link
        e.stopPropagation();

        // Optimistic update
        setLikes((prev) => prev + 1);
        setHasLiked(true);

        try {
            const response = await fetch('/api/likes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId }),
            });

            if (!response.ok) {
                throw new Error('Failed to update likes');
            }

            // Optional: Sync with server response if needed
            // const data = await response.json();
            // setLikes(data.likes);
        } catch (err) {
            console.error('Error liking post:', err);
            // Revert on error
            setLikes((prev) => prev - 1);
            setHasLiked(false);
        }
    };

    return (
        <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${hasLiked
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                }`}
        >
            <ThumbsUp size={14} className={hasLiked ? 'fill-current' : ''} />
            <span>参考になった</span>
            <span className="font-bold ml-0.5">{likes}</span>
        </button>
    );
}
