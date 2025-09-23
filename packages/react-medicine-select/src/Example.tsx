import AsyncSelect from "react-select/async";
import { forwardRef } from "react";
import { fetchMedicines } from "./api";

export type MedicineOption = { label: string; value: string };

// Props: allow all AsyncSelect props
export type MedicineSelectProps = {
	onChange?: (value: any) => void;
	defaultValue?: MedicineOption | MedicineOption[];
	isMulti?: boolean;
	placeholder?: string;
	[key: string]: any;
};

// Hack: cast AsyncSelect to any to satisfy TS, but still type props
const AsyncSelectAny = AsyncSelect as any;

export const MedicineSelect = forwardRef<any, MedicineSelectProps>(
	({ ...props }, ref) => {
		const loadOptions = async (inputValue: string) => {
			const medicines = await fetchMedicines(inputValue);
			return medicines.map((m) => ({ label: m, value: m }));
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

MedicineSelect.displayName = "MedicineSelect";
