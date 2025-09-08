import * as React from "react";
const LogoIcon = () => (
    <svg
        width={512}
        height={512}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    // {...props}
    >
        <mask
            id="mask0_302_82"
            style={{
                maskType: "alpha",
            }}
            maskUnits="userSpaceOnUse"
            x={0}
            y={0}
            width={512}
            height={512}
        >
            <rect width={512} height={512} fill="white" />
        </mask>
        <g mask="url(#mask0_302_82)">
            <path
                d="M27 227C27 131.776 27 84.1644 56.5822 54.5822C86.1644 25 133.776 25 229 25H283.343C378.85 25 426.603 25 456.205 54.6982C485.807 84.3965 485.652 132.15 485.342 227.656L485.154 285.656C484.845 380.597 484.691 428.067 455.129 457.534C425.567 487 378.096 487 283.155 487H229C133.776 487 86.1644 487 56.5822 457.418C27 427.836 27 380.224 27 285V227Z"
                fill="white"
            />
            <g
                className="animate-pulse"
                filter="url(#filter0_d_302_82)">
                <path
                    d="M200.5 148.5C186.5 220.5 266 277.5 305.999 289C368 275 429 194 409.5 140C393.792 96.5 338 80.9999 305.999 124.5C294.5 98.5 214.014 78.9999 200.5 148.5Z"
                    fill="url(#paint0_linear_302_82)"
                />
            </g>
        </g>
        <defs>
            <filter
                id="filter0_d_302_82"
                x={194.867}
                y={98.6104}
                width={222.331}
                height={198.39}
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
            >
                <feFlood floodOpacity={0} result="BackgroundImageFix" />
                <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                />
                <feOffset dy={4} />
                <feGaussianBlur stdDeviation={2} />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                />
                <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_302_82"
                />
                <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_302_82"
                    result="shape"
                />
            </filter>
            <linearGradient
                id="paint0_linear_302_82"
                x1={306.033}
                y1={98.6104}
                x2={306.033}
                y2={289}
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="#FF5FA8" />
                <stop offset={1} stopColor="#FF2B24" />
            </linearGradient>
        </defs>
    </svg>
);


export const HeartLogoIcon = ({ className }: { className: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="83"
        height="76"
        className={className}
        fill="none"
        viewBox="0 0 83 76"
    >
        <path
            fill="url(#paint0_linear_310_139)"
            d="M.632 19.915C-4.784 48.656 25.972 71.409 41.447 76c23.987-5.588 47.586-37.922 40.042-59.478C75.412-.842 53.827-7.03 41.447 10.335 36.998-.044 5.86-7.828.632 19.915"
        ></path>
        <defs>
            <linearGradient
                id="paint0_linear_310_139"
                x1="41.46"
                x2="41.46"
                y1="0"
                y2="76"
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="#FF5FA8"></stop>
                <stop offset="1" stopColor="#FF2B24"></stop>
            </linearGradient>
        </defs>
    </svg>
);
export default LogoIcon;