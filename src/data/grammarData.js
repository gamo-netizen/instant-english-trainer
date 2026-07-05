// 文法カテゴリと問題バンク
// 例文は「毎回違う出題」を実現するため各カテゴリ複数問を収録している
import { ADDITIONAL_EXAMPLES } from './additionalExamples';

export const GRAMMAR_CATEGORIES = {
  // === GROUP 1: 文法・基本文型 (grammar) ===
  so_that: {
    name: "so that 構文",
    group: "grammar",
    description: "「～するために / ～できるように」目的・意図を表す",
    formula: "S + V + so that + S' + can/could/would + 動詞原形",
    nuance: "主節の行為が目指す『目的』や『意図した結果』を明確に記述する接続詞です。目的の中に可能性・能力が含まれるため、後ろの節には can / could / would などの助動詞がほぼセットで呼び出されます。",
    pitfall: "時制の一致に注意。主節が過去形（例: We *added* more engineers...）の場合、so that節内の助動詞も過去形（*could* や *would*）にする必要があります。",
    techTip: "「〇〇を可能にするために、△△を実装した」など、変更の正当な動機・仕様をロジカルに説明する際の最頻出構文です。",
    examples: [
      {
        japanese: "試験に合格できるように猛勉強しました。",
        english: "I studied hard so that I could pass the exam.",
        hints: "studied hard so that I could...",
        scene: "daily",
        explanation: "過去形 studied に合わせて、so thatの後は can ではなく could に時制一致しています。"
      },
      {
        japanese: "プロジェクトを予定通り進めるために人員を増やしました。",
        english: "We added more engineers so that the project could stay on schedule.",
        hints: "added more engineers so that...",
        scene: "tech",
        explanation: "過去形 added に合わせて、so that 節内の助動詞も could に時制一致しています。"
      },
      {
        japanese: "後で確認できるように、ログを保存してください。",
        english: "Please save the logs so that we can check them later.",
        hints: "save the logs so that we can...",
        scene: "tech",
        explanation: "命令文（現在の依頼）なので、so that 節内は can のままでOKです。"
      },
      {
        japanese: "遅れないように早めに家を出ました。",
        english: "I left home early so that I wouldn't be late.",
        hints: "left home early so that I wouldn't...",
        scene: "daily",
        explanation: "「〜しないように」という否定の目的は so that + wouldn't で表現します。"
      }
    ]
  },
  too_to: {
    name: "too ～ to ...",
    group: "grammar",
    description: "「～すぎて…できない」不可能性や制限",
    formula: "too + 形容詞/副詞 + to + 動詞原形",
    nuance: "「〜すぎるため、その結果…できない」という、否定語を使わない強い否定を表します。限界値を超えている困難を伝えます。",
    pitfall: "構文自体に「できない」の意味が含まれるため、to以下に not を入れる必要はありません。",
    techTip: "「ノイズが多すぎて信号を検出できない」など、物理的制限やスペック限界を端的に表現できます。",
    examples: [
      {
        japanese: "疲れていて働けません。",
        english: "I'm too tired to work.",
        hints: "too tired to...",
        scene: "daily",
        explanation: "notを使用せずに「疲れているから働くことは不可能だ」というニュアンスを簡潔に表現しています。"
      },
      {
        japanese: "その問題は複雑すぎて、すぐには解決できません。",
        english: "The problem is too complex to solve quickly.",
        hints: "too complex to solve...",
        scene: "tech",
        explanation: "問題の深刻度・複雑度（complex）が解決の限界を超えている状態を too ~ to でスマートに示しています。"
      },
      {
        japanese: "このコーヒーは熱すぎて飲めません。",
        english: "This coffee is too hot to drink.",
        hints: "too hot to drink",
        scene: "daily",
        explanation: "too hot（熱すぎる）の時点で「飲めない」が確定するため、to drink に否定語は不要です。"
      },
      {
        japanese: "そのファイルは大きすぎてメールで送れません。",
        english: "The file is too large to send by email.",
        hints: "too large to send...",
        scene: "tech",
        explanation: "添付ファイルの容量制限など、物理的な限界超過を too large to send で端的に伝えています。"
      }
    ]
  },
  enough_to: {
    name: "enough to",
    group: "grammar",
    description: "「十分～なので…できる」基準の達成",
    formula: "形容詞/副詞 + enough + to + 動詞原形",
    nuance: "ある動作を実行するのに必要な基準やレベルに完全に達している（充足している）肯定的な評価を表します。",
    pitfall: "語順に注意。「形容詞/副詞 + enough」の順になり、enough が形容詞の後ろにきます（× enough reliable / ◯ reliable enough）。",
    techTip: "性能評価で「このデータは十分信頼に値する」「この強度なら採用可能だ」といった合格判定を下す時に多用します。",
    examples: [
      {
        japanese: "彼女は運転できる年齢に達しています。",
        english: "She is old enough to drive.",
        hints: "old enough to...",
        scene: "daily",
        explanation: "形容詞 old の後ろに enough が置かれる語順が非常に重要です。"
      },
      {
        japanese: "そのデータは使用するのに十分信頼できます。",
        english: "The data is reliable enough to use.",
        hints: "reliable enough to use...",
        scene: "tech",
        explanation: "データの品質や信頼性が基準に達しているため、次の開発フェーズに進められるというビジネス評価のフレーズです。"
      },
      {
        japanese: "このサーバーはピーク時の負荷を処理するのに十分高速です。",
        english: "This server is fast enough to handle peak load.",
        hints: "fast enough to handle...",
        scene: "tech",
        explanation: "fast enough の語順で「基準を満たす速度がある」という合格判定を下しています。"
      },
      {
        japanese: "彼の説明は誰でも理解できるほど分かりやすかったです。",
        english: "His explanation was clear enough for everyone to understand.",
        hints: "clear enough for everyone to...",
        scene: "business",
        explanation: "to不定詞の意味上の主語は「for + 人」で示します（for everyone to understand）。"
      }
    ]
  },
  so_that_degree: {
    name: "so ～ that ...",
    group: "grammar",
    description: "「とても～なので…」明確な因果関係",
    formula: "so + 形容詞/副詞 + that + 主語 (S) + 動詞 (V)",
    nuance: "「原因（とても〜だ）」と「結果（その結果こうなった）」の強い直結関係を示し、客観的でロジカルな印象を与えます。",
    pitfall: "that節の中は主語と動詞を持つ「完全な文」にする必要があります。to不定詞を使ってしまうミスに注意しましょう。",
    techTip: "「バグが非常に深刻だったため、生産が停止した」など、発生したトリガーとインパクトをロジカルにつなぐ報告書で必須の文法です。",
    examples: [
      {
        japanese: "その問題は非常に深刻だったので、生産が停止しました。",
        english: "The issue was so serious that production stopped.",
        hints: "so serious that production...",
        scene: "tech",
        explanation: "so serious (極めて深刻) という原因から、that production stopped (結果、生産停止に至った) という因果を完全に説明しています。"
      },
      {
        japanese: "そのデモはとても印象的だったので、顧客はすぐに契約しました。",
        english: "The demo was so impressive that the client signed immediately.",
        hints: "so impressive that the client...",
        scene: "business",
        explanation: "so impressive（原因）と that 以下の完全な文（結果）で、強い因果関係を表しています。"
      },
      {
        japanese: "昨日はとても疲れていたので、9時に寝ました。",
        english: "I was so tired that I went to bed at nine.",
        hints: "so tired that I went...",
        scene: "daily",
        explanation: "that 節の中は「I went to bed」という主語+動詞の完全な文になっている点がポイントです。"
      }
    ]
  },
  not_only_but_also: {
    name: "not only A but also B",
    group: "grammar",
    description: "「AだけでなくBも」情報の追加と強調",
    formula: "not only A (品詞) but also B (同じ品詞)",
    nuance: "既知の事実に加えて、さらに重要度が高い、または意外性のある情報Bを追加・強調する際に使います。話し手は特に「B」をアピールしたい意図があります。",
    pitfall: "左右対称（並列）のルール。Aが形容詞ならBも形容詞にするなど、文法的に対称にする必要があります。",
    techTip: "「このアップデートは処理速度を高めるだけでなく、消費電力も削減する」など、複数のメリットをスマートにアピールできます。",
    examples: [
      {
        japanese: "彼女は賢いだけでなく、勤勉でもあります。",
        english: "She is not only smart but also hardworking.",
        hints: "not only smart but also...",
        scene: "daily",
        explanation: "スマート（smart）という特徴に加えて、さらに素晴らしい「hardworking（勤勉）」を付け加えてアピールしています。"
      },
      {
        japanese: "この修正はバグを解消するだけでなく、パフォーマンスも改善します。",
        english: "This fix not only resolves the bug but also improves performance.",
        hints: "not only resolves... but also improves...",
        scene: "tech",
        explanation: "resolves と improves という動詞同士を対称に並べ、修正の二重のメリットを強調しています。"
      },
      {
        japanese: "彼は英語だけでなく中国語も話します。",
        english: "He speaks not only English but also Chinese.",
        hints: "not only English but also...",
        scene: "daily",
        explanation: "English と Chinese という名詞同士が対称に並んでいます。並列のルールを守ることが重要です。"
      }
    ]
  },
  neither_nor: {
    name: "neither A nor B",
    group: "grammar",
    description: "「AもBもどちらも〜ない」二者全否定",
    formula: "neither A nor B",
    nuance: "提示された2つの要素のどちらも当てはまらないという、強力な全否定を表します。客観的かつ厳格に二つの可能性を排除します。",
    pitfall: "neither A *or* B としてしまう誤りに注意。必ず「nor」のペアを使います。",
    techTip: "「今回の不具合は設計ミスでも製造ミスでもない」といった厳しい排除条件をロジカルに宣言する場面で多用されます。",
    examples: [
      {
        japanese: "ジョンもマイクも出席しませんでした。",
        english: "Neither John nor Mike attended.",
        hints: "Neither John nor Mike...",
        scene: "business",
        explanation: "二者とも出席しなかった事実を、スマートかつ強力に全否定しています。"
      },
      {
        japanese: "その不具合は設計ミスでも製造ミスでもありませんでした。",
        english: "The defect was neither a design error nor a manufacturing error.",
        hints: "neither a design error nor...",
        scene: "tech",
        explanation: "原因分析で2つの可能性を同時に排除する、報告書で頻出の全否定表現です。"
      },
      {
        japanese: "私は犬も猫も飼っていません。",
        english: "I have neither a dog nor a cat.",
        hints: "neither a dog nor a cat",
        scene: "daily",
        explanation: "neither ~ nor 自体が否定を含むため、動詞は have（肯定形）のままで使います。"
      }
    ]
  },
  unless: {
    name: "unless",
    group: "grammar",
    description: "「～しない限りは」否定の除外条件",
    formula: "unless + S + V",
    nuance: "「もし〜でなければ（＝〜という例外が起きない限りは）、自動的に望ましくない結果になる」という、防衛的で厳しい除外条件を表します。",
    pitfall: "unless の中には既に「否定」が含まれているため、節内に don't などの否定語を重ねないように注意してください。",
    techTip: "「今日、承認を得られない限り、私たちは締め切りに間に合わないでしょう」など、クリティカルパスの警告に欠かせない文法です。",
    examples: [
      {
        japanese: "今日、承認を得られない限り、私たちは締め切りに間に合わないでしょう。",
        english: "Unless we receive approval today, we'll miss the deadline.",
        hints: "Unless we receive approval...",
        scene: "business",
        explanation: "「approval（承認）」が得られない限り、デッドラインを落とすという厳しい条件を unless で提示しています。"
      },
      {
        japanese: "ログを確認しない限り、原因は特定できません。",
        english: "We can't identify the cause unless we check the logs.",
        hints: "can't identify... unless we check...",
        scene: "tech",
        explanation: "unless 節内は check（肯定形）のまま。「確認しない限り」の否定は unless 自体に含まれています。"
      },
      {
        japanese: "雨が降らない限り、私たちはハイキングに行きます。",
        english: "We'll go hiking unless it rains.",
        hints: "go hiking unless it rains",
        scene: "daily",
        explanation: "unless it rains で「雨という例外がない限り実行する」という条件を簡潔に示しています。"
      }
    ]
  },
  as_long_as: {
    name: "as long as",
    group: "grammar",
    description: "「～である限りは」肯定の前提条件",
    formula: "as long as + S + V",
    nuance: "「〜という状態が維持されている期間中はずっと、主節が成り立つ」という、継続的な合意・前提条件を表します。",
    pitfall: "unlessが否定（〜しない限り）であるのに対し、as long asは肯定（〜である限り）です。論理構造の取り違えに注意しましょう。",
    techTip: "「品質が維持されている限り、問題ありません」と、仕様条件内の合意や安全稼働を約束・保証する際に極めて便利です。",
    examples: [
      {
        japanese: "品質が維持されている限り、私たちは問題ありません。",
        english: "As long as quality is maintained, we're okay.",
        hints: "As long as quality is maintained...",
        scene: "tech",
        explanation: "品質維持という前提条件が続く限り、問題がないことを保証しています。"
      },
      {
        japanese: "締め切りを守る限り、進め方はあなたに任せます。",
        english: "As long as you meet the deadline, how you proceed is up to you.",
        hints: "As long as you meet the deadline...",
        scene: "business",
        explanation: "deadline 厳守という条件付きで裁量を委ねる、マネジメントの定番フレーズです。"
      },
      {
        japanese: "健康である限り、働き続けたいです。",
        english: "I want to keep working as long as I stay healthy.",
        hints: "keep working as long as I stay...",
        scene: "daily",
        explanation: "as long as I stay healthy（健康を維持している間はずっと）という継続的な前提条件を表しています。"
      }
    ]
  },
  due_to: {
    name: "due to / because of",
    group: "grammar",
    description: "「～が原因で」客観的な原因・帰属",
    formula: "due to + 名詞 / because of + 名詞",
    nuance: "トラブルや結果を引き起こした直接の原因を端的に示します。due to は because of に比べてフォーマルで、客観的な原因帰属を説明するのに向いています。",
    pitfall: "because は接続詞なので後ろに S+V が来ますが、due to や because of は前置詞句なので後ろには【名詞】のみを置きます。",
    techTip: "「遅延は機器の故障によるものでした」など、トラブルの因果分析報告（Root Cause）の鉄板表現です。",
    examples: [
      {
        japanese: "遅延は機器の故障によるものでした。",
        english: "The delay was due to equipment failure.",
        hints: "due to equipment failure",
        scene: "tech",
        explanation: "be動詞 + due to で、遅延が機器故障に直接起因したものであるという客観的な説明を行っています。"
      },
      {
        japanese: "会議は台風のため延期されました。",
        english: "The meeting was postponed due to the typhoon.",
        hints: "postponed due to...",
        scene: "business",
        explanation: "due to の後ろは the typhoon という名詞のみ。S+V を置かないのがポイントです。"
      },
      {
        japanese: "渋滞のせいで遅刻しました。",
        english: "I was late because of the traffic jam.",
        hints: "late because of...",
        scene: "daily",
        explanation: "カジュアルな場面では because of が自然です。後ろには名詞（the traffic jam）を置きます。"
      }
    ]
  },
  subjunctive_mood: {
    name: "仮定法 (subjunctive)",
    group: "grammar",
    description: "If I were you, I'd... / What would you do if...",
    formula: "If + S + 過去形 (were), S' + would/could + 動詞原形",
    nuance: "現実とは異なる仮想の世界を想定し、「もし〜だったら、こうするだろう」とマイルドに提言したり、配慮を込めて意向表明します。",
    pitfall: "仮定法過去における be動詞 は通常 was ではなく `were` が選ばれます。時制の不一致に注意してください。",
    techTip: "「もし私があなたなら、待つでしょうね」と、相手の機嫌を損ねずに防衛的かつプロフェッショナルなアドバイスを行う際の必須武器です。",
    examples: [
      {
        japanese: "もし私があなたなら、待つでしょうね。",
        english: "If I were you, I'd wait.",
        hints: "If I were you, I'd wait.",
        scene: "business",
        explanation: "相手の立場を思いやったマイルドなアドバイスとして、仮定法（I'd = I would）を使用しています。"
      },
      {
        japanese: "もし時間がもっとあれば、全ケースをテストできるのですが。",
        english: "If we had more time, we could test all the cases.",
        hints: "If we had more time, we could...",
        scene: "tech",
        explanation: "現実には時間がない、という前提を仮定法過去（had / could）で表現しています。"
      },
      {
        japanese: "もし宝くじが当たったら、何をしますか？",
        english: "What would you do if you won the lottery?",
        hints: "What would you do if you won...?",
        scene: "daily",
        explanation: "現実には起こりそうにない仮定なので、if 節は過去形 won、主節は would を使います。"
      }
    ]
  },

  // === GROUP 2: 重要構文・表現の型 (phrases) ===
  allow_a_to_b: {
    name: "allow A to B / enable A to B",
    group: "phrases",
    description: "「AがBすることを可能にする」英語らしい無生物主語",
    formula: "主語 (無生物・ツールなど) + allow/enable + A + to + 動詞原形",
    nuance: "新しいテクノロジーや環境が主語になり、「その存在のおかげで、AがBという行動をストレスなく行うことができる」という機能ベネフィットを示します。",
    pitfall: "日本語訳の「許可する」に引っ張られすぎないように。モノが主語の時は「（ツールのおかげで）〜ができるようになる」という肯定的な「可能」のニュアンスに変化します。",
    techTip: "「このツールにより、エンジニアは作業を迅速化できる」「アップデートによりコストを削減できる」など、製品メリットをアピールする主戦力構文です。",
    examples: [
      {
        japanese: "このツールを使うことで、エンジニアはより迅速に作業できます。",
        english: "This tool allows engineers to work faster.",
        hints: "allows engineers to work faster...",
        scene: "tech",
        explanation: "ツールのおかげで、エンジニアが素早く作業可能になることを allow A to do でエレガントに表現しています。"
      },
      {
        japanese: "この機能により、ユーザーはパフォーマンスを監視できます。",
        english: "This feature enables users to monitor performance.",
        hints: "enables users to monitor...",
        scene: "tech",
        explanation: "enable A to do を使うことで、機能が直接的に「監視能力を付与する」というややテクノロジー志向の強みを示します。"
      },
      {
        japanese: "新しいAPIにより、開発者はデータに直接アクセスできます。",
        english: "The new API allows developers to access the data directly.",
        hints: "allows developers to access...",
        scene: "tech",
        explanation: "無生物主語（The new API）を主語に立てるのが英語らしい表現のコツです。"
      },
      {
        japanese: "このアプリのおかげで、私は支出を管理できます。",
        english: "This app allows me to track my spending.",
        hints: "allows me to track...",
        scene: "daily",
        explanation: "日常のツール紹介でも allow A to do は大活躍します。「〜のおかげで…できる」と訳すと自然です。"
      }
    ]
  },
  prevent_a_from_b: {
    name: "prevent A from B-ing / keep A from B-ing",
    group: "phrases",
    description: "「AがBするのを妨げる / 防ぐ」リスク回避",
    formula: "主語 + prevent/keep + A + from + 動名詞 (doing)",
    nuance: "ある要因や安全策が、Aが特定の好ましくない動作（doing）に陥ったり移行したりするのを「事前にブロックし、防御する」という意味合いを持ちます。",
    pitfall: "from の後ろは必ず【動名詞（-ing形式）】または名詞になります。間違えて不定詞（to do）を置かないように注意しましょう。",
    techTip: "「この機構により漏れ電流の上昇が防がれます」「修正によりクラッシュが防止された」など、リスク軽減の表現に不可欠です。",
    examples: [
      {
        japanese: "この機構により漏れ電流の上昇が防がれます。",
        english: "This mechanism prevents leakage current from increasing.",
        hints: "prevents leakage current from increasing...",
        scene: "tech",
        explanation: "漏れ電流（leakage current）が上昇するのを from で未然にブロックしています。"
      },
      {
        japanese: "そのコーティングにより、湿気がデバイスに侵入するのを防ぎます。",
        english: "The coating keeps moisture from entering the device.",
        hints: "keeps moisture from entering...",
        scene: "tech",
        explanation: "keeps A from doing で、湿気の侵入を継続的に遮断し続けている状態を表しています。"
      },
      {
        japanese: "バリデーションにより、不正なデータが保存されるのを防ぎます。",
        english: "Validation prevents invalid data from being saved.",
        hints: "prevents invalid data from being saved",
        scene: "tech",
        explanation: "受け身の動作を防ぐ場合は from being + 過去分詞の形になります。"
      },
      {
        japanese: "騒音のせいで昨夜は眠れませんでした。",
        english: "The noise kept me from sleeping last night.",
        hints: "kept me from sleeping...",
        scene: "daily",
        explanation: "「騒音が私を眠りから遠ざけた」という無生物主語の発想で、英語らしい一文になります。"
      }
    ]
  },
  be_supposed_to: {
    name: "be supposed to",
    group: "phrases",
    description: "「〜することになっている / 〜するはずだ」合意やルール",
    formula: "be + supposed + to + 動詞原形",
    nuance: "スケジュール、ルール、法律、あるいは「常識・期待値」に照らし合わせ、「当然〜する段取りになっている」「〜するのが約束である」という規定路線を表します。",
    pitfall: "しばしば発音で 'd' が消えるため、「be suppose to」とスペルミスをしてしまう罠があります。必ず過去分詞の `supposed` になります。",
    techTip: "「本来なら本日中に届く手はずなのですが（The packet is supposed to arrive today）」「この仕様が動くはずなのですが」など、予定と現実のギャップをマイルドに示唆するクッションワードです。",
    examples: [
      {
        japanese: "荷物は明日届くことになっています。",
        english: "The shipment is supposed to arrive tomorrow.",
        hints: "is supposed to arrive tomorrow",
        scene: "business",
        explanation: "事前の計画や手はず（shipment schedule）に基づいて「明日届く段取りだ」という共通認識を丁寧に伝えています。"
      },
      {
        japanese: "このスクリプトは毎晩自動で実行されることになっています。",
        english: "This script is supposed to run automatically every night.",
        hints: "is supposed to run automatically...",
        scene: "tech",
        explanation: "仕様上の「本来の動作」を表します。実際に動いていない場合の含みを持たせられる便利な表現です。"
      },
      {
        japanese: "私たちは10時に会うことになっていました。",
        english: "We were supposed to meet at ten.",
        hints: "were supposed to meet...",
        scene: "daily",
        explanation: "過去形 were supposed to は「〜するはずだった（のに実現しなかった）」というニュアンスを含みます。"
      }
    ]
  },
  be_likely_to: {
    name: "be likely to / be expected to",
    group: "phrases",
    description: "「〜しそうだ / 〜と予想される」確度のある推測",
    formula: "be + likely/expected + to + 動詞原形",
    nuance: "データや現在のトレンド、十分な証拠に裏打ちされた上で「〜になる可能性が十分に考えられる / そう予測される」とロジカルに予測する際に用います。",
    pitfall: "可能性が低いときは、否定の un をつけて 「be *unlikely* to do / be expected not to do」と表現します。",
    techTip: "「コストが増加しそうだ」「来年は収益が増加すると予想されている」など、客観的見解として予測を伝えるシーンで超多用されます。",
    examples: [
      {
        japanese: "収益は来年増加すると予想されています。",
        english: "Revenue is expected to grow next year.",
        hints: "is expected to grow...",
        scene: "business",
        explanation: "財務予測などで「当然そう見込まれる」客観予測として expected を使っています。"
      },
      {
        japanese: "その問題は歩留まりに影響しそうです。",
        english: "The issue is likely to impact yield.",
        hints: "is likely to impact...",
        scene: "tech",
        explanation: "データやこれまでの経験則から、問題が歩留まり（yield）に波及する可能性が極めて高いことをロジカルに予測しています。"
      },
      {
        japanese: "このままだとプロジェクトは遅延しそうです。",
        english: "The project is likely to be delayed at this rate.",
        hints: "is likely to be delayed...",
        scene: "business",
        explanation: "受け身（be delayed）と組み合わせて、確度の高い遅延リスクを警告しています。"
      },
      {
        japanese: "午後は雨が降りそうです。",
        english: "It's likely to rain this afternoon.",
        hints: "It's likely to rain...",
        scene: "daily",
        explanation: "天気の話題でも likely to は自然に使えます。根拠のある予測のニュアンスです。"
      }
    ]
  },
  could_you: {
    name: "丁寧な依頼 (Could you... / Would you mind...)",
    group: "phrases",
    description: "Could you / Would you / Would you mind -ing",
    formula: "Could you + 動詞原形 / Would you mind + 動名詞(doing)?",
    nuance: "角を立てずに相手の合意を取り付け、優先して動いてもらうためのクッション表現です。特に mind は「嫌に感じますか？」と相手に配慮します。",
    pitfall: "Would you mind の後ろは必ず【動名詞（-ing形式）】になります。絶対に to 不定詞を置いてはいけません（× mind to wait / ◯ mind waiting）。",
    techTip: "メールの結びやチャットで「本日中にデータを送っていただけますと幸いです」「確認をお願いできますでしょうか」と要請する大人のマナーです。",
    examples: [
      {
        japanese: "それを説明していただけますか？",
        english: "Could you explain that?",
        hints: "Could you explain that?",
        scene: "daily",
        explanation: "相手に対して上品に解説や説明を要求する丁寧な依頼表現です。"
      },
      {
        japanese: "このドキュメントを確認していただけますでしょうか？（かなり丁寧）",
        english: "Would you mind checking this document?",
        hints: "Would you mind checking...",
        scene: "business",
        explanation: "Would you mind + 動名詞（checking）を使うことで、「確認する負担をかけても嫌ではないですか？」と謙虚に聞いています。"
      },
      {
        japanese: "もう少しゆっくり話していただけますか？",
        english: "Could you speak a little more slowly?",
        hints: "Could you speak a little more...",
        scene: "daily",
        explanation: "オンライン会議で聞き取れなかった時の必須フレーズ。a little を挟むと柔らかさが増します。"
      },
      {
        japanese: "会議を30分後ろ倒しにしていただけますか？",
        english: "Could you push the meeting back by thirty minutes?",
        hints: "push the meeting back by...",
        scene: "business",
        explanation: "push back（後ろ倒しにする）+ by（差分の30分）で、スケジュール調整を丁寧に依頼しています。"
      }
    ]
  },
  do_you_happen_to_know: {
    name: "会話を切り出す疑問文",
    group: "phrases",
    description: "Do you happen to know / Have you ever / What do you think about / How come",
    formula: "Do you happen to know + 疑問詞節 / Have you ever + 過去分詞?",
    nuance: "相手の経験、意見、情報をスムーズに引き出したり、「どうして〜なのか？」と原因をフラットに尋ねるための実践フレーズです。",
    pitfall: "How come S+V? は、後ろに疑問文の語順ではなく【肯定句の語順】が来ます（× How come did it fail? / ◯ How come it failed?）。",
    techTip: "「ひょっとして彼がどこにいるか知っていますか？」「どうして失敗したの？」など、チャットやZoomで最も発話頻度の高い重要反応パーツです。",
    examples: [
      {
        japanese: "ひょっとして彼がどこにいるか知っていますか？",
        english: "Do you happen to know where he is?",
        hints: "Do you happen to know where he is?",
        scene: "daily",
        explanation: "happen to do（ひょっとして〜する）を挟んで、知らないかもしれない前提で柔らかく相手に情報を尋ねています。"
      },
      {
        japanese: "どうして失敗したのですか？（ネイティブ頻出）",
        english: "How come it failed?",
        hints: "How come it failed?",
        scene: "tech",
        explanation: "How come は why より会話調で、「どうしてそうなったの？」と直後の肯定文（it failed）を繋ぐだけで理由を聞くことができます。"
      },
      {
        japanese: "この機能を使ったことはありますか？",
        english: "Have you ever used this feature?",
        hints: "Have you ever used...?",
        scene: "tech",
        explanation: "Have you ever + 過去分詞で、相手の経験の有無をスムーズに引き出しています。"
      },
      {
        japanese: "新しいデザインについてどう思いますか？",
        english: "What do you think about the new design?",
        hints: "What do you think about...?",
        scene: "business",
        explanation: "意見を求める定番。× How do you think ではなく ◯ What do you think である点に注意です。"
      }
    ]
  },
  what_matters_is: {
    name: "会話の型 (What matters is... / All you have to do...)",
    group: "phrases",
    description: "what matters is / what happened was / all you have to do is / the thing is that / what if",
    formula: "What matters is + 名詞句 / All you have to do is + 動詞原形",
    nuance: "会話の中で最も強調したいこと（重要なこと、することと言えば、要点、もし〜だったら？）にスポットライトを当て、説得力を生む強力なフレームです。",
    pitfall: "All you have to do is の後ろは、to不定詞 ではなく「動詞の原形（do）」が直接置かれることが多いです。",
    techTip: "「要するに時間が足りないのです」「あなたがすべきことはボタンをクリックすることだけです」など、ミーティングの要点をシャープにします。",
    examples: [
      {
        japanese: "重要なのは品質です。",
        english: "What matters is quality.",
        hints: "What matters is quality.",
        scene: "business",
        explanation: "What matters is（重要なことと言えば）を主語に据え、品質（quality）をこれ以上なく際立たせています。"
      },
      {
        japanese: "ボタンをクリックするだけでいいのです。",
        english: "All you have to do is click the button.",
        hints: "All you have to do is click...",
        scene: "daily",
        explanation: "All you have to do is（〜しさえすればよい）の後ろに、toなしの動詞原形 click を置いたネイティブ最頻出フレーズです。"
      },
      {
        japanese: "実のところ、問題は予算ではなくスケジュールなんです。",
        english: "The thing is that the issue is not the budget but the schedule.",
        hints: "The thing is that...",
        scene: "business",
        explanation: "The thing is（実は要点はこうなんです）で聞き手の注意を引きつけてから本題を切り出しています。"
      },
      {
        japanese: "もしテストが失敗したらどうしますか？",
        english: "What if the test fails?",
        hints: "What if the test fails?",
        scene: "tech",
        explanation: "What if + S + V だけで「もし〜だったらどうする？」というリスク確認・提案が完成する万能フレームです。"
      }
    ]
  },

  // === GROUP 3: 動詞・イディオム・会話表現 (idioms) ===
  basic_verb_get: {
    name: "基本動詞 get の用法",
    group: "idioms",
    description: "get + 形容詞 / get to (〜する機会がある) / get back (戻る) / get along with",
    formula: "get + 形容詞 / get to + 動詞原形 / get back to + [人]",
    nuance: "get（変化・機会）、get back（折り返し連絡する）など、英語脳のコアをなす超多機能基本動詞のネイティブ用法です。",
    pitfall: "get back to [人] は「〜に折り返し連絡する」というビジネスでの決定版フレーズで、emailでも会話でも20倍以上頻繁に使われます。",
    techTip: "「確認して追ってご連絡します」「彼と会う機会がありました」など、自分の主体的行動を報告するのに必須です。",
    examples: [
      {
        japanese: "彼に会う機会がありました。",
        english: "I got to meet him.",
        hints: "got to meet him",
        scene: "daily",
        explanation: "get to do で「幸運な機会を得て実際に〜することができた」というポジティブな経験事実を伝えています。"
      },
      {
        japanese: "確認して追ってご連絡します。",
        english: "I'll get back to you.",
        hints: "I'll get back to you",
        scene: "business",
        explanation: "確認のための「持ち帰り」や保留、折り返し回答をプロフェッショナルかつスマートに引き取る際の業界基準句です。"
      },
      {
        japanese: "だんだん寒くなってきましたね。",
        english: "It's getting cold.",
        hints: "It's getting cold",
        scene: "daily",
        explanation: "get + 形容詞で「〜の状態に変化していく」を表します。進行形にすると変化の途中を描写できます。"
      },
      {
        japanese: "彼女は同僚とうまくやっています。",
        english: "She gets along with her coworkers.",
        hints: "gets along with...",
        scene: "business",
        explanation: "get along with は「人間関係が良好である」を表す定番イディオムです。"
      }
    ]
  },
  basic_verb_take_put: {
    name: "基本動詞 take / put の用法",
    group: "idioms",
    description: "take care of / take a look / put off (延期する) / put together (まとめる) / put up with",
    formula: "take care of + 名詞 / put off + 名詞 / put together + 名詞",
    nuance: "take（直接介入して制御）、put（そっと置く・時間をずらす・我慢する）などの基本動詞のネイティブイディオムです。",
    pitfall: "put off は単に「延期する」という意味ですが、postpone よりも日常のチャットやカジュアルなやりとりで非常によく使われます。",
    techTip: "「その件は私が引き受けて対処します」「確認させてください」「報告書をまとめます」など、自分の主体的行動を名乗るのに必須です。",
    examples: [
      {
        japanese: "その件は私が引き受けて対処します。",
        english: "I'll take care of it.",
        hints: "I'll take care of it",
        scene: "business",
        explanation: "take care of は、ビジネスで「自分が責任を持ってその厄介な問題を解決完了させておくよ」と引き取る、非常に頼もしいセリフです。"
      },
      {
        japanese: "ちょっと私にそれを見せてください（確認させて）。",
        english: "Let me take a look.",
        hints: "Let me take a look",
        scene: "tech",
        explanation: "相手のエラー画面や資料を「どれどれ、一度私の目で直接確認させて」と介入する際の開発現場必須フレーズです。"
      },
      {
        japanese: "私たちが報告書をまとめます。",
        english: "We'll put together a report.",
        hints: "put together a report",
        scene: "business",
        explanation: "散らばったデータや情報を1本に「まとめあげる」作業を put together で表しています。"
      },
      {
        japanese: "会議を来週に延期しましょう。",
        english: "Let's put off the meeting until next week.",
        hints: "put off the meeting until...",
        scene: "business",
        explanation: "put off + until（〜まで延期する）はチャットで postpone より気軽に使える定番です。"
      }
    ]
  },
  basic_verb_come_go_make: {
    name: "基本動詞 come / go / make の用法",
    group: "idioms",
    description: "come up with / come across / go through (詳しく確認する) / go over (復習) / make sense / make sure / make it",
    formula: "come up with + 名詞 / go through + 名詞 / make sure + S + V / make it",
    nuance: "come（良いアイデアが浮かぶ）、go（確認して抜ける、復習する）、make（理にかなう、確実にセーブする、間に合う）を表現します。",
    pitfall: "make sure の後ろは、通例 and などの接続詞なしで「make sure you save it」と直接 S+V が続く形になります。",
    techTip: "「仕様書を詳しく確認しましょう」「それは理にかなっていますね」など、コードレビューやミーティングの舵取りで必須です。",
    examples: [
      {
        japanese: "ドキュメント（資料）を詳しく確認しましょう。",
        english: "Let's go through the document.",
        hints: "Let's go through the document...",
        scene: "business",
        explanation: "go through は、仕様書や重要文書の内容を最初から最後まで「一字一句漏らさずにしっかりとチェック・確認しよう」と促す表現です。"
      },
      {
        japanese: "それは理にかなっています（なるほど）。",
        english: "That makes sense.",
        hints: "That makes sense",
        scene: "daily",
        explanation: "相手の説明がロジカルで納得できるものである、という理解・同意をネイティブらしく伝える最強の相槌です。"
      },
      {
        japanese: "確実に保存するようにしてください。",
        english: "Make sure you save it.",
        hints: "Make sure you save it...",
        scene: "tech",
        explanation: "確実性のセーブ（make sure you do）を、丁寧さを損なわず念押しする技術現場大定番です。"
      },
      {
        japanese: "彼は素晴らしい解決策を思いつきました。",
        english: "He came up with a great solution.",
        hints: "came up with a great solution",
        scene: "tech",
        explanation: "come up with は、頭の中からアイデアや解決策が「浮かび上がってくる」イメージのイディオムです。"
      },
      {
        japanese: "なんとか終電に間に合いました。",
        english: "I made it to the last train.",
        hints: "made it to the last train",
        scene: "daily",
        explanation: "make it は「間に合う・たどり着く・うまくやり遂げる」を一言で表す超万能ネイティブ表現です。"
      }
    ]
  },
  native_daily_idioms: {
    name: "ネイティブ日常・重要イディオム",
    group: "idioms",
    description: "hang out / figure out / find out / work out / check out / point out / run into / catch up / bring up / show up / keep me posted",
    formula: "figure out + 名詞 / run into + [人] / catch up / keep me posted on",
    nuance: "ネイティブがSlackやチャット、日々のコーヒーブレイクで連発する、臨場感溢れる極めて口語的な表現です。",
    pitfall: "大人が「誰かと遊ぶ」時は play ではなく必ず `hang out` を使います。playを使うと非常に幼児っぽくなるので注意してください。",
    techTip: "「私たちは根本原因を解明する必要がある（figure out）」「何かアップデートがあったら逐一知らせて（keep me posted）」などの現場対話です。",
    examples: [
      {
        japanese: "私たちは根本原因を解明する必要があります。",
        english: "We need to figure out the root cause.",
        hints: "figure out the root cause",
        scene: "tech",
        explanation: "figure out は、複雑に入り組んだ root cause（根本原因）をロジカルに調査して特定・解明するイメージを持ちます。"
      },
      {
        japanese: "すべてうまくいきました。",
        english: "It worked out.",
        hints: "It worked out",
        scene: "daily",
        explanation: "様々な紆余曲折を経て、最終的に物事がハッピーエンドに落ち着いた（worked out）ことを伝える強力な表現です。"
      },
      {
        japanese: "（久しぶりに会って）近況を話しましょう。",
        english: "Let's catch up.",
        hints: "Let's catch up",
        scene: "daily",
        explanation: "しばらく会っていなかった人と、積もる話をしたり、お互いの最新進捗を共有しようと会話を持ちかける際の定番です。"
      },
      {
        japanese: "何か進捗があれば逐一知らせてください。",
        english: "Please keep me posted on any updates.",
        hints: "keep me posted on...",
        scene: "business",
        explanation: "相手に対して「状況が変わったらポスト（知らせて）し続けてほしい」という、進行中のタスクの連絡依頼の超重要表現です。"
      },
      {
        japanese: "その設定に問題があることが分かりました。",
        english: "I found out there was a problem with the configuration.",
        hints: "found out there was a problem...",
        scene: "tech",
        explanation: "find out は調査や偶然によって「事実を突き止める・知る」イメージ。figure out（考えて解明）との違いに注目です。"
      },
      {
        japanese: "昨日、駅で偶然旧友に会いました。",
        english: "I ran into an old friend at the station yesterday.",
        hints: "ran into an old friend...",
        scene: "daily",
        explanation: "run into は「予期せずばったり出会う」を表す定番イディオムです。"
      }
    ]
  },
  fillers_reactions: {
    name: "会話のつなぎ・即座の相づち",
    group: "idioms",
    description: "Actually / By the way / Speaking of which / In fact / Exactly / Absolutely / Definitely / Sounds good / Fair enough / Let me check",
    formula: "Actually, + [文] / Exactly. / Absolutely. / Fair enough.",
    nuance: "反対意見をソフトに切り出すクッションや、相手の意見へのインテリジェントな100%同意、話題転換のための潤滑油です。",
    pitfall: "Actually は「実は」と訳されますが、相手の想定や直前の前言を「やんわりと訂正する・真実を語る」時に使われます。対立を避けるクッションです。",
    techTip: "「おっしゃる通り！」「それも一理ありますね」「ところで、例の件はどうなった？」など、チャットやZoomで最も発話頻度の高い重要反応パーツです。",
    examples: [
      {
        japanese: "実は、私は（その意見に）反対です。",
        english: "Actually, I disagree.",
        hints: "Actually, I disagree",
        scene: "business",
        explanation: "相手の直前の発言に対して、「実を言うと、私は反対の考えです」と丁寧かつ明確にクッションを置いて意見を述べています。"
      },
      {
        japanese: "ところで、旅行はどうでしたか？",
        english: "By the way, how was your trip?",
        hints: "By the way, how was...",
        scene: "daily",
        explanation: "雑談の中で、文脈を完全に変えて新しい話題へとジャンプする By the way の代表例です。"
      },
      {
        japanese: "いいですね、その案で行きましょう。",
        english: "Sounds good. Let's go with that plan.",
        hints: "Sounds good. Let's go with...",
        scene: "business",
        explanation: "Sounds good（いいね）+ go with（〜を採用する）は、チャットで提案を快諾する黄金コンビです。"
      },
      {
        japanese: "なるほど、それも一理ありますね。",
        english: "Fair enough.",
        hints: "Fair enough.",
        scene: "daily",
        explanation: "完全同意ではないが「あなたの言い分はもっともだ」と認める、大人の相づちです。"
      }
    ]
  }
};

// 追加例文（学習パート増量分）を各カテゴリにマージする
Object.entries(ADDITIONAL_EXAMPLES).forEach(([key, examples]) => {
  if (GRAMMAR_CATEGORIES[key]) {
    GRAMMAR_CATEGORIES[key].examples.push(...examples);
  }
});

// 設定画面・学習画面で使う文法グループ定義
export const GRAMMAR_GROUPS = {
  grammar: {
    title: "文法・基本文型",
    keys: Object.keys(GRAMMAR_CATEGORIES).filter(k => GRAMMAR_CATEGORIES[k].group === 'grammar')
  },
  phrases: {
    title: "重要構文・表現の型",
    keys: Object.keys(GRAMMAR_CATEGORIES).filter(k => GRAMMAR_CATEGORIES[k].group === 'phrases')
  },
  idioms: {
    title: "動詞・イディオム・会話表現",
    keys: Object.keys(GRAMMAR_CATEGORIES).filter(k => GRAMMAR_CATEGORIES[k].group === 'idioms')
  }
};

// 問題の一意キー: 和文テキストをそのまま使う（DB進捗との紐付けに利用）
export function questionKeyOf(question) {
  return question.japanese;
}

// 全カテゴリの例文をフラットな問題リストに展開する
export function buildQuestionPool(categoryKeys, scene) {
  const pool = [];
  categoryKeys.forEach(catKey => {
    const cat = GRAMMAR_CATEGORIES[catKey];
    if (!cat) return;
    cat.examples.forEach(item => {
      if (scene === 'all' || item.scene === scene) {
        pool.push({ ...item, categoryName: cat.name, categoryKey: catKey });
      }
    });
  });
  return pool;
}

// question_key から問題本体を引くためのルックアップマップ
export const QUESTION_LOOKUP = (() => {
  const map = new Map();
  Object.entries(GRAMMAR_CATEGORIES).forEach(([catKey, cat]) => {
    cat.examples.forEach(item => {
      map.set(item.japanese, { ...item, categoryName: cat.name, categoryKey: catKey });
    });
  });
  return map;
})();
