import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn, useServerFn } from '@tanstack/react-start'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { member } from "~/lib/db/schema";
import { api } from "~/lib/api";

export const createMembers = createServerFn({ method: 'POST', response: "raw", })
    .handler(async ({ data }) => {

        if (!data.userId) throw new Error("userId is required");
        await api.members.create(
            data
        )
    });

export const getMembers = createServerFn({ method: "GET" })
    .handler(async () => {
        const members = await api.members.findAll();
        return members
    })


type MemberInput = z.infer<typeof member>;

export const Route = createFileRoute("/app/_app/members")({
    component: RouteComponent,
    loader: async () => {
        // 👇 loader ke andar serverFn call karna
        const members = await getMembers();
        return { members };
    },
});

function RouteComponent() {

    const context = Route.useRouteContext();

    const { members } = Route.useLoaderData();


    const user = context.user;

    const createMemberMutation = useServerFn(createMembers);




    const form = useForm<MemberInput>({

        defaultValues: {
            name: "",
            relation: "",
            dob: "",
            gender: "",
            userId: user?.id,
        },
    });


    const router = useRouter();



    async function onSubmit(values: MemberInput) {
        console.log('submitted', values);
        try {
            await createMembers({ data: values }).then(() => {
                router.invalidate()
            })
            toast.success("Member added successfully");
            form.reset();

        } catch (err) {
            toast.error("Failed to add member");
            console.error(err);
        }
    }

    return (
        <div className="max-w-md mx-auto p-6">
            <h2 className="text-xl font-semibold mb-4">Add Member</h2>
            <ul className="space-y-2">
                {members.map((member) => (
                    <li key={member.id} className="p-2 border rounded">
                        {member.name + "--- " + member.relation + `     ${(new Date(member.dob).toDateString())}` + member.gender}
                    </li>
                ))}
            </ul>
            <Form {...form}>
                <form
                    action={createMembers.url}
                    onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                <Select onValueChange={field.onChange} value={field.value}>
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

                    <Button type="submit" className="w-full">
                        Add Member
                    </Button>
                </form>
            </Form>
        </div>
    );
}
