import { useState } from 'react';
import { Sparkles, ArrowRight, ChevronRight, Sliders, Check, Bookmark, RotateCcw } from 'lucide-react';
import { GRAMMAR_CATEGORIES, GRAMMAR_GROUPS } from '../data/grammarData';

const TIME_LIMIT_OPTIONS = [5, 10, 20, 0]; // 0は無制限
const QUESTION_COUNT_OPTIONS = [5, 10, 15];

const SCENE_OPTIONS = [
  {
    id: 'all',
    icon: '🌟',
    title: '全シーン混合 (Random)',
    detail: 'すべてのシチュエーションからバランスよく出題します。'
  },
  {
    id: 'tech',
    icon: '💻',
    title: 'エンジニアリング・技術 (Tech & Semiconductor)',
    detail: '歩留まり(yield)やログ調査、開発現場など専門的な技術文脈。'
  },
  {
    id: 'business',
    icon: '💼',
    title: 'ビジネス・オフィス (Business, Meetings & PM)',
    detail: '会議、交渉、マイルストーン、メール調整等の実用的な企業ビジネス英語。'
  },
  {
    id: 'daily',
    icon: '💬',
    title: '日常会話・ネットワーキング (General Daily)',
    detail: 'カジュアルな交流、予定変更、趣味、日々のコミュニケーション。'
  }
];

export default function SetupScreen({
  settings,
  updateSettings,
  bookmarkedCount,
  dueCount,
  onStart,
  onStartBookmarkReview,
  onStartDueReview
}) {
  const [selectedCategories, setSelectedCategories] = useState(() => Object.keys(GRAMMAR_CATEGORIES));
  const [activeGroup, setActiveGroup] = useState('grammar');

  const toggleCategory = key => {
    if (selectedCategories.includes(key)) {
      // 最低1カテゴリは残す
      if (selectedCategories.length > 1) {
        setSelectedCategories(prev => prev.filter(item => item !== key));
      }
    } else {
      setSelectedCategories(prev => [...prev, key]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in py-4">
      {/* ヒーローヘッダー */}
      <div className="text-center max-w-2xl mx-auto space-y-3 py-4">
        <span className="px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/40 text-xs text-indigo-300 font-semibold inline-flex items-center gap-1.5">
          ⚡️ 反射神経を研ぎ澄ます瞬間英作文
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI瞬間英作文
          </span>
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          ビジネスやエンジニアリングなど、実践的なコンテクストの問題を出題。
          出題履歴に基づき毎回違う問題を優先して選び、脳の英語回路を活性化させます。
        </p>
      </div>

      {/* 自動復習の通知バナー */}
      {dueCount > 0 && (
        <div className="max-w-2xl mx-auto w-full p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <RotateCcw className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-amber-300">復習期限が来た問題が {dueCount} 問あります</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                忘却曲線に基づいて、今日復習すべき問題を自動でピックアップしました。
              </div>
            </div>
          </div>
          <button
            onClick={onStartDueReview}
            className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl px-4 py-2 text-xs font-bold transition shrink-0"
          >
            今すぐ復習する
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 左カラム: シーンと文法選択 */}
        <div className="lg:col-span-8 bg-slate-900/40 border border-slate-900 rounded-2xl p-5 sm:p-6 space-y-6">
          {/* STEP 1: シーン選択 */}
          <div>
            <label className="text-sm font-bold text-slate-300 flex items-center gap-2 mb-3">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-[10px] text-white flex items-center justify-center font-black">1</span>
              実践シーンを選択（状況に合う文脈の問題を出題）
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SCENE_OPTIONS.map(option => (
                <button
                  key={option.id}
                  onClick={() => updateSettings({ selectedScene: option.id })}
                  className={`p-3.5 rounded-xl border text-left transition flex items-start gap-3 ${settings.selectedScene === option.id ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-inner' : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:border-slate-800'}`}
                >
                  <div className="mt-0.5">{option.icon}</div>
                  <div>
                    <div className="font-bold text-xs">{option.title}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{option.detail}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 2: 文法カテゴリ選択 */}
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
              <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-[10px] text-white flex items-center justify-center font-black">2</span>
                強化したい英文法・構文を選択（複数選択可）
              </label>
              <div className="flex gap-2 text-[10px] font-bold text-slate-400 self-end sm:self-auto">
                <button
                  onClick={() => setSelectedCategories(Object.keys(GRAMMAR_CATEGORIES))}
                  className="hover:text-indigo-400"
                >
                  すべて選択
                </button>
                <span>|</span>
                <button
                  onClick={() => setSelectedCategories([Object.keys(GRAMMAR_CATEGORIES)[0]])}
                  className="hover:text-indigo-400"
                >
                  クリア
                </button>
              </div>
            </div>

            {/* 文法グループタブ */}
            <div className="flex gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-900 mb-4">
              {Object.entries(GRAMMAR_GROUPS).map(([groupKey, group]) => (
                <button
                  key={groupKey}
                  onClick={() => setActiveGroup(groupKey)}
                  className={`flex-1 py-2 text-center rounded-lg font-bold text-xs transition ${activeGroup === groupKey ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  {group.title} ({group.keys.length})
                </button>
              ))}
            </div>

            {/* カテゴリチェックボックス */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1 bg-slate-950/20 p-3 rounded-xl border border-slate-900/50">
              {GRAMMAR_GROUPS[activeGroup].keys.map(key => {
                const isSelected = selectedCategories.includes(key);
                const cat = GRAMMAR_CATEGORIES[key];
                return (
                  <button
                    key={key}
                    onClick={() => toggleCategory(key)}
                    className={`p-2.5 rounded-lg border text-left transition flex items-start gap-2.5 ${isSelected ? 'bg-indigo-600/5 border-indigo-500/40 text-slate-200' : 'bg-slate-950/20 border-slate-900 text-slate-500 hover:border-slate-800'}`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition-all ${isSelected ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-800 bg-slate-950'}`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                    <div>
                      <div className="font-bold text-[11px] leading-tight text-slate-200">{cat.name}</div>
                      <div className="text-[9px] text-slate-400 mt-0.5 leading-snug">{cat.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 右カラム: トレーニング設定 */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-5 space-y-5">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              トレーニング設定
            </h3>

            {/* 制限時間 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 flex justify-between items-center">
                <span>⏱ 反射スピード（思考制限）</span>
                <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                  {settings.timeLimit > 0 ? `${settings.timeLimit}秒` : '無制限'}
                </span>
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {TIME_LIMIT_OPTIONS.map(sec => (
                  <button
                    key={sec}
                    onClick={() => updateSettings({ timeLimit: sec })}
                    className={`py-2 rounded-lg font-mono text-xs font-bold transition border ${settings.timeLimit === sec ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-950/50 border-slate-900 text-slate-400 hover:border-slate-800'}`}
                  >
                    {sec === 0 ? '無制限' : `${sec}s`}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 italic mt-1 leading-snug">
                ※ 制限時間内に発話。タイムアウトすると自動で回答例と解説が表示されます。
              </p>
            </div>

            {/* 問題数 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 flex justify-between items-center">
                <span>📚 問題数</span>
                <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                  {settings.questionCount} 問
                </span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {QUESTION_COUNT_OPTIONS.map(cnt => (
                  <button
                    key={cnt}
                    onClick={() => updateSettings({ questionCount: cnt })}
                    className={`py-2 rounded-lg font-bold text-xs transition border ${settings.questionCount === cnt ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-950/50 border-slate-900 text-slate-400 hover:border-slate-800'}`}
                  >
                    {cnt}問
                  </button>
                ))}
              </div>
            </div>

            {/* 発音スピード */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 flex justify-between items-center">
                <span>🗣 発音スピード (TTS)</span>
                <span className="text-[10px] text-indigo-400 font-mono">x{settings.speechRate.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min="0.6"
                max="1.2"
                step="0.05"
                value={settings.speechRate}
                onChange={e => updateSettings({ speechRate: parseFloat(e.target.value) })}
                className="w-full accent-indigo-500 h-1 bg-slate-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[8px] text-slate-600 font-bold">
                <span>ゆっくり</span>
                <span>標準</span>
                <span>ネイティブ速め</span>
              </div>
            </div>
          </div>

          {/* 復習ブックマーク */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-5 flex flex-col justify-between gap-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-slate-200 text-xs flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-amber-500 fill-amber-500" />
                  復習ブックマーク ({bookmarkedCount})
                </h4>
                <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                  「言えなかった」「惜しい」と評価した問題は自動的にストックされます。
                </p>
              </div>
            </div>

            {bookmarkedCount > 0 ? (
              <button
                onClick={onStartBookmarkReview}
                className="w-full bg-slate-950 hover:bg-indigo-900/20 text-indigo-400 border border-indigo-500/20 rounded-xl py-2 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                復習ブックから出題する
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="text-[10px] text-center py-2 text-slate-600 font-semibold border border-dashed border-slate-900 rounded-lg">
                ブックマークは現在空です
              </div>
            )}
          </div>

          {/* トレーニング開始 */}
          <button
            onClick={() => onStart({ categoryKeys: selectedCategories })}
            disabled={selectedCategories.length === 0}
            className="w-full relative group overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white rounded-2xl p-4 font-extrabold text-base transition-all duration-300 shadow-xl shadow-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 w-full h-full bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span>トレーニング開始</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
