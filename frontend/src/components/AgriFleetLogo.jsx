import React from 'react';

/**
 * AgriFleetLogo - Official Brand Logo Component
 * Features:
 * - High-fidelity vector SVG matching the green delivery truck with organic sprout leaves
 * - Subtle, professional CSS animations (gentle leaf sway, suspension hover, wheel glow)
 * - Flexible sizing and light/dark theme support
 */
export const AgriFleetLogo = ({ 
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl' | 'hero'
  showText = true, 
  showSubtitle = true,
  theme = 'dark', // 'dark' (for dark bg) | 'light' (for light bg) | 'auto'
  animated = true,
  className = '',
  onClick
}) => {
  const sizeMap = {
    sm: { height: 32, iconSize: 28, titleSize: '1rem', subSize: '0.625rem' },
    md: { height: 44, iconSize: 38, titleSize: '1.25rem', subSize: '0.725rem' },
    lg: { height: 56, iconSize: 48, titleSize: '1.5rem', subSize: '0.85rem' },
    xl: { height: 72, iconSize: 62, titleSize: '1.875rem', subSize: '1rem' },
    hero: { height: 88, iconSize: 76, titleSize: '2.25rem', subSize: '1.15rem' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;
  const isDark = theme === 'dark';

  return (
    <div 
      className={`agrifleet-logo-wrapper ${animated ? 'is-animated' : ''} ${className}`}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        textDecoration: 'none'
      }}
    >
      <style>{`
        .agrifleet-logo-wrapper {
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .agrifleet-logo-wrapper:hover {
          transform: translateY(-1px);
        }

        /* Subtle animated leaf sway */
        @keyframes agrifleetLeafSway {
          0%, 100% {
            transform: rotate(0deg);
            transform-origin: 38px 42px;
          }
          50% {
            transform: rotate(4.5deg);
            transform-origin: 38px 42px;
          }
        }

        /* Soft suspension idle bounce on hover */
        @keyframes agrifleetTruckIdle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-1.5px);
          }
        }

        /* Wheel soft rotate on hover */
        @keyframes agrifleetWheelSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .agrifleet-leaf-sprout {
          animation: agrifleetLeafSway 4.5s ease-in-out infinite;
        }

        .agrifleet-logo-wrapper:hover .agrifleet-truck-body {
          animation: agrifleetTruckIdle 1.2s ease-in-out infinite;
        }

        .agrifleet-logo-wrapper:hover .agrifleet-wheel {
          transform-origin: center;
          animation: agrifleetWheelSpin 2s linear infinite;
        }

        .agrifleet-logo-wrapper:hover .agrifleet-glow-aura {
          opacity: 0.8;
          filter: drop-shadow(0 0 12px rgba(16, 185, 129, 0.45));
        }

        .agrifleet-glow-aura {
          transition: all 0.3s ease;
        }
      `}</style>

      {/* SVG Icon */}
      <div 
        className="agrifleet-logo-icon-container"
        style={{
          width: currentSize.iconSize,
          height: currentSize.iconSize,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <svg 
          viewBox="0 0 100 100" 
          width={currentSize.iconSize} 
          height={currentSize.iconSize}
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="agrifleet-glow-aura"
        >
          <defs>
            <linearGradient id="agriTruckGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="agriLeafGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
            <linearGradient id="agriAccentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Organic Sprout / Leaves on top of truck cab */}
          <g className="agrifleet-leaf-sprout">
            {/* Primary Main Leaf */}
            <path 
              d="M 38 42 C 34 26, 42 12, 60 8 C 66 18, 64 34, 46 44 C 42 46, 39 44, 38 42 Z" 
              fill="url(#agriLeafGrad)" 
            />
            {/* Leaf Vein Center */}
            <path 
              d="M 40 40 C 47 30, 52 20, 58 12" 
              stroke="#ffffff" 
              strokeWidth="2.2" 
              strokeLinecap="round" 
              strokeOpacity="0.85" 
            />
            {/* Secondary Left Sprout Leaf */}
            <path 
              d="M 36 38 C 24 30, 22 18, 34 14 C 42 20, 42 30, 37 38 Z" 
              fill="#059669" 
              opacity="0.95"
            />
            {/* Third Accent Right Sprout */}
            <path 
              d="M 50 36 C 62 30, 72 32, 70 42 C 60 46, 52 42, 50 36 Z" 
              fill="#34d399" 
              opacity="0.9"
            />
            {/* Delicate Sprout Stem curve down to truck roof */}
            <path 
              d="M 38 42 C 40 50, 48 56, 52 62" 
              stroke="#047857" 
              strokeWidth="3.5" 
              strokeLinecap="round" 
            />
          </g>

          {/* Truck Group */}
          <g className="agrifleet-truck-body">
            {/* Cargo Box (Container) */}
            <rect 
              x="12" 
              y="38" 
              width="46" 
              height="36" 
              rx="4" 
              fill="url(#agriTruckGrad)" 
            />
            {/* Cargo Box Horizontal Line Detail */}
            <line 
              x1="18" 
              y1="47" 
              x2="52" 
              y2="47" 
              stroke="#ffffff" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeOpacity="0.75" 
            />
            <line 
              x1="18" 
              y1="55" 
              x2="38" 
              y2="55" 
              stroke="#ffffff" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeOpacity="0.4" 
            />

            {/* Truck Cab Structure */}
            <path 
              d="M 58 48 L 74 48 C 77 48, 80 50, 83 55 L 88 64 C 89 66, 89 68, 89 71 L 89 74 L 58 74 Z" 
              fill="url(#agriTruckGrad)" 
            />

            {/* Truck Windshield / Window (White cutout) */}
            <path 
              d="M 64 53 L 75 53 C 77 53, 79 55, 81 58 L 84 64 L 64 64 Z" 
              fill="#ffffff" 
            />

            {/* Front Bumper & Headlight */}
            <rect 
              x="87" 
              y="68" 
              width="4" 
              height="4" 
              rx="1" 
              fill="#fef08a" 
            />

            {/* Chassis Undercarriage Bar */}
            <rect 
              x="10" 
              y="73" 
              width="80" 
              height="4" 
              rx="2" 
              fill="#064e3b" 
            />
          </g>

          {/* Left Wheel */}
          <g className="agrifleet-wheel" style={{ transformOrigin: '28px 77px' }}>
            <circle cx="28" cy="77" r="10" fill="#0f172a" />
            <circle cx="28" cy="77" r="6" fill="#ffffff" />
            <circle cx="28" cy="77" r="3.5" fill="#10b981" />
          </g>

          {/* Right Wheel */}
          <g className="agrifleet-wheel" style={{ transformOrigin: '74px 77px' }}>
            <circle cx="74" cy="77" r="10" fill="#0f172a" />
            <circle cx="74" cy="77" r="6" fill="#ffffff" />
            <circle cx="74" cy="77" r="3.5" fill="#10b981" />
          </g>
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div 
          className="agrifleet-logo-text-block"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            lineHeight: 1.1
          }}
        >
          <div 
            style={{
              fontSize: currentSize.titleSize,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: isDark ? '#ffffff' : '#064e3b',
              display: 'flex',
              alignItems: 'baseline'
            }}
          >
            <span>Agri</span>
            <span style={{ color: '#10b981', marginLeft: '1px' }}>Fleet</span>
          </div>

          {showSubtitle && (
            <div 
              style={{
                fontSize: currentSize.subSize,
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: isDark ? '#94a3b8' : '#047857',
                marginTop: '2px'
              }}
            >
              Smart Agricultural Logistics
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgriFleetLogo;
