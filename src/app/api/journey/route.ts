import {
  countryLabels,
  destinations,
  lodgings,
  MAX_PEOPLE,
  transports,
  type JourneyRequest,
  type DistrictHighlights,
  type RegionHighlights,
} from "@/lib/journey-options";
import { foodDistricts } from "@/lib/tainan-food";
import { OPENAI_KEY_HEADER } from "@/lib/openai-key";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

// Names we never show, even if the AI suggests them.
const EXCLUDED_NAMES = ["安平豆花"];
const EXCLUDE_RULE = `不要提到或推薦：${EXCLUDED_NAMES.join("、")}。`;

function parseRequest(body: unknown): JourneyRequest | string {
  if (typeof body !== "object" || body === null) return "請求格式錯誤";
  const b = body as Record<string, unknown>;

  if (b.country !== "taiwan" && b.country !== "japan") return "請選擇國家";
  const validNames = new Set(destinations[b.country].map((d) => d.name));
  if (
    !Array.isArray(b.destinations) ||
    b.destinations.length === 0 ||
    !b.destinations.every((d) => typeof d === "string" && validNames.has(d))
  ) {
    return "請至少選擇一個目的地";
  }
  if (!transports.some((t) => t.id === b.transport)) return "請選擇交通方式";
  if (!lodgings.some((l) => l.id === b.lodging)) return "請選擇住宿類型";
  if (
    typeof b.people !== "number" ||
    !Number.isInteger(b.people) ||
    b.people < 1 ||
    b.people > MAX_PEOPLE
  ) {
    return `人數需介於 1 到 ${MAX_PEOPLE} 人`;
  }

  return b as unknown as JourneyRequest;
}

function buildPrompt(req: JourneyRequest) {
  const spots = destinations[req.country]
    .filter((d) => req.destinations.includes(d.name))
    .map((d) => `${d.name}（知名景點：${d.spots}）`)
    .join("、");
  const transport = transports.find((t) => t.id === req.transport)!.label;
  const lodging = lodgings.find((l) => l.id === req.lodging)!.label;

  return [
    `旅遊地區：${countryLabels[req.country]}`,
    `想去的地方：${spots}`,
    `交通方式：${transport}${req.country === "japan" ? "（在日本，高鐵請以新幹線／JR 理解）" : ""}`,
    `住宿類型：${lodging}，共 ${req.people} 人`,
  ].join("\n");
}

const SYSTEM_PROMPT = `你是一位熟悉台灣與日本的旅遊規劃師，請用繁體中文回答。
根據使用者的選擇，提供：
1. 建議天數與每日行程（依地理位置安排順路的路線）
2. 交通分析：此交通方式在這些地點的優缺點、注意事項與大約花費
3. 住宿建議：推薦住在哪一區，以及該住宿類型在此人數下的大約每晚價格
4. 預估總預算（每人）
5. 貼心提醒
內容務實精簡，使用清楚的標題與條列。
${EXCLUDE_RULE}`;

export async function POST(request: Request) {
  // BYOK: the visitor's own key, sent per request. Never stored or logged here.
  const apiKey = request.headers.get(OPENAI_KEY_HEADER)?.trim();
  if (!apiKey) {
    return Response.json(
      { error: "請先在「API 設定」輸入你的 OpenAI API Key" },
      { status: 401 },
    );
  }

  const parsed = parseRequest(await request.json().catch(() => null));
  if (typeof parsed === "string") {
    return Response.json({ error: parsed }, { status: 400 });
  }

  const [analysis, highlights] = await Promise.all([
    chat(apiKey, SYSTEM_PROMPT, buildPrompt(parsed)),
    chat(apiKey, HIGHLIGHTS_PROMPT, parsed.destinations.join("、"), true)
      .then((r) => (typeof r === "string" ? parseHighlights(r) : []))
      .catch(() => []),
  ]);

  if (typeof analysis !== "string") {
    const { status } = analysis;
    if (status === 401) {
      return Response.json(
        { error: "OpenAI API Key 無效，請到「API 設定」重新確認" },
        { status: 401 },
      );
    }
    if (status === 429) {
      return Response.json(
        { error: "OpenAI 額度不足或請求太頻繁，請確認你的帳戶用量" },
        { status: 429 },
      );
    }
    return Response.json(
      { error: "AI 分析失敗，請稍後再試" },
      { status: 502 },
    );
  }

  return Response.json({
    analysis,
    highlights: mergeCuratedTainan(highlights),
  });
}

async function chat(
  apiKey: string,
  system: string,
  user: string,
  json = false,
): Promise<string | { status: number }> {
  const res = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      ...(json && { response_format: { type: "json_object" }, temperature: 0.2 }),
    }),
  });

  if (!res.ok) {
    // Status only: OpenAI's error body can echo part of the visitor's key.
    console.error("OpenAI error", res.status);
    return { status: res.status };
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

const HIGHLIGHTS_PROMPT = `你是在地旅遊達人，請用繁體中文回答。
使用者會給你幾個縣市（台灣）或都道府縣（日本）。針對每一個，挑出最值得去的 5～8 個行政區或地區，
每區列出 3～5 個知名景點（spots）與 3～5 家知名店家（foods）。
規則：
- 景點與店家必須確實位於該行政區內，不可把別區的放進來。
- foods 請給具體店名（例如「阿財牛肉湯」「度小月擔仔麵」），不要給泛稱（例如「海鮮粥」「鹽酥雞」）。
- 只列真實存在、確定知名的名稱；不確定就少列，寧缺勿濫，絕對不要編造。
- ${EXCLUDE_RULE}
只回傳 JSON，格式：
{"regions":[{"name":"台南市","districts":[{"name":"安平區","spots":["安平古堡"],"foods":["阿財牛肉湯"]}]}]}`;

function stringList(value: unknown, max: number): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === "string" && v.trim() !== "")
    .map((v) => v.trim().slice(0, 40))
    .filter((v) => !EXCLUDED_NAMES.some((name) => v.includes(name)))
    .slice(0, max);
}

function parseHighlights(text: string): RegionHighlights[] {
  try {
    const regions = JSON.parse(text)?.regions;
    if (!Array.isArray(regions)) return [];
    return regions
      .filter((r) => typeof r?.name === "string" && Array.isArray(r.districts))
      .map((r) => ({
        name: r.name,
        districts: r.districts
          .filter((d: unknown) => typeof (d as { name?: unknown })?.name === "string")
          .slice(0, 8)
          .map((d: { name: string; spots?: unknown; foods?: unknown }) => ({
            name: d.name,
            spots: stringList(d.spots, 8),
            foods: stringList(d.foods, 8),
          })),
      }));
  } catch {
    return [];
  }
}

// Fold our hand-curated Tainan list (e.g. 安平) into the AI result.
function mergeCuratedTainan(regions: RegionHighlights[]): RegionHighlights[] {
  const tainan = regions.find((r) => r.name.includes("台南") || r.name.includes("臺南"));
  if (!tainan) return regions;

  const added: DistrictHighlights[] = [];
  for (const curated of foodDistricts) {
    const spots = curated.spots ?? [];
    if (curated.foods.length === 0 && spots.length === 0) continue;

    const key = curated.name.replace(/區$/, "");
    let district = tainan.districts.find((d) => d.name.replace(/區$/, "") === key);
    if (!district) {
      district = { name: curated.name, spots: [], foods: [] };
      added.push(district);
    }
    district.spots = [...new Set([...spots, ...district.spots])];
    district.foods = [...new Set([...curated.foods, ...district.foods])];
  }
  // AI districts first, then curated extras; ones with spots (e.g. 安平) lead.
  added.sort((a, b) => b.spots.length - a.spots.length);
  tainan.districts.push(...added);
  return regions;
}
