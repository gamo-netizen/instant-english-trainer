import { Sparkles, BookOpen, Sliders, Award, LogOut } from 'lucide-react';

export default function Header({ screen, onNavigate, userEmail, onSignOut }) {
  const navButtonClass = target =>
    `px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
      screen === target
        ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
        : 'text-slate-400 hover:text-slate-200'
    }`;

  return (
    <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-4 py-3">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('setup')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent tracking-tight">
              AI瞬間英作文
            </h1>
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
              Instant English Trainer
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end text-xs">
          <button onClick={() => onNavigate('study')} className={navButtonClass('study')}>
            <BookOpen className="w-3.5 h-3.5" />
            文法学習パート
          </button>

          <button onClick={() => onNavigate('setup')} className={navButtonClass('setup')}>
            <Sliders className="w-3.5 h-3.5" />
            トレーニング設定
          </button>

          <button onClick={() => onNavigate('stats')} className={navButtonClass('stats')}>
            <Award className="w-3.5 h-3.5" />
            学習データ
          </button>

          {/* ログイン中ユーザーとログアウト */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800/80 rounded-lg py-1.5 px-2.5">
            <span className="text-[10px] text-slate-500 max-w-[140px] truncate" title={userEmail}>
              {userEmail}
            </span>
            <button
              onClick={onSignOut}
              className="text-slate-500 hover:text-rose-400 transition"
              title="ログアウト"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
