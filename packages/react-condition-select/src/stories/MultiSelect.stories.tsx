import type { Meta, StoryFn } from "@storybook/react";
import { ConditionSelect } from "..";

export default {
    title: "Condition/Select",
    component: ConditionSelect,
    argTypes: {
        onChange: { action: "changed" },
        isMulti: {
            control: { type: "boolean" },
            description: "Enable multi-select mode",
        },

        placeholder: { control: "text" },
    },
} as Meta<typeof ConditionSelect>;

const Template: StoryFn<typeof ConditionSelect> = (args) => (
    <div style={{ width: 400 }}>
        <ConditionSelect
            {...args}
            isMulti
        />
    </div>
);

// Single select (default)
// export const Default = Template.bind({});
// Default.args = {
//     isMulti: false,
//     placeholder: "Search for a Condition...",
// };

// Multi-select story
export const MultiSelect = Template.bind({});
MultiSelect.args = {
    placeholder: "Select multiple Conditions...",
};
