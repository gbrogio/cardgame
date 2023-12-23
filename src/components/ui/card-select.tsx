"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { cn } from "utils/cn";

const CardSelectContext = createContext<{
	value: string[];
	multi: boolean;
	handleValue: React.Dispatch<React.SetStateAction<string[]>>;
}>({} as any);
const useCardSelect = () => useContext(CardSelectContext);

export const CardSelect: BTypes.FC<{
	multi?: boolean;
	onChangeValue: (v: string[]) => void;
	defaultValue?: string[];
}> = ({ multi = false, defaultValue = [], onChangeValue, ...props }) => {
	const [value, setValue] = useState<string[]>(defaultValue || []);

	useEffect(() => {
		onChangeValue(value);
	}, [value, onChangeValue]);

	return (
		<CardSelectContext.Provider value={{ multi, value, handleValue: setValue }}>
			<div {...props} />
		</CardSelectContext.Provider>
	);
};
export const CardSelectItem: BTypes.FC<{ value: string }> = ({
	value,
	className,
	...props
}) => {
	const { multi, value: selectedValues, handleValue } = useCardSelect();

	return (
		<button
			type="button"
			className={cn(
				className,
				"flex flex-col rounded-lg px-8 py-8 items-center justify-center w-full space-y-4 bg-accent opacity-80",
				{
					"ring-4 ring-ring/20 border border-ring opacity-100":
						selectedValues.includes(value),
				},
			)}
			onClick={() =>
				handleValue((prev) => {
					if (!multi) return [value];
					if (prev.includes(value)) {
						const newArray = [...prev];
						const i = newArray.indexOf(value);
						newArray.splice(i, 1);
						return newArray;
					}
					return [...prev, value];
				})
			}
			{...props}
		/>
	);
};
