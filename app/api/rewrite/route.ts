import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { ToneType } from '@/types';

export async function POST(request: Request) {
    try {
        const { content, tone } = await request.json();

        if (!content || !tone) {
            return NextResponse.json(
                { error: 'Content and tone are required' },
                { status: 400 }
            );
        }

        // Mock response if API key is not set (for development safety)
        if (!process.env.OPENAI_API_KEY) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return NextResponse.json({
                result: `【MOCK】(${tone}) ${content} (API Keyが設定されていないためモックを返しています)`,
            });
        }

        const systemPrompt = `
      あなたは「バイトの口コミ」を「社会的に適切な表現」に変換するAIです。
      ユーザーの入力した口コミを、指定されたトーンに合わせてリライトしてください。
      
      トーンの定義:
      - business: 丁寧で客観的なビジネス文書風。感情を抑え、建設的な意見にする。
      - mild: 柔らかく、角が立たない表現。ネガティブな内容も「改善の余地がある」程度に留める。
      - humor: ユーモアを交えた、少し笑える表現。自虐や誇張を適度に入れ、読み手を楽しませる。
      
      出力はリライト後の文章のみを返してください。
    `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `トーン: ${tone}\n\n口コミ: ${content}` },
            ],
        });

        const result = completion.choices[0].message.content;

        return NextResponse.json({ result });
    } catch (error) {
        console.error('OpenAI API Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate content' },
            { status: 500 }
        );
    }
}
