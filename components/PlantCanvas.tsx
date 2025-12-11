// app/(demo)/materials/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData,
} from "chart.js";
import { Bar, Radar } from "react-chartjs-2";
import { LuCopy } from "react-icons/lu";
import { GoTrash } from "react-icons/go";

// ✅ 원재료 코드/이름 상수 가져오기
import { ROW_MATERIALS_CODE_NAME_LIST } from "@/data/code-name-map";

ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// ---------------- Types ----------------
type Ingredient = { name: string; value: number };
type CaseCard = { id: string; title: string; ingredients: Ingredient[] };
type PredictionCard = {
  id: string;
  title: string;
  checked: boolean;
  propCount: number;
  caseId: string;
  /** 그래프/입력값 (y_pred) */
  props: number[]; // 물성1~6
  /** ▼ API에서 받은 보조정보(라벨/CI) */
  propKeys?: string[]; // 항목 라벨 (없으면 물성1~6)
  ciLow?: number[]; // 신뢰구간 하한
  ciHigh?: number[]; // 신뢰구간 상한
};

// ---------------- Option 타입 ----------------
type Option = { value: string; label: string };

// ---------------- SelectPopup ----------------
const SelectPopup = ({
  open,
  options,
  value,
  onClose,
  onSelect,
  width = 480,
  maxHeight = 480,
}: {
  open: boolean;
  options: Option[];
  value?: string;
  onClose: () => void;
  onSelect: (opt: Option) => void;
  width?: number;
  maxHeight?: number;
}) => {
  const popRef = useRef<HTMLDivElement | null>(null);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return options;
    return options.filter(
      (o) => o.label.toLowerCase().includes(term) || o.value.toLowerCase().includes(term)
    );
  }, [q, options]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setQ("");
      const idx = filtered.findIndex((o) => o.value === value || o.label === value);
      setActive(idx >= 0 ? idx : 0);
      setTimeout(() => {
        popRef.current?.querySelector<HTMLInputElement>("input")?.focus();
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDocKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((p) => Math.min(p + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((p) => Math.max(p - 1, 0));
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const opt = filtered[active];
        if (opt) onSelect(opt);
      }
    };
    document.addEventListener("keydown", onDocKey);
    return () => document.removeEventListener("keydown", onDocKey);
  }, [open, filtered, active, onClose, onSelect]);

  if (!open) return null;

  return (
    <>
      <div className="list-box-dark-box" onMouseDown={onClose} aria-hidden />
      <div
        ref={popRef}
        role="dialog"
        className="list-box-content"
        aria-modal="true"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width,
          zIndex: 10001,
          borderRadius: 10,
          boxShadow: "0 12px 24px rgba(0,0,0,.14)",
          background: "#fff",
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div style={{ padding: 10, borderBottom: "1px solid #f1f5f9", background: "#dfe3eb" }}>
          <input
            placeholder="검색 (코드/이름)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{
              width: "100%",
              height: 36,
              padding: "0 10px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              outline: "none",
            }}
          />
        </div>
        <div role="listbox" style={{ maxHeight, overflowY: "auto" }}>
          {filtered.length === 0 && (
            <div style={{ padding: 12, color: "#6b7280" }}>검색 결과 없음</div>
          )}
          {filtered.map((o, i) => {
            const isActive = i === active;
            const isSelected = value === o.value || value === o.label;
            return (
              <div
                key={o.value}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSelect(o);
                }}
                style={{
                  padding: "10px 12px",
                  cursor: "pointer",
                  background: isActive ? "#f1f5f9" : isSelected ? "#eef2ff" : "#fff",
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  borderBottom: "1px solid #f8fafc",
                }}
              >
                <span
                  style={{
                    minWidth: 92,
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                    color: "#334155",
                  }}
                >
                  {o.value}
                </span>
                <span style={{ color: "#111827" }}>{o.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

// ---------------- Page ----------------
export default function MaterialsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const MATERIAL_OPTIONS: Option[] = useMemo(
    () =>
      ROW_MATERIALS_CODE_NAME_LIST.map((x) => ({
        value: x.code,
        label: x.name,
      })),
    []
  );

  const pickLabelByIndex = (i: number) =>
    MATERIAL_OPTIONS[(i + MATERIAL_OPTIONS.length) % MATERIAL_OPTIONS.length]?.label ??
    `재료 ${i + 1}`;

  // 좌상단: 원재료 입력 — 최초 2개 케이스
  const [cases, setCases] = useState<CaseCard[]>([
    {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : "case-1",
      title: "case - 1",
      ingredients: Array.from({ length: 5 }, (_, i) => ({
        name: pickLabelByIndex(i),
        value: 60,
      })),
    },
    {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : "case-2",
      title: "case - 2",
      ingredients: Array.from({ length: 5 }, (_, i) => ({
        name: pickLabelByIndex(i + 5),
        value: 60,
      })),
    },
  ]);

  // 예측물성(레이더/테이블용)
  const [preds, setPreds] = useState<PredictionCard[]>([
    {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : "pred-1",
      title: "Test case - 1",
      checked: true,
      propCount: 6,
      caseId: "",
      props: [60, 60, 60, 60, 60, 60],
      propKeys: ["물성1", "물성2", "물성3", "물성4", "물성5", "물성6"],
      ciLow: [0, 0, 0, 0, 0, 0],
      ciHigh: [0, 0, 0, 0, 0, 0],
    },
  ]);

  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    if (!mounted) return;
    document.body.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme, mounted]);

  const MAX_CASE = 10;
  const MAX_ING = 10;
  const MIN_ING = 1;

  const renameCases = (arr: CaseCard[]) =>
    arr.map((c, i) => ({ ...c, title: `case - ${i + 1}` }));

  const uuid = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `id-${Math.random().toString(36).slice(2)}`;

  const addCase = () => {
    setCases((prev) => {
      if (prev.length >= MAX_CASE) return prev;
      const already = prev.reduce((sum, c) => sum + c.ingredients.length, 0);
      const nextIng = Array.from(
        { length: prev[0]?.ingredients.length ?? 5 },
        (_, i) => ({ name: pickLabelByIndex(already + i), value: 60 })
      );
      const next: CaseCard = { id: uuid(), title: "", ingredients: nextIng };
      return renameCases([...prev, next]);
    });
  };

  const copyCase = (id: string) => {
    setCases((prev) => {
      if (prev.length >= MAX_CASE) return prev;
      const found = prev.find((c) => c.id === id);
      if (!found) return prev;
      const next: CaseCard = {
        id: uuid(),
        title: "",
        ingredients: found.ingredients.map((x) => ({ ...x })),
      };
      return renameCases([...prev, next]);
    });
  };

  const deleteCase = (id: string) => {
    setCases((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.filter((c) => c.id !== id);
      return renameCases(next);
    });
  };

  const addIngredient = (caseId: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        if (c.ingredients.length >= MAX_ING) return c;
        const idx = c.ingredients.length;
        return {
          ...c,
          ingredients: [...c.ingredients, { name: pickLabelByIndex(idx), value: 60 }],
        };
      })
    );
  };

  const removeIngredient = (caseId: string, index: number) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        if (c.ingredients.length <= MIN_ING) return c;
        const arr = [...c.ingredients];
        arr.splice(index, 1);
        return { ...c, ingredients: arr };
      })
    );
  };

  const [openIdx, setOpenIdx] = useState<{ caseId: string; index: number } | null>(null);

  // 레이더/테이블 입력 갱신 (형태 유지용)
  const updatePredProp = (predId: string, idx: number, value: number) => {
    setPreds((prev) =>
      prev.map((p) => {
        if (p.id !== predId) return p;
        const next = [...(p.props ?? [])];
        next[idx] = value;
        for (let i = 0; i < 6; i++) if (next[i] == null) next[i] = 0;
        return { ...p, props: next };
      })
    );
  };

  // ─────────────────────────────────────────
  // runPrediction: dataObject → POST 1 → insertedIds → POST 2
  //  → 응답을 케이스 수만큼(초과 시 잘라서) preds 생성, 부족하면 0으로 패딩
  // ─────────────────────────────────────────
  const runPrediction = async () => {
    const dataObject: Record<string, Record<string, string>> = Object.fromEntries(
      cases.map((c, idx) => [
        String(idx + 1),
        Object.fromEntries(
          (c.ingredients ?? []).map((ing, i) => [
            String((ing.name ?? `재료${i + 1}`).toString().trim()),
            String((ing.value ?? "").toString().trim()),
          ])
        ),
      ])
    );

    try {
      // 1) 첫 요청 → insertedIds
      const res = await fetch("http://1.254.24.170:24828/api/DX_API002003", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataObject }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const insertedIds =
        Array.isArray(data?.insertedRows) && data.insertedRows.length > 0
          ? data.insertedRows.map((r: { insertedId: number }) => r.insertedId)
          : [];

      // 2) 두 번째 요청
      if (insertedIds.length > 0) {
        const res2 = await fetch("http://1.254.24.170:24828/api/DX_API002004", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({ idList: insertedIds }),
          body: JSON.stringify({ idList: [442] }),
        });
        if (!res2.ok) throw new Error(`HTTP ${res2.status}`);
        const data2 = await res2.json();

        // 배열 꺼내기 도우미
        const pickArray = (v: any): any[] => {
          if (Array.isArray(v)) return v;
          if (v && typeof v === "object") {
            for (const k of ["rows", "data", "items", "result", "results"]) {
              if (Array.isArray(v[k])) return v[k];
            }
          }
            return [];
        };

        const flat = pickArray(data2);

        // 케이스당 물성 6개로 가정하여 자르기
        const chunkSize = 6;
        const wantCases = cases.length;
        const maxGroups = Math.floor(flat.length / chunkSize);
        const useCases = Math.min(wantCases, maxGroups); // 데이터가 더 많으면 케이스 수만큼만 사용

        // 지정 케이스 수(useCases)만큼 summary 생성
        const makeSummary = (rows: any[]) =>
          Array.from({ length: chunkSize }, (_, i) => {
            const r = rows[i] ?? {};
            return {
              key: (r?.target as string) || `물성${i + 1}`,
              y_pred: Number(r?.y_pred ?? 0),
              ci_low: Number(r?.ci_low ?? 0),
              ci_high: Number(r?.ci_high ?? 0),
            };
          });

        const nextPreds: PredictionCard[] = [];

        // 2-1) 응답이 있는 케이스들
        for (let i = 0; i < useCases; i++) {
          const rows = flat.slice(i * chunkSize, i * chunkSize + chunkSize);
          const sum = makeSummary(rows);
          nextPreds.push({
            id: uuid(),
            title: `Test case - ${i + 1}`,
            checked: i === 0,
            propCount: chunkSize,
            caseId: cases[i].id,
            props: sum.map((s) => s.y_pred),
            propKeys: sum.map((s) => s.key),
            ciLow: sum.map((s) => s.ci_low),
            ciHigh: sum.map((s) => s.ci_high),
          });
        }

        // 2-2) 응답이 부족하면 나머지 케이스는 0으로 패딩
        for (let i = useCases; i < wantCases; i++) {
          nextPreds.push({
            id: uuid(),
            title: `Test case - ${i + 1}`,
            checked: i === 0 && useCases === 0, // 응답 하나도 없을 때 첫 것만 체크
            propCount: chunkSize,
            caseId: cases[i].id,
            props: Array(chunkSize).fill(0),
            propKeys: Array.from({ length: chunkSize }, (_, j) => `물성${j + 1}`),
            ciLow: Array(chunkSize).fill(0),
            ciHigh: Array(chunkSize).fill(0),
          });
        }

        setPreds(nextPreds);
      }
    } catch (err) {
      console.error("❌ 요청 오류:", err);
    }
  };

  // 색상
  const tickColor = theme === "dark" ? "#C3C6D4" : "#666";
  const gridColor = theme === "dark" ? "rgba(70,78,94,1)" : "rgba(0,0,0,0.1)";

  // ✅ “세로 그룹 바”: X축 = 케이스, 데이터셋 = 원재료 인덱스
  const { labelsCaseRows, datasetLabels } = useMemo(() => {
    const labels = cases.map((c) => c.title);
    const longest = cases.reduce((a, b) =>
      (a.ingredients?.length ?? 0) >= (b.ingredients?.length ?? 0) ? a : b
    );
    const dsLabels = (longest?.ingredients ?? []).map((ing, i) => ing?.name || `재료${i + 1}`);
    return { labelsCaseRows: labels, datasetLabels: dsLabels };
  }, [cases]);

  const barDataRows: ChartData<"bar"> = useMemo(() => {
    const pal = [
      "rgba(255, 99, 132, 0.5)",
      "rgba(75, 192, 192, 0.5)",
      "rgba(255, 206, 86, 0.5)",
      "rgba(153, 102, 255, 0.5)",
      "rgba(255, 159, 64, 0.5)",
      "rgba(54, 162, 235, 0.5)",
      "rgba(201, 203, 207, 0.5)",
      "rgba(0, 0, 0, 0.12)",
    ];
    const palB = [
      "rgba(255, 99, 132, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(201, 203, 207, 1)",
      "rgba(0, 0, 0, 0.6)",
    ];

    const maxCount = Math.max(...cases.map((c) => c.ingredients.length), 0);
    const datasets = Array.from({ length: maxCount }, (_, ingIdx) => {
      const dataPerCase = cases.map((c) => Number(c.ingredients[ingIdx]?.value ?? 0));
      const label =
        datasetLabels[ingIdx] ??
        (cases[0]?.ingredients?.[ingIdx]?.name ?? `재료${ingIdx + 1}`);
      return {
        label,
        data: dataPerCase,
        backgroundColor: pal[ingIdx % pal.length],
        borderColor: palB[ingIdx % palB.length],
        borderWidth: 1,
      };
    });

    return { labels: labelsCaseRows, datasets };
  }, [cases, labelsCaseRows, datasetLabels]);

  const barOptionsRows: ChartOptions<"bar"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: { color: tickColor, font: { size: 14 } },
          grid: { color: gridColor },
        },
        y: {
          beginAtZero: true,
          ticks: { color: tickColor, font: { size: 14 } },
          grid: { color: gridColor },
        },
      },
      plugins: {
        legend: { position: "top", labels: { color: tickColor, font: { size: 13 } } },
        tooltip: { enabled: true },
      },
      elements: { bar: { borderRadius: 3 } },
    }),
    [tickColor, gridColor]
  );

  // ✅ 레이더(합쳐진 형태)
  const radarLabels = useMemo(() => ["물성1", "물성2", "물성3", "물성4", "물성5", "물성6"], []);
  const checkedPreds = useMemo(() => preds.filter((p) => p.checked), [preds]);
  const combinedRadarData: ChartData<"radar"> = useMemo(() => {
    if (checkedPreds.length === 0) return { labels: radarLabels, datasets: [] };

    const palFill = [
      "rgba(255, 99, 132, 0.18)",
      "rgba(75, 192, 192, 0.18)",
      "rgba(255, 206, 86, 0.18)",
      "rgba(153, 102, 255, 0.18)",
      "rgba(255, 159, 64, 0.18)",
      "rgba(54, 162, 235, 0.18)",
    ];
    const palStroke = [
      "rgba(255, 99, 132, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
      "rgba(54, 162, 235, 1)",
    ];

    const datasets = checkedPreds.map((p, i) => ({
      label: p.title,
      data: Array.from({ length: 6 }, (_, idx) => Number(p.props[idx] ?? 0)),
      backgroundColor: palFill[i % palFill.length],
      borderColor: palStroke[i % palStroke.length],
      pointBackgroundColor: palStroke[i % palStroke.length],
      borderWidth: 1,
      pointRadius: 3,
    }));

    return { labels: radarLabels, datasets };
  }, [checkedPreds, radarLabels]);

  const radarOptions: ChartOptions<"radar"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: { display: true },
          suggestedMin: 0,
          suggestedMax: 100,
          ticks: { backdropColor: "transparent", color: tickColor, font: { size: 14 } },
          grid: { color: gridColor },
          pointLabels: { color: tickColor, font: { size: 14, weight: 700 } },
        },
      },
      plugins: {
        legend: { position: "top", labels: { color: tickColor, font: { size: 14 } } },
      },
    }),
    [tickColor, gridColor]
  );

  const togglePred = (id: string) => {
    setPreds((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, checked: !p.checked } : p));
      if (!next.some((p) => p.checked) && next.length) next[0].checked = true;
      return next;
    });
  };

  return (
    <PageWrap>
      <TopGrid>
        {/* 좌상단: 원재료 입력 */}
        <Card>
          <SectionHeader>
            <h3>원재료 입력</h3>
            <AddBtn onClick={addCase}>+ case 추가 ({cases ? cases.length : 0}/{MAX_CASE})</AddBtn>
          </SectionHeader>

          <CaseGrid>
            {cases.map((c) => (
              <CaseBox className={`${cases.length > 1 ? "mutiple" : ""}`} key={c.id}>
                <CaseHead>
                  <span>{c.title}</span>
                  <div className="actions">
                    <button title="복사" onClick={() => copyCase(c.id)}>
                      <LuCopy />
                    </button>
                    <button title="삭제" onClick={() => deleteCase(c.id)}>
                      <GoTrash />
                    </button>
                  </div>
                </CaseHead>

                <Inputs>
                  {c.ingredients.map((ing, idx) => {
                    const selected =
                      MATERIAL_OPTIONS.find((o) => o.value === ing.name || o.label === ing.name) ??
                      MATERIAL_OPTIONS[0];

                    return (
                      <Row key={`${c.id}-${idx}`}>
                        <button
                          type="button"
                          className="select-like"
                          onClick={() => setOpenIdx({ caseId: c.id, index: idx })}
                          aria-haspopup="dialog"
                          aria-expanded={openIdx?.caseId === c.id && openIdx?.index === idx}
                        >
                          {selected?.label ?? `재료 ${idx + 1}`}
                        </button>

                        <input
                          type="number"
                          value={ing.value}
                          onChange={(e) => {
                            const num = Number(e.target.value || 0);
                            setCases((prev) =>
                              prev.map((pc) => {
                                if (pc.id !== c.id) return pc;
                                const arr = [...pc.ingredients];
                                arr[idx] = { ...arr[idx], value: num };
                                return { ...pc, ingredients: arr };
                              })
                            );
                          }}
                        />

                        <IconBtn onClick={() => removeIngredient(c.id, idx)} title="삭제">
                          <GoTrash />
                        </IconBtn>

                        <SelectPopup
                          open={openIdx?.caseId === c.id && openIdx?.index === idx}
                          options={MATERIAL_OPTIONS}
                          value={selected?.label}
                          onClose={() => setOpenIdx(null)}
                          onSelect={(opt) => {
                            setOpenIdx(null);
                            setCases((prev) =>
                              prev.map((pc) => {
                                if (pc.id !== c.id) return pc;
                                const arr = [...pc.ingredients];
                                arr[idx] = { ...arr[idx], name: opt.label };
                                return { ...pc, ingredients: arr };
                              })
                            );
                          }}
                        />
                      </Row>
                    );
                  })}
                </Inputs>

                <SubBar>
                  <AddSmall onClick={() => addIngredient(c.id)}>
                    원재료 추가 ({c.ingredients.length}/{MAX_ING})
                  </AddSmall>
                </SubBar>
              </CaseBox>
            ))}
          </CaseGrid>
          <p className="left-right">
            {cases.length > 2 ? "← 좌우로 스크롤하여 다른 케이스를 확인하세요 →" : ""}
          </p>
          <FooterRow>
            <RunBtn onClick={runPrediction}>물성 예측 실행</RunBtn>
            <ExcelBtn>레시피 다운로드 (Excel)</ExcelBtn>
          </FooterRow>
        </Card>

        {/* 우상단: 예측 물성 (레이더/테이블) */}
        <Card>
          <SectionHeader>
            <h3>예측 물성</h3>
          </SectionHeader>

          <PredGrid>
            {preds.map((p) => (
              <PredCard className={`${preds.length > 1 ? "mutiple" : ""}`} key={p.id}>
                <PredHead>
                  <span>{p.title}</span>
                  <input
                    className="checkbox"
                    type="checkbox"
                    checked={p.checked}
                    onChange={() => togglePred(p.id)}
                  />
                </PredHead>

                <PredInputs>
                  {(() => {
                    // 각 케이스의 첫 번째 예측값만 사용
                    const yPred  = Number(p.props?.[0]   ?? 0);
                    const ciHigh = Number(p.ciHigh?.[0]  ?? 0);
                    const ciLow  = Number(p.ciLow?.[0]   ?? 0);

                    const rows = [
                      { label: "y_pred",  value: yPred },
                      { label: "ci_high", value: ciHigh },
                      { label: "ci_low",  value: ciLow },
                    ] as const;

                    return rows.map((row, i) => (
                      <PredRow key={`${p.id}-single-${i}`}>
                        <label>{row.label}</label>
                        <input type="text" value={String(row.value)} readOnly />
                        <small />
                      </PredRow>
                    ));
                  })()}
                </PredInputs>
              </PredCard>
            ))}
          </PredGrid>
        </Card>
      </TopGrid>

      {/* 하단: 좌 — 세로 그룹 바, 우 — 합쳐진 레이더 */}
      <BottomGrid>
        <Card>
          <SectionHeader style={{ marginBottom: 0 }}>
            <h3>케이스별 원재료 Bar</h3>
          </SectionHeader>
          <ChartWrap>
            <Bar data={barDataRows} options={barOptionsRows} />
          </ChartWrap>
        </Card>

        <Card>
          <SectionHeader style={{ marginBottom: 0 }}>
            <h3>예측 레이더</h3>
          </SectionHeader>
          <ChartWrap>
            <Radar data={combinedRadarData} options={radarOptions} />
          </ChartWrap>
        </Card>
      </BottomGrid>
    </PageWrap>
  );
}

// ---------------- styled-components ----------------

export const PageWrap = styled.main`
  width: 100%;
  min-height: 100vh;
  max-width: 100vw;
  position: relative;
  padding: 12px;
  background: var(--background-mainbase-100, #f7f8fa);

  .list-box-content {
    z-index: 10001;
  }
  .list-box-dark-box {
    position: fixed;
    inset: 0;
    opacity: 0.6;
    background-color: #000000;
    z-index: 10000;
  }
`;

/* ✅ 항상 좌우 50% / 50% 비율 고정 */
export const TopGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr)); /* ✅ 핵심: minmax(0,1fr) */
  gap: 12px;
  align-items: stretch;
  width: 100%;
  max-width: 100%;

  /* 내부 콘텐츠가 칸을 밀지 않도록 */
  & > * {
    min-width: 0;
  }

  @media (max-width: 1280px) {
    grid-template-columns: 1fr;
  }
`;

/* ✅ 하단 Bar / Radar도 반반 고정 */
export const BottomGrid = styled.div`
  position: relative;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 12px;

  & > * {
    min-width: 0;
  }

  @media (max-width: 1280px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.section`
  width: 100%;
  height: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  background: #fff;
  border: 1px solid #e5e6eb;
  border-radius: 8px;
  padding: 35px;
  box-sizing: border-box;

  .left-right {
    width: 100%;
    text-align: center;
    margin-top: 15px;
    font-size: var(--font-size-base);
    color: var(--text-neutral-medium);
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  height: 40px;

  h3 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.5px;
  }
`;

export const AddBtn = styled.button`
  border-radius: 6px;
  padding: 6px 10px;
  font-weight: 600;
  background-color: var(--background-gray-200);
`;

export const CaseGrid = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 20px;
  min-width: 0; /* ✅ 중요: 칸 늘어남 방지 */
`;

export const CaseBox = styled.div`
  background-color: var(--background-gray-100);
  border: 1px solid var(--line-border);
  border-radius: 8px;
  width: 100%;
  padding: 20px;
  flex-shrink: 0;
  min-height: 302px;
  max-height: 320px;
  transition: width 0.3s ease-in-out;
  &.mutiple {
    width: calc(50% - 11px);
  }
`;

export const CaseHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  .actions {
    display: inline-flex;
    gap: 0px;
  }
  button {
    padding: 4px 6px;
    border-radius: 6px;
  }
`;

export const Inputs = styled.div`
  background: #fff;
  border-radius: 6px;
  padding: 8px;
  border: 1px solid #e5e7ef;
  max-height: 180px;
  overflow-y: auto;
`;

export const Row = styled.div`
  width: 100%;
  display: flex;
  gap: 6px;
  align-items: center;
  margin-bottom: 8px;

  .select-like {
    border: 1px solid #dfe3eb;
    border-radius: 6px;
    padding: 0 10px;
    background: #fff;
    width: 100%;
    height: 40px;
    text-align: left;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .select-like:hover {
    border-color: #94a3b8;
  }

  input {
    border: 1px solid #dfe3eb;
    border-radius: 6px;
    padding: 8px;
    background: #fff;
    width: 100%;
    height: 40px;
    text-align: right;
  }
`;

export const IconBtn = styled.button`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border: 1px solid #e0e4ea;
  background: #e0e4ea;
  color: var(--text-neutral-strong);
  border-radius: 9999px;
  height: 34px;
  width: 34px;
`;

export const SubBar = styled.div`
  margin-top: 8px;
  display: flex;
  justify-content: center;
  width: 100%;
  button {
    width: 100%;
    background-color: var(--background-gray-200);
  }
`;

export const AddSmall = styled.button`
  background: #dfe5ef;
  padding: 6px 10px;
  border-radius: 6px;
  font-weight: 600;
`;

export const FooterRow = styled.div`
  margin-top: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

export const RunBtn = styled.button`
  background: #e95a5a;
  color: #fff;
  border-radius: 6px;
  padding: 10px 12px;
  font-weight: 700;
`;

export const ExcelBtn = styled.button`
  background: #3a4658;
  color: #fff;
  border-radius: 6px;
  padding: 10px 12px;
  font-weight: 700;
`;

export const PredGrid = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 12px;
  margin-top: 6px;
  min-width: 0; /* ✅ 중요 */
`;

export const PredCard = styled.div`
  width: 100%;
  background-color: var(--background-gray-100);
  border: 1px solid var(--line-border);
  border-radius: 8px;
  padding: 20px;
  flex-shrink: 0;
  overflow-y: hidden;
  min-height: 302px;
  max-height: 320px;
  transition: width 0.3s ease-in-out;
  &.mutiple {
    width: calc(50% - 11px);
  }
`;

export const PredHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;

  span {
    font-weight: 600;
    font-size: var(--font-size-sm);
  }
  .checkbox {
    transform: scale(1.6);
  }
`;

export const PredInputs = styled.div`
  width: 100%;
  border-radius: 6px;
  padding: 8px;
  max-height: 210px;
  overflow-y: auto;
`;
export const PredRow = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr; /* ✅ label: 고정폭 / input: 나머지 전체 차지 */
  align-items: center;
  margin-bottom: 10px;
  gap: 12px;

  label {
    color: var(--text-default);
    font-weight: 600;
  }

  input {
    border: 1px solid #cfd4dc;
    border-radius: 6px;
    padding: 10px 12px;
    width: 100%;                /* ✅ 부모 grid cell 꽉 채움 */
    text-align: right;
    font-size: 15px;
    font-weight: 600;
    color: #111827;
    background-color: #f9fafb;
    box-sizing: border-box;
    transition: all 0.15s ease-in-out;

    &:hover {
      background-color: #f1f5f9;
      border-color: #94a3b8;
    }
    &:focus {
      outline: none;
      border-color: #2563eb;
      background-color: #fff;
    }
  }

  small {
    display: none;
  }
`;




export const PredHint = styled.div`
  margin-top: 15px;
  font-size: var(--font-size-base);
  color: var(--text-neutral-medium);
`;

export const ChartWrap = styled.div`
  height: 420px;
`;
