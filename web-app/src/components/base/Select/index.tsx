import React, {
	ReactElement, useCallback, useEffect, useRef, useState,
} from "react";
import cc from "classcat";
import { InputSizeType, SelectValueType } from "types";
import useBackdropClick from "hooks/useBackdropClick";
import { useTranslation } from "next-i18next";
import SelectContext from "./select-context";
import { OptionProps } from "./Option";
import IconUpArrow from "../Icon/IconUpArrow";
import IconClose from "../Icon/IconClose";

export type SelectChildrenType = ReactElement<OptionProps>[] | ReactElement<OptionProps>;

export interface SelectProps {
	children: SelectChildrenType;
	value?: string | string[];
	className?: string;
	defaultValue?: SelectValueType;
	mode?: "single" | "multiple";
	bordered?: boolean;
	size?: InputSizeType,
	fullWidth?: boolean;
	disabled?: boolean;
	noMinWidth?: boolean;
	placeholder?: React.ReactNode;
	ghost?: boolean;
	onChange?(value?: string | string[]): void;
}

const Select: React.VFC<SelectProps> = ({
	children,
	value,
	bordered,
	mode = "single",
	size = "md",
	fullWidth = true,
	disabled = false,
	placeholder,
	noMinWidth = false,
	ghost = false,
	className,
	onChange,
}) => {
	const { t } = useTranslation(["components"]);

	const loadState = () => {
		if (mode === "multiple") {
			return typeof value === "undefined" ? [] : (typeof value === "string" ? [value] : [...(value! as string[])]);
		}
		return value;
	};

	const [menuOpen, setMenuOpen] = useState(false);

	const selectRef = useRef<HTMLDivElement>(null);
	const selectInputRef = useRef<HTMLDivElement>(null);
	const selectionsRef = useRef<HTMLDivElement>(null);

	const [selection, setSelection] = useState<string | string[] | undefined>(() => loadState());
	const [collapseSelections, setCollapseSelections] = useState(false);

	const getSelected = (optionValue: string) => (mode === "single" ? selection === optionValue : (selection! as string[]).indexOf(optionValue) > -1);

	useEffect(() => {
		setSelection(loadState);
	}, [value]);

	const handleValueChange = (optionValue: string) => {
		if (mode === "single") {
			setSelection(optionValue);
			return;
		}

		const selectedBefore = getSelected(optionValue);
		if (selectedBefore) {
			setSelection((oldSelection) => (oldSelection as string[]).filter((val) => val !== optionValue));
		} else {
			setSelection((oldSelection) => [...(oldSelection as string[]), optionValue]);
		}
	};

	const showPlaceholder = (): boolean => {
		if (placeholder) {
			if (mode === "single") {
				return !selection;
			}
			return !selection || (selection as string[]).length === 0;
		}
		return false;
	};

	useEffect(() => {
		onChange && onChange(selection!);
		if (mode === "multiple") {
			const collapse = selectionsRef.current!.clientWidth > (selectInputRef.current!.clientWidth) - 32;
			setCollapseSelections(collapse);
		}
		setMenuOpen(false);
	}, [selection]);

	const getMode = () => mode;

	const handleToggle = () => {
		setMenuOpen((oldVal) => !oldVal);
	};

	const handleBackdropClick = () => {
		setMenuOpen(false);
	};

	useBackdropClick(selectRef, handleBackdropClick, menuOpen);

	const handleRemoveSelection = useCallback((e: any, optionValue: string) => {
		e && e.stopPropagation();
		setSelection((oldSelection) => (oldSelection as string[]).filter((val) => val !== optionValue));
	}, []);

	const handleClearAll = (e: any) => {
		e && e.stopPropagation();
		setSelection([]);
	};

	const renderInputItem = (child: ReactElement<OptionProps>) => {
		const hasItem = getSelected(child.props.value);
		if (!hasItem) {
			return null;
		}
		return (
			<div
				className="select-input-item"
				style={{
					visibility: collapseSelections ? "hidden" : "visible",
				}}
				onClick={mode === "multiple" && !disabled ? (e) => handleRemoveSelection(e, child.props.value) : undefined}
			>
				{child.props.children}
				{mode === "multiple" && <IconClose className="select-multiple-close-icon" />}
			</div>
		);
	};

	const renderCollapsed = () => (
		<div
			className="select-input-item"
			onClick={handleClearAll}
			style={{
				position: "absolute",
			}}
		>
			{t("components:select.collapseMessage", "", {
				count: selection?.length,
			})}
			<IconClose className="select-multiple-close-icon" />
		</div>
	);

	return (
		<SelectContext.Provider
			value={{
				selection,
				setValueFromOption: handleValueChange,
				getSelected,
				getMode,
			}}
		>
			<div
				ref={selectRef}
				className={cc([
					"select",
					mode === "multiple" ? "select-multiple" : "",
					bordered ? "select-bordered" : "",
					menuOpen ? "select-open" : "",
					disabled ? "select-disabled" : "",
					fullWidth ? "w-100" : "",
					noMinWidth ? "select-w-auto" : "",
					ghost ? "select-ghost" : "",
					className || "",
				])}
			>
				<div
					ref={selectInputRef}
					className={cc([
						"select-input",
						`select-input-${size}`,
					])}
					onClick={!disabled ? handleToggle : undefined}
				>
					<div
						ref={selectionsRef}
						className="select-selections"
					>
						{
							collapseSelections && renderCollapsed()
						}
						{
							React.Children.map(children, (child) => renderInputItem(child))
						}
						{showPlaceholder() && <div className="select-placeholder">{placeholder}</div>}
					</div>
					<IconUpArrow className="select-input-arrow" />
				</div>
				<div className="select-menu">
					{children}
				</div>
			</div>
		</SelectContext.Provider>
	);
};

export default Select;
