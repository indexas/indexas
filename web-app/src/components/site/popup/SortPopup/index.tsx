import Dropdown from "components/base/Dropdown";
import DropdownMenuItem from "components/base/Dropdown/DropdownMenuItem";
import Text from "components/base/Text";
import React from "react";

export type SortPopupSelection = "newest" | "oldest" | "tag" | "default";

export interface SortPopupProps {
	onChange?(type: SortPopupSelection): void;
	children: React.ReactNode;
}
const SortPopup = (
	{
		children,
		onChange,
	}: SortPopupProps,
) => {
	const handleClick = (type: SortPopupSelection) => {
		onChange && onChange(type);
	};

	return (
		<Dropdown
			position="bottom-right"
			menuItems={
				<>
					<DropdownMenuItem
						onClick={() => handleClick("newest")}
					>
						<Text element="span" size="sm">Newest First</Text>
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => handleClick("oldest")}
					>
						<Text element="span" size="sm">Oldest First</Text>
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => handleClick("tag")}
					>
						<Text element="span" size="sm">Most Tagged</Text>
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => handleClick("default")}
					>
						<Text element="span" size="sm">Default</Text>
					</DropdownMenuItem>
				</>
			}
		>
			{children}
		</Dropdown>
	);
};

export default SortPopup;
