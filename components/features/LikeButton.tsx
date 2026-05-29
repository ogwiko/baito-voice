'use client';

import { useState } from 'react';
import { ThumbsUp } from 'lucide-react';

const LS_KEY = 'baito-voice-liked-posts';

function getLiked(): string[] {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
}

interface LikeButtonProps {
    postId: string;
    initialLikes: number;
}

export default function LikeButton({ postId, initialLikes }: LikeButtonProps) {
    const [likes, setLikes] = useState(initialLikes);
    const [hasLiked, setHasLiked] = useState<boolean>(() => getLiked().includes(postId));

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (hasLiked) return;

        setLikes((prev) => prev + 1);
        setHasLiked(true);
        try {
            const liked = getLiked();
            localStorage.setItem(LS_KEY, JSON.stringify([...liked, postId]));
        } catch {}

        try {
            const response = await fetch('/api/likes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId }),
            });
            if (!response.ok) throw new Error('Failed to update likes');
        } catch (err) {
            console.error('Error liking post:', err);
            setLikes((prev) => prev - 1);
            setHasLiked(false);
            try {
                const liked = getLiked().filter((id) => id !== postId);
                localStorage.setItem(LS_KEY, JSON.stringify(liked));
            } catch {}
        }
    };

    return (
        <button
            onClick={handleLike}
            disabled={hasLiked}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${hasLiked
                ? 'bg-blue-100 text-blue-600 cursor-default'
                : 'bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                }`}
        >
            <ThumbsUp size={14} className={hasLiked ? 'fill-current' : ''} />
            <span>参考になった</span>
            <span className="font-bold ml-0.5">{likes}</span>
        </button>
    );
}
