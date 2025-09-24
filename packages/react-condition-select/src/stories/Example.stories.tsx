import type { Meta, StoryFn } from "@storybook/react";
import { ConditionSelect } from "..";

export default {
	title: "Medicine/Select",
	component: ConditionSelect,
	argTypes: {
		onChange: { action: "changed" },
		isMulti: {
			control: { type: "boolean" },
			description: "Enable multi-select mode",
		},
	},
} as Meta<typeof ConditionSelect>;

const Template: StoryFn<typeof ConditionSelect> = (args) => (
	<div style={{ width: 400 }}>
		<ConditionSelect {...args}
		/>
	</div>
);

export const Default = Template.bind({});
Default.args = {};
