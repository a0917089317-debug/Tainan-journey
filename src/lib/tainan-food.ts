export type FoodDistrict = {
  name: string;
  // Label position on /images/台南市分區地圖.png (595×515), in pixels.
  x: number;
  y: number;
  foods: string[];
};

export const FOOD_MAP_SIZE = { width: 595, height: 515 };

export const foodDistricts: FoodDistrict[] = [
  { name: "後壁", x: 300, y: 50, foods: ["後壁稻米（無米樂）"] },
  { name: "白河", x: 403, y: 57, foods: ["白河蓮子", "蓮藕粉"] },
  { name: "鹽水", x: 212, y: 103, foods: ["鹽水意麵"] },
  { name: "新營", x: 268, y: 100, foods: [] },
  { name: "柳營", x: 285, y: 130, foods: ["柳營鮮乳"] },
  { name: "東山", x: 393, y: 130, foods: ["東山咖啡", "龍眼乾"] },
  { name: "北門", x: 83, y: 128, foods: [] },
  { name: "學甲", x: 140, y: 155, foods: ["虱目魚"] },
  { name: "將軍", x: 70, y: 190, foods: [] },
  { name: "下營", x: 222, y: 175, foods: ["下營黑豆"] },
  { name: "六甲", x: 327, y: 180, foods: [] },
  { name: "麻豆", x: 202, y: 215, foods: ["麻豆文旦", "麻豆碗粿"] },
  { name: "官田", x: 298, y: 210, foods: ["官田菱角"] },
  { name: "楠西", x: 460, y: 225, foods: ["梅嶺梅子", "楊桃"] },
  { name: "佳里", x: 140, y: 228, foods: [] },
  { name: "七股", x: 68, y: 262, foods: ["虱目魚", "七股牡蠣"] },
  { name: "西港", x: 168, y: 267, foods: [] },
  { name: "善化", x: 255, y: 260, foods: ["善化胡麻油"] },
  { name: "大內", x: 342, y: 262, foods: ["大內酪梨"] },
  { name: "玉井", x: 415, y: 287, foods: ["玉井芒果冰", "愛文芒果"] },
  { name: "安定", x: 185, y: 302, foods: [] },
  { name: "新市", x: 245, y: 313, foods: [] },
  { name: "山上", x: 320, y: 308, foods: [] },
  { name: "南化", x: 485, y: 308, foods: ["南化芒果", "龍眼"] },
  { name: "安南", x: 118, y: 345, foods: [] },
  { name: "永康", x: 216, y: 365, foods: [] },
  { name: "新化", x: 290, y: 358, foods: [] },
  { name: "左鎮", x: 368, y: 367, foods: [] },
  { name: "北區", x: 139, y: 375, foods: [] },
  {
    name: "中西區",
    x: 139,
    y: 395,
    foods: ["度小月擔仔麵", "阿堂鹹粥", "富盛號碗粿", "福記肉圓", "赤崁棺材板"],
  },
  {
    name: "安平",
    x: 112,
    y: 405,
    foods: ["文章牛肉湯", "阿財牛肉湯", "丹丹漢堡平豐店", "王氏魚皮", "牛園火鍋", "慶平海產"],
  },
  { name: "東區", x: 190, y: 403, foods: [] },
  { name: "南區", x: 125, y: 433, foods: [] },
  { name: "仁德", x: 190, y: 445, foods: [] },
  { name: "歸仁", x: 251, y: 437, foods: [] },
  { name: "關廟", x: 292, y: 414, foods: ["關廟麵", "關廟鳳梨"] },
  { name: "龍崎", x: 331, y: 443, foods: ["龍崎竹筍"] },
];
