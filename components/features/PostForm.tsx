'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Send, Wand2, Loader2, MapPin, Banknote, Tag } from 'lucide-react';
import { ToneType } from '@/types';

const TAG_OPTIONS = ['#激務', '#楽', '#人間関係良', '#まかない有'];

export default function PostForm() {
    const router = useRouter();
    const [shopName, setShopName] = useState('');
    const [location, setLocation] = useState('');
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(0);
    const [tone, setTone] = useState<ToneType>('business');
    const [wage, setWage] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const handleGenerate = async () => {
        if (!content) return;
        setIsGenerating(true);

        try {
            const response = await fetch('/api/rewrite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content, tone }),
            });

            const data = await response.json();

            if (data.error) {
                alert('エラーが発生しました: ' + data.error);
                return;
            }

            setGeneratedContent(data.result);
        } catch (error) {
            console.error('Generation error:', error);
            alert('通信エラーが発生しました');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleTagToggle = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            alert('評価（星）を選択してください');
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    shopName,
                    location,
                    originalContent: content,
                    filteredContent: generatedContent,
                    tone,
                    rating,
                    wage: wage ? parseInt(wage, 10) : null,
                    tags: selectedTags,
                }),
            });

            const data = await response.json();

            if (data.error) {
                alert('エラーが発生しました: ' + data.error);
                return;
            }

            // トースト表示
            setToastMessage('投稿が完了しました！ホームへ戻ります。');
            setShowToast(true);

            // Reset form
            setShopName('');
            setLocation('');
            setContent('');
            setRating(0);
            setGeneratedContent('');
            setWage('');
            setSelectedTags([]);

            // 2秒後にリダイレクト
            setTimeout(() => {
                setShowToast(false);
                router.push('/');
                router.refresh();
            }, 2000);
        } catch (error) {
            console.error('Submission error:', error);
            alert('送信に失敗しました');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 relative">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="text-blue-600">バイト</span>の声を届ける
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Shop Name */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        店名
                    </label>
                    <input
                        type="text"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                        placeholder="例: コンビニ〇〇店"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Location (Optional) */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            エリア・場所 <span className="text-gray-400 text-xs ml-1">（任意）</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MapPin size={18} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                placeholder="例: 渋谷駅前、新宿など"
                            />
                        </div>
                    </div>

                    {/* Hourly Wage (Optional) */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            時給 <span className="text-gray-400 text-xs ml-1">（任意）</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Banknote size={18} className="text-gray-400" />
                            </div>
                            <input
                                type="number"
                                value={wage}
                                onChange={(e) => setWage(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                placeholder="例: 1200"
                                min="0"
                            />
                        </div>
                    </div>
                </div>

                {/* Rating */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        評価
                    </label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`p-1 transition-transform hover:scale-110 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                            >
                                <Star size={32} fill={rating >= star ? 'currentColor' : 'none'} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tags (Optional) */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        特徴タグ <span className="text-gray-400 text-xs ml-1">（任意・複数選択可）</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {TAG_OPTIONS.map((tag) => {
                            const isSelected = selectedTags.includes(tag);
                            return (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => handleTagToggle(tag)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                        isSelected
                                            ? 'bg-blue-100 border border-blue-300 text-blue-700 shadow-sm font-bold'
                                            : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    {tag}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Original Content */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        元のレビュー（本音でOK）
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none min-h-[120px]"
                        placeholder="店長が理不尽で..."
                        required
                    />
                </div>

                {/* Tone Selection */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                        変換トーン
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {(['business', 'mild', 'humor'] as ToneType[]).map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setTone(t)}
                                className={`py-3 px-4 rounded-xl border transition-all font-semibold ${tone === t
                                    ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-200'
                                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {t === 'business' && 'ビジネス'}
                                {t === 'mild' && 'マイルド'}
                                {t === 'humor' && 'ユーモア'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* AI Generation Button */}
                <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={!content || isGenerating}
                    className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transform transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="animate-spin" />
                            AIが変換中...
                        </>
                    ) : (
                        <>
                            <Wand2 />
                            AIで変換する
                        </>
                    )}
                </button>

                {/* Generated Content Preview */}
                {generatedContent && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 animate-in fade-in slide-in-from-bottom-4">
                        <h3 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                            <Wand2 size={16} />
                            変換結果
                        </h3>
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                            {generatedContent}
                        </p>
                    </div>
                )}

                {/* Submit Button */}
                {generatedContent && (
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin" />
                                送信中...
                            </>
                        ) : (
                            <>
                                <Send size={20} />
                                この内容で投稿する
                            </>
                        )}
                    </button>
                )}
            </form>

            {/* Custom Toast */}
            {showToast && (
                <div className="fixed bottom-6 right-6 bg-slate-900/90 text-white px-6 py-3.5 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-3 z-50 border border-slate-700 animate-in fade-in slide-in-from-bottom-5">
                    <div className="bg-emerald-500 text-slate-900 p-1 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <span className="text-sm font-semibold">{toastMessage}</span>
                </div>
            )}
        </div>
    );
}
