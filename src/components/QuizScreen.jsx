import { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, Smile, Meh, Frown, HelpCircle, Bookmark, Info } from 'lucide-react';
import { questionKeyOf } from '../data/grammarData';

const MS_PER_SECOND = 1000;
const WARNING_SECONDS = 3; // 残り時間がこの秒数以下で警告色にする

export default function QuizScreen({
  questions,
  timeLimit,
  speakSentence,
  progressMap,
  onEvaluate,
  onToggleBookmark,
  onFinish,
  onAbort
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [timeLeftMs, setTimeLeftMs] = useState(timeLimit * MS_PER_SECOND);

  const currentQuestion = questions[currentIndex];
  const isStarred = progressMap.get(questionKeyOf(currentQuestion))?.bookmarked ?? false;

  // speakSentenceの最新参照を保持（タイマーeffectの再起動を防ぐ）
  const speakRef = useRef(speakSentence);
  useEffect(() => {
    speakRef.current = speakSentence;
  }, [speakSentence]);

  const revealAnswer = useCallback(() => {
    setIsAnswerRevealed(true);
    speakRef.current(questions[currentIndex]?.english);
  }, [questions, currentIndex]);

  // 問題ごとにカウントダウンを開始する（requestAnimationFrameでなめらかに描画）
  useEffect(() => {
    if (timeLimit <= 0 || isAnswerRevealed) return;

    const totalMs = timeLimit * MS_PER_SECOND;
    const startTime = Date.now();
    setTimeLeftMs(totalMs);
    let animationFrameId;

    const tick = () => {
      const remaining = totalMs - (Date.now() - startTime);
      if (remaining <= 0) {
        setTimeLeftMs(0);
        setIsAnswerRevealed(true);
        speakRef.current(questions[currentIndex]?.english);
      } else {
        setTimeLeftMs(remaining);
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [currentIndex, timeLimit, isAnswerRevealed, questions]);

  const handleEvaluation = rating => {
    onEvaluate(currentQuestion, rating);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsAnswerRevealed(false);
      setTimeLeftMs(timeLimit * MS_PER_SECOND);
    } else {
      onFinish();
    }
  };

  const timeLeftSec = Math.ceil(timeLeftMs / MS_PER_SECOND);
  const timeFraction = timeLimit > 0 ? (timeLeftMs / (timeLimit * MS_PER_SECOND)) * 100 : 0;
  const isWarning = timeLeftSec <= WARNING_SECONDS;

  return (
    <div className="max-w-3xl w-full mx-auto py-6 animate-fade-in space-y-6">
      {/* 進捗・タイマーバー */}
      <div className="flex flex-col bg-slate-900/80 rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl relative">
        <div className="flex justify-between items-center p-4 z-10">
          <div className="text-xs font-extrabold text-slate-400">
            PROGRESS: <span className="text-indigo-400 text-sm font-black">{currentIndex + 1}</span> / {questions.length} 問
          </div>

          {timeLimit > 0 ? (
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">反射時間</span>
              <div className={`px-3 py-1 rounded-lg text-sm font-mono font-black flex items-center gap-1.5 transition-all duration-200 ${isWarning ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse' : 'bg-slate-950 text-indigo-400 border border-slate-800'}`}>
                <span className={`w-2 h-2 rounded-full ${isWarning ? 'bg-rose-500 animate-ping' : 'bg-indigo-500'}`}></span>
                {(timeLeftMs / MS_PER_SECOND).toFixed(1)}秒
              </div>
            </div>
          ) : (
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">⏱ 思考制限なし</span>
          )}
        </div>

        {timeLimit > 0 && (
          <div className="w-full bg-slate-950 h-3.5 relative overflow-hidden border-t border-slate-900">
            <div
              className={`h-full transition-all duration-75 ease-linear bg-gradient-to-r relative ${
                isWarning
                  ? 'from-rose-600 via-orange-500 to-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]'
                  : 'from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_12px_rgba(99,102,241,0.6)]'
              }`}
              style={{ width: `${timeFraction}%` }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white shadow-[0_0_10px_#fff]"></div>
            </div>
          </div>
        )}
      </div>

      {/* 出題ボックス */}
      <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full filter blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/5 rounded-full filter blur-xl"></div>

        <div className="flex justify-between items-center">
          <span className="bg-indigo-950/80 text-indigo-300 text-[10px] font-bold px-3 py-1.5 rounded-full border border-indigo-800/30 uppercase tracking-wider">
            {currentQuestion?.categoryName}
          </span>

          <button
            onClick={() => onToggleBookmark(currentQuestion)}
            className={`p-2 rounded-lg transition-all ${isStarred ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'text-slate-600 hover:text-slate-400 hover:bg-slate-950/50'}`}
          >
            <Bookmark className={`w-5 h-5 ${isStarred ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* 和文 */}
        <div className="space-y-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            和文を見て声に出して英訳してください:
          </span>
          <p className="text-xl sm:text-2xl font-black text-white leading-relaxed tracking-tight">
            {currentQuestion?.japanese}
          </p>
        </div>

        <div className="pt-2">
          {!isAnswerRevealed ? (
            <div className="bg-slate-950/50 border border-slate-900 p-4 rounded-2xl flex items-start gap-3">
              <HelpCircle className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  構文ヒント・キーワード:
                </div>
                <p className="text-xs text-slate-300 mt-1 font-mono">
                  {currentQuestion?.hints || '和文をよく読み、瞬時に適した時制や構文を適用しましょう。'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-2xl p-5 space-y-4 shadow-lg">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest">
                    回答例 (English Model):
                  </span>

                  <button
                    onClick={() => speakSentence(currentQuestion?.english)}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-300 bg-indigo-500/20 hover:bg-indigo-500/30 px-2.5 py-1.5 rounded-lg transition"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    ネイティブ発音
                  </button>
                </div>

                <p className="text-lg sm:text-xl font-mono font-bold text-indigo-200 leading-relaxed">
                  {currentQuestion?.english}
                </p>
              </div>

              {/* 解説 */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-2.5 shadow-md">
                <div className="flex items-center gap-2 text-xs font-black text-indigo-400 border-b border-slate-900 pb-2">
                  <Info className="w-4 h-4 text-indigo-400" />
                  <span>💡 英文法・用法のワンポイント解説</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-1">
                  {currentQuestion?.explanation || 'この文法カテゴリの基本構造に基づいた例文です。キーワードの配置と時制の一致に注意して学習しましょう。'}
                </p>
              </div>

              {/* 自己評価 */}
              <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4 text-center space-y-3">
                <p className="text-xs font-semibold text-slate-400">
                  発話した自分の英語の出来はどうでしたか？
                </p>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleEvaluation('perfect')}
                    className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 py-3 rounded-xl flex flex-col items-center justify-center gap-1 transition"
                  >
                    <Smile className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-xs">完璧！</span>
                    <span className="text-[9px] text-emerald-500/80">すぐに口から出た</span>
                  </button>

                  <button
                    onClick={() => handleEvaluation('good')}
                    className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 py-3 rounded-xl flex flex-col items-center justify-center gap-1 transition"
                  >
                    <Meh className="w-5 h-5 text-amber-400" />
                    <span className="font-bold text-xs">惜しい</span>
                    <span className="text-[9px] text-amber-500/80">少し遅れた・小ミス</span>
                  </button>

                  <button
                    onClick={() => handleEvaluation('bad')}
                    className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 py-3 rounded-xl flex flex-col items-center justify-center gap-1 transition"
                  >
                    <Frown className="w-5 h-5 text-rose-400" />
                    <span className="font-bold text-xs">言えなかった</span>
                    <span className="text-[9px] text-rose-500/80">詰まった・分からず</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {!isAnswerRevealed && (
          <button
            onClick={revealAnswer}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold py-4 rounded-2xl text-sm transition shadow-lg shadow-indigo-600/25"
          >
            答えを見る (または時間切れ)
          </button>
        )}
      </div>

      <div className="text-center">
        <button
          onClick={onAbort}
          className="text-xs font-bold text-slate-500 hover:text-slate-300 transition"
        >
          セッションを終了して設定に戻る
        </button>
      </div>
    </div>
  );
}
