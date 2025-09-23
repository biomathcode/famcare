import renderer from "react-test-renderer";
import { describe, it, expect } from "vitest";
import { MedicineSelect } from "../src";

describe("MedicineSelect", () => {
	it("renders single-select correctly", () => {
		const tree = renderer
			.create(<MedicineSelect isMulti={false} placeholder="Search medicine" />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});

	it("renders multi-select correctly", () => {
		const tree = renderer
			.create(<MedicineSelect isMulti placeholder="Select medicines" />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});

	it("renders with default value correctly", () => {
		const tree = renderer
			.create(
				<MedicineSelect
					isMulti={false}
					defaultValue={{ label: "Paracetamol", value: "Paracetamol" }}
				/>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
