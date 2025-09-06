"use client";

import * as React from "react";
import { useState, useCallback } from "react";
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

type MedicinePickerProps = {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
};

async function fetchMedicines(query: string) {
    if (!query) return [];
    const res = await fetch(
        `https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?terms=${encodeURIComponent(
            query
        )}&maxList=20`
    );
    const data = await res.json();
    // data[1] = array of names
    return data[1] as string[];
}

export function MedicinePicker({
    value,
    onChange,
    placeholder = "Search medicine...",
    disabled = false,
}: MedicinePickerProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const { data: medicines = [], isLoading } = useQuery({
        queryKey: ["medicines", search],
        queryFn: () => fetchMedicines(search),
        enabled: search.length > 1, // only search when typing 2+ chars
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
                        placeholder="Search medicines..."
                        className="h-9"
                        value={search}
                        onValueChange={setSearch}
                    />
                    <CommandList>
                        {isLoading ? (
                            <CommandEmpty>Loading...</CommandEmpty>
                        ) : medicines.length === 0 ? (
                            <CommandEmpty>No medicine found.</CommandEmpty>
                        ) : (
                            <CommandGroup>
                                {medicines.map((med) => (
                                    <CommandItem
                                        key={med}
                                        value={med}
                                        onSelect={(currentValue) => {
                                            onChange?.(currentValue);
                                            setOpen(false);
                                        }}
                                    >
                                        {med}
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                value === med ? "opacity-100" : "opacity-0"
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
