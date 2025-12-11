// components/icons/PlantLayout.tsx
"use client";
import * as React from "react";
import { plantBoxes } from "@/data/plantLayoutData";

type Props = React.SVGProps<SVGSVGElement> & {
  title?: string;
  ariaLabel?: string;
};

const PlantLayoutComp: React.FC<Props> = ({
  title = "plant-layout",
  ariaLabel,
  width = "100%",
  height = "100%",
  className,
  ...rest
}) => {
  return (
    <svg
      id="_레이어_1"
      data-name="레이어 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1655.81 549.94"
      role="img"
      aria-label={ariaLabel ?? title}
      width={width}
      height={height}
      className={className}
      {...rest}
    >
      <title>{title}</title>

      {/* ── 원본 스타일 정의: 폰트/선두께/색상 그대로 ── */}
      <defs>
        <style>
          {`
          .cls-1{fill:#ffa008}
          .cls-2{letter-spacing:-.02em}
          .cls-3{fill:#48beff}
          .cls-4{fill:#d7ccff}
          .cls-4,.cls-5,.cls-6,.cls-7,.cls-8{stroke-miterlimit:10}
          .cls-4,.cls-7{stroke:#a8a8a8;stroke-width:3px}
          .cls-9{fill:#ef73f9}
          .cls-10,.cls-7{fill:#fff}
          .cls-11{letter-spacing:-.02em}
          .cls-12,.cls-5,.cls-8{fill:none}
          .cls-5{stroke:#b2b2b2;stroke-width:3.5px}
          .cls-13{fill:#fffa4d}
          .cls-6{fill:#dbdbdb;stroke:#dbdbdb}
          .cls-6,.cls-8{stroke-width:5px}
          .cls-14{fill:#bdcace}
          .cls-15{fill:#bfbfbf;font-family:Pretendard,Pretendard-Black-KSCpc-EUC-H,sans-serif;font-size:49.5px;font-weight:800}
          .cls-16{fill:#53ed20}
          .cls-17{letter-spacing:-.04em}
          .cls-18{fill:#eaeaea}
          .cls-19{font-family:Pretendard,Pretendard-Bold-KSCpc-EUC-H,sans-serif;font-size:11.7px;font-weight:700}
          .cls-20{letter-spacing:0}
          .cls-8{stroke:#6d6d6d}
          .cls-21{fill:#b5b5b5}
        `}
        </style>
      </defs>

      {/* ── 배경(원본 SVG 1:1) ── */}
      <g>
        <g>
          <g>
            <rect className="cls-18" x="12.45" y="10" width="1543.66" height="529.94"/>
            <rect className="cls-6" x="1556.11" y="10" width="87.25" height="529.94"/>
          </g>
          <g>
            <text className="cls-15" transform="translate(400.32 102.85)">GR5</text>
            <text className="cls-15" transform="translate(843.83 181.71)">GR3</text>
            <text className="cls-15" transform="translate(533.1 443.27)">GR2</text>
            <text className="cls-15" transform="translate(1054.4 407.79)">형합</text>

            <rect className="cls-5" x="1504.02" y="10.23" width="51.1" height="118.69"/>
            <rect className="cls-5" x="1445.66" y="434.2" width="110.45" height="105.51"/>

            {/* 가이드 레일 */}
            <rect className="cls-14" x="225.91" y="159.82" width="207.25" height="10.39"/>
            <rect className="cls-14" x="460.34" y="159.82" width="233.09" height="10.39"/>
            <polygon className="cls-14" points="1021.81 152.97 1021.81 82.96 1011.42 82.96 1011.42 152.97 1011.42 153.87 1011.42 163.36 1348.63 163.36 1348.63 152.97 1021.81 152.97"/>
            <rect className="cls-14" x="198.39" y="341.35" width="104.64" height="10.39"/>
            <rect className="cls-14" x="326.6" y="341.35" width="218.57" height="10.39"/>
            <rect className="cls-14" x="597.85" y="341.35" width="264.62" height="10.39"/>
            <rect className="cls-14" x="1108.45" y="337.45" width="190.47" height="18.18"/>

            {/* 내부 구조물 */}
            <g>
              <rect className="cls-5" x="843.83" y="301.86" width="94.13" height="86.06"/>
              <polygon className="cls-5" points="1107.76 294.42 1027.39 294.42 1027.39 431.93 1168.85 431.93 1168.85 316.49 1107.76 316.49 1107.76 294.42"/>
              <polygon className="cls-5" points="1276.85 295.82 1387.88 295.82 1387.88 353.89 1362.57 353.89 1354.03 365.04 1354.03 405.89 1276.85 405.89 1276.85 361.79 1256.88 361.79 1256.88 330.63 1277.09 330.63 1276.85 295.82"/>
            </g>

            {/* 연결 라인 */}
            <polyline className="cls-5" points="487.34 333.22 618.17 333.22 618.17 354.99 639.08 368.58 704.96 368.58 734.02 391.92 734.02 477.46 446.23 477.46 446.23 351.16"/>

            {/* 좌측 하단 하우징 */}
            <g>
              <polygon className="cls-5" points="216.04 359.35 216.04 440.53 353.78 440.53 353.78 387.8 279.92 387.8 279.92 359.35 216.04 359.35"/>
              <polygon className="cls-5" points="279.92 359.35 279.92 336.47 353.78 336.47 353.78 387.8 279.92 387.8 279.92 359.35"/>
              <polygon className="cls-5" points="224.17 333.47 224.17 312.66 279.92 312.66 279.92 359.35 224.17 359.35 224.17 333.47"/>
            </g>

            {/* 상단 좌측 구조 */}
            <g>
              <polyline className="cls-5" points="581.48 18.78 614.4 51.69 614.4 89.32 586.99 118.04 519.16 118.04 519.16 139.03 484.79 139.03 476.19 170.21"/>
              <rect className="cls-5" x="560.51" y="130.36" width="49.01" height="52.57"/>
              <line className="cls-5" x1="337.17" y1="168.92" x2="337.17" y2="10.71"/>
            </g>

            {/* 외곽/통로 경계 */}
            <path className="cls-21" d="M1466.93,238.51V72.44h-226.21V10.71h-18.35v61.72h-124.72l-52.26-39.77h-288.22V10.71h-18.35v227.79H173.3V10.71h-29.26v529.23h29.26v-28.61h924.35v28.61h33.68v-28.61h23.46v28.61h33.68v-28.61h239.45v-227.47h128.2v-45.36h-89.18ZM1393.07,480.63H173.3v-196.77h1219.77v196.77ZM1435.57,238.51h-678.4V52.2h288.22l52.26,41.17h337.92v145.14Z"/>
          </g>
        </g>
      </g>

      {/* ── 데이터 라벨(plantBoxes) : 숫자/코드 2줄, 중앙 정렬, 간격 고정 ── */}
      <g aria-label="labels">
        {plantBoxes.map((b) => {
          const cx = b.x + b.w / 2;
          const cy = b.y + b.h / 2;
          return (
            <g key={b.id}>
              {/* 데이터 박스: 원본처럼 stroke/rounding 없음 */}
              <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={b.color} />
              {/* 라벨: 원본과 동일한 폰트/간격 */}
              {b.count !== 0 ? (
                <text className="cls-19" x={cx} y={cy - 3} textAnchor="middle">
                  <tspan>{b.count}</tspan>
                  <tspan x={cx} dy={10.5}>{b.code}</tspan>
                </text>
              ) : (
                <text className="cls-19" x={cx} y={cy + 6} textAnchor="middle">{b.code}</text>
              )}
            </g>
          );
        })}
      </g>

      {/* ── 외곽 테두리(원본) ── */}
      <rect className="cls-8" x="12.45" y="10" width="1543.66" height="529.94"/>
      <rect className="cls-12" width="1655.81" height="549.94"/>
    </svg>
  );
};

export default PlantLayoutComp;
