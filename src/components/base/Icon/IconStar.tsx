import * as React from "react";

const IconStar: React.FC<React.SVGProps<SVGSVGElement>> = ({ stroke = "var(--gray-4)", strokeWidth = "1.2", ...props }) => (
	<svg className="icon"
		width={16}
		height={14}
		fill="none"
		viewBox="0 0 16 14"
		xmlns="http://www.w3.org/2000/svg"
		stroke={stroke}
		strokeWidth={strokeWidth}
		{...props}
	>
		<path
			d="M11.548 8.26a.682.682 0 0 0-.25.334.66.66 0 0 0-.005.413l1.05 3.133a.724.724 0 0 1-.006.455.75.75 0 0 1-.279.367.789.789 0 0 1-.896.007l-2.749-1.936a.727.727 0 0 0-.826 0l-2.75 1.936a.79.79 0 0 1-.895-.007.75.75 0 0 1-.279-.367.725.725 0 0 1-.007-.456l1.058-3.132a.667.667 0 0 0-.01-.414.69.69 0 0 0-.252-.333l-2.75-1.937a.748.748 0 0 1-.265-.372.725.725 0 0 1 .005-.452.75.75 0 0 1 .274-.367.789.789 0 0 1 .442-.147h3.39a.71.71 0 0 0 .417-.127.674.674 0 0 0 .255-.344l1.05-3.132a.75.75 0 0 1 .282-.364.79.79 0 0 1 .896 0c.13.09.23.217.282.364l1.058 3.132a.674.674 0 0 0 .252.341.71.71 0 0 0 .412.13h3.397a.789.789 0 0 1 .44.15.75.75 0 0 1 .27.367c.049.146.05.304.003.45a.748.748 0 0 1-.265.371L11.548 8.26Z"
			stroke={stroke}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export default IconStar;
