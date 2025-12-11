// /data/plantLayoutData.ts
// 식별/제어를 위한 타입과 전체 데이터
// ─────────────────────────────────────────────────────────

export type Family = "FR" | "FL";

export interface PlantBox {
  id: string;        // 고유 식별자 (code-count-순번)
  family: Family;    // FR | FL
  code: string;      // FR04, FL07 ...
  count: number;     // 숫자 라벨(1,2,3...)
  x: number;         // SVG 좌표
  y: number;
  w: number;         // width
  h: number;         // height
  color: string;     // 박스 색상
}

// 팔레트(이미지 기준)
const COLORS = {
  orange: "#ffa008",  // FL02 등
  blue:   "#48beff",  // FR 박스 외곽/측면
  pink:   "#ef73f9",  // 다수 FR/FL 라벨 박스
  yellow: "#fffa4d",  // 일부 FR/FL 라벨
  green:  "#53ed20",  // FR07/FL05/FL06 계열
  white:  "#ffffff",
} as const;

// ----------------------------------------------------------------------
// 이하: 이미지/제공 SVG에 등장하는, "라벨이 붙은 모든 박스"를 데이터화
// (FR, FL 전부 포함; x,y,w,h,count,color 수치는 이미지 기준 그대로)
// ----------------------------------------------------------------------

export const plantBoxes: PlantBox[] = [
  // ========== 좌측 바깥 세로 라인 ==========
  // FR10 세로 박스 2개
  { id: "FR10-side-1", family: "FR", code: "FR10", count: 1, x: 37.92, y: 140.89, w: 83.62, h: 66.90, color: COLORS.blue },
  { id: "FR10-side-2", family: "FR", code: "FR10", count: 1, x: 37.92, y: 244.06, w: 83.62, h: 66.90, color: COLORS.blue },

  // ========== 상단 GR5 영역 좌측 ~ 중앙 ==========
  // FR09 상단 묶음
  { id: "FR09-1", family: "FR", code: "FR09", count: 1, x: 198.16, y: 126.66, w: 35.19, h: 22.82, color: COLORS.pink },
  { id: "FR09-2", family: "FR", code: "FR09", count: 2, x: 293.13, y: 95.22,  w: 35.19, h: 22.82, color: COLORS.yellow },
  { id: "FR09-3", family: "FR", code: "FR09", count: 3, x: 353.37, y: 201.37, w: 22.12, h: 35.02, color: COLORS.pink },
  { id: "FR09-4", family: "FR", code: "FR09", count: 4, x: 233.35, y: 206.45, w: 35.19, h: 22.82, color: COLORS.pink },
  { id: "FR09-5", family: "FR", code: "FR09", count: 5, x: 274.46, y: 53.50,  w: 22.82, h: 32.93, color: COLORS.pink },
  { id: "FR09-7", family: "FR", code: "FR09", count: 7, x: 293.13, y: 126.66, w: 35.19, h: 22.82, color: COLORS.pink },
  // FR09 가로 큰 라벨
  { id: "FR09-long", family: "FR", code: "FR09", count: 0, x: 265.34, y: 182.05, w: 69.68, h: 22.82, color: COLORS.pink },
  // FR09 보조(왼쪽 세로)
  { id: "FR09-left-2", family: "FR", code: "FR09", count: 2, x: 176.55, y: 149.48, w: 21.60, h: 33.10, color: COLORS.pink },
  { id: "FR09-left-3", family: "FR", code: "FR09", count: 3, x: 198.16, y: 182.58, w: 35.19, h: 22.82, color: COLORS.pink },
  { id: "FR09-left-1", family: "FR", code: "FR09", count: 1, x: 180.56, y: 212.90, w: 35.19, h: 22.82, color: COLORS.yellow },

  // FR08(중앙부 근처)
  { id: "FR08-1a", family: "FR", code: "FR08", count: 1, x: 495.18, y: 182.93, w: 51.74, h: 23.52, color: COLORS.pink },
  { id: "FR08-1b", family: "FR", code: "FR08", count: 1, x: 495.63, y: 212.90, w: 32.23, h: 23.52, color: COLORS.yellow },
  { id: "FR08-2a", family: "FR", code: "FR08", count: 2, x: 446.87, y: 210.95, w: 21.25, h: 25.43, color: COLORS.pink },
  { id: "FR08-2b", family: "FR", code: "FR08", count: 2, x: 575.08, y: 212.02, w: 35.71, h: 22.82, color: COLORS.pink }, // (이미지 두번째 버전 좌표에서 보정된 값)

  // FR07 (초록/주황 3단)
  { id: "FR07-1-big", family: "FR", code: "FR07", count: 1, x: 715.38, y: 144.95, w: 22.36, h: 34.96, color: COLORS.yellow },
  { id: "FR07-2-big", family: "FR", code: "FR07", count: 2, x: 597.85, y: 218.60, w: 111.00, h: 21.11, color: COLORS.green },
  { id: "FR07-1-mid", family: "FR", code: "FR07", count: 1, x: 597.85, y: 193.60, w: 111.00, h: 21.11, color: COLORS.orange },
  { id: "FR07-3-col", family: "FR", code: "FR07", count: 3, x: 715.38, y: 96.06,  w: 22.36, h: 34.96, color: COLORS.green },
  { id: "FR07-4-col", family: "FR", code: "FR07", count: 4, x: 715.38, y: 39.73,  w: 22.36, h: 34.96, color: COLORS.green },
  // FR07 상단 작은 1/2 (100대)
  { id: "FR07-1-top", family: "FR", code: "FR07", count: 1, x: 631.06, y: 100.88, w: 23.69, h: 20.30, color: COLORS.pink },
  { id: "FR07-2-top", family: "FR", code: "FR07", count: 2, x: 631.06, y: 124.66, w: 18.90, h: 20.30, color: COLORS.yellow },

  // FR06 묶음
  { id: "FR06-1", family: "FR", code: "FR06", count: 1, x: 846.32, y: 145.90, w: 20.61, h: 34.70, color: COLORS.yellow },
  { id: "FR06-1b", family: "FR", code: "FR06", count: 1, x: 757.89, y: 130.36, w: 23.69, h: 34.90, color: COLORS.pink },
  { id: "FR06-2", family: "FR", code: "FR06", count: 2, x: 757.89, y: 61.86,  w: 23.69, h: 34.90, color: COLORS.pink },
  { id: "FR06-3", family: "FR", code: "FR06", count: 3, x: 786.92, y: 91.94,  w: 35.83, h: 23.95, color: COLORS.pink },
  { id: "FR06-1c", family: "FR", code: "FR06", count: 1, x: 786.92, y: 55.35,  w: 35.83, h: 23.95, color: COLORS.pink },

  // FR05 상단 가는 1/2/3/4
  { id: "FR05-3", family: "FR", code: "FR05", count: 3, x: 869.32, y: 55.35,  w: 20.09, h: 13.01, color: COLORS.pink },
  { id: "FR05-4", family: "FR", code: "FR05", count: 4, x: 894.55, y: 67.33,  w: 13.41, h: 18.80, color: COLORS.pink },
  { id: "FR05-2", family: "FR", code: "FR05", count: 2, x: 957.30, y: 55.35,  w: 31.07, h: 13.01, color: COLORS.pink },
  { id: "FR05-1", family: "FR", code: "FR05", count: 1, x: 990.75, y: 55.35,  w: 31.07, h: 13.01, color: COLORS.pink },

  // FR04 상단 레일 1/2/3 + 하단 1/3 블록
  { id: "FR04-rail-1", family: "FR", code: "FR04", count: 1, x: 1064.78, y: 27.31, w: 121.31, h: 9.99,  color: COLORS.blue },
  { id: "FR04-rail-2", family: "FR", code: "FR04", count: 2, x: 1089.35, y: 56.92, w: 121.31, h: 9.99,  color: COLORS.blue },
  { id: "FR04-rail-3", family: "FR", code: "FR04", count: 3, x: 1069.49, y: 96.12, w: 132.81, h: 13.47, color: COLORS.blue },
  // 하부 1/2(작은 보라), 중앙 3(큰 보라) + 하부 노랑 1
  { id: "FR04-1-small", family: "FR", code: "FR04", count: 1, x: 1042.08, y: 126.20, w: 70.32, h: 16.32, color: COLORS.pink },
  { id: "FR04-2-small", family: "FR", code: "FR04", count: 2, x: 1124.31, y: 126.20, w: 70.32, h: 16.32, color: COLORS.pink },
  { id: "FR04-3-big", family: "FR", code: "FR04", count: 3, x: 1048.58, y: 173.81, w: 83.10, h: 41.40, color: COLORS.pink },
  { id: "FR04-1-bottom", family: "FR", code: "FR04", count: 1, x: 1048.58, y: 218.18, w: 83.10, h: 21.66, color: COLORS.yellow },

  // FR02 (우측 상단 안쪽 1, 하단 1/2)
  { id: "FR02-1-top", family: "FR", code: "FR02", count: 1, x: 1359.84, y: 118.04, w: 20.61, h: 34.70, color: COLORS.green },
  { id: "FR02-1-mid", family: "FR", code: "FR02", count: 1, x: 1359.84, y: 161.36, w: 20.61, h: 34.70, color: COLORS.orange },
  { id: "FR02-2-mid", family: "FR", code: "FR02", count: 2, x: 1383.88, y: 216.29, w: 34.09, h: 21.11, color: COLORS.orange },

  // FR03 (우상단 흰 블록 타이틀 영역 - 고정 박스)
  { id: "FR03-box", family: "FR", code: "FR03", count: 0, x: 1336.55, y: 10.23, w: 116.60, h: 53.19, color: COLORS.white },

  // FR01 (맨 우측 바깥 파란 박스)
  { id: "FR01-side", family: "FR", code: "FR01", count: 0, x: 1555.12, y: 107.44, w: 88.24, h: 104.06, color: COLORS.blue },

  // ========== 중단 로드(그레이) 위 작은 라벨들 ==========
  // FR06 / FL06 / FL07 짧은 라벨들
  { id: "FL07-2-mid", family: "FL", code: "FL07", count: 2, x: 640.76, y: 289.66, w: 36.64, h: 24.80, color: COLORS.pink },
  { id: "FL07-1-mid", family: "FL", code: "FL07", count: 1, x: 696.74, y: 286.53, w: 16.43, h: 19.40, color: COLORS.yellow },
  { id: "FL07-3-mid", family: "FL", code: "FL07", count: 3, x: 680.31, y: 286.53, w: 16.43, h: 19.40, color: COLORS.pink },

  { id: "FL06-1a", family: "FL", code: "FL06", count: 1, x: 723.51, y: 286.53, w: 31.81, h: 20.40, color: COLORS.yellow },
  { id: "FL06-2a", family: "FL", code: "FL06", count: 2, x: 757.12, y: 286.53, w: 31.81, h: 20.40, color: COLORS.pink },
  { id: "FL06-1b", family: "FL", code: "FL06", count: 1, x: 790.73, y: 286.53, w: 31.81, h: 20.40, color: COLORS.yellow },

  // FL08 상단 로우
  { id: "FL08-1-long-1", family: "FL", code: "FL08", count: 1, x: 292.52, y: 291.64, w: 73.34, h: 22.82, color: COLORS.yellow },
  { id: "FL08-1-long-2", family: "FL", code: "FL08", count: 1, x: 369.17, y: 291.64, w: 110.97, h: 22.82, color: COLORS.pink },
  { id: "FL08-2-short", family: "FL", code: "FL08", count: 2, x: 497.39, y: 287.92, w: 35.71, h: 22.82, color: COLORS.pink },

  // FL07 세로 스템(작은)
  { id: "FL07-stem", family: "FL", code: "FL07", count: 0, x: 621.25, y: 286.53, w: 15.39, h: 40.30, color: COLORS.pink },

  // FL09 상부 1
  { id: "FL09-1-top", family: "FL", code: "FL09", count: 1, x: 228.41, y: 286.30, w: 35.19, h: 22.82, color: COLORS.yellow },

  // ========== 하단 GR2 주변 ==========
  // 좌하단 FL09 묶음
  { id: "FL09-1", family: "FL", code: "FL09", count: 1, x: 185.38, y: 295.24, w: 35.19, h: 22.82, color: COLORS.pink },
  { id: "FL09-2", family: "FL", code: "FL09", count: 2, x: 178.18, y: 359.35, w: 35.19, h: 22.82, color: COLORS.pink },
  { id: "FL09-3", family: "FL", code: "FL09", count: 3, x: 194.44, y: 414.86, w: 18.93, h: 43.78, color: COLORS.pink },
  { id: "FL09-4", family: "FL", code: "FL09", count: 4, x: 220.34, y: 451.33, w: 21.95, h: 24.04, color: COLORS.pink },
  { id: "FL09-5", family: "FL", code: "FL09", count: 5, x: 265.63, y: 451.33, w: 21.95, h: 24.04, color: COLORS.pink },
  { id: "FL09-6", family: "FL", code: "FL09", count: 6, x: 310.93, y: 451.33, w: 21.95, h: 24.04, color: COLORS.pink },

  // 중앙 하단 큰 FL08 (보라 큰 박스)
  { id: "FL08-3-big", family: "FL", code: "FL08", count: 3, x: 433.10, y: 396.70, w: 120.00, h: 85.00, color: COLORS.pink },

  // 우하단 개별 FL06 (초록 두 개)
  { id: "FL06-1c", family: "FL", code: "FL06", count: 1, x: 973.20, y: 410.50, w: 36.99, h: 23.98, color: COLORS.green },
  { id: "FL06-2c", family: "FL", code: "FL06", count: 2, x: 973.20, y: 446.10, w: 36.99, h: 23.98, color: COLORS.green },

  // 우측 하단 FL05 블록 3개(주황/초록 큰 덩어리 + 하단 바)
  { id: "FL05-1-block", family: "FL", code: "FL05", count: 1, x: 1066.20, y: 466.80, w: 120.00, h: 85.00, color: COLORS.orange },
  { id: "FL05-3-block", family: "FL", code: "FL05", count: 3, x: 1187.00, y: 466.80, w: 60.00,  h: 85.00, color: COLORS.green },
  // 하단 레일 라벨들
  { id: "FL06-rail", family: "FL", code: "FL06", count: 0, x: 1006.00, y: 635.00, w: 60.00,  h: 20.00, color: COLORS.blue },
  { id: "FL05-rail", family: "FL", code: "FL05", count: 0, x: 1206.00, y: 635.00, w: 60.00,  h: 20.00, color: COLORS.blue },
  { id: "FL07-rail", family: "FL", code: "FL07", count: 0, x: 818.00,  y: 635.00, w: 60.00,  h: 20.00, color: COLORS.blue },

  // 중앙 오른쪽(형합 좌측) 작은 FL05 1/2
  { id: "FL05-1-small", family: "FL", code: "FL05", count: 1, x: 1208.90, y: 335.80, w: 36.99, h: 23.98, color: COLORS.green },
  { id: "FL05-2-small", family: "FL", code: "FL05", count: 2, x: 1208.90, y: 370.50, w: 36.99, h: 23.98, color: COLORS.green },

  // 형합 아래 FL04 큰 블록 + 오른쪽 FL03 세트
  { id: "FL04-1-big", family: "FL", code: "FL04", count: 1, x: 1319.00, y: 520.00, w: 220.00, h: 60.00, color: COLORS.orange },
  { id: "FL03-1-small", family: "FL", code: "FL03", count: 1, x: 1536.00, y: 500.00, w: 36.99, h: 23.98, color: COLORS.green },
  { id: "FL03-2-small", family: "FL", code: "FL03", count: 2, x: 1596.00, y: 560.00, w: 36.99, h: 23.98, color: COLORS.orange },
  { id: "FL03-3-small", family: "FL", code: "FL03", count: 3, x: 1704.00, y: 560.00, w: 36.99, h: 23.98, color: COLORS.orange },

  // 우측 대형 FL02(상단/하단 분리 라벨)
  { id: "FL02-1-right", family: "FL", code: "FL02", count: 1, x: 1854.50, y: 441.50, w: 180.00, h: 28.00, color: COLORS.orange },
  { id: "FL02-2-right", family: "FL", code: "FL02", count: 2, x: 1854.50, y: 470.00, w: 180.00, h: 140.00, color: COLORS.orange },

  // 가장 우측 외곽 세로 FL01
  { id: "FL01-side", family: "FL", code: "FL01", count: 0, x: 1555.12, y: 359.70, w: 88.24, h: 65.04, color: COLORS.blue },
];

// ─────────────────────────────────────────────────────────
// 유틸: 코드별/패밀리별 그룹 접근이 필요하면 아래 helper를 쓰세요.
// ─────────────────────────────────────────────────────────
export const byCode = (code: string) => plantBoxes.filter(b => b.code === code);
export const byFamily = (family: Family) => plantBoxes.filter(b => b.family === family);
