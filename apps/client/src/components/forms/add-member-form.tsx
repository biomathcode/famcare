
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button";


import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConditionPicker } from "~/components/condition-picker";
import { createMembers, memberFormData, memberSchema } from "~/lib/db/queries";
import authClient from "~/lib/auth/auth-client";
import ProfileUpload from "~/components/profile-upload";

import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";


export function AddMemberForm() {

    const { data: session } = authClient.useSession();

    const form = useForm<memberFormData>({
        defaultValues: {
            name: "",
            relation: "",
            dob: '',
            gender: "",
            userId: session?.user?.id || '',
            imageUrl: "",
            conditions: "[]",
        },
        resolver: zodResolver(memberSchema),

    });

    const router = useRouter();

    const handleSubmit: SubmitHandler<memberFormData> = async (values) => {
        console.log('submitted', values);
        try {
            await createMembers({
                data: { ...values, userId: session?.user?.id || ' ' },
            });

            toast.success("Member added successfully");
            form.reset();
            router.invalidate();

        } catch (err) {
            toast.error("Failed to add member");
            console.error(err);
        }
    }

    return (
        <Card className="p-6  w-full sm:w-1/3    ">
            <h2 className="text-xl font-semibold mb-4">Add Member</h2>



            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Profile Image</FormLabel>
                                <FormControl>
                                    <ProfileUpload value={field.value} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name="conditions"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select Condition</FormLabel>
                                <FormControl>
                                    <ConditionPicker
                                        value={JSON.parse(field.value || '[]')}
                                        onChange={(values) => field.onChange(JSON.stringify(values))}
                                        placeholder="Choose a condition..."
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
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="relation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Relation</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Father, Mother, Son" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="dob"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date of Birth</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <Select onValueChange={field.onChange} value={field?.value ?? " "}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
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
                            "Add Member"
                        )}
                    </Button>
                </form>
            </Form>
        </Card>

    )
}