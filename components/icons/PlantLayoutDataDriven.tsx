// components/icons/PlantLayoutDataDriven.tsx
import * as React from "react";
import { rects } from "@/data/plantLayoutRects";

export default function PlantLayoutDataDriven(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 1655.81 549.94" {...props}>
      {rects.map(r => (
        <rect key={r.id} x={r.x} y={r.y} width={r.w} height={r.h}
              className={r.className} fill={r.fill} />
      ))}
    </svg>
  );
}
