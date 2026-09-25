export type Country = "taiwan" | "japan";

export type Destination = { name: string; spots: string };

export const destinations: Record<Country, Destination[]> = {
  taiwan: [
    { name: "台北市", spots: "台北101、故宮、士林夜市" },
    { name: "新北市", spots: "九份、十分、淡水老街" },
    { name: "基隆市", spots: "廟口夜市、和平島、正濱漁港" },
    { name: "桃園市", spots: "大溪老街、石門水庫、拉拉山" },
    { name: "新竹市", spots: "城隍廟、十七公里海岸線" },
    { name: "新竹縣", spots: "內灣老街、司馬庫斯" },
    { name: "苗栗縣", spots: "勝興車站、南庄老街" },
    { name: "台中市", spots: "高美濕地、審計新村、逢甲夜市" },
    { name: "彰化縣", spots: "鹿港老街、扇形車庫" },
    { name: "南投縣", spots: "日月潭、清境農場、合歡山" },
    { name: "雲林縣", spots: "北港朝天宮、劍湖山" },
    { name: "嘉義市", spots: "檜意森活村、文化路夜市" },
    { name: "嘉義縣", spots: "阿里山、奮起湖" },
    { name: "台南市", spots: "安平古堡、赤崁樓、神農街" },
    { name: "高雄市", spots: "駁二、旗津、蓮池潭" },
    { name: "屏東縣", spots: "墾丁、小琉球、恆春古城" },
    { name: "宜蘭縣", spots: "礁溪溫泉、太平山、龜山島" },
    { name: "花蓮縣", spots: "太魯閣、七星潭、清水斷崖" },
    { name: "台東縣", spots: "池上、三仙台、綠島、蘭嶼" },
    { name: "澎湖縣", spots: "雙心石滬、跨海大橋、花火節" },
    { name: "金門縣", spots: "莒光樓、翟山坑道、水頭聚落" },
    { name: "連江縣", spots: "馬祖藍眼淚、芹壁聚落" },
  ],
  japan: [
    { name: "北海道", spots: "札幌、小樽、富良野" },
    { name: "青森縣", spots: "奧入瀨溪流、弘前城" },
    { name: "岩手縣", spots: "中尊寺、嚴美溪" },
    { name: "宮城縣", spots: "仙台、松島" },
    { name: "秋田縣", spots: "角館、乳頭溫泉" },
    { name: "山形縣", spots: "銀山溫泉、藏王樹冰" },
    { name: "福島縣", spots: "大內宿、鶴之城" },
    { name: "茨城縣", spots: "國營常陸海濱公園" },
    { name: "栃木縣", spots: "日光東照宮、鬼怒川" },
    { name: "群馬縣", spots: "草津溫泉、伊香保" },
    { name: "埼玉縣", spots: "川越小江戶、秩父" },
    { name: "千葉縣", spots: "東京迪士尼、成田山" },
    { name: "東京都", spots: "淺草、澀谷、新宿" },
    { name: "神奈川縣", spots: "橫濱、鎌倉、箱根" },
    { name: "新潟縣", spots: "越後湯澤、佐渡島" },
    { name: "富山縣", spots: "立山黑部、雨晴海岸" },
    { name: "石川縣", spots: "金澤兼六園、東茶屋街" },
    { name: "福井縣", spots: "東尋坊、恐龍博物館" },
    { name: "山梨縣", spots: "河口湖、富士五湖" },
    { name: "長野縣", spots: "輕井澤、上高地、松本城" },
    { name: "岐阜縣", spots: "白川鄉合掌村、飛驒高山" },
    { name: "靜岡縣", spots: "富士山、熱海、伊豆" },
    { name: "愛知縣", spots: "名古屋城、吉卜力公園" },
    { name: "三重縣", spots: "伊勢神宮、鈴鹿" },
    { name: "滋賀縣", spots: "琵琶湖、彥根城" },
    { name: "京都府", spots: "清水寺、伏見稻荷、嵐山" },
    { name: "大阪府", spots: "道頓堀、大阪城、環球影城" },
    { name: "兵庫縣", spots: "神戶、姬路城、有馬溫泉" },
    { name: "奈良縣", spots: "奈良公園、東大寺" },
    { name: "和歌山縣", spots: "高野山、白濱、熊野古道" },
    { name: "鳥取縣", spots: "鳥取砂丘、柯南小鎮" },
    { name: "島根縣", spots: "出雲大社、松江城" },
    { name: "岡山縣", spots: "倉敷美觀地區、後樂園" },
    { name: "廣島縣", spots: "嚴島神社、原爆圓頂館" },
    { name: "山口縣", spots: "角島大橋、錦帶橋" },
    { name: "德島縣", spots: "鳴門漩渦、祖谷溪" },
    { name: "香川縣", spots: "直島、讚岐烏龍麵" },
    { name: "愛媛縣", spots: "道後溫泉、松山城" },
    { name: "高知縣", spots: "四萬十川、桂濱" },
    { name: "福岡縣", spots: "博多屋台、太宰府" },
    { name: "佐賀縣", spots: "嬉野溫泉、有田燒" },
    { name: "長崎縣", spots: "豪斯登堡、稻佐山夜景" },
    { name: "熊本縣", spots: "熊本城、阿蘇火山" },
    { name: "大分縣", spots: "別府地獄巡禮、由布院" },
    { name: "宮崎縣", spots: "高千穗峽、青島神社" },
    { name: "鹿兒島縣", spots: "櫻島、屋久島" },
    { name: "沖繩縣", spots: "美麗海水族館、國際通" },
  ],
};

export const countryLabels: Record<Country, string> = {
  taiwan: "全台灣",
  japan: "日本",
};

export const transports = [
  { id: "drive", label: "開車" },
  { id: "rail-rent", label: "搭火車／高鐵後，再租機車／汽車" },
  { id: "rail-public", label: "搭火車／高鐵後，再搭大眾運輸" },
] as const;

export const lodgings = [
  { id: "hostel", label: "背包客棧" },
  { id: "budget", label: "平價輕旅" },
  { id: "luxury", label: "高級旅店" },
] as const;

export type TransportId = (typeof transports)[number]["id"];
export type LodgingId = (typeof lodgings)[number]["id"];

export const MAX_PEOPLE = 20;

export type JourneyRequest = {
  country: Country;
  destinations: string[];
  transport: TransportId;
  lodging: LodgingId;
  people: number;
};

export type DistrictHighlights = {
  name: string;
  spots: string[];
  foods: string[];
};

export type RegionHighlights = {
  name: string;
  districts: DistrictHighlights[];
};
