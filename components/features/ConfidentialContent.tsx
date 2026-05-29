'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface ConfidentialContentProps {
  content: string;
}

export default function ConfidentialContent({ content }: ConfidentialContentProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-6">
      {/* Content wrapper with conditional blur */}
      <div 
        className={`text-gray-600 leading-relaxed italic transition-all duration-300 select-none ${
          !isRevealed ? 'blur-[6px] pointer-events-none' : ''
        }`}
      >
        {content}
      </div>

      {/* Overlay toggle button when not revealed */}
      {!isRevealed && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/30 backdrop-blur-[2px] transition-all">
          <button
            onClick={() => setIsRevealed(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs shadow-md hover:bg-slate-800 transform active:scale-95 transition-all cursor-pointer"
          >
            <Eye size={14} />
            心の声を表示する
          </button>
        </div>
      )}

      {/* Toggle button when revealed */}
      {isRevealed && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => setIsRevealed(false)}
            className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <EyeOff size={10} />
            非表示に戻す
          </button>
        </div>
      )}
    </div>
  );
}
