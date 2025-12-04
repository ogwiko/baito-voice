'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-50 text-gray-400">
      <Loader2 className="animate-spin mr-2" />
      地図を読み込み中...
    </div>
  ),
});

export default function MapWrapper() {
  return <MapComponent />;
}
