import { NextResponse } from 'next/server';

// Gemini API（無料枠あり）をfetchで直接呼ぶ。SDK依存なし。
const GEMINI_MODEL = 'gemini-2.0-flash';

export async function POST(request: Request) {
    try {
        const { content, tone } = await request.json();

        if (!content || !tone) {
            return NextResponse.json(
                { error: 'Content and tone are required' },
                { status: 400 }
            );
        }

        // APIキー未設定時はモックを返す（開発時の安全策）
        if (!process.env.GEMINI_API_KEY) {
            await new Promise((resolve) => setTimeout(resolve, 800));
            return NextResponse.json({
                result: `【MOCK】(${tone}) ${content}（API Keyが未設定のためモックを返しています）`,
            });
        }

        const systemPrompt = `あなたは「バイトの口コミ」を「社会的に適切な表現」に変換するAIです。
ユーザーの入力した口コミを、指定されたトーンに合わせてリライトしてください。

トーンの定義:
- business: 丁寧で客観的なビジネス文書風。感情を抑え、建設的な意見にする。
- mild: 柔らかく、角が立たない表現。ネガティブな内容も「改善の余地がある」程度に留める。
- humor: ユーモアを交えた、少し笑える表現。自虐や誇張を適度に入れ、読み手を楽しませる。

重要なルール:
- 個人名・従業員名が含まれていても、出力には含めないこと。
- 出力はリライト後の文章のみを返すこと。前置きや説明は不要。

トーン: ${tone}

口コミ: ${content}`;

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;

        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 500 },
            }),
        });

        if (!res.ok) {
            const errText = await res.text();
            console.error('Gemini API Error:', res.status, errText);
            return NextResponse.json(
                { error: 'AI変換に失敗しました。しばらくしてから再度お試しください。' },
                { status: 500 }
            );
        }

        const data = await res.json();
        const result = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (!result) {
            console.error('Gemini API: empty result', JSON.stringify(data));
            return NextResponse.json(
                { error: 'AI変換結果が取得できませんでした。' },
                { status: 500 }
            );
        }

        return NextResponse.json({ result });
    } catch (error) {
        console.error('Rewrite API Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate content' },
            { status: 500 }
        );
    }
}
