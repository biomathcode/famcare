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

import { getMembers } from "~/lib/db/queries";
import { useQuery } from "@tanstack/react-query";



type MemberPickerProps = {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
};



export function MemberPicker({
    value,
    onChange,
    placeholder = "Select member...",
    disabled = false,
}: MemberPickerProps) {
    const [open, setOpen] = useState(false);
    const { data: members = [], isLoading: loading } = useQuery({
        queryKey: ["members"],
        queryFn: getMembers,
    });

    const selectedMember = members.find((m) => m.id === value);

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
                    {selectedMember ? selectedMember.name : placeholder}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0">
                <Command>
                    <CommandInput placeholder="Search members..." className="h-9" />
                    <CommandList>
                        {loading ? (
                            <CommandEmpty>Loading...</CommandEmpty>
                        ) : (
                            <>
                                <CommandEmpty>No member found.</CommandEmpty>
                                <CommandGroup>
                                    {members.map((member) => (
                                        <CommandItem
                                            key={member.id}
                                            value={member.id}
                                            onSelect={(currentValue) => {
                                                onChange?.(
                                                    currentValue === value ? "" : currentValue
                                                );
                                                setOpen(false);
                                            }}
                                        >
                                            {member.name}
                                            <Check
                                                className={cn(
                                                    "ml-auto",
                                                    value === member.id ? "opacity-100" : "opacity-0"
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
