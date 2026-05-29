import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
    title: '利用規約・免責事項',
    description: 'Baito Voice の利用規約および免責事項',
};

export default function TermsPage() {
    return (
        <div className="max-w-3xl mx-auto">
            <Link
                href="/"
                className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors"
            >
                <ArrowLeft size={20} className="mr-1" />
                ホームに戻る
            </Link>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
                <header>
                    <h1 className="text-2xl font-bold text-gray-900">利用規約・免責事項</h1>
                    <p className="text-sm text-gray-400 mt-2">最終更新日: 2026年5月29日</p>
                </header>

                <section className="space-y-3">
                    <h2 className="font-bold text-gray-800 flex items-center gap-2">
                        <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
                        第1条（サービスの目的）
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-sm">
                        Baito Voice（以下「本サービス」）は、アルバイトに関する体験・感想を、AIによって社会的に適切な表現へ変換し、共有することを目的とした情報プラットフォームです。本サービスは特定の店舗・企業を批判・誹謗することを目的としたものではありません。
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="font-bold text-gray-800 flex items-center gap-2">
                        <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
                        第2条（投稿に関する禁止事項）
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-sm">
                        利用者は、投稿にあたり以下の行為を行ってはなりません。
                    </p>
                    <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 ml-2">
                        <li>個人名、従業員名、その他個人を特定できる情報の記載</li>
                        <li>事実に基づかない虚偽の内容の投稿</li>
                        <li>特定の店舗・個人への誹謗中傷、名誉毀損、信用毀損</li>
                        <li>差別的・暴力的・わいせつな表現</li>
                        <li>法令または公序良俗に反する行為</li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="font-bold text-gray-800 flex items-center gap-2">
                        <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
                        第3条（投稿内容の責任）
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-sm">
                        投稿された内容に関する一切の責任は、投稿した利用者本人が負うものとします。本サービスに投稿された情報はあくまで個人の主観的な感想であり、その正確性・真実性を運営者が保証するものではありません。
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="font-bold text-gray-800 flex items-center gap-2">
                        <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
                        第4条（免責事項）
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-sm">
                        運営者は、本サービスに掲載された情報の利用によって生じたいかなる損害についても、責任を負いません。本サービスの情報は参考情報であり、就労や契約に関する判断は利用者ご自身の責任で行ってください。
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="font-bold text-gray-800 flex items-center gap-2">
                        <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
                        第5条（投稿の削除）
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-sm">
                        運営者は、投稿が本規約に違反すると判断した場合、または関係者からの正当な削除依頼を受けた場合、事前の通知なく当該投稿を削除することができます。削除依頼は下記の連絡先までご連絡ください。
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="font-bold text-gray-800 flex items-center gap-2">
                        <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
                        第6条（お問い合わせ・削除依頼）
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-sm">
                        本サービスに関するお問い合わせ、および投稿の削除依頼は、運営者までメールにてご連絡ください。内容を確認のうえ、速やかに対応いたします。
                    </p>
                </section>
            </div>
        </div>
    );
}
