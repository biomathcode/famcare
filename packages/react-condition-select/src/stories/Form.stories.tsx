import type { Meta, StoryFn } from "@storybook/react";
import { useState, FormEvent, useRef } from "react";
import { ConditionSelect } from "..";

export default {
    title: "Condition/Select/FormExample",
    component: ConditionSelect,
} as Meta<typeof ConditionSelect>;

const Template: StoryFn<typeof ConditionSelect> = (args) => {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const value = formData.get("Condition"); // get value by field name

        alert(JSON.stringify(value, null, 2));
    };
    return (
        <form onSubmit={handleSubmit} style={{ width: 400, display: "flex", flexDirection: "column", gap: 16 }}>
            <label style={{ fontWeight: 600 }}>Select Condition</label>
            <ConditionSelect
                {...args}
                name="Condition"

            />
            <button type="submit" style={{ padding: "8px 16px", cursor: "pointer" }}>
                Submit
            </button>
        </form>
    );
};

// Single-select example
export const SingleSelect = Template.bind({});
SingleSelect.args = {
    isMulti: false,
    placeholder: "Search for a Condition...",
};



const MultiTemplate: StoryFn<typeof ConditionSelect> = (args) => {
    const selectRef = useRef<any>(null); // ref to AsyncSelect

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const value = selectRef.current?.getValue(); // get selected value(s) directly
        console.log('input', value)
        alert(JSON.stringify(value, null, 2));
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{ width: 400, display: "flex", flexDirection: "column", gap: 16 }}
        >
            <label style={{ fontWeight: 600 }}>Select Condition</label>
            <ConditionSelect
                {...args}
                ref={selectRef} // attach ref
            />
            <button type="submit" style={{ padding: "8px 16px", cursor: "pointer" }}>
                Submit
            </button>
        </form>
    );
};

// Multi-select example
export const MultiSelect = MultiTemplate.bind({});
MultiSelect.args = {
    isMulti: true,
    placeholder: "Select multiple Conditions...",
};
