import { formatDateLabel } from "@/src/features/dashboard/lib/dashboard.utils";

import type { ExerciseProgressSummaryPoint } from "../lib/training-plans.types";

type ExerciseProgressSummaryChartProps = {
  data: ExerciseProgressSummaryPoint[];
  labels: {
    empty: string;
    volume: string;
    estimatedOneRepMax: string;
  };
};

const CHART_WIDTH = 760;
const CHART_HEIGHT = 280;
const PADDING_X = 56;
const PADDING_TOP = 24;
const PADDING_BOTTOM = 42;

export function ExerciseProgressSummaryChart({
  data,
  labels,
}: ExerciseProgressSummaryChartProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-[18px] border border-dashed border-white/10 bg-black/20 px-6 py-12 text-center text-white/52">
        {labels.empty}
      </div>
    );
  }

  const innerWidth = CHART_WIDTH - PADDING_X * 2;
  const innerHeight = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;
  const volumeMax = Math.max(...data.map((item) => item.totalVolume), 1);
  const oneRepMaxMax = Math.max(...data.map((item) => item.bestEstimatedOneRepMax), 1);
  const stepX = data.length > 1 ? innerWidth / (data.length - 1) : 0;
  const barWidth = Math.min(44, innerWidth / Math.max(data.length * 1.8, 1));

  const linePath = data
    .map((item, index) => {
      const x = PADDING_X + stepX * index;
      const y =
        PADDING_TOP +
        innerHeight -
        (item.bestEstimatedOneRepMax / oneRepMaxMax) * innerHeight;

      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <div className="overflow-hidden rounded-[20px] border border-white/8 bg-[#090909] p-4">
      <div className="mb-4 flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.14em] text-white/42">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#1cc31c]" />
          {labels.volume}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-0.5 w-5 rounded-full bg-[#fa614d]" />
          {labels.estimatedOneRepMax}
        </span>
      </div>

      <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="h-auto w-full">
        <defs>
          <linearGradient id="progress-volume-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#39d353" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#1cc31c" stopOpacity="0.28" />
          </linearGradient>
        </defs>

        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = PADDING_TOP + innerHeight * ratio;

          return (
            <line
              key={ratio}
              x1={PADDING_X}
              x2={CHART_WIDTH - PADDING_X}
              y1={y}
              y2={y}
              stroke="rgba(255,255,255,0.08)"
              strokeDasharray="4 6"
            />
          );
        })}

        {data.map((item, index) => {
          const x = PADDING_X + stepX * index;
          const barHeight = (item.totalVolume / volumeMax) * innerHeight;
          const barY = PADDING_TOP + innerHeight - barHeight;

          return (
            <g key={`${item.date}-${index}`}>
              <rect
                x={x - barWidth / 2}
                y={barY}
                width={barWidth}
                height={barHeight}
                rx="10"
                fill="url(#progress-volume-fill)"
              />
              <text
                x={x}
                y={CHART_HEIGHT - 12}
                textAnchor="middle"
                fill="rgba(255,255,255,0.52)"
                fontSize="11"
              >
                {formatDateLabel(item.date)}
              </text>
            </g>
          );
        })}

        <path
          d={linePath}
          fill="none"
          stroke="#fa614d"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {data.map((item, index) => {
          const x = PADDING_X + stepX * index;
          const y =
            PADDING_TOP +
            innerHeight -
            (item.bestEstimatedOneRepMax / oneRepMaxMax) * innerHeight;

          return (
            <g key={`point-${item.date}-${index}`}>
              <circle cx={x} cy={y} r="5" fill="#fa614d" />
              <circle cx={x} cy={y} r="10" fill="#fa614d" fillOpacity="0.18" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
