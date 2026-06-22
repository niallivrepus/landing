import * as React from "react"

import { cn } from "../../lib/utils"

export type OOExpression = "default" | "happy" | "rainbow-puke"

interface OOProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Background color of the container
     * @default "var(--color-blue-4)"
     */
    backgroundColor?: string
    /**
     * Border color of the container
     * @default "var(--color-light-glass-20)"
     */
    borderColor?: string
    /**
     * Body gradient start color
     * @default "#7700FF"
     */
    bodyGradientStart?: string
    /**
     * Body gradient end color
     * @default "#B300FF"
     */
    bodyGradientEnd?: string
    /**
     * Body stroke color
     * @default "#E2C5FF" (purple-6)
     */
    bodyStrokeColor?: string
    /**
     * Eye color
     * @default "var(--color-light-space)" (theme-independent white)
     */
    eyeColor?: string
    /**
     * Facial expression
     * @default "default"
     */
    expression?: OOExpression
    /**
     * Whether the character body is bouncing (click feedback).
     * Only the purple body bounces, not the blue background.
     */
    bouncing?: boolean
}

const OO = React.forwardRef<HTMLDivElement, OOProps>(
    (
        {
            className,
            backgroundColor = "#0066FF",
            borderColor = "rgba(255, 255, 255, 0.20)",
            bodyGradientStart = "#7700FF",
            bodyGradientEnd = "#B300FF",
            bodyStrokeColor = "#E2C5FF",
            eyeColor = "#FFFFFF",
            expression = "default",
            bouncing = false,
            style: externalStyle,
            ...props
        },
        ref
    ) => {
        const uniqueId = React.useId()

        return (
            <div
                ref={ref}
                className={cn("relative overflow-hidden rounded-full", className)}
                style={{
                    width: 42,
                    height: 42,
                    backgroundColor,
                    border: `1px solid ${borderColor}`,
                    ...externalStyle,
                }}
                data-slot="oo"
                {...props}
            >
                <svg
                    width="35"
                    height="42"
                    viewBox="0 0 39 46"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{
                        top: "6px",
                        width: "35px",
                        height: "42px",
                        transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        transform: bouncing ? "translateY(-4px)" : "translateY(0)",
                    }}
                >
                    <defs>
                        {/* Body gradient */}
                        <linearGradient
                            id={`oo-body-gradient-${uniqueId}`}
                            x1="2"
                            y1="43.882"
                            x2="40.5535"
                            y2="39.8229"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stopColor={bodyGradientStart} />
                            <stop offset="1" stopColor={bodyGradientEnd} />
                        </linearGradient>

                        {/* Inner shadow filter for body */}
                        <filter
                            id={`oo-inner-shadow-${uniqueId}`}
                            x="0"
                            y="0"
                            width="38.5713"
                            height="47.2489"
                            filterUnits="userSpaceOnUse"
                            colorInterpolationFilters="sRGB"
                        >
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                            <feColorMatrix
                                in="SourceAlpha"
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                result="hardAlpha"
                            />
                            <feOffset dy="1.3671" />
                            <feGaussianBlur stdDeviation="0.683548" />
                            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.15 0" />
                            <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
                        </filter>

                        {/* Eye drop shadow filter */}
                        <filter
                            id={`oo-eye-shadow-${uniqueId}`}
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
                            <feOffset dy="-0.341774" />
                            <feGaussianBlur stdDeviation="0.341774" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                            <feColorMatrix
                                in="SourceAlpha"
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                result="hardAlpha"
                            />
                            <feOffset dy="0.341774" />
                            <feGaussianBlur stdDeviation="0.341774" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
                            <feBlend mode="overlay" in2="effect1_dropShadow" result="effect2_dropShadow" />
                            <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow" result="shape" />
                        </filter>

                        {/* Mask for body stroke */}
                        <mask
                            id={`oo-body-mask-${uniqueId}`}
                            maskUnits="userSpaceOnUse"
                            x="0"
                            y="0"
                            width="39"
                            height="46"
                        >
                            <rect fill="white" width="39" height="46" />
                            <path d="M14.874 2C15.283 2 15.684 2.03547 16.0742 2.10156C24.2 2.40708 31.1575 7.83523 34.4824 15.6387C35.8145 18.3494 36.5712 21.4563 36.5713 24.7588C36.5713 24.956 36.5669 25.1528 36.5615 25.3486C36.5672 25.5773 36.5713 25.8068 36.5713 26.0371H36.5322C35.9378 36.0024 28.4444 43.8816 19.2861 43.8818C9.73945 43.8818 2 35.3201 2 24.7588C2.0001 19.0454 4.2657 13.9181 7.85645 10.4141C7.7812 9.99873 7.73926 9.57081 7.73926 9.13379C7.73952 5.19375 10.934 2.00016 14.874 2Z" />
                        </mask>

                        {/* Rainbow puke clip path */}
                        <clipPath id={`oo-rainbow-clip-${uniqueId}`}>
                            <rect x="0.683" y="1.025" width="8" height="16" rx="1" />
                        </clipPath>
                    </defs>

                    {/* Body shape with inner shadow */}
                    <g>
                        <path
                            d="M14.874 2C15.283 2 15.684 2.03547 16.0742 2.10156C24.2 2.40708 31.1575 7.83523 34.4824 15.6387C35.8145 18.3494 36.5712 21.4563 36.5713 24.7588C36.5713 24.956 36.5669 25.1528 36.5615 25.3486C36.5672 25.5773 36.5713 25.8068 36.5713 26.0371H36.5322C35.9378 36.0024 28.4444 43.8816 19.2861 43.8818C9.73945 43.8818 2 35.3201 2 24.7588C2.0001 19.0454 4.2657 13.9181 7.85645 10.4141C7.7812 9.99873 7.73926 9.57081 7.73926 9.13379C7.73952 5.19375 10.934 2.00016 14.874 2Z"
                            fill={`url(#oo-body-gradient-${uniqueId})`}
                        />
                    </g>

                    {/* Body stroke */}
                    <path
                        d="M14.874 2V0H14.8739L14.874 2ZM16.0742 2.10156L15.7402 4.07347L15.8688 4.09525L15.9991 4.10015L16.0742 2.10156ZM34.4824 15.6387L32.6425 16.4226L32.6636 16.4723L32.6875 16.5208L34.4824 15.6387ZM36.5713 24.7588H38.5713V24.7588L36.5713 24.7588ZM36.5615 25.3486L34.5623 25.2939L34.5608 25.3461L34.5621 25.3983L36.5615 25.3486ZM36.5713 26.0371V28.0371H38.5713L38.5713 26.0371L36.5713 26.0371ZM36.5322 26.0371V24.0371H34.648L34.5358 25.918L36.5322 26.0371ZM19.2861 43.8818V45.8818H19.2862L19.2861 43.8818ZM2 24.7588L0 24.7588V24.7588H2ZM7.85645 10.4141L9.25327 11.8455L10.0139 11.1032L9.82441 10.0575L7.85645 10.4141ZM7.73926 9.13379L5.73926 9.13366V9.13379H7.73926ZM14.874 2V4C15.1672 4 15.4564 4.02541 15.7402 4.07347L16.0742 2.10156L16.4082 0.129651C15.9116 0.0455333 15.3989 0 14.874 0V2ZM16.0742 2.10156L15.9991 4.10015C23.2312 4.37207 29.5711 9.21416 32.6425 16.4226L34.4824 15.6387L36.3224 14.8547C32.744 6.45631 25.1688 0.442093 16.1494 0.102975L16.0742 2.10156ZM34.4824 15.6387L32.6875 16.5208C33.885 18.9577 34.5712 21.7629 34.5713 24.7588L36.5713 24.7588L38.5713 24.7588C38.5712 21.1497 37.7441 17.7412 36.2774 14.7566L34.4824 15.6387ZM36.5713 24.7588H34.5713C34.5713 24.928 34.5675 25.103 34.5623 25.2939L36.5615 25.3486L38.5608 25.4034C38.5663 25.2027 38.5713 24.984 38.5713 24.7588H36.5713ZM36.5615 25.3486L34.5621 25.3983C34.5676 25.6183 34.5713 25.8297 34.5713 26.0371L36.5713 26.0371L38.5713 26.0371C38.5713 25.7839 38.5668 25.5363 38.5609 25.299L36.5615 25.3486ZM36.5713 26.0371V24.0371H36.5322V26.0371V28.0371H36.5713V26.0371ZM36.5322 26.0371L34.5358 25.918C33.9934 35.0117 27.2103 41.8816 19.2861 41.8818L19.2861 43.8818L19.2862 45.8818C29.6785 45.8815 37.8823 36.993 38.5287 26.1562L36.5322 26.0371ZM19.2861 43.8818V41.8818C11.0292 41.8818 4 34.4103 4 24.7588H2H0C0 36.2299 8.44966 45.8818 19.2861 45.8818V43.8818ZM2 24.7588L4 24.7588C4.00009 19.5737 6.05573 14.9658 9.25327 11.8455L7.85645 10.4141L6.45962 8.98267C2.47567 12.8704 0.000105619 18.5171 0 24.7588L2 24.7588ZM7.85645 10.4141L9.82441 10.0575C9.76889 9.75106 9.73926 9.44264 9.73926 9.13379H7.73926H5.73926C5.73926 9.69899 5.79351 10.2464 5.88848 10.7706L7.85645 10.4141ZM7.73926 9.13379L9.73926 9.13392C9.73945 6.29866 12.0382 4.00012 14.8741 4L14.874 2L14.8739 0C9.82968 0.000210524 5.73959 4.08884 5.73926 9.13366L7.73926 9.13379Z"
                        fill={bodyStrokeColor}
                        mask={`url(#oo-body-mask-${uniqueId})`}
                    />

                    {/* Eyes */}
                    {expression === "happy" || expression === "rainbow-puke" ? (
                        <g transform="translate(15.5, 12.4)">
                            <path d="M3.89697 1.02533C0.435924 1.32109 0.472019 5.97135 0.858909 7.92327C1.48452 6.88095 2.8135 4.79631 4.02087 4.79631C5.59815 4.79631 6.50606 6.88096 7.09943 7.92328C7.57682 5.46175 6.96019 1.02532 3.89697 1.02533Z" fill={eyeColor} />
                            <path d="M13.6387 1.02533C11.5964 1.08988 10.8049 4.65175 11.4985 7.91882C12.0018 6.87649 13.2512 4.79184 14.2226 4.79184C15.1939 4.79184 16.3914 6.87649 16.8688 7.91882C17.1462 5.32551 16.195 1.02532 13.6387 1.02533Z" fill={eyeColor} />
                        </g>
                    ) : (
                        <>
                            <g>
                                <ellipse cx="19.4223" cy="16.9144" rx="3.37091" ry="5.25236" fill={eyeColor} />
                            </g>
                            <g>
                                <ellipse
                                    cx="29.5921"
                                    cy="16.9143"
                                    rx="2.86138"
                                    ry="5.25236"
                                    transform="rotate(-6.90938 29.5921 16.9143)"
                                    fill={eyeColor}
                                />
                            </g>
                        </>
                    )}

                    {/* Rainbow puke */}
                    {expression === "rainbow-puke" && (
                        <g transform="translate(20, 25)">
                            <g clipPath={`url(#oo-rainbow-clip-${uniqueId})`}>
                                <rect x="0.683" y="1.025" width="8" height="16" rx="1" fill="white" />
                                <rect width="1" height="16" x="0.683" y="1.025" fill="#FF0700" />
                                <rect width="1" height="16" x="1.683" y="1.025" fill="#FF4D00" />
                                <rect width="1" height="16" x="2.683" y="1.025" fill="#FFC633" />
                                <rect width="1" height="16" x="3.683" y="1.025" fill="#21DC11" />
                                <rect width="1" height="16" x="4.683" y="1.025" fill="#43FDFF" />
                                <rect width="1" height="16" x="5.683" y="1.025" fill="#0066FF" />
                                <rect width="1" height="16" x="6.683" y="1.025" fill="#9327FF" />
                                <rect width="1" height="16" x="7.683" y="1.025" fill="#FF00EE" />
                            </g>
                        </g>
                    )}
                </svg>
            </div>
        )
    }
)

OO.displayName = "OO"

export { OO, type OOProps }
