"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

type Segment = {
  key: number;
  value: number;
  fill: string;
};

interface Props {
  value: number;
  min?: number;
  max?: number;
  title?: string;
  bottomLabel?: string;
}

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

export default function EffectivenessSpeedometerChart({
  value,
  min = 1,
  max = 5,
  title = "Speedometer",
  bottomLabel,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 600,
    height: 360,
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      setSize((prev) =>
        prev.width === w && prev.height === h ? prev : { width: w, height: h }
      );
    };

    update();
    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const safeValue = useMemo(() => clamp(value, min, max), [value, min, max]);

  const segments = useMemo<Segment[]>(() => {
    const count = max - min + 1;
    const denom = Math.max(1, max - min);
    return Array.from({ length: count }, (_, i) => {
      const v = min + i;
      const ratio = (v - min) / denom;
      const hue = ratio * 120;
      return {
        key: v,
        value: 1,
        fill: `hsl(${hue} 95% 45%)`,
      };
    });
  }, [min, max]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      <div ref={containerRef} className="h-[360px] w-full">
        {(() => {
          const w = Math.max(1, size.width);
          const h = Math.max(1, size.height);
          const cx = w / 2;
          const cy = h * 0.85;
          const outerRadius = Math.min(w * 0.42, h * 0.7);
          const innerRadius = outerRadius * 0.65;
          const needleLength = outerRadius * 0.95;

          const angle =
            180 - ((safeValue - min) / Math.max(1, max - min)) * 180;
          const rad = (Math.PI / 180) * angle;
          const nx = cx + needleLength * Math.cos(rad);
          const ny = cy - needleLength * Math.sin(rad);

          const tickValues = Array.from(
            { length: max - min + 1 },
            (_, i) => min + i
          );

          return (
            <PieChart width={w} height={h}>
              <Pie
                data={segments}
                dataKey="value"
                startAngle={180}
                endAngle={0}
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                paddingAngle={1}
                stroke="none"
                isAnimationActive={false}
                nameKey="key"
              >
                {segments.map((s) => (
                  <Cell key={s.key} fill={s.fill} />
                ))}
              </Pie>

              <g>
                {tickValues.map((tv) => {
                  const a = 180 - ((tv - min) / Math.max(1, max - min)) * 180;
                  const r = (Math.PI / 180) * a;
                  const tx = cx + (outerRadius + 16) * Math.cos(r);
                  const ty = cy - (outerRadius + 16) * Math.sin(r);
                  return (
                    <text
                      key={tv}
                      x={tx}
                      y={ty}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={12}
                      fill="#111827"
                    >
                      {tv}
                    </text>
                  );
                })}

                <text
                  x={cx}
                  y={h * 0.96}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={12}
                  fill="#111827"
                >
                  {bottomLabel ?? ""}
                </text>

                <line
                  x1={cx}
                  y1={cy}
                  x2={nx}
                  y2={ny}
                  stroke="#111827"
                  strokeWidth={3}
                />
                <circle cx={cx} cy={cy} r={6} fill="#111827" />

                <text
                  x={cx}
                  y={cy - innerRadius * 0.35}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={20}
                  fontWeight={700}
                  fill="#111827"
                >
                  {safeValue.toFixed(1)}
                </text>
              </g>

              <Tooltip
                formatter={(_v: any, _n: any, payload: any) => {
                  const k = payload?.payload?.key;
                  return [k, "Scale"];
                }}
              />
            </PieChart>
          );
        })()}
      </div>
    </div>
  );
}
