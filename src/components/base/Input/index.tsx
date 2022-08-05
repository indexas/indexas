import React, { useRef, useState } from "react";
import cc from "classcat";
import { InputSizeType, PropType } from "types";
import Flex from "components/layout/base/Grid/Flex";
import IconVisible from "../Icon/IconVisible";
import IconInvisible from "../Icon/IconInvisible";

export interface InputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
	error?: string;
	inputSize?: InputSizeType;
	block?: boolean;
	ghost?: boolean;
	addOnBefore?: React.ReactNode;
	addOnAfter?: React.ReactNode;
	type?: PropType<React.InputHTMLAttributes<HTMLInputElement>, "type">;
}

const Input: React.FC<InputProps> = ({
	className,
	addOnBefore,
	addOnAfter,
	disabled,
	readOnly,
	type,
	block = true,
	inputSize = "md",
	ghost = false,
	...inputProps
}) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [showPw, setShowPw] = useState(false);

	const handleTogglePw = () => {
		setShowPw((oldVal) => !oldVal);
	};
	const renderVisible = () => (showPw ? <IconInvisible onClick={handleTogglePw} /> : <IconVisible onClick={handleTogglePw} />);

	return (
		<Flex className={cc(
			[
				"input",
				`input-${inputSize}`,
				ghost ? "input-ghost" : "",
				block ? "input-block" : "",
				disabled ? "input-disabled" : "",
				readOnly ? "input-readonly" : "",
				addOnBefore ? "input-add-on-before" : "",
				addOnAfter ? "input-add-on-after" : "",
				className,
			],
		)}>
			{addOnBefore}
			<input
				ref={inputRef}
				{...inputProps}
				disabled={disabled}
				readOnly={readOnly}
				type={type === "password" && showPw ? "text" : type}
				className={"input__input"} />
			{type === "password" ? renderVisible() : addOnAfter}
		</Flex>
	);
};
export default Input;
