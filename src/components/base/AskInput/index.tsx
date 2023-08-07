import React from "react";
import Input from "../Input";
import IconSend from "../Icon/IconSend";
import { useEnterSubmit } from "../../../hooks/useEnterSubmit";

export interface AskInputProps {
	onSubmit: (value: string) => Promise<void>
	input: string,
	setInput: (value: string) => void,
	isLoading: (value: boolean) => void,
}

const AskInput = ({
	onSubmit, input, setInput, isLoading, ...inputProps
}: AskInputProps) => {
	const { formRef, onKeyDown } = useEnterSubmit();
	const inputRef = React.useRef<HTMLInputElement>(null);
	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault();
				if (!input?.trim()) {
					return;
				}
				setInput("");
				await onSubmit(input);
			}}
			ref={formRef}
		>
			<Input
				ref={inputRef}
				value={input}
				onKeyDown={onKeyDown}
				onChange={(e) => setInput(e.target.value)}
				inputSize={"lg"}
				addOnAfter={<IconSend width={20} height={20} />}
				spellCheck={false}
			/>
		</form>

	);
};

export default AskInput;
