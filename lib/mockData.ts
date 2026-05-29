// 共有モックデータ（Supabase未接続時のデモ表示用）
// app/page.tsx と app/post/[id]/page.tsx で共用

export const MOCK_POSTS = [
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
    shops: { id: "shop-1", name: "渋谷カフェ・ラテ", location: "東京都渋谷区神南1-2-3", average_rating: 4, lat: 35.6580, lng: 139.7016 }
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
    shops: { id: "shop-2", name: "新宿コンビニ24", location: "東京都新宿区歌舞伎町2-3-4", average_rating: 2, lat: 35.6896, lng: 139.6993 }
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
    shops: { id: "shop-3", name: "梅田居酒屋・のれん", location: "大阪府大阪市北区梅田1-1-1", average_rating: 5, lat: 34.7024, lng: 135.4959 }
  }
];
