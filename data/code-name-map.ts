// /app/data/code-name-map.ts
// 또는 src/data/code-name-map.ts (프로젝트 구조에 맞게 위치만 맞춰주세요)

export type CodeName = { code: string; name: string };

/**
 * 원재료 코드/이름 매핑 리스트
 * - code: 사내/레거시 코드 등 “키값”
 * - name: 화면에 표시되는 한글/영문 명칭
 *
 * 필요에 따라 자유롭게 추가/수정하세요.
 */
export const ROW_MATERIALS_CODE_NAME_LIST: CodeName[] = [
  // 공통/배합
  { code: "10/20", name: "10/20" },
  { code: "BR-01", name: "BR-01" },
  { code: "DCR-34", name: "DCR-34" },

  // SBR 계열
  { code: "SBR-1500", name: "SBR-1500" },
  { code: "SBR-1502", name: "SBR-1502" },
  { code: "SBR-1502M", name: "SBR-1502M" },
  { code: "SBR-1712", name: "SBR-1712" },
  { code: "SBR-1723", name: "SBR-1723" },
  { code: "SBR-1778", name: "SBR-1778" },
  { code: "SBR-1783", name: "SBR-1783" },
  { code: "SBR-1789", name: "SBR-1789" },

  // NBR/CR/IR 등
  { code: "NBR-KNB-35L", name: "NBR KNB-35L" },
  { code: "NBR-240S", name: "NBR 240S" },
  { code: "CR-M41", name: "CR M-41" },
  { code: "IR-10", name: "IR-10" },

  // RR/천연/부틸/라텍스
  { code: "RR-BUTYL", name: "RR 부틸" },
  { code: "RR-LATEX", name: "RR 라텍스" },
  { code: "RR-NR-TR", name: "RR 천연 TR" },
  { code: "RR-NR-SP", name: "RR 천연 SP" },

  // IIR/CIIR/CBK 계열 (샘플)
  { code: "IIR-BUTY-268", name: "IIR Buty-268" },
  { code: "CBK-139", name: "CBK-139" },
  { code: "CIIR-1139", name: "CIIR-1139" },

  // NdBR/BR 등
  { code: "NdBR-60", name: "NdBR-60" },

  // 기타 빈번한 항목(예시)
  { code: "KHS-68", name: "KHS-68" },
  { code: "RR-01", name: "RR-01" },
  { code: "BR-10", name: "BR-10" },
  { code: "EPDM-40", name: "EPDM-40" },
  { code: "EPDM-70", name: "EPDM-70" },
  { code: "NR-10", name: "NR-10" },
  { code: "NR-50", name: "NR-50" },
  { code: "NBR-33", name: "NBR-33" },

  // 필요 시 계속 추가
];

/** code → name 빠른 조회용 */
export const CODE_TO_NAME: Record<string, string> = Object.fromEntries(
  ROW_MATERIALS_CODE_NAME_LIST.map(({ code, name }) => [code, name])
);

/** name → code 빠른 조회용 (이름이 유니크하다는 가정) */
export const NAME_TO_CODE: Record<string, string> = Object.fromEntries(
  ROW_MATERIALS_CODE_NAME_LIST.map(({ code, name }) => [name, code])
);

/** 유틸: code로 표시명 찾기 (없으면 code 반환) */
export const codeToName = (code?: string) =>
  (code && CODE_TO_NAME[code]) ?? code ?? "";

/** 유틸: name으로 코드 찾기 (없으면 name 반환) */
export const nameToCode = (name?: string) =>
  (name && NAME_TO_CODE[name]) ?? name ?? "";
