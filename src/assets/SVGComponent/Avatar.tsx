import { SVGType } from "@/lib/types";

const AvatarIcon = ({ size = 40, fill = "#1D293D" }: SVGType) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Head */}
    <circle cx="50" cy="38" r="16" fill={fill} />

    {/* Body */}
    <path
      d="M22 82C22 66.536 34.536 54 50 54C65.464 54 78 66.536 78 82V84H22V82Z"
      fill={fill}
    />
  </svg>
);

export default AvatarIcon;
