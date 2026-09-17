'use client';

import {
  useCallback,
  useEffect,
  useRef,
} from 'react';

import createGlobe from 'cobe';

import { COUNTRIES } from '@/lib/constants';
import { CountryFlag } from '@/components/ui/country-flag';

/* =========================================================
   CAPITAL COORDINATES
========================================================= */

const CAPITAL_COORDS: Record<
  string,
  [number, number]
> = {
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

/* =========================================================
   MARKERS
========================================================= */

const MARKERS = COUNTRIES.map((country) => ({
  id: `apac-${country.code.toLowerCase()}`,
  code: country.code,
  location: CAPITAL_COORDS[country.code],
}));

/* =========================================================
   CONNECTION ARCS
========================================================= */

const ARCS = [
  {
    id: 'apac-arc-my-sg',
    from: CAPITAL_COORDS.MY,
    to: CAPITAL_COORDS.SG,
  },
  {
    id: 'apac-arc-my-hk',
    from: CAPITAL_COORDS.MY,
    to: CAPITAL_COORDS.HK,
  },
  {
    id: 'apac-arc-sg-au',
    from: CAPITAL_COORDS.SG,
    to: CAPITAL_COORDS.AU,
  },
  {
    id: 'apac-arc-hk-tw',
    from: CAPITAL_COORDS.HK,
    to: CAPITAL_COORDS.TW,
  },
  {
    id: 'apac-arc-id-ph',
    from: CAPITAL_COORDS.ID,
    to: CAPITAL_COORDS.PH,
  },
  {
    id: 'apac-arc-au-nz',
    from: CAPITAL_COORDS.AU,
    to: CAPITAL_COORDS.NZ,
  },
];

const SPEED = 0.0024;

/* =========================================================
   COLORS
========================================================= */

/**
 * SmartWills red:
 * #A42025
 *
 * COBE uses RGB values from 0 to 1.
 */
const SMARTWILLS_RED: [
  number,
  number,
  number,
] = [0.643, 0.125, 0.145];

/* =========================================================
   COMPONENT
========================================================= */

export function ApacGlobe({ showPins = true }: { showPins?: boolean }) {
  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  const pointerInteracting = useRef<{
    x: number;
    y: number;
  } | null>(null);

  const dragOffset = useRef({
    phi: 0,
    theta: 0,
  });

  const phiOffsetRef = useRef(0);
  const thetaOffsetRef = useRef(0);

  const isPausedRef = useRef(false);

  /* =======================================================
     POINTER DOWN
  ======================================================= */

  const handlePointerDown = useCallback(
    (event: React.PointerEvent) => {
      pointerInteracting.current = {
        x: event.clientX,
        y: event.clientY,
      };

      if (canvasRef.current) {
        canvasRef.current.style.cursor =
          'grabbing';
      }

      isPausedRef.current = true;
    },
    []
  );

  /* =======================================================
     POINTER UP
  ======================================================= */

  const handlePointerUp =
    useCallback(() => {
      if (
        pointerInteracting.current !==
        null
      ) {
        phiOffsetRef.current +=
          dragOffset.current.phi;

        thetaOffsetRef.current +=
          dragOffset.current.theta;

        dragOffset.current = {
          phi: 0,
          theta: 0,
        };
      }

      pointerInteracting.current = null;

      if (canvasRef.current) {
        canvasRef.current.style.cursor =
          'grab';
      }

      isPausedRef.current = false;
    }, []);

  /* =======================================================
     POINTER MOVE
  ======================================================= */

  useEffect(() => {
    const handlePointerMove = (
      event: PointerEvent
    ) => {
      if (
        pointerInteracting.current !==
        null
      ) {
        dragOffset.current = {
          phi:
            (event.clientX -
              pointerInteracting.current.x) /
            300,

          theta:
            (event.clientY -
              pointerInteracting.current.y) /
            1000,
        };
      }
    };

    window.addEventListener(
      'pointermove',
      handlePointerMove,
      {
        passive: true,
      }
    );

    window.addEventListener(
      'pointerup',
      handlePointerUp,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        'pointermove',
        handlePointerMove
      );

      window.removeEventListener(
        'pointerup',
        handlePointerUp
      );
    };
  }, [handlePointerUp]);

  /* =======================================================
     CREATE GLOBE
  ======================================================= */

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;

    let globe:
      | ReturnType<typeof createGlobe>
      | null = null;

    let animationId = 0;

    let phi = 0;

    function init() {
      const width = canvas.offsetWidth;

      if (width === 0 || globe) {
        return;
      }

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(
          window.devicePixelRatio || 1,
          2
        ),

        width,
        height: width,

        phi: 0,
        theta: 0.25,

        /*
         * LIGHT MODE
         */
        dark: 0,

        diffuse: 1.35,

        /*
         * Globe dot/detail density
         */
        mapSamples: 20000,

        /*
         * Reduce from previous 10.
         * Gives softer grey land dots.
         */
        mapBrightness: 5.5,

        /*
         * Main globe color.
         * Very light grey / white.
         */
        baseColor: [
          0.97,
          0.97,
          0.97,
        ],

        /*
         * SmartWills red locations
         */
        markerColor: SMARTWILLS_RED,

        /*
         * Soft white-grey glow
         */
        glowColor: [
          0.97,
          0.97,
          0.97,
        ],

        markerElevation: 0.025,

        markers: MARKERS.map(
          (marker) => ({
            location:
              marker.location,

            size:
              marker.code === 'MY'
                ? 0.045
                : 0.032,

            id: marker.id,
          })
        ),

        arcs: ARCS.map((arc) => ({
          from: arc.from,
          to: arc.to,
          id: arc.id,
        })),

        /*
         * Soft red connections
         */
        arcColor: SMARTWILLS_RED,

        arcWidth: 0.35,
        arcHeight: 0.22,

        opacity: 0.78,
      });

      /* ===============================================
         ANIMATION
      =============================================== */

      function animate() {
        if (!isPausedRef.current) {
          phi += SPEED;
        }

        globe!.update({
          phi:
            phi +
            phiOffsetRef.current +
            dragOffset.current.phi,

          theta:
            0.25 +
            thetaOffsetRef.current +
            dragOffset.current.theta,
        });

        animationId =
          requestAnimationFrame(
            animate
          );
      }

      animate();

      setTimeout(() => {
        if (canvas) {
          canvas.style.opacity = '1';
        }
      }, 100);
    }

    /* =================================================
       HANDLE INITIAL WIDTH
    ================================================= */

    if (canvas.offsetWidth > 0) {
      init();
    } else {
      const resizeObserver =
        new ResizeObserver(
          (entries) => {
            const width =
              entries[0]?.contentRect
                .width ?? 0;

            if (width > 0) {
              resizeObserver.disconnect();
              init();
            }
          }
        );

      resizeObserver.observe(canvas);
    }

    /* =================================================
       CLEANUP
    ================================================= */

    return () => {
      if (animationId) {
        cancelAnimationFrame(
          animationId
        );
      }

      if (globe) {
        globe.destroy();
      }
    };
  }, []);

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="relative aspect-square w-full select-none">
      {/* SOFT BACKGROUND GLOW */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[78%]
          w-[78%]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#a42025]/[0.025]
          blur-[55px]
        "
      />

      {/* GLOBE CANVAS */}
      <canvas
        ref={canvasRef}
        onPointerDown={
          handlePointerDown
        }
        style={{
          width: '100%',
          height: '100%',
          cursor: 'grab',
          opacity: 0,
          transition:
            'opacity 1.2s ease',
          borderRadius: '50%',
          touchAction: 'none',
          position: 'relative',
          zIndex: 1,
        }}
      />

      {/* COUNTRY LABELS */}
      {MARKERS.map((marker) => (
        <div
          key={marker.id}
          className="hero-flag-badge"
          style={{
            position: 'absolute',

            positionAnchor: `--cobe-${marker.id}`,

            bottom: 'anchor(top)',
            left: 'anchor(center)',

            translate: '-50% 0',

            display: 'flex',
            flexDirection: 'column',

            alignItems: 'center',

            gap: 6,

            pointerEvents: 'none',

            opacity: showPins ? `var(--cobe-visible-${marker.id}, 0)` : 0,
            visibility: showPins ? 'visible' : 'hidden',

            filter: `blur(calc((1 - var(--cobe-visible-${marker.id}, 0)) * 8px))`,

            transition:
              'opacity 0.4s ease, filter 0.4s ease, visibility 0.4s ease',

            zIndex: 10,
          }}
        >
          <span
            style={{
              fontFamily:
                'var(--font-mono, ui-monospace, monospace)',

              fontSize: '0.55rem',

              color:
                marker.code === 'MY'
                  ? '#a42025'
                  : '#292929',

              background:
                'rgba(255,255,255,0.96)',

              padding: '4px 7px',

              borderRadius: 5,

              border:
                marker.code === 'MY'
                  ? '1px solid rgba(164,32,37,0.28)'
                  : '1px solid rgba(0,0,0,0.08)',

              letterSpacing: '0.05em',

              whiteSpace: 'nowrap',

              boxShadow:
                marker.code === 'MY'
                  ? '0 5px 16px rgba(164,32,37,0.14)'
                  : '0 4px 14px rgba(0,0,0,0.08)',

              display: 'inline-flex',

              alignItems: 'center',

              gap: 5,

              fontWeight:
                marker.code === 'MY'
                  ? 700
                  : 500,
            }}
          >
            <CountryFlag
              code={marker.code}
              className="h-2.5 w-[15px] rounded-[1px] object-cover"
            />

            {marker.code}
          </span>
        </div>
      ))}
    </div>
  );
}