import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Star, MapPin, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Post, Shop } from '@/types';

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function PostDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    const { data: post, error } = await supabase
        .from('posts')
        .select(`
      *,
      shops (
        id,
        name,
        location,
        average_rating
      )
    `)
        .eq('id', id)
        .single();

    if (error || !post) {
        notFound();
    }

    const shop = post.shops as unknown as Shop;

    return (
        <div className="max-w-3xl mx-auto">
            <Link
                href="/"
                className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors"
            >
                <ArrowLeft size={20} className="mr-1" />
                一覧に戻る
            </Link>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">{shop.name}</h1>
                            <div className="flex items-center text-gray-500 gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                    <MapPin size={16} />
                                    {shop.location}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar size={16} />
                                    {new Date(post.created_at).toLocaleDateString('ja-JP')}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100">
                                <Star size={20} className="text-yellow-400 fill-yellow-400 mr-1.5" />
                                <span className="font-bold text-yellow-700 text-lg">{post.rating}</span>
                            </div>
                            <span className="text-xs text-gray-400 mt-1">評価</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                    {/* Filtered Content */}
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-bold text-gray-800 flex items-center gap-2">
                                <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                                みんなへの公開内容
                            </h2>
                            <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-md border border-blue-100">
                                {post.tone_type === 'business' && 'ビジネス変換'}
                                {post.tone_type === 'mild' && 'マイルド変換'}
                                {post.tone_type === 'humor' && 'ユーモア変換'}
                            </span>
                        </div>
                        <div className="bg-blue-50/30 p-6 rounded-xl border border-blue-100 text-gray-800 leading-relaxed text-lg">
                            {post.filtered_content}
                        </div>
                    </section>

                    {/* Original Content (Usually hidden or blurred in real apps, but showing here for demo) */}
                    <section className="opacity-75">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-bold text-gray-600 flex items-center gap-2">
                                <span className="w-1 h-6 bg-gray-300 rounded-full"></span>
                                元の心の声
                            </h2>
                            <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-500 rounded-md">
                                非公開情報
                            </span>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-gray-600 leading-relaxed italic">
                            {post.original_content}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const { data: post } = await supabase
        .from('posts')
        .select(`*, shops(name)`)
        .eq('id', id)
        .single();

    if (!post) {
        return {
            title: '投稿が見つかりません',
        };
    }

    const shop = post.shops as unknown as Shop;
    const title = `${shop.name}のバイト口コミ・評判`;
    const description = post.filtered_content.slice(0, 100) + '...';

    return {
        title,
        description,
        openGraph: {
            title: `${title} | Baito-Voice`,
            description,
        },
    };
}
