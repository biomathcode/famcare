import renderer from "react-test-renderer";
import { describe, it, expect } from "vitest";
import { ConditionSelect } from "../src";

describe("MedicineSelect", () => {
	it("renders single-select correctly", () => {
		const tree = renderer
			.create(<ConditionSelect isMulti={false} placeholder="Search condition" />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});

	it("renders multi-select correctly", () => {
		const tree = renderer
			.create(<ConditionSelect isMulti placeholder="Select conditions" />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});

	it("renders with default value correctly", () => {
		const tree = renderer
			.create(
				<ConditionSelect
					isMulti={false}
					defaultValue={{ label: "Back Pain", value: "Back Pain" }}
				/>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
