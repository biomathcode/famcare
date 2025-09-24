

# `react-condition-select`

[![npm version](https://img.shields.io/npm/v/@biomathcode/react-condition-select?color=blue&label=npm)](https://www.npmjs.com/package/@biomathcode/react-condition-select)
[![npm downloads](https://img.shields.io/npm/dm/@biomathcode/react-condition-select?color=green&label=downloads)](https://www.npmjs.com/package/@biomathcode/react-condition-select)
[![Storybook](https://img.shields.io/badge/Storybook-Demo-orange)](https://biomathcode.github.io/famcare/)

A simple React component library for **searching and selecting medical conditions** using [`react-select/async`](https://react-select.com/async). Supports **single and multi-select** modes.

---
## Demo

Check out the live Storybook demo:  
[https://biomathcode.github.io/famcare/](https://biomathcode.github.io/famcare/)

---

## Features

* Async condition search via NLM RxTerms API
* Single and multi-select support
* Fully typed with TypeScript
* Uncontrolled and form-friendly
* Lightweight and ready to use in your React projects

---

## Installation

```bash
# Using npm
npm install react-condition-select react-select

# Using pnpm
pnpm add react-condition-select react-select

# Using yarn
yarn add react-condition-select react-select
```

> Make sure you have `react` and `react-dom` installed as peer dependencies.

---

## Usage

### Single Select

```tsx
import React from "react";
import { ConditionSelect } from "react-condition-select";

export function App() {
  const handleChange = (option: any) => {
    console.log(option);
  };

  return (
    <ConditionSelect
      placeholder="Search for a condition..."
      onChange={handleChange}
      isMulti={false}
    />
  );
}
```

### Multi Select

```tsx
import React from "react";
import { ConditionSelect } from "react-condition-select";

export function App() {
  const handleChange = (options: any[]) => {
    console.log(options);
  };

  return (
    <ConditionSelect
      placeholder="Select multiple conditions..."
      onChange={handleChange}
      isMulti
    />
  );
}
```

### Using Inside a Form

```tsx
import React, { FormEvent, useRef } from "react";
import { ConditionSelect } from "react-condition-select";

export function FormExample() {
  const selectRef = useRef<any>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const value = selectRef.current?.getValue();
    alert(JSON.stringify(value, null, 2));
  };

  return (
    <form onSubmit={handleSubmit}>
      <ConditionSelect placeholder="Select condition..." ref={selectRef} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## Props

| Prop           | Type                                   | Description                          |
| -------------- | -------------------------------------- | ------------------------------------ |
| `isMulti`      | `boolean`                              | Enable multi-select mode             |
| `placeholder`  | `string`                               | Placeholder text                     |
| `onChange`     | `(option) => void`                     | Callback when selection changes      |
| `defaultValue` | `ConditionOption \| ConditionOption[]` | Initial selected value(s)            |
| ...            | any                                    | Any other `react-select/async` props |

---

## ConditionOption Type

```ts
export type ConditionOption = {
  label: string;
  value: string;
};
```




