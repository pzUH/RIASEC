import React from 'react';
import { RIASEC_DIMENSIONS, HOLLAND_HEXAGON_ORDER } from '../data/riasecData';
import { AssessmentResult, RiasecDimension } from '../types/riasec';

interface HexagonChartProps {
  result: AssessmentResult;
  size?: number;
}

export const HexagonChart: React.FC<HexagonChartProps> = ({ result, size = 320 }) => {
  const center = size / 2;
  const maxRadius = (size / 2) * 0.72; // Leave room for vertex labels

  // 6 vertices at 60 degree intervals, starting at -90deg (top) for Realistic
  const angleStep = (2 * Math.PI) / 6;
  const startAngle = -Math.PI / 2;

  // Grid levels (e.g., 2, 4, 6 max score)
  const gridLevels = [1, 2, 3, 4, 5, 6];

  // Calculate polygon points for a given scale (1 to 6)
  const getGridPoints = (level: number) => {
    const r = (level / 6) * maxRadius;
    return HOLLAND_HEXAGON_ORDER.map((_, i) => {
      const angle = startAngle + i * angleStep;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  };

  // Calculate user score polygon points
  const userPolygonPoints = HOLLAND_HEXAGON_ORDER.map((dim, i) => {
    const score = result.scores[dim] || 0;
    // ensure at least slight radius so it doesn't collapse to 0
    const normalizedScore = Math.max(score, 0.3);
    const r = (normalizedScore / 6) * maxRadius;
    const angle = startAngle + i * angleStep;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, dim, score };
  });

  const polygonPathString = userPolygonPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible select-none"
      >
        <defs>
          <radialGradient id="hexGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
            <stop offset="70%" stopColor="#4f46e5" stopOpacity="0.1" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="userShapeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Outer radial glow */}
        <circle cx={center} cy={center} r={maxRadius * 1.1} fill="url(#hexGlow)" />

        {/* Concentric Hexagon Grid Lines */}
        {gridLevels.map((lvl) => (
          <polygon
            key={lvl}
            points={getGridPoints(lvl)}
            fill={lvl === 6 ? 'rgba(255,255,255,0.02)' : 'transparent'}
            stroke={lvl === 6 ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.08)'}
            strokeWidth={lvl === 6 ? 1.5 : 1}
            strokeDasharray={lvl < 6 ? '3 3' : undefined}
          />
        ))}

        {/* Spokes from center to outer vertices */}
        {HOLLAND_HEXAGON_ORDER.map((_, i) => {
          const angle = startAngle + i * angleStep;
          const x = center + maxRadius * Math.cos(angle);
          const y = center + maxRadius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1"
            />
          );
        })}

        {/* User Data Polygon */}
        <polygon
          points={polygonPathString}
          fill="url(#userShapeGradient)"
          stroke="#818cf8"
          strokeWidth="2.5"
          className="transition-all duration-700 ease-out drop-shadow-[0_0_12px_rgba(99,102,241,0.6)]"
        />

        {/* Vertex score nodes */}
        {userPolygonPoints.map((p) => {
          const dimInfo = RIASEC_DIMENSIONS[p.dim];
          const isTopCode = result.topCode.includes(p.dim);
          return (
            <g key={p.dim} className="transition-all duration-500">
              <circle
                cx={p.x}
                cy={p.y}
                r={isTopCode ? 6 : 4.5}
                fill={dimInfo.color}
                stroke="#ffffff"
                strokeWidth={isTopCode ? 2 : 1.5}
                className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              />
            </g>
          );
        })}

        {/* Vertex Outer Labels (R, I, A, S, E, C) */}
        {HOLLAND_HEXAGON_ORDER.map((dim, i) => {
          const angle = startAngle + i * angleStep;
          const labelDist = maxRadius + 24;
          const x = center + labelDist * Math.cos(angle);
          const y = center + labelDist * Math.sin(angle);
          const dimInfo = RIASEC_DIMENSIONS[dim];
          const isTopCode = result.topCode.includes(dim);
          const score = result.scores[dim];

          return (
            <g key={`lbl-${dim}`} transform={`translate(${x}, ${y})`}>
              {/* Outer circular badge */}
              <circle
                cx="0"
                cy="0"
                r="13"
                fill={isTopCode ? `${dimInfo.color}33` : 'rgba(15, 23, 42, 0.8)'}
                stroke={dimInfo.color}
                strokeWidth={isTopCode ? '2' : '1.2'}
              />
              <text
                x="0"
                y="4"
                textAnchor="middle"
                fontSize="11"
                fontWeight="800"
                fill={dimInfo.color}
              >
                {dim}
              </text>
              <text
                x="0"
                y={angle > 0 && angle < Math.PI ? '22' : '-16'}
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="600"
                fill={isTopCode ? '#f8fafc' : '#94a3b8'}
              >
                {dimInfo.nameId} ({score}/6)
              </text>
            </g>
          );
        })}
      </svg>
      <div className="text-[11px] text-slate-400 mt-2 text-center">
        Diagram Hexagon John Holland (Kesesuaian Tipe Sisi-ke-Sisi)
      </div>
    </div>
  );
};
