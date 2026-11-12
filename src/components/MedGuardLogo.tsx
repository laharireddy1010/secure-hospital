import React from 'react';

interface MedGuardLogoProps {
  size?: number;
  className?: string;
}

export const MedGuardLogo: React.FC<MedGuardLogoProps> = ({ size = 40, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="MEDGUARD AI Medical Shield Logo"
    >
      <defs>
        <linearGradient id="mgShieldGrad" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#14B8A6" />
        </linearGradient>
        <linearGradient id="mgInnerFill" x1="12" y1="10" x2="52" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0E2542" />
          <stop offset="100%" stopColor="#07111F" />
        </linearGradient>
      </defs>

      {/* Outer glowing shield */}
      <path
        d="M32 4L10 13V30C10 44.5 19.4 55.9 32 60C44.6 55.9 54 44.5 54 30V13L32 4Z"
        fill="url(#mgInnerFill)"
        stroke="url(#mgShieldGrad)"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />

      {/* Subtle inner hex/circuit ring */}
      <path
        d="M32 10L16 16.8V29.8C16 40.9 22.8 49.8 32 53.3C41.2 49.8 48 40.9 48 29.8V16.8L32 10Z"
        stroke="#22D3EE"
        strokeOpacity="0.28"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Medical cross */}
      <path
        d="M28.5 19H35.5V26.5H43V33.5H35.5V41H28.5V33.5H21V26.5H28.5V19Z"
        fill="url(#mgShieldGrad)"
        fillOpacity="0.22"
        stroke="#38BDF8"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      {/* ECG pulse wave across the cross */}
      <path
        d="M17 30.5H24.5L27.5 23.5L31.5 37.5L35 27.5L38 30.5H47"
        stroke="#2DD4BF"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

