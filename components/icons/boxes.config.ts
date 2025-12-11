// components/icons/boxes.config.ts
export type Status = "none" | "ok" | "warn" | "error";

export interface BoxRect {
  id: string;       // 내 식별자
  x: number; y: number; w: number; h: number; rx?: number;
}

export const strokeByStatus: Record<Exclude<Status,"none">, string> = {
  ok:   "#1f9a00",
  warn: "#c49c00",
  error:"#e53935",
};
