import { Star, MapPin, Quote } from 'lucide-react';
import { Post, Shop } from '@/types';
import Link from 'next/link';
import LikeButton from './LikeButton';

interface PostCardProps {
    post: Partial<Post>;
    shop: Partial<Shop>;
}

export default function PostCard({ post, shop }: PostCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-lg text-gray-900">{shop.name}</h3>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                        <MapPin size={14} />
                        <span>{shop.location}</span>
                    </div>
                </div>
                <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                    <Star size={16} className="text-yellow-400 fill-yellow-400 mr-1" />
                    <span className="font-bold text-yellow-700">{post.rating}</span>
                </div>
            </div>

            <div className="relative bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <Quote className="absolute top-2 left-2 text-blue-200 w-6 h-6 -z-10" />
                <p className="text-gray-700 leading-relaxed text-sm">
                    {post.filtered_content}
                </p>
                <div className="mt-3 flex justify-end">
                    <span className="text-xs font-medium px-2 py-1 bg-white rounded-md border border-blue-100 text-blue-600">
                        {post.tone_type === 'business' && 'ビジネス変換'}
                        {post.tone_type === 'mild' && 'マイルド変換'}
                        {post.tone_type === 'humor' && 'ユーモア変換'}
                    </span>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                <span>{new Date(post.created_at || '').toLocaleDateString()}</span>

                <div className="flex items-center gap-4">
                    <LikeButton postId={post.id!} initialLikes={post.likes || 0} />
                    <Link href={`/post/${post.id}`} className="hover:text-gray-600 hover:underline">
                        詳細を見る
                    </Link>
                </div>
            </div>
        </div>
    );
}
