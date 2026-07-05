import { useState } from 'react';
import {
  BookOpen,
  Volume2,
  ChevronRight,
  Play,
  Search,
  Flame,
  Lightbulb,
  ShieldAlert,
  Briefcase
} from 'lucide-react';
import { GRAMMAR_CATEGORIES } from '../data/grammarData';

// シーンごとのタグ表示スタイル
function sceneTag(scene) {
  if (scene === 'tech') {
    return { label: 'エンジニアリング・技術', className: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' };
  }
  if (scene === 'business') {
    return { label: 'ビジネス一般', className: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' };
  }
  return { label: '日常会話・交流', className: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' };
}

export default function StudyScreen({ speakSentence, onStartTraining }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(Object.keys(GRAMMAR_CATEGORIES)[0]);

  const filteredKeys = Object.keys(GRAMMAR_CATEGORIES).filter(key => {
    const cat = GRAMMAR_CATEGORIES[key];
    const query = searchQuery.toLowerCase();
    return (
      cat.name.toLowerCase().includes(query) ||
      cat.description.toLowerCase().includes(query) ||
      (cat.nuance && cat.nuance.toLowerCase().includes(query)) ||
      (cat.techTip && cat.techTip.toLowerCase().includes(query))
    );
  });

  const activeCat = GRAMMAR_CATEGORIES[selectedCategory];

  return (
    <div className="space-y-6 animate-fade-in py-4">
      {/* 学習センターヘッダー */}
      <div className="bg-slate-900/40 border border-slate-900/60 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 text-[10px] font-bold uppercase tracking-widest border border-indigo-900/50">
            📖 Grammar Study Center
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">英文法・構文リファレンス</h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            トレーニングする前に、それぞれの用法を体系的に学習できます。ルール、語順、ニュアンス、そして実践向けの文脈・用語サンプルを熟読しましょう。
          </p>
        </div>

        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="文法名や解説を検索..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-xl py-2 px-10 text-xs text-slate-200 placeholder-slate-600 outline-none transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 左カラム: カテゴリ一覧 */}
        <div className="lg:col-span-4 bg-slate-900/30 border border-slate-900 rounded-2xl p-4 space-y-4 max-h-[750px] overflow-y-auto">
          <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase px-1">
            文法一覧 ({filteredKeys.length})
          </span>

          <div className="space-y-1">
            {filteredKeys.map(key => {
              const cat = GRAMMAR_CATEGORIES[key];
              const isActive = selectedCategory === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between gap-3 ${isActive ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-md' : 'bg-slate-950/20 border-transparent text-slate-400 hover:bg-slate-950/60'}`}
                >
                  <div className="space-y-1">
                    <div className={`font-bold text-xs ${isActive ? 'text-indigo-400' : 'text-slate-200'}`}>
                      {cat.name}
                    </div>
                    <div className="text-[10px] text-slate-500 line-clamp-1">{cat.description}</div>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'translate-x-1 text-indigo-400' : 'text-slate-600'}`} />
                </button>
              );
            })}

            {filteredKeys.length === 0 && (
              <div className="text-center py-8 text-slate-600 text-xs font-semibold">
                該当する文法項目が見つかりません。
              </div>
            )}
          </div>
        </div>

        {/* 右カラム: 詳細カード */}
        <div className="lg:col-span-8 space-y-6">
          {activeCat ? (
            <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 sm:p-8 space-y-6 animate-fade-in relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full filter blur-xl"></div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-900 pb-5">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    Target Grammar Concept
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">{activeCat.name}</h3>
                  <p className="text-xs text-slate-400 italic">{activeCat.description}</p>
                </div>

                <button
                  onClick={() => onStartTraining(selectedCategory)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/10 flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  この文法で瞬間英作文！
                </button>
              </div>

              {/* 公式・ニュアンス・落とし穴・実務Tips */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-indigo-950/20 border border-indigo-900/40 p-4 rounded-xl space-y-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 opacity-10">
                    <Flame className="w-16 h-16 text-indigo-400" />
                  </div>
                  <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" />
                    基本公式 (Formula)
                  </div>
                  <div className="font-mono text-xs font-semibold bg-slate-950/60 p-2.5 rounded border border-slate-900 text-indigo-300 select-all">
                    {activeCat.formula}
                  </div>
                </div>

                <div className="bg-slate-950/60 border border-slate-900 p-4 rounded-xl space-y-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 opacity-10">
                    <Lightbulb className="w-16 h-16 text-amber-400" />
                  </div>
                  <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5" />
                    核心のニュアンス (Core Nuance)
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-normal">{activeCat.nuance}</p>
                </div>

                <div className="bg-rose-500/5 border border-rose-500/20 p-4 rounded-xl space-y-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 opacity-10">
                    <ShieldAlert className="w-16 h-16 text-rose-400" />
                  </div>
                  <div className="text-[10px] font-black text-rose-400 uppercase tracking-widest flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    注意すべき落とし穴 (Common Pitfalls)
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-normal">{activeCat.pitfall}</p>
                </div>

                <div className="bg-cyan-500/5 border border-cyan-500/20 p-4 rounded-xl space-y-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 opacity-10">
                    <Briefcase className="w-16 h-16 text-cyan-400" />
                  </div>
                  <div className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    実務・現場での活用法 (Practical Tip)
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-normal">{activeCat.techTip}</p>
                </div>
              </div>

              {/* 用例リスト */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  📚 実践シチュエーション用例
                </span>

                <div className="space-y-3">
                  {activeCat.examples.map((ex, idx) => {
                    const tag = sceneTag(ex.scene);
                    return (
                      <div key={idx} className="bg-slate-950/40 border border-slate-900 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md ${tag.className}`}>
                            {tag.label}
                          </span>

                          <button
                            onClick={() => speakSentence(ex.english)}
                            className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[10px] font-bold"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            発音を聞く
                          </button>
                        </div>

                        <div className="space-y-1">
                          <div className="text-xs text-slate-400">和文 (Japanese Statement)</div>
                          <div className="text-xs text-slate-100 font-bold">{ex.japanese}</div>
                        </div>

                        <div className="space-y-1 pt-1 border-t border-slate-900">
                          <div className="text-xs text-indigo-400">解答例 (Model Composition)</div>
                          <div className="text-xs font-mono font-bold text-indigo-200">{ex.english}</div>
                        </div>

                        {ex.explanation && (
                          <div className="bg-slate-950 p-2.5 rounded-lg text-[10px] text-slate-400 leading-relaxed border-l-2 border-indigo-500">
                            {ex.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/10 border border-slate-900 border-dashed rounded-2xl p-12 text-center text-slate-500">
              左側のリストから勉強したい文法を選択してください。
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
