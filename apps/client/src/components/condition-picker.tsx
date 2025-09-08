"use client";

import * as React from "react";
import { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

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
    value?: string[];
    onChange?: (value: string[]) => void;
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
    return (data[3] || []).map((item: string[]) => item[0]);
}

export function ConditionPicker({
    value = [],
    onChange,
    placeholder = "Search conditions...",
    disabled = false,
}: ConditionPickerProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const { data: conditions = [], isLoading } = useQuery({
        queryKey: ["conditions", search],
        queryFn: () => fetchConditions(search),
        enabled: search.length > 1,
    });

    function toggleCondition(cond: string) {
        if (value.includes(cond)) {
            onChange?.(value.filter((v) => v !== cond));
        } else {
            onChange?.([...value, cond]);
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    disabled={disabled}
                    aria-expanded={open}
                    className="w-[300px] justify-between flex flex-wrap gap-1"
                >
                    {value.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                            {value.map((cond) => (
                                <span
                                    key={cond}
                                    className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full flex items-center"
                                >
                                    {cond}
                                    <X
                                        className="ml-1 cursor-pointer"
                                        size={12}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleCondition(cond);
                                        }}
                                    />
                                </span>
                            ))}
                        </div>
                    ) : (
                        placeholder
                    )}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
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
                                {conditions.map((cond: string) => (
                                    <CommandItem
                                        key={cond}
                                        value={cond}
                                        onSelect={() => toggleCondition(cond)}
                                    >
                                        {cond}
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                value.includes(cond) ? "opacity-100" : "opacity-0"
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
