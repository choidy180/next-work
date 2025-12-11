export type Status = "ok" | "warning" | "error" | "unknown";
export type Family = "FR" | "FL";

export interface BoxItem {
  id: string;
  family: Family;     // FR / FL
  x: number; y: number; w: number; h: number;
  rx?: number;
  count?: string;     // 좌상단 숫자
  tag: string;        // 우하단 라벨 (FR04/FL05 등)
  status?: Status;
}

export const strokeByStatus: Record<Status,string> = {
  ok: "#1f9a00",
  warning: "#c49c00",
  error: "#e53935",
  unknown: "#6d6d6d",
};

export const fillByFamily: Record<Family,string> = {
  FR: "#48beff",
  FL: "#ffa008",
};

// 예시 데이터(질문 이미지의 일부). 나머지도 같은 포맷으로 쭉 추가!
export const BOXES: BoxItem[] = [
  { id: "FR03-banner", family: "FR", x:1336.55, y:10.23,  w:116.6, h:53.19, tag:"FR03" },
  { id: "FR10-a",      family: "FR", x:37.92,   y:140.89, w:83.62, h:66.9,  tag:"FR10" },
  { id: "FR10-b",      family: "FR", x:37.92,   y:244.06, w:83.62, h:66.9,  tag:"FR10" },
  { id: "FR07-1",      family: "FR", x:597.85,  y:193.6,  w:111,  h:21.11, count:"1", tag:"FR07" },
  { id: "FR07-2",      family: "FR", x:597.85,  y:218.6,  w:111,  h:21.11, count:"2", tag:"FR07" },
  { id: "FL02-1",      family: "FL", x:1432.25, y:293.16, w:110.45,h:21.65, count:"1", tag:"FL02" },
  { id: "FL02-2",      family: "FL", x:1432.25, y:316.67, w:110.45,h:86.06, count:"2", tag:"FL02" },
  { id: "FL05-big1",   family: "FL", x:859.8,   y:405.87, w:64.4, h:74.76,  count:"1", tag:"FL05" },
  // ... (필요한 모든 박스 추가)
];
