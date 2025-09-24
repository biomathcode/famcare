import AsyncSelect from "react-select/async";
import { forwardRef } from "react";
import { fetchConditions } from "./api";

export type ConditionOption = { label: string; value: string };

// Props: allow all AsyncSelect props
export type ConditionSelectProps = {
	onChange?: (value: any) => void;
	defaultValue?: ConditionOption | ConditionOption[];
	isMulti?: boolean;
	placeholder?: string;
	[key: string]: any;
};

// Hack: cast AsyncSelect to any to satisfy TS, but still type props
const AsyncSelectAny = AsyncSelect as any;

export const ConditionSelect = forwardRef<any, ConditionSelectProps>(
	({ ...props }, ref) => {
		const loadOptions = async (inputValue: string) => {
			const Conditions = await fetchConditions(inputValue);
			return Conditions.map((m: any) => ({ label: m, value: m }));
		};

		return (
			<AsyncSelectAny
				cacheOptions
				defaultOptions
				loadOptions={loadOptions}
				ref={ref}
				{...props}
			/>
		);
	}
);

ConditionSelect.displayName = "ConditionSelect";
