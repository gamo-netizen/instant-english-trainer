import { useState } from 'react';
import { Sparkles, Lock, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const MIN_PASSWORD_LENGTH = 6;

export default function UpdatePasswordScreen({ onComplete }) {
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();
    setErrorMessage('');

    if (password.length < MIN_PASSWORD_LENGTH) {
      setErrorMessage(`パスワードは${MIN_PASSWORD_LENGTH}文字以上で入力してください。`);
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(`エラー: ${error.message}`);
    } else {
      setIsDone(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 mx-auto">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent tracking-tight">
            新しいパスワードを設定
          </h1>
          <p className="text-xs text-slate-400">
            アカウントの新しいパスワードを入力してください。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isDone ? (
            <>
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>パスワードを更新しました。</span>
              </div>
              <button
                type="button"
                onClick={onComplete}
                className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white rounded-xl py-3 font-extrabold text-sm transition-all duration-300 shadow-lg shadow-indigo-500/20"
              >
                トレーニングを始める
              </button>
            </>
          ) : (
            <>
              <div className="space-y-1.5">
                <label htmlFor="new-password" className="text-xs font-bold text-slate-400">
                  新しいパスワード（{MIN_PASSWORD_LENGTH}文字以上）
                </label>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 focus-within:border-indigo-500 rounded-xl px-3 py-2.5 transition">
                  <Lock className="w-4 h-4 text-slate-500" />
                  <input
                    id="new-password"
                    type="password"
                    required
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm w-full text-slate-200 placeholder-slate-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white rounded-xl py-3 font-extrabold text-sm transition-all duration-300 shadow-lg shadow-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    パスワードを更新
                  </>
                )}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
