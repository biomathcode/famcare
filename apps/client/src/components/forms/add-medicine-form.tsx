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
import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MemberPicker } from "@/components/member-picker";
import { MedicinePicker } from "~/components/medicine-picker";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { zodResolver } from "@hookform/resolvers/zod";


import { createMedicine, CreateMedicineFormData, createMedicineSchema, } from "~/lib/db/queries";
import authClient from "~/lib/auth/auth-client";

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
                <Button type="submit" disabled={form.formState.isSubmitting} className="w-full flex items-center justify-center">
                    {form.formState.isSubmitting ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                            </svg>
                            <span className="ml-2">Loading...</span>
                        </>
                    ) : (
                        "Add Medicine"
                    )}
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