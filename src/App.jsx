import { useState, useEffect, useCallback, useMemo } from 'react';
import { AlertCircle } from 'lucide-react';
import { supabase } from './lib/supabaseClient';
import { nextSchedule, isDue } from './lib/srs';
import { buildQuestionPool, questionKeyOf, QUESTION_LOOKUP } from './data/grammarData';
import AuthScreen from './components/AuthScreen';
import Header from './components/Header';
import StudyScreen from './components/StudyScreen';
import SetupScreen from './components/SetupScreen';
import QuizScreen from './components/QuizScreen';
import StatsScreen from './components/StatsScreen';

const SETTINGS_STORAGE_KEY = 'iet_settings';

const DEFAULT_SETTINGS = {
  selectedScene: 'all', // 'all' | 'tech' | 'business' | 'daily'
  timeLimit: 10, // 秒。0は無制限
  questionCount: 5,
  speechRate: 0.85
};

// localStorageの破損データで画面が落ちないように安全に読み込む
function loadSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

// Fisher-Yatesシャッフル
function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// 未出題→最終回答が古い順に優先して選び、出題順はランダムにする
// （同じ問題ばかり出ないようにするための選定ロジック）
function selectQuestions(pool, count, progressMap) {
  const prioritized = shuffle(pool).sort((a, b) => {
    const lastA = progressMap.get(questionKeyOf(a))?.last_answered_at;
    const lastB = progressMap.get(questionKeyOf(b))?.last_answered_at;
    const timeA = lastA ? Date.parse(lastA) : 0;
    const timeB = lastB ? Date.parse(lastB) : 0;
    return timeA - timeB;
  });
  return shuffle(prioritized.slice(0, Math.min(count, prioritized.length)));
}

export default function App() {
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  // 画面: 'setup' | 'quiz' | 'stats' | 'study'
  const [screen, setScreen] = useState('setup');
  const [settings, setSettings] = useState(loadSettings);

  // 出題中の問題と今回セッションの評価結果
  const [questions, setQuestions] = useState([]);
  const [sessionEvals, setSessionEvals] = useState([]);

  // DB上の学習進捗 (question_key -> row)
  const [progressMap, setProgressMap] = useState(new Map());
  const [syncError, setSyncError] = useState('');

  // --- 認証 ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // --- 進捗ロード ---
  const loadProgress = useCallback(async userId => {
    const { data, error } = await supabase
      .from('iet_question_progress')
      .select('*')
      .eq('user_id', userId);
    if (error) {
      setSyncError('学習データの読み込みに失敗しました。ネットワークを確認してください。');
      return;
    }
    setSyncError('');
    setProgressMap(new Map(data.map(row => [row.question_key, row])));
  }, []);

  useEffect(() => {
    if (session?.user) {
      loadProgress(session.user.id);
    } else {
      setProgressMap(new Map());
    }
  }, [session, loadProgress]);

  // --- 設定の永続化 ---
  const updateSettings = useCallback(patch => {
    setSettings(prev => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // 保存失敗は無視（プライベートモード等）
      }
      return next;
    });
  }, []);

  // --- 音声読み上げ ---
  const speakSentence = useCallback(
    text => {
      if (!text || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = settings.speechRate;
      window.speechSynthesis.speak(utterance);
    },
    [settings.speechRate]
  );

  // --- セッション開始 ---
  const startSession = useCallback(
    ({ categoryKeys, scene, count }) => {
      const pool = buildQuestionPool(categoryKeys, scene);
      // シーン絞り込みで問題が空になった場合は全シーンにフォールバック
      const effectivePool = pool.length > 0 ? pool : buildQuestionPool(categoryKeys, 'all');
      if (effectivePool.length === 0) return;
      setQuestions(selectQuestions(effectivePool, count, progressMap));
      setSessionEvals([]);
      setScreen('quiz');
    },
    [progressMap]
  );

  // 進捗レコード(question_key)のリストから復習セッションを開始
  const startReviewSession = useCallback(keys => {
    const reviewQuestions = keys
      .map(key => QUESTION_LOOKUP.get(key))
      .filter(Boolean);
    if (reviewQuestions.length === 0) return;
    setQuestions(shuffle(reviewQuestions));
    setSessionEvals([]);
    setScreen('quiz');
  }, []);

  // --- 評価の記録 (ローカル即時反映 + Supabase upsert) ---
  const recordEvaluation = useCallback(
    async (question, rating) => {
      const key = questionKeyOf(question);
      const prev = progressMap.get(key);
      const { intervalDays, dueAt } = nextSchedule(prev?.interval_days ?? 0, rating);
      const now = new Date().toISOString();

      const row = {
        user_id: session.user.id,
        question_key: key,
        category_key: question.categoryKey,
        scene: question.scene,
        // 「言えなかった」「惜しい」は自動で復習ブックに入れる
        bookmarked: (prev?.bookmarked ?? false) || rating !== 'perfect',
        answer_count: (prev?.answer_count ?? 0) + 1,
        perfect_count: (prev?.perfect_count ?? 0) + (rating === 'perfect' ? 1 : 0),
        good_count: (prev?.good_count ?? 0) + (rating === 'good' ? 1 : 0),
        bad_count: (prev?.bad_count ?? 0) + (rating === 'bad' ? 1 : 0),
        interval_days: intervalDays,
        due_at: dueAt,
        last_rating: rating,
        last_answered_at: now,
        updated_at: now
      };

      setProgressMap(prevMap => {
        const next = new Map(prevMap);
        next.set(key, { ...prev, ...row });
        return next;
      });
      setSessionEvals(prevEvals => [...prevEvals, { question, rating }]);

      const { error } = await supabase
        .from('iet_question_progress')
        .upsert(row, { onConflict: 'user_id,question_key' });
      if (error) {
        setSyncError('学習データの保存に失敗しました。通信状態を確認してください。');
      } else {
        setSyncError('');
      }
    },
    [progressMap, session]
  );

  // --- ブックマーク切り替え ---
  const toggleBookmark = useCallback(
    async question => {
      const key = questionKeyOf(question);
      const prev = progressMap.get(key);
      const nextBookmarked = !(prev?.bookmarked ?? false);
      const now = new Date().toISOString();

      const row = {
        user_id: session.user.id,
        question_key: key,
        category_key: question.categoryKey,
        scene: question.scene,
        bookmarked: nextBookmarked,
        answer_count: prev?.answer_count ?? 0,
        perfect_count: prev?.perfect_count ?? 0,
        good_count: prev?.good_count ?? 0,
        bad_count: prev?.bad_count ?? 0,
        interval_days: prev?.interval_days ?? 0,
        due_at: prev?.due_at ?? null,
        last_rating: prev?.last_rating ?? null,
        last_answered_at: prev?.last_answered_at ?? null,
        updated_at: now
      };

      setProgressMap(prevMap => {
        const next = new Map(prevMap);
        next.set(key, { ...prev, ...row });
        return next;
      });

      const { error } = await supabase
        .from('iet_question_progress')
        .upsert(row, { onConflict: 'user_id,question_key' });
      if (error) {
        setSyncError('ブックマークの保存に失敗しました。');
      }
    },
    [progressMap, session]
  );

  // --- 派生データ ---
  const bookmarkedKeys = useMemo(
    () => [...progressMap.values()].filter(row => row.bookmarked).map(row => row.question_key),
    [progressMap]
  );
  const dueKeys = useMemo(
    () => [...progressMap.values()].filter(isDue).map(row => row.question_key),
    [progressMap]
  );
  const totalStats = useMemo(() => {
    let totalSolved = 0;
    let perfect = 0;
    let good = 0;
    let bad = 0;
    progressMap.forEach(row => {
      totalSolved += row.answer_count ?? 0;
      perfect += row.perfect_count ?? 0;
      good += row.good_count ?? 0;
      bad += row.bad_count ?? 0;
    });
    return { totalSolved, perfect, good, bad };
  }, [progressMap]);

  if (!authReady) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Header
        screen={screen}
        onNavigate={setScreen}
        userEmail={session.user.email}
        onSignOut={() => supabase.auth.signOut()}
      />

      <main className="flex-grow max-w-6xl w-full mx-auto p-4 flex flex-col justify-center">
        {syncError && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{syncError}</span>
          </div>
        )}

        {screen === 'study' && (
          <StudyScreen
            speakSentence={speakSentence}
            onStartTraining={categoryKey =>
              startSession({ categoryKeys: [categoryKey], scene: 'all', count: 3 })
            }
          />
        )}

        {screen === 'setup' && (
          <SetupScreen
            settings={settings}
            updateSettings={updateSettings}
            bookmarkedCount={bookmarkedKeys.length}
            dueCount={dueKeys.length}
            onStart={({ categoryKeys }) =>
              startSession({
                categoryKeys,
                scene: settings.selectedScene,
                count: settings.questionCount
              })
            }
            onStartBookmarkReview={() => startReviewSession(bookmarkedKeys)}
            onStartDueReview={() => startReviewSession(dueKeys)}
          />
        )}

        {screen === 'quiz' && questions.length > 0 && (
          <QuizScreen
            questions={questions}
            timeLimit={settings.timeLimit}
            speakSentence={speakSentence}
            progressMap={progressMap}
            onEvaluate={recordEvaluation}
            onToggleBookmark={toggleBookmark}
            onFinish={() => setScreen('stats')}
            onAbort={() => setScreen('setup')}
          />
        )}

        {screen === 'stats' && (
          <StatsScreen
            totalStats={totalStats}
            sessionEvals={sessionEvals}
            bookmarkedKeys={bookmarkedKeys}
            dueCount={dueKeys.length}
            onToggleBookmark={toggleBookmark}
            onRestart={() => setScreen('setup')}
            onStartBookmarkReview={() => startReviewSession(bookmarkedKeys)}
          />
        )}
      </main>

      <footer className="py-6 border-t border-slate-900 bg-slate-950/50 text-center text-[10px] text-slate-600 font-semibold space-y-2">
        <p>© 2026 AI瞬間英作文 - Instant English Trainer.</p>
        <p className="text-[9px] text-slate-700">
          学習データはSupabaseに保存され、どの端末からでも続きから学習できます。
        </p>
      </footer>
    </div>
  );
}
