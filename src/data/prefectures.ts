import { Prefecture } from "@/types";

export const PREFECTURES: Prefecture[] = [
  // Hokkaido
  { id: "hokkaido", name: "北海道", nameEn: "Hokkaido", region: "hokkaido", districtCount: 12, proportionalBlockId: "hokkaido" },

  // Tohoku
  { id: "aomori", name: "青森県", nameEn: "Aomori", region: "tohoku", districtCount: 3, proportionalBlockId: "tohoku" },
  { id: "iwate", name: "岩手県", nameEn: "Iwate", region: "tohoku", districtCount: 3, proportionalBlockId: "tohoku" },
  { id: "miyagi", name: "宮城県", nameEn: "Miyagi", region: "tohoku", districtCount: 5, proportionalBlockId: "tohoku" },
  { id: "akita", name: "秋田県", nameEn: "Akita", region: "tohoku", districtCount: 2, proportionalBlockId: "tohoku" },
  { id: "yamagata", name: "山形県", nameEn: "Yamagata", region: "tohoku", districtCount: 3, proportionalBlockId: "tohoku" },
  { id: "fukushima", name: "福島県", nameEn: "Fukushima", region: "tohoku", districtCount: 4, proportionalBlockId: "tohoku" },

  // Kita-Kanto
  { id: "ibaraki", name: "茨城県", nameEn: "Ibaraki", region: "kanto", districtCount: 7, proportionalBlockId: "kitakanto" },
  { id: "tochigi", name: "栃木県", nameEn: "Tochigi", region: "kanto", districtCount: 5, proportionalBlockId: "kitakanto" },
  { id: "gunma", name: "群馬県", nameEn: "Gunma", region: "kanto", districtCount: 5, proportionalBlockId: "kitakanto" },
  { id: "saitama", name: "埼玉県", nameEn: "Saitama", region: "kanto", districtCount: 16, proportionalBlockId: "kitakanto" },

  // Minami-Kanto
  { id: "chiba", name: "千葉県", nameEn: "Chiba", region: "kanto", districtCount: 14, proportionalBlockId: "minamikanto" },
  { id: "kanagawa", name: "神奈川県", nameEn: "Kanagawa", region: "kanto", districtCount: 20, proportionalBlockId: "minamikanto" },
  { id: "yamanashi", name: "山梨県", nameEn: "Yamanashi", region: "chubu", districtCount: 2, proportionalBlockId: "minamikanto" },

  // Tokyo
  { id: "tokyo", name: "東京都", nameEn: "Tokyo", region: "kanto", districtCount: 30, proportionalBlockId: "tokyo" },

  // Hokuriku-Shinetsu
  { id: "niigata", name: "新潟県", nameEn: "Niigata", region: "chubu", districtCount: 5, proportionalBlockId: "hokurikushinetsu" },
  { id: "toyama", name: "富山県", nameEn: "Toyama", region: "chubu", districtCount: 3, proportionalBlockId: "hokurikushinetsu" },
  { id: "ishikawa", name: "石川県", nameEn: "Ishikawa", region: "chubu", districtCount: 3, proportionalBlockId: "hokurikushinetsu" },
  { id: "fukui", name: "福井県", nameEn: "Fukui", region: "chubu", districtCount: 2, proportionalBlockId: "hokurikushinetsu" },
  { id: "nagano", name: "長野県", nameEn: "Nagano", region: "chubu", districtCount: 5, proportionalBlockId: "hokurikushinetsu" },

  // Tokai
  { id: "gifu", name: "岐阜県", nameEn: "Gifu", region: "chubu", districtCount: 5, proportionalBlockId: "tokai" },
  { id: "shizuoka", name: "静岡県", nameEn: "Shizuoka", region: "chubu", districtCount: 8, proportionalBlockId: "tokai" },
  { id: "aichi", name: "愛知県", nameEn: "Aichi", region: "chubu", districtCount: 16, proportionalBlockId: "tokai" },
  { id: "mie", name: "三重県", nameEn: "Mie", region: "kinki", districtCount: 4, proportionalBlockId: "tokai" },

  // Kinki
  { id: "shiga", name: "滋賀県", nameEn: "Shiga", region: "kinki", districtCount: 4, proportionalBlockId: "kinki" },
  { id: "kyoto", name: "京都府", nameEn: "Kyoto", region: "kinki", districtCount: 6, proportionalBlockId: "kinki" },
  { id: "osaka", name: "大阪府", nameEn: "Osaka", region: "kinki", districtCount: 19, proportionalBlockId: "kinki" },
  { id: "hyogo", name: "兵庫県", nameEn: "Hyogo", region: "kinki", districtCount: 12, proportionalBlockId: "kinki" },
  { id: "nara", name: "奈良県", nameEn: "Nara", region: "kinki", districtCount: 3, proportionalBlockId: "kinki" },
  { id: "wakayama", name: "和歌山県", nameEn: "Wakayama", region: "kinki", districtCount: 2, proportionalBlockId: "kinki" },

  // Chugoku
  { id: "tottori", name: "鳥取県", nameEn: "Tottori", region: "chugoku", districtCount: 2, proportionalBlockId: "chugoku" },
  { id: "shimane", name: "島根県", nameEn: "Shimane", region: "chugoku", districtCount: 2, proportionalBlockId: "chugoku" },
  { id: "okayama", name: "岡山県", nameEn: "Okayama", region: "chugoku", districtCount: 5, proportionalBlockId: "chugoku" },
  { id: "hiroshima", name: "広島県", nameEn: "Hiroshima", region: "chugoku", districtCount: 7, proportionalBlockId: "chugoku" },
  { id: "yamaguchi", name: "山口県", nameEn: "Yamaguchi", region: "chugoku", districtCount: 4, proportionalBlockId: "chugoku" },

  // Shikoku
  { id: "tokushima", name: "徳島県", nameEn: "Tokushima", region: "shikoku", districtCount: 2, proportionalBlockId: "shikoku" },
  { id: "kagawa", name: "香川県", nameEn: "Kagawa", region: "shikoku", districtCount: 3, proportionalBlockId: "shikoku" },
  { id: "ehime", name: "愛媛県", nameEn: "Ehime", region: "shikoku", districtCount: 4, proportionalBlockId: "shikoku" },
  { id: "kochi", name: "高知県", nameEn: "Kochi", region: "shikoku", districtCount: 2, proportionalBlockId: "shikoku" },

  // Kyushu
  { id: "fukuoka", name: "福岡県", nameEn: "Fukuoka", region: "kyushu", districtCount: 11, proportionalBlockId: "kyushu" },
  { id: "saga", name: "佐賀県", nameEn: "Saga", region: "kyushu", districtCount: 2, proportionalBlockId: "kyushu" },
  { id: "nagasaki", name: "長崎県", nameEn: "Nagasaki", region: "kyushu", districtCount: 3, proportionalBlockId: "kyushu" },
  { id: "kumamoto", name: "熊本県", nameEn: "Kumamoto", region: "kyushu", districtCount: 4, proportionalBlockId: "kyushu" },
  { id: "oita", name: "大分県", nameEn: "Oita", region: "kyushu", districtCount: 3, proportionalBlockId: "kyushu" },
  { id: "miyazaki", name: "宮崎県", nameEn: "Miyazaki", region: "kyushu", districtCount: 3, proportionalBlockId: "kyushu" },
  { id: "kagoshima", name: "鹿児島県", nameEn: "Kagoshima", region: "kyushu", districtCount: 4, proportionalBlockId: "kyushu" },
  { id: "okinawa", name: "沖縄県", nameEn: "Okinawa", region: "kyushu", districtCount: 4, proportionalBlockId: "kyushu" },
];

export const getPrefecture = (id: string): Prefecture | undefined => {
  return PREFECTURES.find((p) => p.id === id);
};

export const getPrefecturesByBlock = (blockId: string): Prefecture[] => {
  return PREFECTURES.filter((p) => p.proportionalBlockId === blockId);
};

export const getPrefecturesByRegion = (region: string): Prefecture[] => {
  return PREFECTURES.filter((p) => p.region === region);
};

// Total districts: 289
export const TOTAL_DISTRICTS = PREFECTURES.reduce((sum, p) => sum + p.districtCount, 0);
