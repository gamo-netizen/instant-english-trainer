// AI瞬間英作文: Gemini APIで新しい出題を生成するEdge Function
// APIキーはSupabaseのSecret (GEMINI_API_KEY) に保存し、クライアントには一切露出しない
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const MAX_COUNT = 15;
const MAX_EXCLUDE = 60;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      // キー未設定の場合はクライアント側でプリセット問題にフォールバックする
      return jsonResponse({ error: "not_configured" }, 503);
    }

    const { categories, scene, count, exclude } = await req.json();

    if (!Array.isArray(categories) || categories.length === 0) {
      return jsonResponse({ error: "invalid_request", detail: "categories is required" }, 400);
    }
    const safeCount = Math.min(Math.max(Number(count) || 5, 1), MAX_COUNT);
    const safeExclude = (Array.isArray(exclude) ? exclude : [])
      .slice(0, MAX_EXCLUDE)
      .map((item) => String(item));

    const sceneInstruction =
      scene === "tech"
        ? "engineering, software development, semiconductors, manufacturing"
        : scene === "business"
        ? "business meetings, negotiations, project management, office email"
        : scene === "daily"
        ? "daily life, casual conversation, networking, travel"
        : "a balanced mix of engineering/tech, business, and daily life";

    const categoryList = categories
      .map(
        (cat: { key: string; name: string; description?: string; formula?: string }) =>
          `- key: "${cat.key}" / name: "${cat.name}" / pattern: ${cat.formula ?? ""} (${cat.description ?? ""})`
      )
      .join("\n");

    const excludeBlock =
      safeExclude.length > 0
        ? `\nDo NOT reuse or closely paraphrase any of these previously used Japanese sentences:\n${safeExclude
            .map((s) => `- ${s}`)
            .join("\n")}`
        : "";

    const prompt = `You are a professional ESL teacher creating 瞬間英作文 (instant English composition) drills for a Japanese learner.

Generate exactly ${safeCount} NEW original questions. Requirements:
- Each question must target one of these grammar categories:
${categoryList}
- Scene/domain: ${sceneInstruction}
- The Japanese sentence must sound natural and be translatable in under 10 seconds by an intermediate learner.
- The English answer must clearly demonstrate the target grammar pattern.
- Vary topics, vocabulary, and sentence structures. Be creative so questions differ every session.${excludeBlock}

Output ONLY a JSON array with this exact structure (no surrounding text):
[
  {
    "japanese": "自然な和文",
    "english": "Correct English translation using the target grammar",
    "hints": "key phrase hint in English (partial sentence)",
    "explanation": "文法ポイントの簡潔な日本語解説（1〜2文）",
    "categoryKey": "the key of the grammar category used",
    "scene": "tech" | "business" | "daily"
  }
]`;

    const geminiRes = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 1.0,
        },
      }),
    });

    if (!geminiRes.ok) {
      const detail = await geminiRes.text();
      console.error("Gemini API error:", geminiRes.status, detail);
      return jsonResponse({ error: "gemini_error", status: geminiRes.status }, 502);
    }

    const data = await geminiRes.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return jsonResponse({ error: "empty_response" }, 502);
    }

    let questions: unknown;
    try {
      questions = JSON.parse(text);
    } catch {
      return jsonResponse({ error: "parse_error" }, 502);
    }
    if (!Array.isArray(questions)) {
      return jsonResponse({ error: "invalid_format" }, 502);
    }

    // 必須フィールドが揃った問題のみ返す
    const valid = questions.filter(
      (q: Record<string, unknown>) =>
        typeof q?.japanese === "string" &&
        q.japanese.length > 0 &&
        typeof q?.english === "string" &&
        q.english.length > 0
    );

    return jsonResponse({ questions: valid }, 200);
  } catch (err) {
    console.error("generate-questions internal error:", err);
    return jsonResponse({ error: "internal" }, 500);
  }
});
