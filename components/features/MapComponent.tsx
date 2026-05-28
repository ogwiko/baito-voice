'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';
import { Shop } from '@/types';

// Fix for default marker icon in Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapComponentProps {
  shops: Shop[];
}

export default function MapComponent({ shops }: MapComponentProps) {
  const defaultCenter: [number, number] = [35.6812, 139.7671]; // Tokyo Station
  const hasShops = shops && shops.length > 0;
  
  // Find a valid center
  const centerShop = shops?.find(s => s.lat && s.lng);
  const center: [number, number] = centerShop && centerShop.lat && centerShop.lng
    ? [centerShop.lat, centerShop.lng]
    : defaultCenter;

  return (
    <MapContainer
      center={center}
      zoom={hasShops ? 12 : 13}
      style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {shops && shops.map((shop) => {
        if (!shop.lat || !shop.lng) return null;
        return (
          <Marker 
            key={shop.id} 
            position={[shop.lat, shop.lng]} 
            icon={icon}
          >
            <Popup>
              <div className="p-1 min-w-[150px]">
                <h4 className="font-bold text-slate-800 text-sm mb-1">{shop.name}</h4>
                <p className="text-xs text-slate-500 mb-2">{shop.location}</p>
                <a 
                  href={`/?keyword=${encodeURIComponent(shop.name)}`}
                  className="inline-block w-full text-center bg-blue-600 text-white font-bold text-[10px] py-1 px-2 rounded hover:bg-blue-700 transition-colors"
                >
                  この店の口コミを見る
                </a>
              </div>
            </Popup>
          </Marker>
        );
      })}
      
      {!hasShops && (
        <Marker position={defaultCenter} icon={icon}>
          <Popup>
            東京駅周辺 <br /> バイト募集中！
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
