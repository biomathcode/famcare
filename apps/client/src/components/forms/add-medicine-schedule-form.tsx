import { useRouter } from "@tanstack/react-router";

import { useForm } from "react-hook-form";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MemberPicker } from "@/components/member-picker";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { MemberMedicinePicker } from "~/components/member-medicine-picker";

import { Calendar } from "~/components/ui/calendar";
import { useState } from "react";
import authClient from "~/lib/auth/auth-client";
import { createMedicineSchedule } from "~/lib/db/queries";


export function MedicineScheduleForm({ mode }: { mode: "card" | "dialog" }) {


    const { data: session } = authClient.useSession();


    const router = useRouter();

    const form = useForm({
        defaultValues: {
            medicineId: "",
            memberId: "",
            frequency: "daily",
            timesPerDay: 1,
            recurrenceRule: {},
            customDates: [],
            daysOfWeek: [],
            dosage: 1,
            unit: "pill",
            startDate: "",
            endDate: "",
            userId: session?.user?.id || ""
        },

    });
    async function onSubmit(values: any) {
        console.log("submitted", values);
        try {
            let recurrenceRule = {};
            if (frequency === "daily") {
                recurrenceRule = {};
            } else if (frequency === "weekly") {
                recurrenceRule = { daysOfWeek: values.daysOfWeek || [] };
            } else if (frequency === "monthly") {
                recurrenceRule = { customDates: values.customDates || [] };
            }

            const payload = {
                ...values,
                dosage: Number(values.dosage),
                timesPerDay: Number(values.timesPerDay),
                recurrenceRule,
            };

            console.log(values)
            await createMedicineSchedule({ data: payload }).then(() => {
                router.invalidate();
            });
            toast.success("Medicine schedule added successfully");
            // form.reset();
        } catch (err) {
            toast.error("Failed to add medicine schedule");
            console.error(err);
        }

    }




    const [memberId, setMemberId] = useState<string | null>(null)



    const [frequency, setFrequency] = useState("daily");


    const FormComponent = (<Form {...form}>
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-6"
        >
            <FormField
                control={form.control}
                name="memberId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Select Member</FormLabel>
                        <FormControl>
                            <MemberPicker
                                value={field.value}
                                onChange={(value) => {
                                    field.onChange(value);
                                    setMemberId(value); // Keep local state in sync
                                }}
                                placeholder="Choose a member..."
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            {
                memberId && <FormField
                    control={form.control}
                    name="medicineId"
                    render={({ field }) => {

                        return (<FormItem>
                            <FormLabel>Select Medicine</FormLabel>
                            <FormControl>
                                <MemberMedicinePicker
                                    memberId={memberId}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Choose a medicine..."
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>)
                    }}
                />
            }


            <FormField
                control={form.control}
                name="timesPerDay"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Times Per Day</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} min={1}
                                value={field?.value || 1}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="flex justify-between">
                <FormField
                    control={form.control}
                    name="dosage"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Dosage</FormLabel>
                            <FormControl>
                                <Input

                                    type="number" {...field} min={1}
                                    value={field?.value ?? 1}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value ?? ""}
                                    onValueChange={field.onChange}

                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pill">Pill</SelectItem>
                                        <SelectItem value="ml">ml</SelectItem>
                                        <SelectItem value="drop">drops</SelectItem>

                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                            <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>End Date (Optional)</FormLabel>
                        <FormControl>
                            <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Frequency</FormLabel>
                        <FormControl>
                            <Select
                                value={field.value}
                                onValueChange={(value) => {
                                    setFrequency(value);
                                    field.onChange(value);
                                    form.setValue("daysOfWeek", []);
                                    form.setValue("customDates", []);
                                }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {
                frequency === 'daily' ?
                    <FormItem>
                        <FormLabel>Daily Recurrence</FormLabel>
                        <FormControl>
                            <div className="text-gray-500">No additional input needed.</div>
                        </FormControl>
                    </FormItem> :
                    frequency === 'weekly' ?
                        <FormField
                            control={form.control}
                            name="daysOfWeek"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Select Days of the Week</FormLabel>
                                    <FormControl>
                                        <div className="flex flex-wrap gap-2">
                                            {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                                                <Button
                                                    key={day}
                                                    variant={Array.isArray(field.value) && field.value.includes(day) ? "default" : "outline"}
                                                    onClick={() => {
                                                        let updatedDays: string[] = Array.isArray(field.value) ? field.value : [];

                                                        if (updatedDays.includes(day)) {
                                                            updatedDays = updatedDays.filter((d) => d !== day);
                                                        } else {
                                                            updatedDays.push(day);
                                                        }

                                                        field.onChange(updatedDays);
                                                    }}
                                                    type="button"
                                                >
                                                    {day.charAt(0).toUpperCase() + day.slice(1)}
                                                </Button>
                                            ))}
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        :
                        frequency === 'monthly' ? <FormField
                            control={form.control}
                            name="customDates"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Select Custom Dates</FormLabel>
                                    <FormControl>
                                        <Calendar
                                            mode="multiple"
                                            selected={
                                                field.value
                                            }
                                            onSelect={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        /> : null
            }

            <Button type="submit" disabled={form.formState.isSubmitting} className="w-full flex items-center justify-center">
                {form.formState.isSubmitting ? (
                    <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <span className="ml-2">Loading...</span>
                    </>
                ) : (
                    "Add Medicine Schedule"
                )}
            </Button>

        </form>
    </Form>


    )

    if (mode === "card") {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Add Medicine Schedule</CardTitle>
                    <CardDescription>
                        Add A Schedule to your Medicines
                    </CardDescription>

                </CardHeader>
                <CardContent>
                    {FormComponent}
                </CardContent>
            </Card>
        )
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Add Medicine Schedule</Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Medicine Schedule</DialogTitle>
                    <DialogDescription>
                        Add A Schedule to your Medicines
                    </DialogDescription>
                </DialogHeader>


                {FormComponent}

            </DialogContent>
        </Dialog>
    )
}

