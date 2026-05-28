import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Star, MapPin, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Post, Shop } from '@/types';
import ConfidentialContent from '@/components/features/ConfidentialContent';
import type { Metadata } from 'next';

// Revalidate every 60 seconds
export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://baito-voice-rdps.vercel.app';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const mockPost = MOCK_POSTS.find((p) => p.id === id);
  let shopName = mockPost?.shop_name || 'バイト口コミ';
  let content = mockPost?.filtered_content || '';

  if (!mockPost) {
    const isPlaceholderUrl =
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
    if (!isPlaceholderUrl) {
      try {
        const { data } = await supabase
          .from('posts')
          .select('shop_name, filtered_content')
          .eq('id', id)
          .single();
        if (data) {
          shopName = data.shop_name;
          content = data.filtered_content;
        }
      } catch {}
    }
  }

  const title = `${shopName}のバイト口コミ | Baito Voice`;
  const description = content.slice(0, 100) + (content.length > 100 ? '…' : '');
  const url = `${siteUrl}/post/${id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Baito Voice',
      locale: 'ja_JP',
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title,
      description,
      site: '@baito_voice',
    },
  };
}

const MOCK_POSTS = [
  {
    id: "mock-1",
    created_at: new Date().toISOString(),
    shop_name: "渋谷カフェ・ラテ",
    rating: 4,
    tone_type: "mild",
    wage: 1200,
    tags: ["#楽", "#まかない有"],
    filtered_content: "シフトの融通が利きやすく、スタッフの皆さんもとても親切で働きやすい環境です。美味しいまかないもいただけます！",
    original_content: "店長がめっちゃ優しくてシフト超自由！まかないのパスタが美味しすぎるから実質食費浮いて最高です。",
    shops: {
      id: "shop-1",
      name: "渋谷カフェ・ラテ",
      location: "東京都渋谷区神南1-2-3",
      average_rating: 4
    }
  },
  {
    id: "mock-2",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    shop_name: "新宿コンビニ24",
    rating: 2,
    tone_type: "business",
    wage: 1050,
    tags: ["#激務"],
    filtered_content: "深夜時間帯は比較的業務量が多く、マルチタスク能力が求められるため、非常に鍛えられる環境です。",
    original_content: "夜勤ワンオペで品出しとレジと掃除全部やらされてマジで地獄。忙しすぎて死ぬ。",
    shops: {
      id: "shop-2",
      name: "新宿コンビニ24",
      location: "東京都新宿区歌舞伎町2-3-4",
      average_rating: 2
    }
  },
  {
    id: "mock-3",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    shop_name: "梅田居酒屋・のれん",
    rating: 5,
    tone_type: "humor",
    wage: 1500,
    tags: ["#人間関係良", "#まかない有"],
    filtered_content: "活気あふれる職場で、まるで毎日がフェスティバルのようです。店長のギャグ線が高く、笑いの絶えない職場です！",
    original_content: "みんな仲良すぎてバイト終わりの飲み会が楽しすぎる！店長が面白くて最高です。時給も良し！",
    shops: {
      id: "shop-3",
      name: "梅田居酒屋・のれん",
      location: "大阪府大阪市北区梅田1-1-1",
      average_rating: 5
    }
  }
];

export default async function PostDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    let post: any = null;
    let dbError = false;

    const isPlaceholderUrl = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

    if (isPlaceholderUrl) {
        dbError = true;
    } else {
        try {
            const { data, error } = await supabase
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
                
            if (error) {
                throw error;
            }
            post = data;
        } catch (e) {
            console.error('Error fetching post:', e);
            dbError = true;
        }
    }

    // Fallback to mock data if db error or post not found in db
    if (!post || dbError) {
        post = MOCK_POSTS.find(p => p.id === id);
    }

    if (!post) {
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

                    {/* Original Content with Blur UI */}
                    <section className="opacity-90">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-bold text-gray-600 flex items-center gap-2">
                                <span className="w-1 h-6 bg-gray-300 rounded-full"></span>
                                元の心の声
                            </h2>
                            <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-500 rounded-md">
                                非公開情報
                            </span>
                        </div>
                        <ConfidentialContent content={post.original_content} />
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
