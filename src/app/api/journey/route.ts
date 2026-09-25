import {
  countryLabels,
  destinations,
  lodgings,
  MAX_PEOPLE,
  transports,
  type JourneyRequest,
} from "@/lib/journey-options";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

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
內容務實精簡，使用清楚的標題與條列。`;

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "伺服器尚未設定 OPENAI_API_KEY" },
      { status: 500 },
    );
  }

  const parsed = parseRequest(await request.json().catch(() => null));
  if (typeof parsed === "string") {
    return Response.json({ error: parsed }, { status: 400 });
  }

  const res = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildPrompt(parsed) },
      ],
    }),
  });

  if (!res.ok) {
    console.error("OpenAI error", res.status, await res.text());
    return Response.json(
      { error: "AI 分析失敗，請稍後再試" },
      { status: 502 },
    );
  }

  const data = await res.json();
  const analysis: string = data.choices?.[0]?.message?.content ?? "";
  return Response.json({ analysis });
}
