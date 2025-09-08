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
import { medicine } from "~/lib/db/schema";
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

//TODO: Add Options for scheduling like daily, weekly, monthly
//TODO: Add Dosage options like daily 2times, weekly -> set day of the week, Monthly -> Select Dates
//TODO: 

export const createMedicine = createServerFn({
    method: "POST",
    response: "raw",
}).handler(async ({ data }) => {
    if (!data.userId) throw new Error("userId is required");
    console.log('post data', data)
    await api.medicines.create(data);
});


export const createMedicineSchedule = createServerFn({
    method: "POST",
    response: 'raw',
}).handler(async ({ data }) => {
    if (!data.userId) throw new Error("userId is required");


    console.log('post data', data)
    await api.medicineSchedules.create(data);
})

export const getMedicines = createServerFn({ method: "GET" }).handler(
    async () => {
        const medicines = await api.medicines.findAll();
        return medicines;
    }
);

type MedicineInput = z.infer<typeof medicine>;

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
    const form = useForm<{
        medicineId: string;
        memberId: string;
        frequency: string;
        timesPerDay: number;
        recurrenceRule: { interval?: number; daysOfWeek?: string[]; daysOfMonth?: number[]; customDates?: string[] };
        dosage: number;
        unit: string;
        startDate: string;
        endDate?: string;
    }>({
        defaultValues: {
            medicineId: "",
            memberId: "",
            frequency: "daily",
            timesPerDay: 1,
            recurrenceRule: {},
            dosage: 1,
            unit: "pill",
            startDate: "",
            endDate: "",
        },
    });
    async function onSubmit(values: typeof form["defaultValues"]) {
        console.log("submitted", values);
        try {
            const payload = {
                ...values,
                startDate: parseDateTimeLocal(values.startDate),
                endDate: values.endDate ? parseDateTimeLocal(values.endDate) : null,
            };
            await createMedicineSchedule({ data: payload }).then(() => {
                router.invalidate();
            });
            toast.success("Medicine schedule added successfully");
            form.reset();
        } catch (err) {
            toast.error("Failed to add medicine schedule");
            console.error(err);
        }
    }
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
                            name="medicineId"
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
                            name="frequency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Frequency</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="daily, weekly, monthly" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="timesPerDay"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Times Per Day</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} min={1} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="recurrenceRule"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Recurrence Rule (JSON)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder={`{ "daysOfWeek": ["monday", "tuesday"], "customDates": ["2025-09-06"] }`}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="dosage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dosage</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} min={1} />
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
                                        <Input {...field} placeholder="pill, ml, etc." />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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

                        <Button type="submit" className="w-full">
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


    const form = useForm<MedicineInput>({
        defaultValues: {
            name: "",
            description: "",
            dosage: "",
            userId: user?.id,
        },
    });

    async function onSubmit(values: MedicineInput) {
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
