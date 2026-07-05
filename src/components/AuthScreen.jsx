import { useState } from 'react';
import { Sparkles, Mail, Lock, LogIn, UserPlus, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const MIN_PASSWORD_LENGTH = 6;

// Supabaseの英語エラーメッセージを日本語に変換する
function translateAuthError(message) {
  if (!message) return 'エラーが発生しました。時間をおいて再度お試しください。';
  if (message.includes('Invalid login credentials')) {
    return 'メールアドレスまたはパスワードが正しくありません。';
  }
  if (message.includes('Email not confirmed')) {
    return 'メールアドレスが未確認です。受信した確認メールのリンクをクリックしてください。';
  }
  if (message.includes('User already registered')) {
    return 'このメールアドレスは既に登録されています。ログインしてください。';
  }
  if (message.includes('Password should be at least')) {
    return `パスワードは${MIN_PASSWORD_LENGTH}文字以上で設定してください。`;
  }
  if (message.includes('rate limit') || message.includes('Too many requests')) {
    return 'リクエストが多すぎます。しばらく待ってから再度お試しください。';
  }
  return `エラー: ${message}`;
}

export default function AuthScreen() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const switchMode = nextMode => {
    setMode(nextMode);
    setErrorMessage('');
    setInfoMessage('');
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setErrorMessage('');
    setInfoMessage('');

    if (mode !== 'reset' && password.length < MIN_PASSWORD_LENGTH) {
      setErrorMessage(`パスワードは${MIN_PASSWORD_LENGTH}文字以上で入力してください。`);
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin
        });
        if (error) {
          setErrorMessage(translateAuthError(error.message));
        } else {
          setInfoMessage(
            'このメールアドレス宛にパスワード再設定リンクを送信しました（該当アカウントが存在する場合）。メール内のリンクを開いて新しいパスワードを設定してください。'
          );
        }
      } else if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          // 確認メールのリンクを登録操作を行ったサイト（本番/ローカル）に戻す
          options: { emailRedirectTo: window.location.origin }
        });
        if (error) {
          setErrorMessage(translateAuthError(error.message));
        } else if (data.session) {
          // メール確認が無効な場合はそのままログイン状態になる
        } else if (data.user && data.user.identities?.length === 0) {
          // Supabaseは列挙攻撃対策のため、登録済みメールでも200を返しつつ
          // identitiesを空配列にする（実際には何も起きていない）
          setErrorMessage(
            'このメールアドレスは既に登録されています。ログインするか、パスワードをお忘れの場合は再設定してください。'
          );
        } else {
          setInfoMessage(
            '確認メールを送信しました。メール内のリンクをクリックして登録を完了してください（届かない場合は迷惑メールフォルダもご確認ください）。'
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setErrorMessage(translateAuthError(error.message));
        }
      }
    } catch {
      setErrorMessage('通信エラーが発生しました。ネットワークを確認してください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* ロゴヘッダー */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 mx-auto">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent tracking-tight">
              AI瞬間英作文
            </h1>
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider mt-1">
              Instant English Trainer
            </p>
          </div>
          <p className="text-xs text-slate-400">
            {mode === 'reset'
              ? 'パスワードを再設定するメールアドレスを入力してください。'
              : '学習データを保存するため、ログインまたは新規登録してください。'}
          </p>
        </div>

        {/* ログイン / 新規登録 タブ（パスワード再設定時は非表示） */}
        {mode !== 'reset' && (
          <div className="flex gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => switchMode('login')}
              className={`flex-1 py-2.5 text-center rounded-lg font-bold text-xs transition ${mode === 'login' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              ログイン
            </button>
            <button
              onClick={() => switchMode('signup')}
              className={`flex-1 py-2.5 text-center rounded-lg font-bold text-xs transition ${mode === 'signup' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              新規登録
            </button>
          </div>
        )}

        {/* 入力フォーム */}
        <form onSubmit={handleSubmit} className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
          {infoMessage && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{infoMessage}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-bold text-slate-400">メールアドレス</label>
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 focus-within:border-indigo-500 rounded-xl px-3 py-2.5 transition">
              <Mail className="w-4 h-4 text-slate-500" />
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full text-slate-200 placeholder-slate-600"
              />
            </div>
          </div>

          {mode !== 'reset' && (
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-bold text-slate-400">パスワード（{MIN_PASSWORD_LENGTH}文字以上）</label>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 focus-within:border-indigo-500 rounded-xl px-3 py-2.5 transition">
                <Lock className="w-4 h-4 text-slate-500" />
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm w-full text-slate-200 placeholder-slate-600"
                />
              </div>
            </div>
          )}

          {mode === 'login' && (
            <button
              type="button"
              onClick={() => switchMode('reset')}
              className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition"
            >
              パスワードをお忘れですか？
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white rounded-xl py-3 font-extrabold text-sm transition-all duration-300 shadow-lg shadow-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                ログイン
              </>
            ) : mode === 'reset' ? (
              <>
                <KeyRound className="w-4 h-4" />
                再設定メールを送信
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                アカウント作成
              </>
            )}
          </button>

          {mode === 'reset' && (
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="w-full text-center text-[11px] font-bold text-slate-400 hover:text-slate-200 transition"
            >
              ログイン画面に戻る
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
