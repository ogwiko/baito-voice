'use client';

import { Search, MapPin, Banknote, Tag } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export default function SearchFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value && value !== 'すべてのエリア' && value !== 'こだわらない') {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            return params.toString();
        },
        [searchParams]
    );

    const handleChange = (name: string, value: string) => {
        router.push('/?' + createQueryString(name, value));
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Search size={20} className="text-blue-600" />
                条件で絞り込む
            </h3>

            <div className="space-y-6">
                {/* Free Word Search */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
                        placeholder="店名やキーワードで検索"
                        onChange={(e) => handleChange('keyword', e.target.value)}
                        defaultValue={searchParams.get('keyword') || ''}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer hover:text-blue-600 text-gray-400 transition-colors">
                        {/* Mic icon is decorative for now */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
                    </div>
                </div>

                {/* Area */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                        <MapPin size={14} /> エリア
                    </label>
                    <select
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-500 outline-none"
                        onChange={(e) => handleChange('area', e.target.value)}
                        defaultValue={searchParams.get('area') || ''}
                    >
                        <option value="">すべてのエリア</option>
                        <option value="北海道 東北">北海道・東北</option>
                        <option value="関東">関東</option>
                        <option value="東京">東京都</option>
                        <option value="神奈川">神奈川県</option>
                        <option value="埼玉">埼玉県</option>
                        <option value="千葉">千葉県</option>
                        <option value="中部 東海">中部・東海</option>
                        <option value="愛知">愛知県</option>
                        <option value="近畿 関西">近畿・関西</option>
                        <option value="大阪">大阪府</option>
                        <option value="京都">京都府</option>
                        <option value="兵庫">兵庫県</option>
                        <option value="中国 四国">中国・四国</option>
                        <option value="九州 沖縄">九州・沖縄</option>
                        <option value="福岡">福岡県</option>
                        <option value="その他">その他</option>
                    </select>
                </div>

                {/* Hourly Wage */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                        <Banknote size={14} /> 時給
                    </label>
                    <select
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-500 outline-none"
                        onChange={(e) => handleChange('wage', e.target.value)}
                        defaultValue={searchParams.get('wage') || ''}
                    >
                        <option>こだわらない</option>
                        <option value="1000">1000円以上</option>
                        <option value="1200">1200円以上</option>
                        <option value="1500">1500円以上</option>
                    </select>
                </div>

                {/* Tags */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                        <Tag size={14} /> 特徴
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {['#激務', '#楽', '#人間関係良', '#まかない有'].map((tag) => {
                            const isActive = searchParams.get('tag') === tag;
                            return (
                                <button
                                    key={tag}
                                    onClick={() => handleChange('tag', isActive ? '' : tag)}
                                    className={`px-3 py-1 rounded-full text-xs transition-colors ${isActive
                                        ? 'bg-blue-100 text-blue-700 font-bold'
                                        : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                                        }`}
                                >
                                    {tag}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
