// 間隔反復 (SM-2簡易版) のスケジュール計算
// 評価に応じて次回復習日までの間隔を伸縮させる

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// 評価ごとの間隔ルール
const FIRST_INTERVAL_PERFECT = 3; // 初回「完璧」→3日後
const FIRST_INTERVAL_GOOD = 1; // 初回「惜しい」→1日後
const MULTIPLIER_PERFECT = 2.5; // 「完璧」を重ねるごとに間隔を2.5倍
const MULTIPLIER_GOOD = 1.5; // 「惜しい」は1.5倍で緩やかに伸ばす
const MAX_INTERVAL_DAYS = 90; // 最長でも90日以内に再出題

/**
 * 現在の間隔と評価から次回の間隔(日数)と復習期限を計算する
 * @param {number} currentIntervalDays 現在の間隔(初回は0)
 * @param {'perfect'|'good'|'bad'} rating ユーザーの自己評価
 * @returns {{ intervalDays: number, dueAt: string }}
 */
export function nextSchedule(currentIntervalDays, rating) {
  let intervalDays;

  if (rating === 'bad') {
    // 言えなかった → 間隔リセット。即座に復習対象にする
    intervalDays = 0;
  } else if (rating === 'good') {
    intervalDays =
      currentIntervalDays <= 0
        ? FIRST_INTERVAL_GOOD
        : currentIntervalDays * MULTIPLIER_GOOD;
  } else {
    intervalDays =
      currentIntervalDays <= 0
        ? FIRST_INTERVAL_PERFECT
        : currentIntervalDays * MULTIPLIER_PERFECT;
  }

  intervalDays = Math.min(intervalDays, MAX_INTERVAL_DAYS);
  const dueAt = new Date(Date.now() + intervalDays * MS_PER_DAY).toISOString();

  return { intervalDays, dueAt };
}

/**
 * 復習期限が到来しているか判定する
 * @param {{ due_at: string | null }} progress 進捗レコード
 */
export function isDue(progress) {
  if (!progress?.due_at) return false;
  return new Date(progress.due_at).getTime() <= Date.now();
}
