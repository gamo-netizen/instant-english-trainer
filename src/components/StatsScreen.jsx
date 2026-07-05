import { Award, Bookmark, RotateCcw } from 'lucide-react';

const RATING_LABELS = {
  perfect: { label: '完璧！', className: 'text-emerald-400' },
  good: { label: '惜しい', className: 'text-amber-400' },
  bad: { label: '言えなかった', className: 'text-rose-400' }
};

export default function StatsScreen({
  totalStats,
  sessionEvals,
  bookmarkedRows,
  questionFromRow,
  dueCount,
  onToggleBookmark,
  onRestart,
  onStartBookmarkReview
}) {
  return (
    <div className="max-w-3xl w-full mx-auto py-6 animate-fade-in space-y-6">
      {/* 完了ヘッダー */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
          <Award className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-black text-white">トレーニング完了！</h2>
        <p className="text-xs text-slate-400">
          お疲れ様でした。反射英語回路の結合がより強化されました。
        </p>
      </div>

      <div className="bg-slate-900/40 border border-slate-900/80 rounded-3xl p-6 sm:p-8 space-y-6">
        {/* 今回のセッション結果 */}
        {sessionEvals.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest">
              📝 今回のセッション ({sessionEvals.length}問)
            </h3>
            <div className="max-h-[200px] overflow-y-auto space-y-2 bg-slate-950/40 p-3 rounded-xl border border-slate-900">
              {sessionEvals.map((entry, index) => {
                const rating = RATING_LABELS[entry.rating];
                return (
                  <div key={index} className="flex justify-between items-center text-[10px] border-b border-slate-900 pb-2 last:border-b-0 last:pb-0 gap-4">
                    <div className="text-slate-300">
                      <span className="text-slate-500 font-bold">{index + 1}.</span> {entry.question.japanese}
                    </div>
                    <span className={`font-bold shrink-0 ${rating.className}`}>{rating.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 累計統計 */}
        <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest">
          📊 累計の習得成果
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 text-center">
            <div className="text-[10px] text-slate-500 font-bold uppercase">総回答数</div>
            <div className="text-2xl font-black text-white mt-1">{totalStats.totalSolved}</div>
          </div>

          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 text-center">
            <div className="text-[10px] font-bold uppercase text-emerald-400">完璧！</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{totalStats.perfect}</div>
          </div>

          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 text-center">
            <div className="text-[10px] font-bold uppercase text-amber-400">惜しい</div>
            <div className="text-2xl font-black text-amber-400 mt-1">{totalStats.good}</div>
          </div>

          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 text-center">
            <div className="text-[10px] font-bold uppercase text-rose-400">要復習</div>
            <div className="text-2xl font-black text-rose-400 mt-1">{totalStats.bad}</div>
          </div>
        </div>

        {/* 自動復習の案内 */}
        {dueCount > 0 && (
          <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl flex items-start gap-3">
            <RotateCcw className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-indigo-300">
                復習期限が来ている問題が {dueCount} 問あります
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">
                評価に応じて次回の復習タイミングを自動計算しています。設定画面の「今すぐ復習する」から挑戦できます。
              </p>
            </div>
          </div>
        )}

        {/* 復習ブックマーク一覧 */}
        {bookmarkedRows.length > 0 && (
          <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl space-y-3">
            <div className="flex items-start gap-3">
              <Bookmark className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 fill-current" />
              <div>
                <h4 className="text-xs font-bold text-amber-400">
                  現在 {bookmarkedRows.length} 問が「復習ブック」に登録されています
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  「言えなかった」問題や「惜しい」評価の問題は、次回以降ピンポイントに反復練習が可能です。
                </p>
              </div>
            </div>

            <div className="max-h-[160px] overflow-y-auto space-y-2 bg-slate-950/40 p-3 rounded-xl border border-slate-900">
              {bookmarkedRows.map((row, index) => {
                const question = questionFromRow(row);
                if (!question) return null;
                return (
                  <div key={row.question_key} className="flex justify-between items-center text-[10px] border-b border-slate-900 pb-2 last:border-b-0 last:pb-0 gap-4">
                    <div className="text-slate-300">
                      <span className="text-slate-500 font-bold">{index + 1}.</span> {question.japanese}
                    </div>
                    <button
                      onClick={() => onToggleBookmark(question)}
                      className="text-rose-500 hover:text-rose-400 shrink-0 font-bold"
                    >
                      削除
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* アクション */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={onRestart}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold py-3.5 rounded-2xl text-xs transition"
          >
            新しいトレーニングを始める
          </button>

          {bookmarkedRows.length > 0 && (
            <button
              onClick={onStartBookmarkReview}
              className="flex-1 bg-slate-950 hover:bg-indigo-950/20 text-indigo-400 border border-indigo-500/20 font-extrabold py-3.5 rounded-2xl text-xs transition"
            >
              復習ブックから再出題
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
