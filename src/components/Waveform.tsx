export function Waveform() {
  const VW = 900;
  const H = 120;
  const cy = H / 2;

  // Build one full period of a sine-like wave spanning [0, VW]
  // n = number of full cycles within VW
  const buildWave = (amp: number, n: number) => {
    const halfCycleW = VW / (n * 2);
    let d = `M 0 ${cy}`;
    for (let i = 0; i < n * 2; i++) {
      const x0 = i * halfCycleW;
      const x1 = (i + 1) * halfCycleW;
      const dir = i % 2 === 0 ? -1 : 1;
      const cp = halfCycleW * 0.3642;
      const cpY = cy + dir * amp;
      d += ` C ${x0 + cp} ${cpY}, ${x1 - cp} ${cpY}, ${x1} ${cy}`;
    }
    return d;
  };

  // Three layers: high-frequency faint background → low-frequency bright foreground
  // Each layer tiles at its own speed using the waveScroll keyframe from styles.css
  const layers = [
    { n: 3, amp: 8,  color: "rgba(255,246,233,0.07)", strokeWidth: 1,   speed: 22 },
    { n: 2, amp: 16, color: "rgba(191,96,64,0.22)",   strokeWidth: 1.5, speed: 13 },
    { n: 1, amp: 26, color: "rgba(255,246,233,0.48)", strokeWidth: 2,   speed: 8  },
  ] as const;

  return (
    <div className="relative h-full w-full overflow-hidden" aria-hidden>
      {layers.map(({ n, amp, color, strokeWidth, speed }) => {
        const path = buildWave(amp, n);
        return (
          // Each layer is a 200%-wide strip that scrolls left by 50% (= one full period)
          // producing a perfectly seamless infinite loop via the waveScroll CSS keyframe
          <div
            key={n}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              width: "200%",
              animation: `waveScroll ${speed}s linear infinite`,
              willChange: "transform",
            }}
          >
            {([0, 1] as const).map((k) => (
              <svg
                key={k}
                viewBox={`0 0 ${VW} ${H}`}
                preserveAspectRatio="none"
                style={{ width: "50%", height: "100%", display: "block" }}
              >
                <path
                  d={path}
                  fill="none"
                  stroke={color}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                />
              </svg>
            ))}
          </div>
        );
      })}
    </div>
  );
}
