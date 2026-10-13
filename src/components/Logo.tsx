import React from 'react';

export interface BridgeIconProps {
  className?: string;
  variant?: 'light' | 'dark' | 'color';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Official HOPEBRIDGE Brand Icon: Orange Bridge Vector Symbol.
 * Features an elegant parabolic arch, structural roadway deck,
 * vertical suspension cables, and solid foundation piers.
 */
export const BridgeIcon: React.FC<BridgeIconProps> = ({
  className = '',
  variant = 'color',
  size = 'md'
}) => {
  const pixelSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  };

  const isLight = variant === 'light';

  // Colors based on variant
  // Warm vibrant orange is the primary brand color
  const archColor = isLight ? '#FB923C' : '#EA580C';       // Luminous orange on dark, rich orange on light
  const cableColor = isLight ? '#FDBA74' : '#F97316';      // Suspension cables
  const deckColor = isLight ? '#FFFFFF' : '#0F172A';       // Crisp white on dark, deep navy on light
  const pierColor = isLight ? '#E2E8F0' : '#0F172A';       // Foundation piers
  const baseColor = isLight ? '#CBD5E1' : '#0F172A';       // Foundation anchors
  const waterColor = isLight ? '#FB923C' : '#EA580C';      // Center waterline accent

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${pixelSizes[size]} shrink-0 transition-transform ${className}`}
      aria-label="HOPEBRIDGE Orange Bridge Icon"
      role="img"
    >
      {/* 1. Primary sweeping curved arch in warm vibrant orange */}
      <path
        d="M 3.5 21.5 C 7.5 9 11.5 6 16 6 C 20.5 6 24.5 9 28.5 21.5"
        stroke={archColor}
        strokeWidth="2.75"
        strokeLinecap="round"
      />

      {/* 2. Strong structural bridge roadway deck */}
      <rect
        x="2"
        y="16.5"
        width="28"
        height="2"
        rx="1"
        fill={deckColor}
      />

      {/* 3. Vertical suspension / structural support lines */}
      <line
        x1="8.5"
        y1="13"
        x2="8.5"
        y2="16.5"
        stroke={cableColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="12"
        y1="8.8"
        x2="12"
        y2="16.5"
        stroke={cableColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="16"
        y1="6"
        x2="16"
        y2="16.5"
        stroke={cableColor}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <line
        x1="20"
        y1="8.8"
        x2="20"
        y2="16.5"
        stroke={cableColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="23.5"
        y1="13"
        x2="23.5"
        y2="16.5"
        stroke={cableColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* 4. Deep foundation pier pillars under the deck */}
      <rect
        x="5.5"
        y="18.5"
        width="2"
        height="6.5"
        rx="0.5"
        fill={pierColor}
      />
      <rect
        x="24.5"
        y="18.5"
        width="2"
        height="6.5"
        rx="0.5"
        fill={pierColor}
      />

      {/* 5. Foundation anchor baseline & waterline */}
      <path
        d="M 3 25 H 10 M 22 25 H 29"
        stroke={baseColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M 12.5 25 H 19.5"
        stroke={waterColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'color';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

/**
 * Official HOPEBRIDGE Brand Logo component.
 * Combines the official orange bridge symbol with the clear HOPEBRIDGE wordmark.
 */
export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'color',
  size = 'md',
  showTagline = false
}) => {
  const containerPadding = {
    sm: 'p-1',
    md: 'p-1.5',
    lg: 'p-2'
  };

  const textSizes = {
    sm: 'text-base sm:text-lg',
    md: 'text-lg sm:text-xl',
    lg: 'text-xl sm:text-2xl'
  };

  const isLight = variant === 'light';

  return (
    <div className={`flex items-center gap-2 sm:gap-2.5 ${className}`}>
      {/* Official Orange Bridge Emblem Container */}
      <div
        className={`${containerPadding[size]} shrink-0 flex items-center justify-center rounded-xl transition-all duration-200 ${
          isLight
            ? 'bg-stone-800/90 border border-stone-700/80 shadow-xs'
            : 'bg-orange-50/90 border border-orange-200/70 shadow-xs hover:border-orange-300'
        }`}
        aria-hidden="true"
      >
        <BridgeIcon size={size} variant={variant} />
      </div>

      {/* HOPEBRIDGE Wordmark */}
      <div className="flex flex-col justify-center">
        <span
          className={`font-bold tracking-tight uppercase leading-none font-sans ${textSizes[size]} ${
            isLight ? 'text-white' : 'text-stone-900'
          }`}
        >
          HOPE<span className={isLight ? 'text-orange-400' : 'text-orange-600'}>BRIDGE</span>
        </span>
        {showTagline && (
          <span
            className={`text-[10px] sm:text-[11px] font-medium tracking-wide mt-1 leading-none ${
              isLight ? 'text-stone-300' : 'text-stone-500'
            }`}
          >
            Every Child Deserves a Chance
          </span>
        )}
      </div>
    </div>
  );
};
