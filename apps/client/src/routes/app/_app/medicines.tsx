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

function LoadingScreen() {
    return <div>Loading...</div>;
}

function RouteComponent() {
    const context = Route.useRouteContext();
    const { medicines } = Route.useLoaderData();
    const user = context.user;

    const form = useForm<MedicineInput>({
        defaultValues: {
            name: "",
            description: "",
            dosage: "",
            userId: user?.id,
        },
    });

    const router = useRouter();

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
        <div className="max-w-md mx-auto p-6">
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
                                <FormLabel>Select Member</FormLabel>
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


                    {/* <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter medicine name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

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

                    <FormField
                        control={form.control}
                        name="dosage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Dosage</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. 1 pill, 5ml" {...field} />
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
        </div>
    );
}
