import React, { useState } from 'react';
import { Calendar, Clock, Send, Bell } from 'lucide-react';

export default function App() {
  const [content, setContent] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [posts, setPosts] = useState<any[]>([]);

  const handleSubscribe = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          alert('通知設定が完了しました！');
        }
      } catch (err) {
        console.error('Service Worker Registration Failed', err);
      }
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content || !scheduledTime) return;
    
    const newPost = {
      id: Date.now().toString(),
      content,
      scheduledTime,
      status: 'pending'
    };
    
    setPosts([...posts, newPost]);
    setContent('');
    setScheduledTime('');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 max-w-2xl mx-auto">
      <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Calendar className="text-indigo-400" />
          Discord 予約投稿ポータル
        </h1>
        <button
          onClick={handleSubscribe}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1 text-sm transition"
        >
          <Bell size={16} />
          通知設定
        </button>
      </header>

      <main className="space-y-6">
        <form onSubmit={handleCreatePost} className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Send size={18} className="text-indigo-400" />
            新しい予約を作成
          </h2>
          <div>
            <label className="block text-sm text-slate-400 mb-1">投稿内容</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
              rows={3}
              placeholder="送信したいメッセージを入力..."
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">送信予定日時</label>
            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-lg transition"
          >
            予約を追加する
          </button>
        </form>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Clock size={18} className="text-indigo-400" />
            予約一覧
          </h2>
          {posts.length === 0 ? (
            <p className="text-center py-8 text-slate-500">まだ予約された投稿はありません。</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50 flex justify-between items-center">
                <div>
                  <p className="font-medium text-slate-200">{post.content}</p>
                  <p className="text-xs text-slate-400 mt-1">{new Date(post.scheduledTime).toLocaleString('ja-JP')}</p>
                </div>
                <span className="text-xs px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
                  {post.status}
                </span>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
