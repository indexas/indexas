import React, { useContext } from "react";
import cc from "classcat";
import { InputSizeType } from "types";
import SelectContext from "../select-context";

export interface OptionProps {
	value: string;
	children: React.ReactNode;
	divider?: boolean;
	size?: InputSizeType,
}

const Option = (
	{
		value,
		children,
		divider = false,
		size = "md",
	}: OptionProps,
) => {
	const selectContext = useContext(SelectContext);

	const getSelected = () => (selectContext && selectContext.getSelected ? selectContext.getSelected(value) : false);

	const handleSelected = () => {
		selectContext && selectContext.setValueFromOption && selectContext.setValueFromOption(value);
	};

	return (
		<div
			className={cc([
				"option",
				getSelected() ? "option-selected" : "",
				divider ? "option-divider" : "",
				`option-${size}`,
			])}
			onClick={handleSelected}
		>
			{children}
		</div>);
};

export default Option;
