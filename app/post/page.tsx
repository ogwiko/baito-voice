import PostForm from '@/components/features/PostForm';

export default function PostPage() {
    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-gray-900">投稿する</h1>
                <p className="text-gray-500 mt-2">
                    あなたの体験を、AIが社会的に適切な言葉に変換します。
                </p>
            </header>

            <PostForm />
        </div>
    );
}
