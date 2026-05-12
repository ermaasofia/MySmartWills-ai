'use client';

import { useCallback, useEffect, useRef } from 'react';
import createGlobe from 'cobe';
import { COUNTRIES } from '@/lib/constants';
import { CountryFlag } from '@/components/ui/country-flag';

const CAPITAL_COORDS: Record<string, [number, number]> = {
  MY: [3.139, 101.687],
  SG: [1.352, 103.819],
  HK: [22.302, 114.177],
  CN: [39.904, 116.407],
  TW: [25.033, 121.565],
  ID: [-6.208, 106.846],
  TH: [13.756, 100.502],
  AU: [-33.869, 151.209],
  NZ: [-36.848, 174.763],
  BN: [4.903, 114.939],
  VN: [21.028, 105.804],
  PH: [14.599, 120.984],
};

const MARKERS = COUNTRIES.map((c) => ({
  id: `apac-${c.code.toLowerCase()}`,
  code: c.code,
  location: CAPITAL_COORDS[c.code],
}));

const ARCS = [
  { id: 'apac-arc-my-sg', from: CAPITAL_COORDS.MY, to: CAPITAL_COORDS.SG },
  { id: 'apac-arc-my-hk', from: CAPITAL_COORDS.MY, to: CAPITAL_COORDS.HK },
  { id: 'apac-arc-sg-au', from: CAPITAL_COORDS.SG, to: CAPITAL_COORDS.AU },
  { id: 'apac-arc-hk-tw', from: CAPITAL_COORDS.HK, to: CAPITAL_COORDS.TW },
  { id: 'apac-arc-id-ph', from: CAPITAL_COORDS.ID, to: CAPITAL_COORDS.PH },
  { id: 'apac-arc-au-nz', from: CAPITAL_COORDS.AU, to: CAPITAL_COORDS.NZ },
];

const SPEED = 0.003;

export function ApacGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null);
  const dragOffset = useRef({ phi: 0, theta: 0 });
  const phiOffsetRef = useRef(0);
  const thetaOffsetRef = useRef(0);
  const isPausedRef = useRef(false);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY };
    if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
    isPausedRef.current = true;
  }, []);

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi;
      thetaOffsetRef.current += dragOffset.current.theta;
      dragOffset.current = { phi: 0, theta: 0 };
    }
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
    isPausedRef.current = false;
  }, []);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        };
      }
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handlePointerUp]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    let globe: ReturnType<typeof createGlobe> | null = null;
    let animationId = 0;
    let phi = 0;

    function init() {
      const width = canvas.offsetWidth;
      if (width === 0 || globe) return;

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width,
        height: width,
        phi: 0,
        theta: 0.25,
        dark: 0,
        diffuse: 1.5,
        mapSamples: 16000,
        mapBrightness: 10,
        baseColor: [1, 1, 1],
        markerColor: [0, 0, 0],
        glowColor: [0.94, 0.93, 0.91],
        markerElevation: 0.02,
        markers: MARKERS.map((m) => ({ location: m.location, size: 0.03, id: m.id })),
        arcs: ARCS.map((a) => ({ from: a.from, to: a.to, id: a.id })),
        arcColor: [0, 0, 0],
        arcWidth: 0.5,
        arcHeight: 0.25,
        opacity: 0.7,
      });

      function animate() {
        if (!isPausedRef.current) phi += SPEED;
        globe!.update({
          phi: phi + phiOffsetRef.current + dragOffset.current.phi,
          theta: 0.25 + thetaOffsetRef.current + dragOffset.current.theta,
        });
        animationId = requestAnimationFrame(animate);
      }
      animate();
      setTimeout(() => {
        if (canvas) canvas.style.opacity = '1';
      });
    }

    if (canvas.offsetWidth > 0) {
      init();
    } else {
      const ro = new ResizeObserver((entries) => {
        const w = entries[0]?.contentRect.width ?? 0;
        if (w > 0) {
          ro.disconnect();
          init();
        }
      });
      ro.observe(canvas);
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (globe) globe.destroy();
    };
  }, []);

  return (
    <div className="relative aspect-square w-full select-none">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'grab',
          opacity: 0,
          transition: 'opacity 1.2s ease',
          borderRadius: '50%',
          touchAction: 'none',
        }}
      />
      {MARKERS.map((m) => (
        <div
          key={m.id}
          style={{
            position: 'absolute',
            positionAnchor: `--cobe-${m.id}`,
            bottom: 'anchor(top)',
            left: 'anchor(center)',
            translate: '-50% 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            pointerEvents: 'none',
            opacity: `var(--cobe-visible-${m.id}, 0)`,
            filter: `blur(calc((1 - var(--cobe-visible-${m.id}, 0)) * 8px))`,
            transition: 'opacity 0.3s, filter 0.3s',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono, ui-monospace, monospace)',
              fontSize: '0.55rem',
              color: '#000',
              background: '#fff',
              padding: '2px 6px',
              borderRadius: 3,
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <CountryFlag code={m.code} className="h-2.5 w-[15px] object-cover" />
            {m.code}
          </span>
        </div>
      ))}
    </div>
  );
}
