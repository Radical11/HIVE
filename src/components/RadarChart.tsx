"use client";

interface RadarChartProps {
    data: { frontend: number; backend: number; devops: number };
    size?: number;
}

export default function RadarChart({ data, size = 100 }: RadarChartProps) {
    const cx = size / 2;
    const cy = size / 2;
    const maxRadius = size / 2 - 10;

    // Triangle vertices (top, bottom-left, bottom-right)
    const angles = [-90, 150, 30]; // degrees
    const labels = ["FE", "BE", "DO"];
    const values = [data.frontend / 100, data.backend / 100, data.devops / 100];

    const getPoint = (angleDeg: number, radius: number) => {
        const angleRad = (angleDeg * Math.PI) / 180;
        return {
            x: cx + radius * Math.cos(angleRad),
            y: cy + radius * Math.sin(angleRad),
        };
    };

    // Grid levels
    const levels = [0.25, 0.5, 0.75, 1];

    // Data points
    const dataPoints = values.map((v, i) => getPoint(angles[i], maxRadius * v));
    const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Grid */}
            {levels.map((level) => {
                const points = angles.map((a) => getPoint(a, maxRadius * level));
                const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
                return (
                    <path key={level} d={path} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                );
            })}

            {/* Axis lines */}
            {angles.map((a, i) => {
                const p = getPoint(a, maxRadius);
                return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />;
            })}

            {/* Data polygon */}
            <path d={dataPath} fill="rgba(0, 230, 118, 0.15)" stroke="#00E676" strokeWidth="1.5" />

            {/* Data points */}
            {dataPoints.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="3" fill="#00E676" />
            ))}

            {/* Labels */}
            {angles.map((a, i) => {
                const p = getPoint(a, maxRadius + 10);
                return (
                    <text
                        key={i}
                        x={p.x}
                        y={p.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="fill-text-muted text-[8px] font-mono"
                    >
                        {labels[i]}
                    </text>
                );
            })}
        </svg>
    );
}
