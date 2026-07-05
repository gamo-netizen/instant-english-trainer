import { useState, useEffect, useCallback, useMemo } from 'react';
import { AlertCircle } from 'lucide-react';
import { supabase } from './lib/supabaseClient';
import { nextSchedule, isDue } from './lib/srs';
import { speak, getEnglishVoices, onVoicesChanged } from './lib/speech';
import {
  GRAMMAR_CATEGORIES,
  buildQuestionPool,
  questionKeyOf,
  QUESTION_LOOKUP
} from './data/grammarData';
import AuthScreen from './components/AuthScreen';
import UpdatePasswordScreen from './components/UpdatePasswordScreen';
import Header from './components/Header';
import StudyScreen from './components/StudyScreen';
import SetupScreen from './components/SetupScreen';
import QuizScreen from './components/QuizScreen';
import StatsScreen from './components/StatsScreen';

const SETTINGS_STORAGE_KEY = 'iet_settings';
const AI_EXCLUDE_LIMIT = 40; // AIに「除外リスト」として渡す直近の出題数

const DEFAULT_SETTINGS = {
  selectedScene: 'all', // 'all' | 'tech' | 'business' | 'daily'
  timeLimit: 10, // 秒。0は無制限
  questionCount: 5,
  speechRate: 0.85,
  useAI: true, // AIによる問題生成を使う（失敗時はプリセットにフォールバック）
  voiceURI: '' // 読み上げ音声。空なら最も自然な音声を自動選択
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

// DBの進捗レコードから出題用の問題オブジェクトを復元する
// プリセット問題はバンクから、AI生成問題は保存された本文から再構築する
function questionFromRow(row) {
  const fromBank = QUESTION_LOOKUP.get(row.question_key);
  if (fromBank) return fromBank;
  if (!row.japanese || !row.english) return null;
  return {
    japanese: row.japanese,
    english: row.english,
    hints: row.hints || '',
    explanation: row.explanation || '',
    categoryName: row.category_name || 'AI生成問題',
    categoryKey: row.category_key,
    scene: row.scene || 'daily'
  };
}

export default function App() {
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  // 画面: 'setup' | 'quiz' | 'stats' | 'study'
  const [screen, setScreen] = useState('setup');
  const [settings, setSettings] = useState(loadSettings);

  // 出題中の問題と今回セッションの評価結果
  const [questions, setQuestions] = useState([]);
  const [sessionEvals, setSessionEvals] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationNotice, setGenerationNotice] = useState('');

  // DB上の学習進捗 (question_key -> row)
  const [progressMap, setProgressMap] = useState(new Map());
  const [syncError, setSyncError] = useState('');

  // 利用可能な英語音声（非同期ロードされるため変更を監視）
  const [englishVoices, setEnglishVoices] = useState(() => getEnglishVoices());

  useEffect(() => {
    const refresh = () => setEnglishVoices(getEnglishVoices());
    refresh();
    return onVoicesChanged(refresh);
  }, []);

  // --- 認証 ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      // パスワード再設定リンクからの遷移時は、通常画面ではなく再設定フォームを表示する
      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecovery(true);
      }
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
    text => speak(text, { voiceURI: settings.voiceURI, rate: settings.speechRate }),
    [settings.voiceURI, settings.speechRate]
  );

  // --- AI問題生成 ---
  const generateAIQuestions = useCallback(
    async ({ categoryKeys, scene, count }) => {
      const categories = categoryKeys
        .map(key => {
          const cat = GRAMMAR_CATEGORIES[key];
          return cat
            ? { key, name: cat.name, description: cat.description, formula: cat.formula }
            : null;
        })
        .filter(Boolean);

      // 直近に出題した問題を除外リストとして渡し、毎回違う問題を生成させる
      const exclude = [...progressMap.values()]
        .filter(row => row.last_answered_at)
        .sort((a, b) => Date.parse(b.last_answered_at) - Date.parse(a.last_answered_at))
        .slice(0, AI_EXCLUDE_LIMIT)
        .map(row => row.question_key);

      const { data, error } = await supabase.functions.invoke('generate-questions', {
        body: { categories, scene, count, exclude }
      });
      if (error || !Array.isArray(data?.questions) || data.questions.length === 0) {
        return null;
      }

      return data.questions.slice(0, count).map(item => {
        const cat = GRAMMAR_CATEGORIES[item.categoryKey];
        return {
          japanese: item.japanese,
          english: item.english,
          hints: item.hints || '',
          explanation: item.explanation || '',
          categoryKey: cat ? item.categoryKey : categoryKeys[0],
          categoryName: cat ? cat.name : 'AI生成問題',
          scene: ['tech', 'business', 'daily'].includes(item.scene) ? item.scene : 'daily',
          source: 'ai'
        };
      });
    },
    [progressMap]
  );

  // --- セッション開始 ---
  const startSession = useCallback(
    async ({ categoryKeys, scene, count }) => {
      setIsGenerating(true);
      setGenerationNotice('');

      let selected = null;
      if (settings.useAI) {
        try {
          selected = await generateAIQuestions({ categoryKeys, scene, count });
        } catch {
          selected = null;
        }
        if (!selected) {
          setGenerationNotice(
            'AI問題生成が利用できないため、プリセット問題から出題します。（SupabaseのGEMINI_API_KEY設定を確認してください）'
          );
        }
      }

      if (!selected || selected.length === 0) {
        const pool = buildQuestionPool(categoryKeys, scene);
        // シーン絞り込みで問題が空になった場合は全シーンにフォールバック
        const effectivePool = pool.length > 0 ? pool : buildQuestionPool(categoryKeys, 'all');
        if (effectivePool.length === 0) {
          setIsGenerating(false);
          return;
        }
        selected = selectQuestions(effectivePool, count, progressMap);
      }

      setQuestions(selected);
      setSessionEvals([]);
      setIsGenerating(false);
      setScreen('quiz');
    },
    [progressMap, settings.useAI, generateAIQuestions]
  );

  // 進捗レコードのリストから復習セッションを開始
  const startReviewSession = useCallback(rows => {
    const reviewQuestions = rows.map(questionFromRow).filter(Boolean);
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
        // AI生成問題も復習で再出題できるよう、本文をDBに保存する
        japanese: question.japanese,
        english: question.english,
        hints: question.hints || null,
        explanation: question.explanation || null,
        category_name: question.categoryName || null,
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
        japanese: question.japanese,
        english: question.english,
        hints: question.hints || null,
        explanation: question.explanation || null,
        category_name: question.categoryName || null,
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
  const bookmarkedRows = useMemo(
    () => [...progressMap.values()].filter(row => row.bookmarked),
    [progressMap]
  );
  const dueRows = useMemo(() => [...progressMap.values()].filter(isDue), [progressMap]);
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

  if (isPasswordRecovery) {
    return <UpdatePasswordScreen onComplete={() => setIsPasswordRecovery(false)} />;
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
        {generationNotice && (
          <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{generationNotice}</span>
          </div>
        )}

        {/* 学習パートからのAI生成中はオーバーレイで通知 */}
        {isGenerating && screen === 'study' && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold text-indigo-300">
              <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              AI問題セットを生成中...
            </div>
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
            englishVoices={englishVoices}
            isGenerating={isGenerating}
            bookmarkedCount={bookmarkedRows.length}
            dueCount={dueRows.length}
            onStart={({ categoryKeys }) =>
              startSession({
                categoryKeys,
                scene: settings.selectedScene,
                count: settings.questionCount
              })
            }
            onStartBookmarkReview={() => startReviewSession(bookmarkedRows)}
            onStartDueReview={() => startReviewSession(dueRows)}
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
            bookmarkedRows={bookmarkedRows}
            questionFromRow={questionFromRow}
            dueCount={dueRows.length}
            onToggleBookmark={toggleBookmark}
            onRestart={() => setScreen('setup')}
            onStartBookmarkReview={() => startReviewSession(bookmarkedRows)}
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
