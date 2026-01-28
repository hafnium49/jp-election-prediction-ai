import { ProportionalBlock } from "@/types";

export const PROPORTIONAL_BLOCKS: ProportionalBlock[] = [
  {
    id: "hokkaido",
    name: "北海道",
    nameEn: "Hokkaido",
    seats: 8,
    prefectureIds: ["hokkaido"],
  },
  {
    id: "tohoku",
    name: "東北",
    nameEn: "Tohoku",
    seats: 13,
    prefectureIds: ["aomori", "iwate", "miyagi", "akita", "yamagata", "fukushima"],
  },
  {
    id: "kitakanto",
    name: "北関東",
    nameEn: "Kita-Kanto",
    seats: 19,
    prefectureIds: ["ibaraki", "tochigi", "gunma", "saitama"],
  },
  {
    id: "minamikanto",
    name: "南関東",
    nameEn: "Minami-Kanto",
    seats: 22,
    prefectureIds: ["chiba", "kanagawa", "yamanashi"],
  },
  {
    id: "tokyo",
    name: "東京",
    nameEn: "Tokyo",
    seats: 17,
    prefectureIds: ["tokyo"],
  },
  {
    id: "hokurikushinetsu",
    name: "北陸信越",
    nameEn: "Hokuriku-Shin'etsu",
    seats: 11,
    prefectureIds: ["niigata", "toyama", "ishikawa", "fukui", "nagano"],
  },
  {
    id: "tokai",
    name: "東海",
    nameEn: "Tokai",
    seats: 21,
    prefectureIds: ["gifu", "shizuoka", "aichi", "mie"],
  },
  {
    id: "kinki",
    name: "近畿",
    nameEn: "Kinki",
    seats: 28,
    prefectureIds: ["shiga", "kyoto", "osaka", "hyogo", "nara", "wakayama"],
  },
  {
    id: "chugoku",
    name: "中国",
    nameEn: "Chugoku",
    seats: 11,
    prefectureIds: ["tottori", "shimane", "okayama", "hiroshima", "yamaguchi"],
  },
  {
    id: "shikoku",
    name: "四国",
    nameEn: "Shikoku",
    seats: 6,
    prefectureIds: ["tokushima", "kagawa", "ehime", "kochi"],
  },
  {
    id: "kyushu",
    name: "九州",
    nameEn: "Kyushu",
    seats: 20,
    prefectureIds: ["fukuoka", "saga", "nagasaki", "kumamoto", "oita", "miyazaki", "kagoshima", "okinawa"],
  },
];

export const getBlock = (id: string): ProportionalBlock | undefined => {
  return PROPORTIONAL_BLOCKS.find((b) => b.id === id);
};

// Total proportional seats: 176
export const TOTAL_PROPORTIONAL_SEATS = PROPORTIONAL_BLOCKS.reduce(
  (sum, b) => sum + b.seats,
  0
);

// Total seats in House of Representatives: 465
export const TOTAL_SEATS = 289 + TOTAL_PROPORTIONAL_SEATS;
export const MAJORITY_THRESHOLD = Math.floor(TOTAL_SEATS / 2) + 1; // 233
