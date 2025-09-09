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

import { getMedicineByMemberId } from "~/lib/db/queries";
import { useQuery } from "@tanstack/react-query";


type Medicine = {
    id: string;
    name: string;
};

type MemberMedicinePickerProps = {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    memberId?: string;
};

export function MemberMedicinePicker({
    value,
    onChange,
    placeholder = "Select medicine...",
    disabled = false,
    memberId,
}: MemberMedicinePickerProps) {
    const [open, setOpen] = useState(false);

    const { data: medicines = [], isLoading: loading } = useQuery({
        queryKey: ["medicines", memberId],
        queryFn: () => getMedicineByMemberId({ data: { memberId: memberId || ' ' } }),
        enabled: !!memberId, // Only run query if memberId is present
    });

    console.log("medicines By memberId", medicines, memberId)

    const selectedMedicine = medicines.find((m: Medicine) => m.id === value);

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
                    {selectedMedicine ? selectedMedicine.name : placeholder}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[250px] p-0">
                <Command>
                    <CommandInput placeholder="Search medicines..." className="h-9" />
                    <CommandList>
                        {loading ? (
                            <CommandEmpty>Loading...</CommandEmpty>
                        ) : (
                            <>
                                <CommandEmpty>No medicine found.
                                    {memberId}

                                </CommandEmpty>
                                <CommandGroup>
                                    {medicines.map((medicine: Medicine) => (
                                        <CommandItem
                                            key={medicine.id}
                                            value={medicine.id}
                                            onSelect={(currentValue) => {
                                                onChange?.(
                                                    currentValue === value ? "" : currentValue
                                                );
                                                setOpen(false);
                                            }}
                                        >
                                            {medicine.name}
                                            <Check
                                                className={cn(
                                                    "ml-auto",
                                                    value === medicine.id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}