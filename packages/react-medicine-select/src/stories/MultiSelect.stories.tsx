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

        placeholder: { control: "text" },
    },
} as Meta<typeof MedicineSelect>;

const Template: StoryFn<typeof MedicineSelect> = (args) => (
    <div style={{ width: 400 }}>
        <MedicineSelect
            {...args}
            isMulti
        />
    </div>
);

// Single select (default)
// export const Default = Template.bind({});
// Default.args = {
//     isMulti: false,
//     placeholder: "Search for a medicine...",
// };

// Multi-select story
export const MultiSelect = Template.bind({});
MultiSelect.args = {
    placeholder: "Select multiple medicines...",
};
