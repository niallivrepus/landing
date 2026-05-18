import { useTheme } from "../../hooks/use-theme";

interface LogoProps {
  onClick?: () => void;
  width?: number;
  height?: number;
}

export const Logo = ({ onClick, width = 38, height = 22 }: LogoProps) => {
  const { isDarkMode } = useTheme();

  return (
    <div
      onClick={onClick}
      style={{
        cursor: onClick ? "pointer" : "default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 38 22"
        fill="none"
      >
        <g filter="url(#filter0_d_13976_670)">
          <path
            d="M27.7824 5.14531C22.5874 6.36044 19.7007 9.48499 19.1325 9.48499C18.5643 9.48499 15.6776 6.36044 10.4827 5.14531C6.70459 4.26162 4.14221 7.69747 6.64694 12.1901C8.19379 15.678 9.77851 17 12.2418 17C14.1937 17 15.4004 15.9752 16.3073 15.3788C16.9965 14.9255 18.035 14.1105 19.1326 14.1105C20.2302 14.1105 21.2686 14.9255 21.958 15.3788C22.8648 15.9752 24.0714 17 26.0234 17C28.4866 17 30.0715 15.678 31.6183 12.1901C33.509 7.50321 31.5608 4.26176 27.7827 5.14546L27.7824 5.14531ZM16.9692 12.4816C16.4843 13.1956 12.9576 15.3082 11.0573 14.0865C9.15706 12.8649 7.37419 8.7448 8.59416 7.85859C9.81413 6.97238 18.1891 10.685 16.9692 12.4816ZM27.2076 14.0865C25.3073 15.3082 21.7807 13.1957 21.2958 12.4816C20.0758 10.685 28.451 6.97223 29.6708 7.85844C30.8906 8.74466 29.1077 12.8649 27.2076 14.0865Z"
            fill={isDarkMode ? "white" : "black"}
          />
        </g>
        <defs>
          <filter
            id="filter0_d_13976_670"
            x="0.650024"
            y="0"
            width="36.7"
            height="22"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="2.5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_13976_670"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_13976_670"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};
