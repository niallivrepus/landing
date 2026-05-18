import * as React from "react";
import { motion } from "motion/react";
import { getSvgPath } from "figma-squircle";

/* ─── Types ─── */
export interface PassportData {
  avatarSrc?: string;
  nameOfInfinity?: string;
  points?: number;
  tosInscriptionCount?: number;
  nonTosInscriptionCount?: number;
  earliestAuraInteraction?: string;
  marketplaceInteractions?: number;
  marketplacesUsed?: number;
  numberOfSales?: number;
  uniqueTos20s?: number;
  transfersMade?: number;
  eCitizenDuration?: string;
  tosAddress?: string;
}

const defaultData: PassportData = {
  avatarSrc: "/images/villains/villain-1.png",
  nameOfInfinity: "light",
  points: 0,
  tosInscriptionCount: 0,
  nonTosInscriptionCount: 1203,
  earliestAuraInteraction: "2025-03-26",
  marketplaceInteractions: 7,
  marketplacesUsed: 3,
  numberOfSales: 123,
  uniqueTos20s: 8,
  transfersMade: 2,
  eCitizenDuration: "1 Year",
  tosAddress: "TOS1p50gzy6hhx65eekjvggmqwyktax4ensw446",
};

/* ─── Vortex symbol (infinity/owl logo) ─── */
function VortexSymbol({ color = "white", width = 38, height = 22 }: { color?: string; width?: number; height?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 38 22" fill="none">
      <path
        d="M27.7824 5.14531C22.5874 6.36044 19.7007 9.48499 19.1325 9.48499C18.5643 9.48499 15.6776 6.36044 10.4827 5.14531C6.70459 4.26162 4.14221 7.69747 6.64694 12.1901C8.19379 15.678 9.77851 17 12.2418 17C14.1937 17 15.4004 15.9752 16.3073 15.3788C16.9965 14.9255 18.035 14.1105 19.1326 14.1105C20.2302 14.1105 21.2686 14.9255 21.958 15.3788C22.8648 15.9752 24.0714 17 26.0234 17C28.4866 17 30.0715 15.678 31.6183 12.1901C33.509 7.50321 31.5608 4.26176 27.7827 5.14546L27.7824 5.14531ZM16.9692 12.4816C16.4843 13.1956 12.9576 15.3082 11.0573 14.0865C9.15706 12.8649 7.37419 8.7448 8.59416 7.85859C9.81413 6.97238 18.1891 10.685 16.9692 12.4816ZM27.2076 14.0865C25.3073 15.3082 21.7807 13.1957 21.2958 12.4816C20.0758 10.685 28.451 6.97223 29.6708 7.85844C30.8906 8.74466 29.1077 12.8649 27.2076 14.0865Z"
        fill={color}
      />
    </svg>
  );
}

/* ─── Jokuh logo (front side bottom — oval with eye) ─── */
function JokuhLogo({ width = 50, height = 23, opacity = 1 }: { width?: number; height?: number; opacity?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 50 23" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
      <g filter="url(#filter0_i_jl)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M25.0024 7.05719e-05C11.1939 7.05719e-05 -1.52588e-05 5.03106 -1.52588e-05 11.2371C-1.52588e-05 17.4431 11.1939 22.4741 25.0024 22.4741C38.8108 22.4741 50.0048 17.4431 50.0048 11.2371C50.0048 5.03106 38.8108 7.05719e-05 25.0024 7.05719e-05ZM32.7039 10.9485C28.4261 11.0374 9.07741 11.3157 12.2347 7.36054C15.1532 4.01707 21.731 1.68563 29.3778 1.68563C39.7341 1.68563 48.1296 5.96197 48.1296 11.2371C48.1296 16.5122 39.7341 20.7886 29.3778 20.7886C21.731 20.7886 15.1532 18.4571 12.2348 15.1137C9.07726 11.1585 28.4261 11.4368 32.7039 11.5257C32.8532 14.0468 34.945 16.0452 37.5036 16.0452C40.159 16.0452 42.3117 13.8926 42.3117 11.2371C42.3117 8.58163 40.159 6.42895 37.5036 6.42895C34.945 6.42895 32.8532 8.4274 32.7039 10.9485Z"
          fill="url(#paint0_linear_jl)"
        />
      </g>
      <defs>
        <filter id="filter0_i_jl" x="0" y="0" width="50.0048" height="22.6664" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="0.192"/>
          <feGaussianBlur stdDeviation="0.096"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.15 0"/>
          <feBlend mode="normal" in2="shape"/>
        </filter>
        <linearGradient id="paint0_linear_jl" x1="25" y1="0" x2="25" y2="22.47" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1D1D1D"/>
          <stop offset="1" stopColor="#060606"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── Jokuh symbol SVG (front side mandala) ─── */
function JokuhSymbol({ size = 220, opacity = 0.5 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 225 225" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity, filter: "drop-shadow(0px 0.75px 0.5px rgba(255,255,255,0.12))" }}>
      <g><path d="M158.508 66.2215L161.095 63.6345C154.021 25.7447 138.338 4.92243 119.496 0.790039C112.96 2.20948 108.37 6.34187 106.126 12.1112C105.989 12.4775 105.851 12.8438 105.737 13.2101C105.668 13.4162 105.611 13.6222 105.542 13.8397C105.473 14.0687 105.416 14.2976 105.359 14.538C105.313 14.7097 105.279 14.8699 105.233 15.0417C105.21 15.1676 105.187 15.282 105.164 15.408C104.844 16.9648 104.615 18.7963 104.489 20.8911C106.801 13.3818 109.491 9.62718 112.365 9.62718C120.343 9.62718 126.914 38.4395 127.898 96.831L130.829 93.9006C130.325 69.6099 128.825 49.36 126.387 34.6848C125.334 28.3088 124.121 23.089 122.759 18.9337C122.77 18.9337 122.793 18.9222 122.804 18.9108C129.192 37.5352 133.164 61.7572 134.503 90.2261L137.365 87.3643C135.682 55.4498 130.737 30.4265 123.56 12.26C124.602 14.1717 125.609 16.1978 126.582 18.3384C134.022 34.765 138.819 57.144 140.776 83.9645L143.604 81.1371C141.154 50.4704 135.018 27.2557 126.502 11.39C128.963 14.8127 131.275 18.7276 133.393 23.1691C140.067 37.1803 144.622 55.7475 146.889 77.8518L149.636 75.1045C146.465 46.6013 139.574 25.4814 130.348 11.6533C133.954 15.6712 137.262 20.6622 140.204 26.6147C146.099 38.5196 150.335 53.8587 152.807 71.9336L155.474 69.2665C151.72 43.6136 144.485 24.7946 135.11 12.7408C139.529 16.9533 143.524 22.4937 147.026 29.3276C152.12 39.2866 155.967 51.7524 158.508 66.2444V66.2215Z" fill="url(#paint0_linear_pp)"/></g>
      <g><path d="M130.806 5.52894C121.167 2.5298 113.246 5.42592 108.518 11.9965C108.289 12.3171 108.072 12.6376 107.866 12.9581C107.751 13.1412 107.637 13.3244 107.522 13.519C107.397 13.725 107.282 13.9311 107.168 14.1486C107.088 14.2974 107.007 14.4462 106.927 14.6065C106.87 14.7209 106.824 14.824 106.767 14.9384C104.844 18.8533 103.104 24.9432 101.639 33.2194C93.3739 28.5261 85.4525 25.0577 77.9203 22.8255C87.1581 7.57797 99.2005 0 112.365 0C118.855 0 125.059 1.84298 130.806 5.52894ZM65.775 53.7898C64.9966 56.9492 64.2754 60.2231 63.6344 63.6572L96.8309 96.8537C96.9339 91.0386 97.0828 85.5211 97.2888 80.2898C85.3266 69.2892 74.6579 60.3261 65.775 53.8013V53.7898Z" fill="url(#paint1_linear_pp)"/></g>
      <g><path d="M66.2214 158.53L63.6344 161.117C70.7087 199.007 86.3912 219.829 105.233 223.962C111.769 222.542 116.36 218.41 118.603 212.641C118.741 212.274 118.878 211.908 118.992 211.542C119.061 211.336 119.118 211.13 119.187 210.912C119.256 210.683 119.313 210.454 119.37 210.214C119.416 210.042 119.45 209.882 119.496 209.71C119.519 209.584 119.542 209.47 119.565 209.344C119.885 207.787 120.114 205.956 120.24 203.861C117.928 211.37 115.238 215.125 112.365 215.125C104.397 215.125 97.8154 186.312 96.8309 127.921L93.9005 130.851C94.4042 155.142 95.9037 175.392 98.3419 190.067C99.3951 196.443 100.608 201.663 101.971 205.818C101.959 205.818 101.936 205.83 101.925 205.841C95.526 187.217 91.5653 162.995 90.226 134.526L87.3642 137.388C89.0469 169.302 93.992 194.325 101.169 212.492C100.128 210.58 99.1203 208.554 98.1473 206.414C90.7067 189.987 85.9104 167.608 83.953 140.787L81.1255 143.615C83.5752 174.282 89.7108 197.496 98.2275 213.362C95.7664 209.939 93.454 206.024 91.3363 201.583C84.6512 187.572 80.1068 169.004 77.8402 146.9L75.0929 149.647C78.2638 178.151 85.1549 199.271 94.3813 213.099C90.7754 209.081 87.4672 204.09 84.5253 198.137C78.6301 186.232 74.3946 170.893 71.9221 152.818L69.2549 155.485C73.0096 181.138 80.2441 199.957 89.6193 212.011C85.2007 207.799 81.2057 202.258 77.7029 195.424C72.6089 185.465 68.7627 172.999 66.2214 158.507V158.53Z" fill="url(#paint2_linear_pp)"/></g>
      <g><path d="M93.9232 219.212C103.562 222.211 111.483 219.315 116.211 212.744C116.44 212.423 116.657 212.103 116.863 211.782C116.978 211.599 117.092 211.416 117.207 211.221C117.332 211.015 117.447 210.809 117.561 210.592C117.642 210.443 117.722 210.294 117.802 210.134C117.859 210.02 117.905 209.916 117.962 209.802C119.885 205.887 121.625 199.797 123.09 191.521C131.355 196.214 139.277 199.683 146.809 201.915C137.559 217.162 125.529 224.74 112.353 224.74C105.862 224.74 99.6582 222.897 93.9117 219.212H93.9232ZM158.954 170.951C159.732 167.791 160.454 164.517 161.095 161.083L127.898 127.887C127.795 133.702 127.646 139.219 127.44 144.451C139.402 155.451 150.071 164.414 158.954 170.939V170.951Z" fill="url(#paint3_linear_pp)"/></g>
      <g><path d="M66.2098 66.2326L63.6228 63.6455C25.7329 70.7198 4.91072 86.4023 0.77832 105.244C2.19776 111.78 6.33015 116.371 12.0995 118.614C12.4658 118.752 12.8321 118.889 13.1984 119.004C13.4044 119.072 13.6105 119.129 13.828 119.198C14.0569 119.267 14.2859 119.324 14.5263 119.381C14.698 119.427 14.8582 119.461 15.0299 119.507C15.1558 119.53 15.2703 119.553 15.3962 119.576C16.953 119.896 18.7846 120.125 20.8794 120.251C13.3701 117.939 9.61547 115.249 9.61547 112.376C9.61547 104.397 38.4278 97.8265 96.8193 96.842L93.8888 93.9116C69.5982 94.4153 49.3483 95.9148 34.6731 98.3531C28.2971 99.4062 23.0772 100.62 18.9219 101.982C18.9219 101.97 18.9105 101.947 18.899 101.936C37.5234 95.5371 61.7455 91.5764 90.2143 90.2371L87.3526 87.3753C55.4381 89.058 30.4148 94.0032 12.2483 101.18C14.16 100.139 16.1861 99.1315 18.3267 98.1585C34.7533 90.7179 57.1323 85.9215 83.9528 83.9641L81.1254 81.1366C50.4586 83.5863 27.244 89.722 11.3783 98.2386C14.801 95.7775 18.7159 93.4652 23.1574 91.3474C37.1686 84.6738 55.7358 80.1179 77.8401 77.8513L75.0928 75.104C46.5895 78.2749 25.4697 85.166 11.6416 94.3924C15.6595 90.7865 20.6504 87.4783 26.6029 84.5364C38.5079 78.6412 53.847 74.4058 71.9219 71.9332L69.2547 69.266C43.6018 73.0207 24.7828 80.2552 12.7291 89.6304C16.9416 85.2118 22.482 81.2168 29.3159 77.714C39.2749 72.62 51.7407 68.7738 66.2327 66.2326H66.2098Z" fill="url(#paint4_linear_pp)"/></g>
      <g><path d="M5.52894 93.9346C2.52981 103.573 5.42592 111.494 11.9965 116.222C12.3171 116.451 12.6376 116.668 12.9581 116.875C13.1412 116.989 13.3244 117.103 13.519 117.218C13.725 117.344 13.9311 117.458 14.1486 117.573C14.2974 117.653 14.4462 117.733 14.6065 117.813C14.7209 117.87 14.824 117.916 14.9384 117.973C18.8533 119.897 24.9432 121.637 33.2194 123.102C28.5261 131.367 25.0577 139.288 22.8255 146.82C7.57797 137.571 0 125.54 0 112.376C0 105.885 1.84298 99.681 5.52894 93.9346ZM53.7898 158.965C56.9492 159.744 60.2231 160.465 63.6572 161.106L96.8537 127.909C91.0386 127.806 85.5211 127.658 80.2898 127.452C69.2892 139.414 60.3261 150.082 53.8013 158.965H53.7898Z" fill="url(#paint5_linear_pp)"/></g>
      <g><path d="M158.519 158.508L161.106 161.095C198.996 154.02 219.818 138.338 223.951 119.496C222.531 112.96 218.399 108.369 212.629 106.126C212.263 105.988 211.897 105.851 211.53 105.737C211.324 105.668 211.118 105.611 210.901 105.542C210.672 105.473 210.443 105.416 210.203 105.359C210.031 105.313 209.871 105.279 209.699 105.233C209.573 105.21 209.459 105.187 209.333 105.164C207.776 104.844 205.944 104.615 203.849 104.489C211.359 106.801 215.113 109.491 215.113 112.364C215.113 120.343 186.301 126.914 127.91 127.898L130.84 130.829C155.131 130.325 175.381 128.825 190.056 126.387C196.432 125.334 201.652 124.121 205.807 122.758C205.807 122.77 205.818 122.793 205.83 122.804C187.205 129.203 162.983 133.164 134.515 134.503L137.376 137.365C169.291 135.682 194.314 130.737 212.481 123.56C210.569 124.601 208.543 125.609 206.402 126.582C189.976 134.022 167.597 138.819 140.776 140.776L143.603 143.603C174.27 141.154 197.485 135.018 213.351 126.502C209.928 128.963 206.013 131.275 201.571 133.393C187.56 140.078 168.993 144.622 146.889 146.889L149.636 149.636C178.139 146.465 199.259 139.574 213.087 130.348C209.069 133.954 204.078 137.262 198.126 140.204C186.221 146.099 170.882 150.334 152.807 152.807L155.474 155.474C181.127 151.719 199.946 144.485 212 135.11C207.787 139.528 202.247 143.523 195.413 147.026C185.454 152.12 172.988 155.966 158.496 158.508H158.519Z" fill="url(#paint6_linear_pp)"/></g>
      <g><path d="M219.2 130.817C222.199 121.179 219.303 113.257 212.732 108.53C212.412 108.301 212.091 108.083 211.771 107.877C211.588 107.763 211.404 107.648 211.21 107.534C211.004 107.408 210.798 107.293 210.58 107.179C210.431 107.099 210.283 107.018 210.122 106.938C210.008 106.881 209.905 106.835 209.79 106.778C205.876 104.855 199.786 103.115 191.509 101.65C196.203 93.385 199.671 85.4636 201.903 77.9315C217.151 87.1807 224.729 99.2116 224.729 112.387C224.729 118.878 222.886 125.082 219.2 130.828V130.817ZM170.939 65.7861C167.78 65.0077 164.506 64.2865 161.072 63.6455L127.875 96.842C133.69 96.9451 139.208 97.0939 144.439 97.2999C155.44 85.3377 164.403 74.669 170.928 65.7861H170.939Z" fill="url(#paint7_linear_pp)"/></g>
      <g><path d="M112.353 47.1165V43.4534C80.5646 21.6696 54.7514 18.0294 38.508 28.4234C34.8907 34.0439 34.5702 40.2253 37.0542 45.8802C37.2145 46.235 37.3748 46.5899 37.5579 46.9333C37.6495 47.1279 37.7639 47.3225 37.867 47.5171C37.9814 47.7232 38.1074 47.9292 38.2218 48.1353C38.3134 48.2841 38.3935 48.4214 38.4851 48.5817C38.5538 48.6847 38.6225 48.7877 38.6912 48.8908C39.5611 50.2186 40.7058 51.6724 42.0909 53.2406C38.4164 46.2923 37.6609 41.7478 39.6985 39.7102C45.3305 34.0668 70.3538 49.7951 112.353 90.3864V86.2426C94.8162 69.4154 79.4313 56.1596 67.3432 47.5171C62.089 43.751 57.5445 40.9236 53.6411 38.9433C53.6411 38.9318 53.6525 38.9089 53.6639 38.8975C71.3497 47.54 91.2905 61.8717 112.353 81.057V77.0162C88.589 55.6331 67.4004 41.4387 49.4858 33.6661C51.5806 34.2843 53.7212 35.0055 55.919 35.8296C72.792 42.1828 92.0117 54.6143 112.353 72.197V68.1905C88.9324 48.2383 68.1789 36.1616 50.9395 30.9646C55.0948 31.64 59.502 32.7733 64.138 34.4217C78.7674 39.6072 95.1138 49.5089 112.353 63.543V59.6625C89.9626 41.7478 70.1477 31.6858 53.8585 28.4348C59.2501 28.7325 65.1225 29.923 71.4069 32.0407C83.9987 36.2875 97.8382 44.1402 112.365 55.1752V51.4091C91.5652 35.9327 73.1583 27.7366 57.9909 25.8363C64.0922 25.699 70.8346 26.775 78.1378 29.1446C88.7836 32.5901 100.311 38.68 112.353 47.1279V47.1165Z" fill="url(#paint8_linear_pp)"/></g>
      <g><path d="M49.8522 23.7871C40.912 28.4804 37.3634 36.1385 38.6684 44.1286C38.7256 44.5178 38.8057 44.8955 38.8859 45.2733C38.9316 45.4793 38.9889 45.6968 39.0461 45.9143C39.1034 46.1433 39.172 46.3722 39.2407 46.6011C39.2865 46.7614 39.3323 46.9217 39.3895 47.0934C39.4239 47.2078 39.4697 47.3223 39.5154 47.4368C40.9234 51.5577 44.0027 57.0981 48.8105 63.9893C39.6414 66.5191 31.5941 69.667 24.6915 73.4102C20.4446 56.0908 23.5926 42.2169 32.9105 32.9104C37.5008 28.3202 43.2014 25.2409 49.8636 23.7871H49.8522ZM37.993 103.894C39.6757 106.675 41.4843 109.503 43.4532 112.376H90.3977C86.3569 108.198 82.5565 104.18 79.0079 100.334C62.7759 101.009 48.8906 102.223 37.993 103.882V103.894Z" fill="url(#paint9_linear_pp)"/></g>
      <g><path d="M112.376 177.636V181.299C144.165 203.083 169.978 206.723 186.221 196.329C189.838 190.709 190.159 184.527 187.675 178.872C187.515 178.518 187.354 178.163 187.171 177.819C187.08 177.625 186.965 177.43 186.862 177.236C186.748 177.029 186.622 176.823 186.507 176.617C186.416 176.469 186.336 176.331 186.244 176.171C186.175 176.068 186.107 175.965 186.038 175.862C185.168 174.534 184.023 173.08 182.638 171.512C186.313 178.46 187.068 183.005 185.031 185.042C179.399 190.686 154.375 174.958 112.376 134.366V138.51C129.913 155.337 145.298 168.593 157.386 177.236C162.64 181.002 167.185 183.829 171.088 185.809C171.088 185.821 171.077 185.844 171.065 185.855C153.38 177.213 133.439 162.881 112.376 143.696V147.736C136.14 169.12 157.329 183.314 175.243 191.086C173.149 190.468 171.008 189.747 168.81 188.923C151.937 182.57 132.718 170.138 112.376 152.556V156.562C135.797 176.514 156.55 188.591 173.79 193.788C169.634 193.113 165.227 191.979 160.591 190.331C145.962 185.145 129.615 175.244 112.376 161.21V165.09C134.767 183.005 154.581 193.067 170.871 196.318C165.479 196.02 159.607 194.83 153.322 192.712C140.73 188.465 126.891 180.612 112.365 169.577V173.344C133.164 188.831 151.571 197.016 166.738 198.916C160.637 199.054 153.895 197.978 146.591 195.608C135.946 192.163 124.418 186.073 112.376 177.625V177.636Z" fill="url(#paint10_linear_pp)"/></g>
      <g><path d="M174.866 200.954C183.806 196.26 187.354 188.602 186.05 180.612C185.981 180.223 185.912 179.845 185.832 179.468C185.786 179.261 185.729 179.044 185.672 178.826C185.615 178.598 185.546 178.369 185.477 178.14C185.431 177.979 185.386 177.819 185.328 177.647C185.294 177.533 185.248 177.418 185.202 177.304C183.794 173.183 180.715 167.643 175.907 160.752C185.077 158.222 193.124 155.074 200.026 151.331C204.273 168.65 201.125 182.524 191.807 191.83C187.217 196.421 181.517 199.5 174.854 200.954H174.866ZM186.725 120.847C185.042 118.065 183.234 115.238 181.265 112.365H134.32C138.361 116.543 142.161 120.561 145.71 124.407C161.942 123.732 175.827 122.518 186.725 120.858V120.847Z" fill="url(#paint11_linear_pp)"/></g>
      <g><path d="M47.1049 112.376H43.4418C21.658 144.165 18.0178 169.978 28.4118 186.221C34.0323 189.839 40.2137 190.159 45.8686 187.675C46.2234 187.515 46.5783 187.355 46.9217 187.171C47.1163 187.08 47.3109 186.965 47.5055 186.862C47.7116 186.748 47.9176 186.622 48.1237 186.507C48.2725 186.416 48.4098 186.336 48.5701 186.244C48.6731 186.176 48.7761 186.107 48.8792 186.038C50.207 185.168 51.6608 184.023 53.2291 182.638C46.2807 186.313 41.7362 187.068 39.6986 185.031C34.0552 179.399 49.7835 154.376 90.3748 112.376H86.231C69.4038 129.913 56.1481 145.298 47.5055 157.386C43.7394 162.64 40.912 167.185 38.9317 171.088C38.9202 171.088 38.8973 171.077 38.8859 171.065C47.5284 153.38 61.8601 133.439 81.0454 112.376H77.0046C55.6215 136.14 41.4271 157.329 33.6546 175.244C34.2727 173.149 34.9939 171.008 35.8181 168.81C42.1712 151.937 54.6027 132.718 72.1854 112.376H68.1789C48.2267 135.797 36.15 156.55 30.953 173.79C31.6284 169.634 32.7617 165.227 34.4101 160.591C39.5956 145.962 49.4973 129.615 63.5314 112.376H59.6509C41.7362 134.767 31.6742 154.582 28.4232 170.871C28.7209 165.479 29.9114 159.607 32.0291 153.322C36.2759 140.731 44.1286 126.891 55.1636 112.365H51.3975C35.9211 133.164 27.725 151.571 25.8247 166.738C25.6874 160.637 26.7634 153.895 29.133 146.592C32.5785 135.946 38.6684 124.419 47.1163 112.376H47.1049Z" fill="url(#paint12_linear_pp)"/></g>
      <g><path d="M23.7755 174.878C28.4688 183.818 36.1155 187.366 44.117 186.061C44.5062 186.004 44.8839 185.924 45.2617 185.844C45.4677 185.798 45.6852 185.741 45.9027 185.684C46.1317 185.626 46.3606 185.558 46.5895 185.489C46.7498 185.443 46.9101 185.397 47.0818 185.34C47.1962 185.306 47.3107 185.26 47.4252 185.214C51.5576 183.806 57.0865 180.727 63.9777 175.919C66.5075 185.088 69.6554 193.136 73.3986 200.038C56.0792 204.285 42.2053 201.137 32.8988 191.819C28.3085 187.229 25.2293 181.528 23.7755 174.866V174.878ZM103.882 186.737C106.664 185.054 109.491 183.245 112.364 181.277V134.332C108.186 138.373 104.168 142.173 100.322 145.722C100.998 161.954 102.211 175.839 103.871 186.737H103.882Z" fill="url(#paint13_linear_pp)"/></g>
      <g><path d="M177.624 112.364H181.287C203.071 80.5756 206.711 54.7624 196.318 38.519C190.697 34.9017 184.516 34.5812 178.861 37.0652C178.506 37.2255 178.151 37.3857 177.808 37.5689C177.613 37.6605 177.418 37.7749 177.224 37.878C177.018 37.9924 176.812 38.1184 176.606 38.2328C176.457 38.3244 176.319 38.4045 176.159 38.4961C176.056 38.5648 175.953 38.6335 175.85 38.7022C174.522 39.5721 173.069 40.7168 171.5 42.1019C178.449 38.4274 182.993 37.6719 185.031 39.7095C190.674 45.3529 174.946 70.3648 134.354 112.364H138.498C155.326 94.8272 168.581 79.4423 177.224 67.3542C180.99 62.1 183.817 57.5555 185.798 53.652C185.809 53.652 185.832 53.6635 185.843 53.6749C177.201 71.3607 162.869 91.3015 143.684 112.364H147.725C169.108 88.6 183.302 67.4114 191.075 49.4968C190.457 51.5916 189.735 53.7322 188.911 55.93C182.558 72.803 170.127 92.0227 152.544 112.364H156.55C176.503 88.9434 188.579 68.1898 193.776 50.9505C193.101 55.1058 191.968 59.5129 190.319 64.149C185.134 78.7784 175.232 95.1248 161.198 112.353H165.078C182.993 89.9622 193.055 70.1473 196.306 53.8581C196.008 59.2497 194.818 65.122 192.7 71.4065C188.453 83.9982 180.601 97.8378 169.566 112.364H173.332C188.808 91.5648 197.004 73.1579 198.905 57.9905C199.042 64.0918 197.966 70.8341 195.596 78.1373C192.151 88.7831 186.061 100.31 177.613 112.353L177.624 112.364Z" fill="url(#paint14_linear_pp)"/></g>
      <g><path d="M200.954 49.8633C196.26 40.9231 188.602 37.3745 180.612 38.6795C180.223 38.7482 179.845 38.8168 179.467 38.897C179.261 38.9428 179.044 39 178.826 39.0572C178.597 39.1145 178.368 39.1831 178.14 39.2518C177.979 39.2976 177.819 39.3434 177.647 39.4006C177.533 39.435 177.418 39.4808 177.304 39.5266C173.183 40.9346 167.643 44.0138 160.751 48.8216C158.222 39.6525 155.074 31.6052 151.33 24.7026C168.65 20.4557 182.524 23.6037 191.83 32.9216C196.421 37.5119 199.5 43.2125 200.954 49.8747V49.8633ZM120.847 38.0041C118.065 39.6868 115.238 41.4955 112.365 43.4644V90.4088C116.543 86.368 120.561 82.5676 124.407 79.019C123.732 62.787 122.518 48.9017 120.858 38.0041H120.847Z" fill="url(#paint15_linear_pp)"/></g>
      <defs>
        {/* Gradients — all #1D1D1D → #060606 */}
        {[
          { id: "paint0_linear_pp", x1: 132.8, y1: 96.8, x2: 132.8, y2: 0.8 },
          { id: "paint1_linear_pp", x1: 97.2, y1: 96.9, x2: 97.2, y2: 0 },
          { id: "paint2_linear_pp", x1: 91.9, y1: 224, x2: 91.9, y2: 127.9 },
          { id: "paint3_linear_pp", x1: 127.5, y1: 224.7, x2: 127.5, y2: 127.9 },
          { id: "paint4_linear_pp", x1: 48.8, y1: 120.3, x2: 48.8, y2: 63.6 },
          { id: "paint5_linear_pp", x1: 48.4, y1: 161.1, x2: 48.4, y2: 93.9 },
          { id: "paint6_linear_pp", x1: 175.9, y1: 161.1, x2: 175.9, y2: 104.5 },
          { id: "paint7_linear_pp", x1: 176.3, y1: 130.8, x2: 176.3, y2: 63.6 },
          { id: "paint8_linear_pp", x1: 73.9, y1: 90.4, x2: 73.9, y2: 22.8 },
          { id: "paint9_linear_pp", x1: 56.6, y1: 112.4, x2: 56.6, y2: 23.8 },
          { id: "paint10_linear_pp", x1: 150.8, y1: 201.9, x2: 150.8, y2: 134.4 },
          { id: "paint11_linear_pp", x1: 168.1, y1: 201, x2: 168.1, y2: 112.4 },
          { id: "paint12_linear_pp", x1: 56.6, y1: 189.3, x2: 56.6, y2: 112.4 },
          { id: "paint13_linear_pp", x1: 68.1, y1: 201.9, x2: 68.1, y2: 134.3 },
          { id: "paint14_linear_pp", x1: 168.1, y1: 112.4, x2: 168.1, y2: 35.5 },
          { id: "paint15_linear_pp", x1: 156.7, y1: 90.4, x2: 156.7, y2: 22.8 },
        ].map((g) => (
          <linearGradient key={g.id} id={g.id} x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2} gradientUnits="userSpaceOnUse">
            <stop stopColor="#1D1D1D"/>
            <stop offset="1" stopColor="#060606"/>
          </linearGradient>
        ))}
      </defs>
    </svg>
  );
}

/* ─── Stat field (glass pill with label + value) ─── */
function StatField({ label, value, highlighted = false }: { label: string; value: string | number; highlighted?: boolean }) {
  return (
    <div
      className="flex flex-col gap-[4px] p-[4.5px] rounded-[7px] w-full relative"
      style={{
        background: highlighted ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.05)",
      }}
    >
      <span
        className="text-[#000340] leading-[1.4]"
        style={{ fontFamily: "var(--font-satoshi), sans-serif", fontSize: 7 }}
      >
        {label}
      </span>
      <span
        className="text-[#000340] font-bold leading-[1.4]"
        style={{ fontFamily: "var(--font-satoshi), sans-serif", fontSize: 8 }}
      >
        {value}
      </span>
      <div
        className="absolute inset-0 pointer-events-none rounded-[inherit]"
        style={{ boxShadow: "inset 0px 0.5px 0.5px 0px rgba(255,255,255,0.15)" }}
      />
    </div>
  );
}

/* ─── Mandala / flower pattern (8 interlocking petals) ─── */
function MandalaPattern({ size = 200, opacity = 0.15, color = "white" }: { size?: number; opacity?: number; color?: string }) {
  const petals = 8;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      {Array.from({ length: petals }).map((_, i) => {
        const angle = (360 / petals) * i;
        return (
          <g key={i} transform={`rotate(${angle} 100 100)`}>
            <ellipse cx="100" cy="55" rx="28" ry="52" fill="none" stroke={color} strokeWidth="0.8" opacity={opacity} />
            <ellipse cx="100" cy="55" rx="22" ry="46" fill="none" stroke={color} strokeWidth="0.5" opacity={opacity * 0.7} />
            <ellipse cx="100" cy="55" rx="16" ry="40" fill="none" stroke={color} strokeWidth="0.3" opacity={opacity * 0.5} />
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Front side (dark) ─── */
function PassportFront() {
  return (
    <div
      className="absolute inset-0 rounded-[56px] overflow-hidden"
      style={{ backfaceVisibility: "hidden" }}
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at top left, rgba(10,10,10,1) 0%, rgba(0,0,0,1) 100%)",
        }}
      />

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      {/* Glass border */}
      <div className="absolute inset-0 rounded-[56px] border-2 border-light-glass-5" />

      {/* Content */}
      <div className="relative flex flex-col items-center justify-between h-full py-10 px-8">
        {/* Title */}
        <div className="flex flex-col items-center gap-1.5 mt-4">
          <h2
            className="text-white tracking-[0.2em] font-bold"
            style={{ fontFamily: "var(--font-satoshi), sans-serif", fontSize: 22 }}
          >
            PASSPORT
          </h2>
          <span
            className="text-white/40 tracking-[0.35em] uppercase"
            style={{ fontFamily: "var(--font-satoshi), sans-serif", fontSize: 8 }}
          >
            Vortex Citizen
          </span>
        </div>

        {/* Jokuh symbol with center logo */}
        <div className="relative flex items-center justify-center flex-1">
          <div style={{ filter: "drop-shadow(0px 1px 2px rgba(255,255,255,0.06))" }}>
            <JokuhSymbol size={220} opacity={0.35} />
          </div>
          {/* Center vortex logo */}
          <div className="absolute">
            <VortexSymbol color="rgba(255,255,255,0.6)" width={28} height={16} />
          </div>
        </div>

        {/* Bottom Jokuh logo */}
        <div className="mb-2">
          <JokuhLogo width={52} height={24} opacity={0.25} />
        </div>
      </div>

      {/* Click hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white/20 text-[9px] tracking-wider">
        TAP TO FLIP
      </div>
    </div>
  );
}

/* ─── Back side (light) with 3D shader reflections + info overlay ─── */
function PassportBack({ mousePos, data, isStatic = false }: { mousePos: { x: number; y: number }; data: PassportData; isStatic?: boolean }) {
  return (
    <div
      className="absolute inset-0 rounded-[56px] overflow-hidden"
      style={isStatic ? {} : { backfaceVisibility: "hidden", transform: "rotateY(-180deg)" }}
    >
      {/* Background gradient (warm peach → cool white-blue) */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, #fff2ed 0%, #f8f4f0 40%, #f5f8ff 100%)",
        }}
      />

      {/* Large watermark vortex (top left, oversized) */}
      <div className="absolute -top-8 -left-16 opacity-[0.04]">
        <VortexSymbol color="black" width={380} height={220} />
      </div>

      {/* Plastic/glossy specular reflection layer — follows mouse */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(ellipse 60% 40% at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 20%, rgba(255,255,255,0) 60%)`,
          mixBlendMode: "overlay",
        }}
      />

      {/* Hard specular highlight — sharp plastic reflection */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 25% 15% at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%)`,
          mixBlendMode: "hard-light",
        }}
      />

      {/* Rainbow/holographic iridescence band */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(${135 + (mousePos.x - 50) * 0.5}deg, rgba(255,0,0,0) 0%, rgba(255,0,100,0.06) ${20 + mousePos.x * 0.2}%, rgba(100,0,255,0.08) ${35 + mousePos.x * 0.15}%, rgba(0,150,255,0.06) ${50 + mousePos.x * 0.1}%, rgba(0,255,200,0.04) ${65 + mousePos.y * 0.1}%, rgba(255,255,0,0.03) ${80 + mousePos.y * 0.05}%, rgba(255,0,0,0) 100%)`,
          mixBlendMode: "color",
        }}
      />

      {/* Secondary edge reflection for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(${180 + (mousePos.x - 50) * 0.8}deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.15) 55%, rgba(255,255,255,0) 100%)`,
          mixBlendMode: "soft-light",
        }}
      />

      {/* Glass border */}
      <div
        className="absolute inset-0 rounded-[56px]"
        style={{
          border: "2px solid rgba(255,255,255,0.3)",
          boxShadow: "inset -1px 1px 2px 0px rgba(255,255,255,0.8)",
        }}
      />

      {/* Content */}
      <div className="relative flex flex-col justify-between h-full p-5 pb-8">
        {/* Top row: logo + text | multilingual */}
        <div className="flex items-start justify-between">
          {/* Left: vortex + text */}
          <div className="flex items-center gap-2">
            <div
              style={{
                filter: "drop-shadow(0px 0.1px 0.2px white) drop-shadow(0px -0.1px 0.2px rgba(0,0,0,0.5))",
              }}
            >
              <VortexSymbol color="black" width={44} height={26} />
            </div>
            <div className="flex flex-col">
              <span
                className="font-bold text-black tracking-[0.08em]"
                style={{ fontFamily: "var(--font-satoshi), sans-serif", fontSize: 12 }}
              >
                OFFICIAL PASSPORT
              </span>
              <span
                className="text-black/60"
                style={{ fontFamily: "var(--font-satoshi), sans-serif", fontSize: 9 }}
              >
                Jokuh
              </span>
            </div>
          </div>

          {/* Right: multilingual */}
          <div className="flex flex-col items-end gap-0.5 text-right">
            {["PASSPORT", "Pasaporte", "Passeport", "Pāsapōrṭa", "护照"].map((t) => (
              <span
                key={t}
                className="text-black/50 leading-tight"
                style={{ fontFamily: "var(--font-satoshi), sans-serif", fontSize: 7 }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Right side: cascade of decreasing mandala patterns */}
        <div className="absolute right-5 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
          {[18, 16, 14, 12, 11, 10, 9, 8].map((s, i) => (
            <MandalaPattern key={i} size={s} opacity={0.08 + i * 0.005} color="black" />
          ))}
        </div>

        {/* Info overlay */}
        <div className="flex gap-[13px] items-end">
          {/* Avatar + stat columns */}
          <div className="flex gap-[4.5px] items-start">
            {/* User avatar */}
            <div
              className="shrink-0 rounded-full overflow-hidden"
              style={{
                width: 26,
                height: 36,
                borderRadius: 999,
                border: "2.2px solid #1d1d1d",
                boxShadow: "0px 0.3px 0.6px 0px white, 0px -0.3px 0.6px 0px rgba(0,0,0,0.5)",
              }}
            >
              {data.avatarSrc && (
                <img src={data.avatarSrc} alt="" className="w-full h-full object-cover" />
              )}
            </div>

            {/* Two stat columns */}
            <div className="flex gap-[2px]">
              {/* Left column */}
              <div className="flex flex-col gap-[1px] w-[100px]">
                <StatField label="Name of Infinity" value={data.nameOfInfinity ?? "—"} highlighted />
                <StatField label="Points" value={data.points ?? 0} />
                <StatField label="TOS Inscription Count" value={data.tosInscriptionCount ?? 0} />
                <StatField label="Non TOS Inscription Count" value={data.nonTosInscriptionCount ?? 0} />
                <StatField label="Earliest Aura Interaction" value={data.earliestAuraInteraction ?? "—"} />
              </div>

              {/* Right column */}
              <div className="flex flex-col gap-[1px] w-[100px]">
                <StatField label="Marketplace interactions" value={data.marketplaceInteractions ?? 0} />
                <StatField label="Marketplaces Used" value={data.marketplacesUsed ?? 0} />
                <StatField label="Number of Sales" value={data.numberOfSales ?? 0} />
                <StatField label="Unique TOS-20s" value={data.uniqueTos20s ?? 0} />
                <StatField label="Transfers made" value={data.transfersMade ?? 0} />
              </div>
            </div>
          </div>

          {/* E-Citizen Duration */}
          <div className="flex flex-col gap-[7px] items-center justify-center shrink-0">
            {/* Ghosted avatar */}
            <div
              className="rounded-full overflow-hidden opacity-20"
              style={{
                width: 26,
                height: 36,
                borderRadius: 999,
                border: "2.2px solid #1d1d1d",
                boxShadow: "0px 0.3px 0.6px 0px white, 0px -0.3px 0.6px 0px rgba(0,0,0,0.5)",
              }}
            >
              {data.avatarSrc && (
                <img src={data.avatarSrc} alt="" className="w-full h-full object-cover" />
              )}
            </div>

            <div className="flex flex-col gap-[4.5px] items-center">
              {/* Label */}
              <span
                className="text-black font-bold text-center leading-[1.2]"
                style={{ fontFamily: "var(--font-satoshi), sans-serif", fontSize: 6.5 }}
              >
                E-Citizen
                <br />
                Duration
              </span>

              {/* Glass tag */}
              <div
                className="flex items-center justify-center px-[5.5px] rounded-[9px] relative"
                style={{
                  height: 18,
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(7px)",
                  border: "0.6px solid rgba(255,255,255,0.1)",
                  boxShadow: "0px 5.6px 11.2px 0px rgba(0,0,0,0.1)",
                }}
              >
                <span
                  className="text-black whitespace-nowrap"
                  style={{
                    fontFamily: "var(--font-geist-mono, 'Geist Mono', monospace)",
                    fontSize: 7,
                    textShadow: "0px -0.3px 0.6px rgba(0,0,0,0.5), 0px 0.3px 0.6px white",
                  }}
                >
                  {data.eCitizenDuration ?? "—"}
                </span>
                <div
                  className="absolute inset-0 pointer-events-none rounded-[inherit]"
                  style={{ boxShadow: "inset 0px 0.6px 0.6px 0px rgba(255,255,255,0.5), inset 0px 1.1px 1.7px 0px white" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Click hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-black/20 text-[9px] tracking-wider">
        TAP TO FLIP
      </div>
    </div>
  );
}

/* ─── Main interactive passport component ─── */
export function PassportCard({ data: dataProp, variant = "interactive" }: { data?: Partial<PassportData>; variant?: "interactive" | "front" | "back" } = {}) {
  const data = { ...defaultData, ...dataProp };
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [mousePos, setMousePos] = React.useState({ x: 50, y: 50 });
  const cardRef = React.useRef<HTMLDivElement>(null);

  // Squircle clip path
  const squirclePath = React.useMemo(
    () =>
      getSvgPath({
        width: 328,
        height: 492,
        cornerRadius: 56,
        cornerSmoothing: 1,
      }),
    [],
  );

  const handleMouseMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  const handleMouseLeave = React.useCallback(() => {
    setMousePos({ x: 50, y: 50 });
  }, []);

  const baseFlipY = isFlipped ? -180 : 0;

  // Static front/back variants
  if (variant === "front" || variant === "back") {
    return (
      <div
        className="relative select-none"
        style={{ width: 328, height: 492 }}
      >
        <div className="relative w-full h-full">
          {variant === "front" ? <PassportFront /> : <PassportBack mousePos={{ x: 50, y: 50 }} data={data} isStatic />}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      className="relative cursor-pointer select-none"
      style={{
        width: 328,
        height: 492,
        perspective: 1200,
      }}
      onClick={() => setIsFlipped((f) => !f)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative w-full h-full"
        style={{
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateY: baseFlipY,
        }}
        transition={{
          rotateY: { type: "tween", duration: 0.45, ease: [0.4, 0, 0.2, 1] },
        }}
      >
        <PassportFront />
        <PassportBack mousePos={mousePos} data={data} />
      </motion.div>
    </div>
  );
}
