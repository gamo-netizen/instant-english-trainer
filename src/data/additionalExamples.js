// 学習パート増量分の追加例文（カテゴリキー → 例文リスト）
// grammarData.js 読み込み時に各カテゴリの examples にマージされる

export const ADDITIONAL_EXAMPLES = {
  so_that: [
    {
      japanese: "顧客がすぐ理解できるように、図を追加しました。",
      english: "I added a diagram so that the client could understand it quickly.",
      hints: "added a diagram so that the client could...",
      scene: "business",
      explanation: "過去形 added に合わせて so that 節内は could に時制一致。資料改善の意図を明確に伝えています。"
    },
    {
      japanese: "終電を逃さないように、早めに出ましょう。",
      english: "Let's leave early so that we won't miss the last train.",
      hints: "leave early so that we won't...",
      scene: "daily",
      explanation: "「〜しないように」という否定の目的は so that + won't / wouldn't で表します。"
    }
  ],
  too_to: [
    {
      japanese: "今日は忙しすぎてランチに行けません。",
      english: "I'm too busy to go out for lunch today.",
      hints: "too busy to go out...",
      scene: "business",
      explanation: "too busy の時点で「行けない」が確定するため、否定語は不要です。"
    },
    {
      japanese: "この仕様は曖昧すぎて実装できません。",
      english: "This spec is too vague to implement.",
      hints: "too vague to implement",
      scene: "tech",
      explanation: "vague（曖昧）が限界を超えているため実装不可能、という開発現場のフィードバック定番文です。"
    }
  ],
  enough_to: [
    {
      japanese: "このバッテリーは一日中もつほど長持ちします。",
      english: "This battery lasts long enough to get through the day.",
      hints: "lasts long enough to...",
      scene: "tech",
      explanation: "副詞 long の後ろに enough を置く語順。「基準を満たす持続時間」を表しています。"
    },
    {
      japanese: "私たちは締め切りに間に合うほど早く終えました。",
      english: "We finished early enough to meet the deadline.",
      hints: "finished early enough to...",
      scene: "business",
      explanation: "early enough to meet the deadline で「期限に間に合う基準を満たす早さ」を表現しています。"
    }
  ],
  so_that_degree: [
    {
      japanese: "その新機能はとても好評だったので、利用者が倍増しました。",
      english: "The new feature was so popular that the number of users doubled.",
      hints: "so popular that the number of users...",
      scene: "tech",
      explanation: "so popular（原因）→ that 以下の完全な文（結果: 利用者倍増）という強い因果関係を示しています。"
    },
    {
      japanese: "会議がとても長かったので、全員疲れ果てました。",
      english: "The meeting was so long that everyone was exhausted.",
      hints: "so long that everyone was...",
      scene: "business",
      explanation: "that 節は everyone was exhausted という主語+動詞の完全な文になっている点がポイントです。"
    }
  ],
  not_only_but_also: [
    {
      japanese: "このツールは速いだけでなく、無料でもあります。",
      english: "This tool is not only fast but also free.",
      hints: "not only fast but also...",
      scene: "tech",
      explanation: "fast と free という形容詞同士を対称に並べ、2つのメリットを強調しています。"
    },
    {
      japanese: "彼女はプレゼンだけでなく、交渉も得意です。",
      english: "She is good at not only presentations but also negotiations.",
      hints: "not only presentations but also...",
      scene: "business",
      explanation: "presentations と negotiations という名詞同士の並列。強調したいのは後半のBです。"
    }
  ],
  neither_nor: [
    {
      japanese: "そのプランは現実的でも経済的でもありません。",
      english: "The plan is neither realistic nor economical.",
      hints: "neither realistic nor...",
      scene: "business",
      explanation: "形容詞2つを neither ~ nor で結び、提案を強力に全否定しています。or ではなく nor を使う点に注意。"
    },
    {
      japanese: "私は今朝、コーヒーも紅茶も飲みませんでした。",
      english: "I had neither coffee nor tea this morning.",
      hints: "had neither coffee nor tea",
      scene: "daily",
      explanation: "neither ~ nor 自体が否定を含むため、動詞は had（肯定形）のままで使います。"
    }
  ],
  unless: [
    {
      japanese: "再起動しない限り、その設定は反映されません。",
      english: "The settings won't take effect unless you restart the system.",
      hints: "won't take effect unless you restart...",
      scene: "tech",
      explanation: "unless 節内は restart（肯定形）。take effect（効力を持つ・反映される）も技術現場の頻出表現です。"
    },
    {
      japanese: "予約しない限り、そのお店には入れませんよ。",
      english: "You can't get into that restaurant unless you make a reservation.",
      hints: "can't get into... unless you make...",
      scene: "daily",
      explanation: "「予約という例外がない限り不可能」という除外条件を unless で示しています。"
    }
  ],
  as_long_as: [
    {
      japanese: "APIの仕様が変わらない限り、この実装で問題ありません。",
      english: "This implementation is fine as long as the API spec doesn't change.",
      hints: "fine as long as the API spec doesn't...",
      scene: "tech",
      explanation: "as long as は肯定の前提条件。「仕様不変」という状態が続く限り保証する、という条件付き合意です。"
    },
    {
      japanese: "静かにしている限り、ここで勉強してもいいですよ。",
      english: "You can study here as long as you stay quiet.",
      hints: "study here as long as you stay...",
      scene: "daily",
      explanation: "「静かにしている間はずっとOK」という継続的な許可条件を as long as で表しています。"
    }
  ],
  due_to: [
    {
      japanese: "システム障害のため、サービスを一時停止しています。",
      english: "The service is temporarily suspended due to a system failure.",
      hints: "suspended due to a system failure",
      scene: "tech",
      explanation: "due to の後ろは a system failure という名詞のみ。障害報告のアナウンスで頻出の形です。"
    },
    {
      japanese: "悪天候のため、フライトはキャンセルされました。",
      english: "The flight was canceled due to bad weather.",
      hints: "canceled due to bad weather",
      scene: "daily",
      explanation: "受け身 + due to + 名詞で、キャンセルの客観的な原因を端的に説明しています。"
    }
  ],
  subjunctive_mood: [
    {
      japanese: "もし予算が2倍あったら、チームを拡大するのですが。",
      english: "If we had twice the budget, we would expand the team.",
      hints: "If we had twice the budget, we would...",
      scene: "business",
      explanation: "現実には予算がない前提を、仮定法過去（had / would）でマイルドに表現しています。"
    },
    {
      japanese: "もし彼がここにいたら、何と言うでしょうね。",
      english: "If he were here, what would he say?",
      hints: "If he were here, what would...?",
      scene: "daily",
      explanation: "仮定法過去の be動詞は was ではなく were を使うのが原則です。"
    }
  ],
  allow_a_to_b: [
    {
      japanese: "この自動化により、チームは手作業を減らせます。",
      english: "This automation allows the team to reduce manual work.",
      hints: "allows the team to reduce...",
      scene: "tech",
      explanation: "自動化（無生物）を主語に立て、チームが得るベネフィットを allow A to do で表現しています。"
    },
    {
      japanese: "リモートワークにより、私たちはどこでも働けます。",
      english: "Remote work enables us to work from anywhere.",
      hints: "enables us to work from anywhere",
      scene: "business",
      explanation: "制度や環境を主語にした enable A to do。「〜のおかげで…できる」と訳すと自然です。"
    }
  ],
  prevent_a_from_b: [
    {
      japanese: "二段階認証により、攻撃者のログインを防ぎます。",
      english: "Two-factor authentication prevents attackers from logging in.",
      hints: "prevents attackers from logging in",
      scene: "tech",
      explanation: "from の後ろは動名詞 logging in。セキュリティ対策の説明で頻出のパターンです。"
    },
    {
      japanese: "締め切りがあるおかげで、私たちは先延ばしせずに済みます。",
      english: "The deadline keeps us from procrastinating.",
      hints: "keeps us from procrastinating",
      scene: "business",
      explanation: "「締め切りが私たちを先延ばしから遠ざける」という無生物主語の発想が英語らしいポイントです。"
    }
  ],
  be_supposed_to: [
    {
      japanese: "このボタンを押すとレポートが出力されるはずです。",
      english: "This button is supposed to generate the report.",
      hints: "is supposed to generate...",
      scene: "tech",
      explanation: "仕様上の「本来の動作」を表します。動かない場合の含みを持たせられる便利なクッション表現です。"
    },
    {
      japanese: "今日は雨が降るはずでしたが、晴れましたね。",
      english: "It was supposed to rain today, but it's sunny.",
      hints: "was supposed to rain, but...",
      scene: "daily",
      explanation: "過去形 was supposed to は「〜するはずだった（のに違った）」という予定と現実のギャップを表します。"
    }
  ],
  be_likely_to: [
    {
      japanese: "新モデルは今四半期に発売される見込みです。",
      english: "The new model is expected to launch this quarter.",
      hints: "is expected to launch...",
      scene: "business",
      explanation: "ロードマップに基づく客観予測として be expected to を使っています。"
    },
    {
      japanese: "この変更は既存ユーザーに影響しそうにありません。",
      english: "This change is unlikely to affect existing users.",
      hints: "is unlikely to affect...",
      scene: "tech",
      explanation: "可能性が低い場合は un をつけて be unlikely to do。影響範囲の報告で頻出です。"
    }
  ],
  could_you: [
    {
      japanese: "画面を共有していただけますか？",
      english: "Could you share your screen?",
      hints: "Could you share your screen?",
      scene: "business",
      explanation: "オンライン会議の超頻出依頼。Could you で丁寧さを保ちながら簡潔にお願いしています。"
    },
    {
      japanese: "少々お待ちいただいてもよろしいですか？",
      english: "Would you mind waiting a moment?",
      hints: "Would you mind waiting...?",
      scene: "daily",
      explanation: "Would you mind の後ろは動名詞 waiting。to wait としないのが鉄則です。"
    }
  ],
  do_you_happen_to_know: [
    {
      japanese: "ひょっとして会議室がどこか知っていますか？",
      english: "Do you happen to know where the meeting room is?",
      hints: "happen to know where the meeting room is?",
      scene: "business",
      explanation: "間接疑問なので語順は where the meeting room is（肯定文の語順）になる点に注意です。"
    },
    {
      japanese: "どうして彼は昨日休んだのですか？",
      english: "How come he was off yesterday?",
      hints: "How come he was off...?",
      scene: "daily",
      explanation: "How come の後ろは he was off という肯定文の語順。did he を使わないのがポイントです。"
    }
  ],
  what_matters_is: [
    {
      japanese: "実際に起こったのは、サーバーが過負荷になったということです。",
      english: "What happened was the server got overloaded.",
      hints: "What happened was...",
      scene: "tech",
      explanation: "What happened was（何が起きたかと言うと）で聞き手の注意を引きつけてから本題を説明する型です。"
    },
    {
      japanese: "重要なのは、同じミスを繰り返さないことです。",
      english: "What matters is that we don't repeat the same mistake.",
      hints: "What matters is that we don't...",
      scene: "business",
      explanation: "What matters is の後ろに that 節を置いて、再発防止という要点にスポットライトを当てています。"
    }
  ],
  basic_verb_get: [
    {
      japanese: "オフィスに戻ったら電話します。",
      english: "I'll call you when I get back to the office.",
      hints: "when I get back to the office",
      scene: "business",
      explanation: "get back to + 場所 は「〜に戻る」。get back to + 人（折り返し連絡する）との違いに注目です。"
    },
    {
      japanese: "その仕組みがだんだん分かってきました。",
      english: "I'm getting the hang of it.",
      hints: "getting the hang of it",
      scene: "daily",
      explanation: "get the hang of は「コツをつかむ」の定番イディオム。進行形で「掴みつつある」変化を表します。"
    }
  ],
  basic_verb_take_put: [
    {
      japanese: "その騒音にはもう我慢できません。",
      english: "I can't put up with the noise anymore.",
      hints: "can't put up with...",
      scene: "daily",
      explanation: "put up with は「我慢する」。tolerate よりも日常会話で圧倒的によく使われます。"
    },
    {
      japanese: "その提案をちょっと見てみましょう。",
      english: "Let's take a look at the proposal.",
      hints: "take a look at the proposal",
      scene: "business",
      explanation: "take a look at + 対象 で「ざっと目を通す・確認する」。会議の進行でも頻出です。"
    }
  ],
  basic_verb_come_go_make: [
    {
      japanese: "昨日、面白い記事を偶然見つけました。",
      english: "I came across an interesting article yesterday.",
      hints: "came across an interesting article",
      scene: "daily",
      explanation: "come across は「偶然出くわす・見つける」。意図的に探した find とのニュアンスの違いが重要です。"
    },
    {
      japanese: "リリース前にチェックリストをもう一度確認しましょう。",
      english: "Let's go over the checklist before the release.",
      hints: "go over the checklist...",
      scene: "tech",
      explanation: "go over は「復習・再確認する」。go through（一通り確認）よりも見直しのニュアンスが強い表現です。"
    }
  ],
  native_daily_idioms: [
    {
      japanese: "会議で予算の件を持ち出しました。",
      english: "I brought up the budget issue in the meeting.",
      hints: "brought up the budget issue",
      scene: "business",
      explanation: "bring up は「（話題を）持ち出す・切り出す」。デリケートな議題を提起する時の定番です。"
    },
    {
      japanese: "彼は結局現れませんでした。",
      english: "He didn't show up after all.",
      hints: "didn't show up after all",
      scene: "daily",
      explanation: "show up は「（約束の場に）現れる・顔を出す」。after all（結局）と組み合わせた口語頻出文です。"
    }
  ],
  fillers_reactions: [
    {
      japanese: "確認させてください。",
      english: "Let me check.",
      hints: "Let me check.",
      scene: "business",
      explanation: "即答できない時に間を取る万能フレーズ。沈黙するより Let me check と言う方が印象が良くなります。"
    },
    {
      japanese: "そういえば、あの件はどうなりましたか？",
      english: "Speaking of which, what happened to that issue?",
      hints: "Speaking of which, what happened to...?",
      scene: "business",
      explanation: "Speaking of which は直前の話題を受けて「そういえば」と関連する話題に繋ぐ、大人の会話術です。"
    }
  ]
};
