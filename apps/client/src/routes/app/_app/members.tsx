import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from '@tanstack/react-start'

import { z } from "zod";
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
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns"
import { api } from "~/lib/api";
import ProfileUpload from "~/components/profile-upload";
import { Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { member } from "~/lib/db/schema";
import { ConditionPicker } from "~/components/condition-picker";
import { LoadingScreen } from "~/components/loading-screen";
import { createInsertSchema } from "drizzle-zod";

//TODO: Add diseases field in the form 

const memberSchema = createInsertSchema(member, {
    dob: z.string(),
    conditions: z.string().optional(), // Expect stringified JSON

})


export type memberFormData = z.infer<typeof memberSchema>;


export const createMembers = createServerFn({ method: 'POST' })
    .validator(memberSchema)
    .handler(async ({ data }) => {
        console.log("data", data)
        if (!data.userId) throw new Error("userId is required");
        const payload = {
            ...data,
            dob: data.dob ? new Date(data.dob) : null,
            conditions: JSON.parse(data.conditions || ' '), // Store as JSON type
        };
        return await api.members.create(payload);
    });

export const getMembers = createServerFn({ method: "GET" })
    .handler(async () => {
        const members = await api.members.findAll();
        return members
    })


export const deleteMember = createServerFn({ method: "POST" })
    .handler(async ({ data }) => {
        if (!data || !data.id) {
            throw new Error("Member id is required for deletion");
        }
        const id = await api.members.remove(data.id)
        return id
    })




export const Route = createFileRoute("/app/_app/members")({
    component: RouteComponent,
    loader: async () => {
        const members = await getMembers();
        return { members };
    },
    pendingComponent: LoadingScreen,
});



function RouteComponent() {
    const context = Route.useRouteContext();
    const { members } = Route.useLoaderData();
    const user = context.user;

    const form = useForm<memberFormData>({

        defaultValues: {
            name: "",
            relation: "",
            dob: '',
            gender: "",
            userId: user?.id,
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
                data: { ...values, userId: user?.id },
            });

            toast.success("Member added successfully");
            form.reset();
            router.invalidate();

        } catch (err) {
            toast.error("Failed to add member");
            console.error(err);
        }
    }

    async function handleDelete(id: string) {
        try {
            await deleteMember({ data: { id } }).then(() => {
                router.invalidate(); // refresh members list
            });
            toast.success("Member deleted successfully");
        } catch (err) {
            toast.error("Failed to delete member");
            console.error(err);
        }
    }

    return (
        <div className=" p-6 w-full flex md:flex-row justify-around gap-2 flex-col">
            <MembersCards
                members={members}
                handleDelete={handleDelete}

            />


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
                                            value={JSON.parse(field.value || ' ')}
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



                        <Button type="submit"
                            disabled={form.formState.isSubmitting}
                            className="w-full">
                            Add Member
                        </Button>
                    </form>
                </Form>
            </Card>


        </div>
    );
}










export function MembersCards({ members, handleDelete }: { members: MemberInput[], handleDelete: (id: string) => void }) {

    return (
        <div className="flex flex-col gap-2 p-2 flex-wrap w-2/3">
            <div className="flex flex-col mb-2">
                <h1 className="text-2xl font-semibold ">Members </h1>
                <div>
                    {members.length + " total"}
                </div>
            </div>
            <div className="flex flex-wrap gap-2  ">
                {members.map((member) => (
                    <Card key={member.id} className="shadow-md max-h-fit max-w-md w-3xs py-4  ">
                        <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={member.imageUrl || "/placeholder.svg"} alt={`Avatar of ${member.name}`} />
                                <AvatarFallback>{member.name
                                    .split(" ")
                                    .map((p) => p[0])
                                    .slice(0, 2)
                                    .join("")
                                    .toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-medium leading-none">{member.name}</div>
                                <div className="text-xs text-muted-foreground">{member.relation}</div>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-1 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">DOB</span>
                                <span>{format(new Date(member.dob), "PP")}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Gender</span>
                                <span className="capitalize">{member.gender}</span>
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-end">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(member.id)}
                            >
                                <Trash2 className="w-4 h-4 mr-1" /> Delete
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>

    )
}


