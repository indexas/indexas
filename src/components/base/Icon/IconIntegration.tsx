import * as React from "react";

const IconIntegration = (
	{
		stroke = "var(--main)",
		strokeWidth = "1.2",
		...props
	}: React.SVGProps<SVGSVGElement>,
) => (<svg className="icon"
	width={16}
	height={16}
	viewBox="0 0 16 16"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	stroke={stroke}
	strokeWidth={strokeWidth}
	{...props}
>
	<path
		d="M4.376 6.966c.496.002.982-.146 1.395-.425.414-.28.737-.677.928-1.142.19-.465.241-.977.146-1.472a2.559 2.559 0 0 0-.685-1.306c-.35-.357-.798-.6-1.285-.699a2.474 2.474 0 0 0-1.45.144 2.517 2.517 0 0 0-1.127.938 2.574 2.574 0 0 0 .309 3.213 2.49 2.49 0 0 0 1.769.75ZM11.617 6.966c.496.002.982-.146 1.396-.425.413-.28.736-.677.927-1.142a2.583 2.583 0 0 0-.54-2.778 2.474 2.474 0 0 0-2.735-.556 2.517 2.517 0 0 0-1.126.939 2.574 2.574 0 0 0 .309 3.213 2.49 2.49 0 0 0 1.769.75ZM4.376 14.12c.496.001.982-.147 1.395-.426.414-.279.737-.676.928-1.141a2.583 2.583 0 0 0-.54-2.778 2.474 2.474 0 0 0-2.735-.555 2.517 2.517 0 0 0-1.126.937 2.575 2.575 0 0 0 .309 3.214 2.49 2.49 0 0 0 1.769.749ZM11.617 14.12c.496.001.982-.147 1.396-.426.413-.279.736-.676.927-1.141a2.583 2.583 0 0 0-.54-2.778 2.474 2.474 0 0 0-2.735-.555 2.517 2.517 0 0 0-1.126.937 2.575 2.575 0 0 0 .309 3.214 2.49 2.49 0 0 0 1.769.749ZM11.467 6.966v2.068M6.884 4.549h2.232M4.533 9.034V6.966M9.116 11.588H6.884"
		strokeLinecap="round"
		strokeLinejoin="round"
	/>
</svg>);

export default IconIntegration;
