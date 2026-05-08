export function Waveform() {
  // Build a smooth sine-like path using cubic beziers.
  const width = 1000;
  const height = 120;
  const cy = height / 2;
  const amplitude = 28;
  const cycles = 2.5;
  const halfCycles = cycles * 2; // 5
  const halfW = width / halfCycles; // 200

  const buildPath = (phaseShift = 0) => {
    let d = `M ${0 + phaseShift} ${cy}`;
    for (let i = 0; i < halfCycles + 1; i++) {
      const x0 = i * halfW + phaseShift;
      const x1 = (i + 1) * halfW + phaseShift;
      const dir = i % 2 === 0 ? -1 : 1;
      const c1x = x0 + halfW * 0.3642;
      const c2x = x0 + halfW * 0.6358;
      const cy1 = cy + dir * amplitude * 2;
      d += ` C ${c1x} ${cy1}, ${c2x} ${cy1}, ${x1} ${cy}`;
    }
    return d;
  };

  const primary = buildPath(-halfW); // start one half-cycle before 0 for seamless drift
  const secondary = buildPath(-halfW / 2); // phase-offset by half a cycle

  return (
    <div className="flex h-full w-full items-center justify-center px-6">
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Calm breathing waveform"
        style={{ display: "block" }}
      >
        {/* Secondary, faint warm-peach wave (slower) */}
        <path
          d={secondary}
          fill="none"
          stroke="rgba(191, 96, 64, 0.2)"
          strokeWidth={1}
          strokeLinecap="round"
          style={{
            strokeDasharray: `${halfW} ${halfW}`,
            animation: "waveDriftSlow 9s linear infinite",
          }}
        />
        {/* Primary cream wave */}
        <path
          d={primary}
          fill="none"
          stroke="rgba(255, 246, 233, 0.5)"
          strokeWidth={1.5}
          strokeLinecap="round"
          style={{
            strokeDasharray: `${halfW * 2} ${halfW * 2}`,
            animation: "waveDrift 6s linear infinite",
          }}
        />
      </svg>
      <style>{`
        @keyframes waveDrift {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: ${halfW * 2}; }
        }
        @keyframes waveDriftSlow {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: ${halfW * 2}; }
        }
      `}</style>
    </div>
  );
}
