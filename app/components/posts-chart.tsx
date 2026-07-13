import { getQuarterlyPostCounts } from "app/blog/utils";

function smoothPath(points: { x: number; y: number }[]) {
  if (points.length === 0) return "";
  if (points.length === 1) {
    return `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  }

  let path = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const midX = (current.x + next.x) / 2;
    path += ` C ${midX.toFixed(1)} ${current.y.toFixed(1)}, ${midX.toFixed(1)} ${next.y.toFixed(1)}, ${next.x.toFixed(1)} ${next.y.toFixed(1)}`;
  }

  return path;
}

export function BlogPostsChart() {
  const data = getQuarterlyPostCounts();
  const width = 560;
  const height = 140;
  const padding = { top: 8, right: 18, bottom: 24, left: 18 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const xDenom = Math.max(data.length - 1, 1);

  const points = data.map((d, i) => ({
    x: padding.left + (i / xDenom) * chartWidth,
    y: padding.top + chartHeight - (d.count / maxCount) * chartHeight,
    count: d.count,
    label: d.label,
  }));

  const linePath = smoothPath(points);

  const baseline = padding.top + chartHeight;
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${baseline} L ${points[0].x.toFixed(1)} ${baseline} Z`;

  const yearTicks = data
    .map((d, i) => ({ year: d.key.slice(0, 4), index: i }))
    .filter((d, i, arr) => d.year !== arr[i - 1]?.year);

  return (
    <figure className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto text-amber-700/80 dark:text-amber-400"
        role="img"
        aria-label="Blog posts published per quarter since the first post"
      >
        <path
          d={areaPath}
          className="fill-amber-200/50 dark:fill-amber-500/20"
        />
        <path
          d={linePath}
          fill="none"
          className="stroke-amber-500 dark:stroke-amber-400"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {yearTicks.map((tick) => {
          const x = padding.left + (tick.index / xDenom) * chartWidth;
          return (
            <text
              key={tick.year}
              x={x}
              y={height - 6}
              textAnchor="middle"
              className="fill-current text-[10px]"
            >
              {tick.year}
            </text>
          );
        })}
      </svg>
      <figcaption className="mt-2 text-sm text-amber-800/85 dark:text-amber-300 sr-only">
        Posts per quarter, all time
      </figcaption>
    </figure>
  );
}
