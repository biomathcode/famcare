"use client";

import * as React from "react";
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { useQuery } from "@tanstack/react-query";

type ConditionPickerProps = {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
};

async function fetchConditions(query: string) {
    if (!query) return [];
    const res = await fetch(
        `https://clinicaltables.nlm.nih.gov/api/conditions/v3/search?terms=${encodeURIComponent(
            query
        )}&maxList=20`
    );
    const data = await res.json();
    // data[1] contains the matched condition names
    return (data[3] || []).map((item: string[]) => item[0]);

}

export function ConditionPicker({
    value,
    onChange,
    placeholder = "Search condition...",
    disabled = false,
}: ConditionPickerProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const { data: conditions = [], isLoading } = useQuery({
        queryKey: ["conditions", search],
        queryFn: () => fetchConditions(search),
        enabled: search.length > 1, // start searching after 2 chars
    });

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    disabled={disabled}
                    aria-expanded={open}
                    className="w-[250px] justify-between"
                >
                    {value || placeholder}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Search conditions..."
                        className="h-9"
                        value={search}
                        onValueChange={setSearch}
                    />
                    <CommandList>
                        {isLoading ? (
                            <CommandEmpty>Loading...</CommandEmpty>
                        ) : conditions.length === 0 ? (
                            <CommandEmpty>No condition found.</CommandEmpty>
                        ) : (
                            <CommandGroup>
                                {conditions.map((cond) => (
                                    <CommandItem
                                        key={cond}
                                        value={cond}
                                        onSelect={(currentValue) => {
                                            onChange?.(currentValue);
                                            setOpen(false);
                                        }}
                                    >
                                        {cond}
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                value === cond ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
