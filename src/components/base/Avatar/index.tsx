import React, { useEffect, useState } from "react";
import cc from "classcat";
import { generateRandomColor, isSSR } from "utils/helper";
import { ShapeType } from "types";
import { Users } from "types/entity";
import { appConfig } from "config";
import { ProfileState } from "store/slices/profileSlice";

export interface AvatarProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	size?: number;
	user?: Users | ProfileState;
	creatorRule?: any;
	shape?: ShapeType;
	hoverable?: boolean;
	contentRatio?: number;
	randomColor?: boolean;
	bgColor?: string;
}

const Avatar = (
	{
		size = 40,
		user,
		creatorRule,
		children,
		className,
		style,
		bgColor,
		shape = "circle",
		hoverable = false,
		randomColor = false,
		...divProps
	}: AvatarProps,
) => {
	const maxLetters = size > 32 ? 4 : 2;
	const [color, setColor] = useState<string>(bgColor || "var(--main)");
	const getFontSize = () => size * (1 / maxLetters);
	useEffect(() => {
		if (!isSSR() && randomColor) {
			setColor(generateRandomColor());
		}
	}, []);

	return (
		<div
			{...divProps}
			className={cc(
				[
					"avatar",
					`avatar-${shape}`,
					hoverable ? "avatar-hoverable" : "",
					className || "",
				],
			)}
			style={{
				...style,
				width: size,
				height: size,
				lineHeight: `${size}px`,
				fontSize: getFontSize(),

				backgroundColor: color,
			}}
		>
			{
				user ? (
					user.avatar ? (
						<img src={`${appConfig.ipfsProxy}/${user.avatar}`} alt="profile_img"/>
					) : (
						user.name ? user.name!.substring(0, 1).toUpperCase() : (user.id ? user.id.toString().slice(maxLetters * -1).toUpperCase() : "Y")
					)
				) : creatorRule ? (
					creatorRule.image ? (
						<img src={creatorRule.image} alt="profile_img"/>
					) : (
						(creatorRule.symbol || creatorRule.ensName)?.substring(0, 4).toUpperCase()
					)
				) : (
					typeof children !== "string" ? children : null
				)
			}
		</div>
	);
};

export default Avatar;
