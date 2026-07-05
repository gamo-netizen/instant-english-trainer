# AI瞬間英作文 - Instant English Trainer

和文を見て瞬時に英語を発話する「瞬間英作文」トレーニングアプリです。
ビジネス・エンジニアリング・日常会話の実践的な例文で、英語の反射神経を鍛えます。

## 主な機能

- **瞬間英作文トレーニング**: 制限時間（5秒/10秒/20秒/無制限）内に和文を英訳して発話
- **文法学習パート**: 22の文法・構文カテゴリの公式、ニュアンス、落とし穴、実務Tipsを体系的に学習
- **毎回違う出題**: 出題履歴に基づき、未出題・久しぶりの問題を優先的に選定
- **自動復習（間隔反復）**: 自己評価（完璧/惜しい/言えなかった）に応じて次回復習日を自動計算（SM-2簡易版）。復習期限が来た問題を自動でピックアップ
- **復習ブックマーク**: 言えなかった問題を自動ストック。手動での追加/削除も可能
- **ネイティブ発音**: Web Speech APIによる読み上げ（速度調整可）
- **アカウント同期**: Supabase認証（メール/パスワード）で学習データをクラウド保存。どの端末からでも続きから学習可能

## 技術スタック

- React 19 + Vite 7
- Tailwind CSS 4
- Supabase (Auth + Postgres + RLS)
- lucide-react

## セットアップ

```bash
npm install
cp .env.example .env
# .env にSupabaseのURLとPublishable Keyを設定
npm run dev
```

### Supabaseのセットアップ

1. [Supabase](https://supabase.com)でプロジェクトを作成
2. Authentication > Providers で Email を有効化
3. 以下のマイグレーションを SQL Editor で実行:

```sql
create table public.iet_question_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_key text not null,
  category_key text not null,
  scene text,
  bookmarked boolean not null default false,
  answer_count integer not null default 0,
  perfect_count integer not null default 0,
  good_count integer not null default 0,
  bad_count integer not null default 0,
  interval_days real not null default 0,
  due_at timestamptz,
  last_rating text check (last_rating in ('perfect', 'good', 'bad')),
  last_answered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, question_key)
);

alter table public.iet_question_progress enable row level security;

create policy "iet_qp_select_own" on public.iet_question_progress
  for select using ((select auth.uid()) = user_id);
create policy "iet_qp_insert_own" on public.iet_question_progress
  for insert with check ((select auth.uid()) = user_id);
create policy "iet_qp_update_own" on public.iet_question_progress
  for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "iet_qp_delete_own" on public.iet_question_progress
  for delete using ((select auth.uid()) = user_id);

create index iet_qp_user_due_idx on public.iet_question_progress (user_id, due_at);
```

## スクリプト

| コマンド | 説明 |
| --- | --- |
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番ビルド |
| `npm run lint` | ESLint実行 |
| `npm run preview` | ビルド結果のプレビュー |

## 復習アルゴリズム（間隔反復）

| 評価 | 次回復習までの間隔 |
| --- | --- |
| 言えなかった | 即時（間隔リセット） |
| 惜しい | 初回1日 → 以降1.5倍ずつ |
| 完璧！ | 初回3日 → 以降2.5倍ずつ（最長90日） |
