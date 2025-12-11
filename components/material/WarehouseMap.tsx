"use client";

import React, { useMemo, useState } from "react";
import styled from "styled-components";

/** ─────────────────────────────────────────────────────────────────────────────
 * 타입 정의
 * ──────────────────────────────────────────────────────────────────────────── */
type Group = "GR5" | "GR3" | "GR2" | "형합" | "외곽";
type Family = "FR" | "FL";
type Status = "ok" | "lack" | "over" | "unknown" | "disabled" | "selected" | "warning";

export interface BoxNode {
  id: string;                // 유니크 id
  family: Family;            // FR / FL
  tag: string;               // FR09, FL05 ...
  count?: number;            // 1,2,3 ...
  x: number;                 // SVG viewBox 기준 x
  y: number;
  w: number;
  h: number;
  radius?: number;           // 라운드 박스 필요 시
  group: Group;              // 구역 (GR5, GR3, GR2, 형합, 외곽)
  status: Status;            // 현재 상태
  locked?: boolean;          // 편집잠금
  note?: string;             // 툴팁/메모
}

/** ─────────────────────────────────────────────────────────────────────────────
 * 색상/스타일 토큰
 * ──────────────────────────────────────────────────────────────────────────── */
const palette = {
  // 패밀리 컬러 (원본 이미지 톤 참고)
  FR: "#48beff",
  FL: "#ffa008",

  // 상태 하이라이트
  ok: "#53ed20",
  lack: "#ff3b30",
  over: "#ef73f9",
  warning: "#fffa4d",
  unknown: "#bdcace",
  disabled: "#b5b5b5",
  selected: "#333",

  // 배경/선
  bg: "#f5f5f5",
  board: "#e0e0e0",
  corridor: "#c7ccd1",
  wall: "#7a7a7a",
  text: "#111",
  textInverted: "#fff",
};

const familyFill = (family: Family) => palette[family];

/** 상태별 보더/글자색 */
const statusStroke = (s: Status) => {
  switch (s) {
    case "ok":
      return "#18a900";
    case "lack":
      return "#c6241c";
    case "over":
      return "#b416cc";
    case "warning":
      return "#d3cb00";
    case "disabled":
      return "#8d8d8d";
    case "selected":
      return "#111";
    default:
      return "#6d6d6d";
  }
};

const statusBadge = (s: Status) => {
  switch (s) {
    case "ok":
      return "정상";
    case "lack":
      return "부족";
    case "over":
      return "과잉";
    case "warning":
      return "주의";
    case "disabled":
      return "OFF";
    case "selected":
      return "선택";
    default:
      return "미정";
  }
};

/** ─────────────────────────────────────────────────────────────────────────────
 * 데이터 (샘플)
 * 좌표계: 원본 이미지 비율에 맞춰 viewBox 2048 x 670 사용
 * ──────────────────────────────────────────────────────────────────────────── */
const initialBoxes: BoxNode[] = [
  // 왼 외곽 FR10 더미
  { id: "FR10-1", family: "FR", tag: "FR10", x: 60, y: 90, w: 140, h: 110, group: "외곽", status: "ok" },
  { id: "FR10-2", family: "FR", tag: "FR10", x: 60, y: 260, w: 140, h: 110, group: "외곽", status: "ok" },

  // 상단 GR5 내부 샘플들
  { id: "FR09-1", family: "FR", tag: "FR09", x: 245, y: 55, w: 180, h: 70, group: "GR5", status: "ok" },
  { id: "FR09-2", family: "FR", tag: "FR09", count: 1, x: 330, y: 150, w: 60, h: 40, group: "GR5", status: "warning" },
  { id: "FR09-3", family: "FR", tag: "FR09", count: 2, x: 500, y: 235, w: 120, h: 40, group: "GR5", status: "over" },
  { id: "FR08-1", family: "FR", tag: "FR08", count: 1, x: 620, y: 230, w: 120, h: 40, group: "GR5", status: "ok" },
  { id: "FR07-1", family: "FR", tag: "FR07", count: 1, x: 770, y: 210, w: 140, h: 60, group: "GR5", status: "warning" },
  { id: "FR06-1", family: "FR", tag: "FR06", count: 1, x: 955, y: 165, w: 55, h: 45, group: "GR5", status: "ok" },

  // 상단 GR3 내부 샘플들
  { id: "FR04-3", family: "FR", tag: "FR04", count: 3, x: 1300, y: 250, w: 170, h: 90, group: "GR3", status: "over" },
  { id: "FR04-1", family: "FR", tag: "FR04", count: 1, x: 1320, y: 320, w: 170, h: 45, group: "GR3", status: "warning" },
  { id: "FR02-1", family: "FR", tag: "FR02", count: 1, x: 1718, y: 180, w: 55, h: 45, group: "GR3", status: "ok" },

  // 하단 GR2 / 형합 구간 FL들
  { id: "FL08-1", family: "FL", tag: "FL08", count: 1, x: 450, y: 420, w: 260, h: 95, group: "GR2", status: "over" },
  { id: "FL07-belt", family: "FL", tag: "FL07", x: 1040, y: 630, w: 170, h: 40, group: "외곽", status: "ok", note: "바닥 라인" },
  { id: "FL06-1", family: "FL", tag: "FL06", count: 1, x: 1000, y: 480, w: 65, h: 70, group: "GR2", status: "ok" },
  { id: "FL06-2", family: "FL", tag: "FL06", count: 2, x: 1000, y: 560, w: 65, h: 70, group: "GR2", status: "ok" },
  { id: "FL05-1", family: "FL", tag: "FL05", count: 1, x: 1180, y: 510, w: 120, h: 90, group: "GR2", status: "warning" },
  { id: "FL05-3", family: "FL", tag: "FL05", count: 3, x: 1305, y: 510, w: 90, h: 90, group: "GR2", status: "ok" },
  { id: "FL04-1", family: "FL", tag: "FL04", count: 1, x: 1450, y: 560, w: 260, h: 90, group: "형합", status: "warning" },
  { id: "FL03-1", family: "FL", tag: "FL03", count: 1, x: 1710, y: 520, w: 70, h: 60, group: "GR3", status: "ok" },
  { id: "FL03-3", family: "FL", tag: "FL03", count: 3, x: 1785, y: 560, w: 70, h: 60, group: "GR3", status: "over" },
  { id: "FL02-1", family: "FL", tag: "FL02", count: 1, x: 1840, y: 410, w: 220, h: 90, group: "GR3", status: "warning" },
  { id: "FL02-2", family: "FL", tag: "FL02", count: 2, x: 1840, y: 510, w: 220, h: 160, group: "GR3", status: "warning" },

  // 좌측 하단 FL09 라인
  { id: "FL09-1", family: "FL", tag: "FL09", count: 1, x: 260, y: 420, w: 80, h: 60, group: "GR2", status: "warning" },
  { id: "FL09-2", family: "FL", tag: "FL09", count: 2, x: 230, y: 500, w: 80, h: 60, group: "GR2", status: "ok" },
  { id: "FL09-3", family: "FL", tag: "FL09", count: 3, x: 210, y: 590, w: 80, h: 60, group: "GR2", status: "over" },
  { id: "FL09-4", family: "FL", tag: "FL09", count: 4, x: 285, y: 640, w: 70, h: 50, group: "GR2", status: "ok" },
  { id: "FL09-5", family: "FL", tag: "FL09", count: 5, x: 360, y: 640, w: 70, h: 50, group: "GR2", status: "ok" },
  { id: "FL09-6", family: "FL", tag: "FL09", count: 6, x: 435, y: 640, w: 70, h: 50, group: "GR2", status: "ok" },
];

/** ─────────────────────────────────────────────────────────────────────────────
 * 메인 컴포넌트
 * ──────────────────────────────────────────────────────────────────────────── */
const WarehouseMap: React.FC = () => {
  const [boxes, setBoxes] = useState<BoxNode[]>(initialBoxes);
  const [query, setQuery] = useState("");
  const [familyFilter, setFamilyFilter] = useState<Family | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<Status | "ALL">("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return boxes.filter((b) => {
      if (familyFilter !== "ALL" && b.family !== familyFilter) return false;
      if (statusFilter !== "ALL" && b.status !== statusFilter) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        if (!(`${b.tag} ${b.group} ${b.note ?? ""}`.toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }, [boxes, familyFilter, statusFilter, query]);

  const toggleSelect = (id: string) => {
    setBoxes((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, status: b.status === "selected" ? "ok" : "selected" }
          : b
      )
    );
    setSelectedId((s) => (s === id ? null : id));
  };

  const cycleStatus = (id: string) => {
    const order: Status[] = ["ok", "warning", "lack", "over", "unknown", "disabled"];
    setBoxes((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const idx = order.indexOf(b.status as Status);
        const next = order[(idx + 1) % order.length];
        return { ...b, status: next };
      })
    );
  };

  const incCount = (id: string, delta = 1) => {
    setBoxes((prev) =>
      prev.map((b) => (b.id === id ? { ...b, count: Math.max(0, (b.count ?? 0) + delta) } : b))
    );
  };

  return (
    <Wrap>
      {/* 컨트롤 패널 */}
      <Panel>
        <div className="row">
          <input
            placeholder="검색: FR04, FL05, 그룹(GR2/GR3/형합), 메모"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select value={familyFilter} onChange={(e) => setFamilyFilter(e.target.value as any)}>
            <option value="ALL">All Family</option>
            <option value="FR">FR</option>
            <option value="FL">FL</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
            <option value="ALL">All Status</option>
            <option value="ok">정상</option>
            <option value="warning">주의</option>
            <option value="lack">부족</option>
            <option value="over">과잉</option>
            <option value="unknown">미정</option>
            <option value="disabled">OFF</option>
            <option value="selected">선택됨</option>
          </select>
        </div>
        <LegendList>
          <li><i style={{background: palette.FR}} /> FR</li>
          <li><i style={{background: palette.FL}} /> FL</li>
          <li><b style={{borderColor: statusStroke("ok")}} /> 정상</li>
          <li><b style={{borderColor: statusStroke("warning")}} /> 주의</li>
          <li><b style={{borderColor: statusStroke("lack")}} /> 부족</li>
          <li><b style={{borderColor: statusStroke("over")}} /> 과잉</li>
          <li><b style={{borderColor: statusStroke("disabled")}} /> OFF</li>
          <li><b style={{borderColor: statusStroke("selected")}} /> 선택</li>
        </LegendList>
      </Panel>

      {/* 맵 */}
      <svg viewBox="0 0 2048 740" className="map">
        {/* 배경/벽/통로 간단 드로잉 (필요하면 세부적으로 더 추가 가능) */}
        <rect x={0} y={0} width={2048} height={740} fill={palette.bg} />
        <rect x={120} y={40} width={1800} height={660} fill="#fff" stroke={palette.wall} strokeWidth={18} />

        {/* 샘플 통로(회색) */}
        <rect x={180} y={320} width={1680} height={90} fill={palette.corridor} opacity={0.5} />
        <rect x={260} y={600} width={1530} height={70} fill={palette.corridor} opacity={0.45} />
        <rect x={1230} y={130} width={680} height={70} fill={palette.corridor} opacity={0.35} />

        {/* 구역 라벨 */}
        <text x={470} y={205} fontSize={120} fill="#cfd3d7" fontWeight={700}>GR5</text>
        <text x={1060} y={205} fontSize={120} fill="#cfd3d7" fontWeight={700}>GR3</text>
        <text x={860} y={540} fontSize={120} fill="#cfd3d7" fontWeight={700}>GR2</text>
        <text x={1470} y={480} fontSize={120} fill="#cfd3d7" fontWeight={700}>형합</text>

        {/* 박스 렌더 */}
        {filtered.map((b) => (
          <g
            key={b.id}
            transform={`translate(${b.x}, ${b.y})`}
            onClick={() => toggleSelect(b.id)}
            onDoubleClick={() => cycleStatus(b.id)}
            onContextMenu={(e) => {
              e.preventDefault();
              incCount(b.id, +1);
            }}
            style={{ cursor: b.locked ? "not-allowed" : "pointer" }}
          >
            {/* 본체 */}
            <rect
              width={b.w}
              height={b.h}
              rx={b.radius ?? 6}
              fill={familyFill(b.family)}
              fillOpacity={0.95}
              stroke={statusStroke(b.status)}
              strokeWidth={b.status === "selected" ? 5 : 3}
              opacity={b.locked ? 0.5 : 1}
            />

            {/* 상단 라벨 (count + tag) */}
            <foreignObject width={b.w} height={b.h}>
              <CardDiv className={`family-${b.family}`}>
                <div className="top">
                  <span className="count">{b.count ?? ""}</span>
                  <span className="tag">{b.tag}</span>
                </div>
                <div className="bottom">
                  <span className={`badge badge-${b.status}`}>{statusBadge(b.status)}</span>
                  {b.note && <span className="note" title={b.note}>ⓘ</span>}
                </div>
              </CardDiv>
            </foreignObject>
          </g>
        ))}
      </svg>

      {/* 사이드 인스펙터 (선택된 박스 편집) */}
      <Inspector>
        <h4>선택 상세</h4>
        {selectedId ? (
          <Editor
            node={boxes.find((b) => b.id === selectedId)!}
            onChange={(next) => {
              setBoxes((prev) => prev.map((p) => (p.id === next.id ? next : p)));
            }}
            onRemove={() => {
              setBoxes((prev) => prev.filter((p) => p.id !== selectedId));
              setSelectedId(null);
            }}
          />
        ) : (
          <div className="empty">박스를 선택하면 속성이 표시됩니다.</div>
        )}
      </Inspector>
    </Wrap>
  );
};

export default WarehouseMap;

/** ─────────────────────────────────────────────────────────────────────────────
 * 속성 편집기
 * ──────────────────────────────────────────────────────────────────────────── */
const Editor: React.FC<{
  node: BoxNode;
  onChange: (n: BoxNode) => void;
  onRemove: () => void;
}> = ({ node, onChange, onRemove }) => {
  const update = <K extends keyof BoxNode>(k: K, v: BoxNode[K]) =>
    onChange({ ...node, [k]: v });

  return (
    <div className="editor">
      <div className="grid">
        <label>ID</label>
        <code>{node.id}</code>

        <label>Family</label>
        <select value={node.family} onChange={(e) => update("family", e.target.value as any)}>
          <option value="FR">FR</option>
          <option value="FL">FL</option>
        </select>

        <label>Tag</label>
        <input value={node.tag} onChange={(e) => update("tag", e.target.value)} />

        <label>Count</label>
        <input
          type="number"
          value={node.count ?? 0}
          onChange={(e) => update("count", Number(e.target.value))}
        />

        <label>Status</label>
        <select value={node.status} onChange={(e) => update("status", e.target.value as any)}>
          <option value="ok">정상</option>
          <option value="warning">주의</option>
          <option value="lack">부족</option>
          <option value="over">과잉</option>
          <option value="unknown">미정</option>
          <option value="disabled">OFF</option>
          <option value="selected">선택</option>
        </select>

        <label>Group</label>
        <select value={node.group} onChange={(e) => update("group", e.target.value as any)}>
          <option>GR5</option><option>GR3</option><option>GR2</option><option>형합</option><option>외곽</option>
        </select>

        <label>좌표 (x,y)</label>
        <div className="xy">
          <input type="number" value={node.x} onChange={(e) => update("x", Number(e.target.value))} />
          <input type="number" value={node.y} onChange={(e) => update("y", Number(e.target.value))} />
        </div>

        <label>크기 (w,h)</label>
        <div className="xy">
          <input type="number" value={node.w} onChange={(e) => update("w", Number(e.target.value))} />
          <input type="number" value={node.h} onChange={(e) => update("h", Number(e.target.value))} />
        </div>

        <label>메모</label>
        <input value={node.note ?? ""} onChange={(e) => update("note", e.target.value)} />

        <label>잠금</label>
        <input type="checkbox" checked={!!node.locked} onChange={(e) => update("locked", e.target.checked)} />
      </div>

      <div className="actions">
        <button className="danger" onClick={onRemove}>삭제</button>
      </div>
    </div>
  );
};

/** ─────────────────────────────────────────────────────────────────────────────
 * 스타일
 * ──────────────────────────────────────────────────────────────────────────── */
const Wrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 16px;
  width: 100%;
  min-height: 720px;

  .map {
    width: 100%;
    height: auto;
    background: #fbfbfc;
    border: 1px solid ${palette.board};
    border-radius: 8px;
  }
`;

const Panel = styled.div`
  grid-column: 1 / span 2;
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 12px; border: 1px solid ${palette.board}; border-radius: 8px; background:#fff;

  .row {
    display: flex; gap: 8px; align-items: center;
  }

  input, select {
    border: 1px solid ${palette.board}; border-radius: 6px; padding: 8px 10px; background: #fff;
  }
`;

const LegendList = styled.ul`
  display: flex; gap: 14px; align-items: center; margin: 0; padding: 0; list-style: none;
  li { display:flex; gap:8px; align-items:center; font-size: 13px; }
  i { width: 16px; height: 12px; border-radius: 2px; display:inline-block; }
  b { width: 16px; height: 12px; border: 3px solid #aaa; border-radius: 2px; display:inline-block; }
`;

const CardDiv = styled.div`
  width: 100%; height: 100%;
  display: flex; flex-direction: column; justify-content: space-between;
  padding: 6px 8px; color: ${palette.textInverted};
  font-family: Pretendard, system-ui, -apple-system, Segoe UI, Roboto, "Noto Sans KR", Arial, sans-serif;

  .top {
    display: flex; align-items: center; gap: 6px; font-weight: 700;
    .count { background: rgba(0,0,0,.25); padding: 1px 6px; border-radius: 4px; font-size: 12px; }
    .tag   { font-size: 13px; text-shadow: 0 1px 0 rgba(0,0,0,.2); }
  }

  .bottom {
    display: flex; align-items: center; justify-content: space-between;
    .badge { font-size: 11px; padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(0,0,0,.25); background: rgba(0,0,0,.18); }
    .badge-ok { background: ${palette.ok}; color: #08340b; border-color: #0a600f; }
    .badge-warning { background: ${palette.warning}; color: #272100; border-color: #847e00; }
    .badge-lack { background: ${palette.lack}; color: #fff; border-color: #7a0d08; }
    .badge-over { background: ${palette.over}; color: #200225; border-color: #530b5f; }
    .badge-unknown { background: ${palette.unknown}; color: #1a2326; border-color: #6c7b80; }
    .badge-disabled { background: ${palette.disabled}; color: #222; border-color: #5f5f5f; }
    .badge-selected { background: ${palette.selected}; color: #fff; border-color: #111; }
    .note { margin-left: 8px; font-weight: 700; }
  }
`;

const Inspector = styled.aside`
  border: 1px solid ${palette.board}; border-radius: 8px; background:#fff; padding: 12px;

  h4 { margin: 4px 0 10px; }
  .empty { color: #888; font-size: 14px; }

  .editor .grid {
    display: grid; grid-template-columns: 110px 1fr; gap: 8px 10px; font-size: 14px;
    label { align-self: center; color: #555; }
    code, input, select { border: 1px solid ${palette.board}; border-radius: 6px; background:#fff; padding: 6px 8px; }
    code { background: #f7f8fa; }
    .xy { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  }
  .actions { display:flex; justify-content:flex-end; margin-top: 10px; }
  .danger { background:#ffebe9; color:#b10d0d; border:1px solid #f0c2bf; padding:6px 10px; border-radius:6px; }
`;
