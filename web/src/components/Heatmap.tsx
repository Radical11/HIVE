"use client";

interface HeatmapProps {
    contributions: number[];
    width?: number;
    cellSize?: number;
    gap?: number;
}

export default function Heatmap({ contributions, width, cellSize = 10, gap = 2 }: HeatmapProps) {
    const weeks = Math.ceil(contributions.length / 7);
    const svgWidth = width || weeks * (cellSize + gap);
    const svgHeight = 7 * (cellSize + gap);

    const getColor = (value: number) => {
        if (value === 0) return "rgba(255,255,255,0.03)";
        if (value <= 2) return "rgba(0, 230, 118, 0.15)";
        if (value <= 4) return "rgba(0, 230, 118, 0.3)";
        if (value <= 6) return "rgba(0, 230, 118, 0.5)";
        if (value <= 8) return "rgba(0, 230, 118, 0.7)";
        return "rgba(0, 230, 118, 0.9)";
    };

    return (
        <svg width={svgWidth} height={svgHeight} className="overflow-visible">
            {contributions.map((val, i) => {
                const week = Math.floor(i / 7);
                const day = i % 7;
                return (
                    <rect
                        key={i}
                        x={week * (cellSize + gap)}
                        y={day * (cellSize + gap)}
                        width={cellSize}
                        height={cellSize}
                        rx={2}
                        fill={getColor(val)}
                        className="transition-all duration-200 hover:stroke-neon-green hover:stroke-1"
                    />
                );
            })}
        </svg>
    );
}
