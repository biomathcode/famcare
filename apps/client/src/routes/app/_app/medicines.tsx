/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useRouter } from "@tanstack/react-router";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from '@/components/ui/badge';
import { toast } from "sonner";
import { MemberPicker } from "@/components/member-picker";
import { MedicinePicker } from "~/components/medicine-picker";
import { LoadingScreen } from "~/components/loading-screen";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { MemberMedicinePicker } from "~/components/member-medicine-picker";

import { Calendar } from "~/components/ui/calendar";
import { useState } from "react";
import { createMedicine, CreateMedicineFormData, createMedicineSchedule, createMedicineSchema, deleteMedicine, getMedicines } from "~/lib/db/queries";
import { format } from "date-fns";
import authClient from "~/lib/auth/auth-client";




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

            <Button type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full">
                Add Medicine Schedule
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



export function MedicineForm({ mode }: { mode: "card" | "dialog" }) {
    const { data: session } = authClient.useSession();


    const router = useRouter();


    const form = useForm<CreateMedicineFormData>({
        defaultValues: {
            name: "",
            description: "",
            userId: session?.user?.id,
        },
        resolver: zodResolver(createMedicineSchema)
    });

    async function onSubmit(values: CreateMedicineFormData) {
        console.log("submitted", values);
        try {
            await createMedicine({ data: values }).then(() => {
                router.invalidate();
            });
            toast.success("Medicine added successfully");
            form.reset();
        } catch (err) {
            toast.error("Failed to add medicine");
            console.error(err);
        }
    }


    const FormComponent = (
        <Form {...form}>
            <form
                action={createMedicine.url}
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
                                    onChange={field.onChange}
                                    placeholder="Choose a member..."
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Select Medicine</FormLabel>
                            <FormControl>
                                <MedicinePicker
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Choose a medicine..."
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />




                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Optional description..."
                                    {...field}
                                    value={field?.value ?? ""}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">
                    Add Medicine
                </Button>
            </form>
        </Form>

    )


    if (mode === "card") {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Add Medicine</CardTitle>
                    <CardDescription>
                        Add your Medicine
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
                <Button>Add Medicine</Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Medicine</DialogTitle>
                    <DialogDescription>
                        Add your Medicine
                    </DialogDescription>
                </DialogHeader>
                {FormComponent}
            </DialogContent>
        </Dialog>
    )
}



export const Route = createFileRoute("/app/_app/medicines")({
    component: RouteComponent,
    loader: async () => {
        const medicines = await getMedicines();
        return { medicines };
    },
    pendingComponent: LoadingScreen,
});




function RouteComponent() {
    const { medicines } = Route.useLoaderData();
    console.log(medicines)
    return (
        <div className=" p-6 w-full">
            <MemberMedicinesGrid data={medicines} />
        </div>
    );
}



const groupByMember = (data: any) => {
    const map = new Map();
    data.forEach((item) => {
        const memberId = item.member.id;
        if (!map.has(memberId)) {
            map.set(memberId, { member: item.member, medicines: [] });
        }
        map.get(memberId).medicines.push({
            medicine: item.medicine,
            schedule: item.medicineSchedule,
        });
    });
    return Array.from(map.values());
};




export function MemberMedicinesGrid({ data }: any) {
    const grouped = groupByMember(data);

    const router = useRouter()

    return (
        <div className="flex flex-col  gap-4 w-full">
            <div className="flex justify-between w-full px-4">
                <div className="flex flex-col ">
                    <div className="text-2xl font-bold">
                        Medicines
                    </div>
                    <div>
                        Add Medicines and its Schedule
                    </div>
                </div>
                <div className="flex gap-4 items-center">
                    <MedicineForm mode="dialog" />
                    <MedicineScheduleForm mode="dialog" />

                </div>
            </div>
            {grouped.map(({ member, medicines }) => (
                <Card key={member.id}>
                    <CardHeader className="flex w-full justify-between">
                        <div className="flex items-center gap-3">
                            <img
                                src={member?.imageUrl}
                                alt={member?.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <CardTitle>{member?.name}</CardTitle>
                        </div>
                        <CardAction className="flex gap-2">
                            <MedicineForm />
                            <MedicineScheduleForm />

                        </CardAction>
                    </CardHeader>
                    <CardContent className="w-full">
                        <div className="space-y-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {medicines?.map(({ medicine, schedule }) => (
                                <div
                                    key={medicine.id}
                                    className="p-2 border rounded-md bg-muted flex flex-col gap-1 relative"
                                >
                                    <Button
                                        onClick={async () => {
                                            await deleteMedicine({ data: { id: medicine.id } })
                                            router.invalidate()
                                        }}
                                        className="absolute right-2 top-2" variant="destructive">
                                        Delete
                                    </Button>
                                    <div className="font-semibold">{medicine.name || "No Name"}</div>
                                    {medicine?.description && <div className="text-sm">{medicine?.description}</div>}

                                    {schedule ? (
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            <Badge variant="secondary">
                                                {schedule?.frequency} ({schedule?.timesPerDay}x/day)
                                            </Badge>
                                            {schedule.recurrenceRule.daysOfWeek && (
                                                <Badge variant="outline">
                                                    Days: {schedule.recurrenceRule.daysOfWeek.join(", ")}
                                                </Badge>
                                            )}
                                            {schedule.recurrenceRule.customDates && (
                                                <Badge variant="outline">
                                                    Dates:{" "}
                                                    {schedule.recurrenceRule.customDates
                                                        .map((d: string) => format(new Date(d), "dd MMM"))
                                                        .join(", ")}
                                                </Badge>
                                            )}
                                            <Badge variant="outline">
                                                Dosage: {schedule.dosage} {schedule.unit}
                                            </Badge>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-muted-foreground mt-1">No schedule</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}