/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
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
import { toast } from "sonner";
import { medicine, medicineSchedule } from "~/lib/db/schema";
import { api } from "~/lib/api";
import { MemberPicker } from "@/components/member-picker";
import { MedicinePicker } from "~/components/medicine-picker";
import { LoadingScreen } from "~/components/loading-screen";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { createInsertSchema } from "drizzle-zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { MemberMedicinePicker } from "~/components/member-medicine-picker";

import { Calendar } from "~/components/ui/calendar";
import { useState } from "react";

//TODO: Add Options for scheduling like daily, weekly, monthly
//TODO: Add Dosage options like daily 2times, weekly -> set day of the week, Monthly -> Select Dates
//TODO: 

const createMedicineSchema = createInsertSchema(medicine)

const createMedicineScheduleSchema = createInsertSchema(medicineSchedule, {
    startDate: z.string(),
    endDate: z.string(),
})

type createMedicineScheduleFormData = z.infer<typeof createMedicineScheduleSchema>;

type CreateMedicineFormData = z.infer<typeof createMedicineSchema>;




export const createMedicine = createServerFn({
    method: "POST",
    response: "raw",
})
    .validator(createMedicineSchema)
    .handler(async ({ data }) => {
        if (!data.userId) throw new Error("userId is required");
        console.log('post data', data)
        return await api.medicines.create(data);
    });


export const createMedicineSchedule = createServerFn({
    method: "POST",
    response: 'raw',
})
    .validator(createMedicineScheduleSchema)
    .handler(async ({ data }) => {
        if (!data.userId) throw new Error("userId is required");


        console.log('post data', data)

        const payload = {
            ...data,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),

        }
        return await api.medicineSchedules.create(payload);
    })

export const getMedicines = createServerFn({ method: "GET" }).handler(
    async () => {
        const medicines = await api.medicines.findAll();
        return medicines;
    }
);


export const Route = createFileRoute("/app/_app/medicines")({
    component: RouteComponent,
    loader: async () => {
        const medicines = await getMedicines();
        return { medicines };
    },
    pendingComponent: LoadingScreen,
});



function MedicineSchedule() {


    const context = Route.useRouteContext();
    const user = context.user;

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
            userId: user?.id || ""
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


    return (

        <Card className="w-full max-w-sm gap-0">
            <CardHeader className="m-0">
                <CardTitle>Add Medicine Schedule</CardTitle>

            </CardHeader>
            <CardContent>
                <Form {...form}>
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


            </CardContent>

        </Card>
    )
}



function MedicineForm() {

    const context = Route.useRouteContext();
    const user = context.user;

    const router = useRouter();


    const form = useForm<CreateMedicineFormData>({
        defaultValues: {
            name: "",
            description: "",
            userId: user?.id,
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

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Add Medicine</CardTitle>
                <CardDescription>
                    Add your Medicine
                </CardDescription>

            </CardHeader>
            <CardContent>
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
            </CardContent>
        </Card>
    )
}




function RouteComponent() {
    const { medicines } = Route.useLoaderData();
    return (
        <div className=" p-6">

            <div className="flex gap-4">
                <MedicineForm />

                <MedicineSchedule />
                <div>
                    <h2 className="text-xl font-semibold mb-4">Add Medicine</h2>


                    <ul className="space-y-2">
                        {medicines.map((m) => (
                            <li key={m.id} className="p-2 border rounded">
                                <p className="font-medium">{m.name}</p>
                                {m.description && <p className="text-sm">{m.description}</p>}
                                {m.dosage && (
                                    <p className="text-sm text-muted-foreground">Dosage: {m.dosage}</p>
                                )}
                            </li>
                        ))}
                    </ul>

                </div>

            </div>



        </div>
    );
}
