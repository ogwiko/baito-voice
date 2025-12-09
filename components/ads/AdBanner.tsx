import React from 'react';

interface AdBannerProps {
    type: 'sidebar' | 'feed';
}

export default function AdBanner({ type }: AdBannerProps) {
    if (type === 'sidebar') {
        return (
            <div className="w-full p-4 mt-6 bg-gray-50 border border-gray-200 rounded-xl flex flex-col items-center justify-center text-center space-y-2">
                <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm font-medium">
                    広告スペース
                </div>
                <div className="text-xs text-gray-500">
                    <p className="font-bold text-gray-700">マッハバイトで探そう！</p>
                    <p>採用祝い金がもらえるバイト探し</p>
                </div>
                <button className="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                    今すぐチェック
                </button>
                <span className="text-[10px] text-gray-400">スポンサーリンク</span>
            </div>
        );
    }

    // Feed type
    return (
        <div className="w-full my-6 p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between gap-4">
            <div className="flex-1">
                <p className="text-sm font-bold text-gray-800 mb-1">
                    スキマ時間で稼げるバイト特集
                </p>
                <p className="text-xs text-gray-600">
                    履歴書不要・面接なしで即日勤務可能なお仕事が満載！
                </p>
                <span className="text-[10px] text-gray-400 mt-1 block">スポンサーリンク</span>
            </div>
            <div className="w-24 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs shrink-0">
                広告
            </div>
        </div>
    );
}
