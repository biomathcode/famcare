import type { Meta, StoryFn } from "@storybook/react";
import { MedicineSelect } from "..";

export default {
	title: "Medicine/Select",
	component: MedicineSelect,
	argTypes: {
		onChange: { action: "changed" },
		isMulti: {
			control: { type: "boolean" },
			description: "Enable multi-select mode",
		},
	},
} as Meta<typeof MedicineSelect>;

const Template: StoryFn<typeof MedicineSelect> = (args) => (
	<div style={{ width: 400 }}>
		<MedicineSelect {...args}
		/>
	</div>
);

export const Default = Template.bind({});
Default.args = {};
