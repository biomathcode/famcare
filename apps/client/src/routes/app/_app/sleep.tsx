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
import { toast } from "sonner";
import { sleepGoal } from "~/lib/db/schema";
import { api } from "~/lib/api";

import { MemberPicker } from "@/components/member-picker";
import { getSleepGoals } from "~/lib/db/queries";


export const createSleepGoal = createServerFn({
    method: "POST",
    response: "raw",
}).handler(async ({ data }) => {
    if (!data.userId) throw new Error("userId is required");
    await api.sleepGoals.create(data);
});



//TODO: Add Woke up and Slept one Time, date and member and display to show the sleep cycle of each of the members
//

type SleepGoalInput = z.infer<typeof sleepGoal>;

export const Route = createFileRoute("/app/_app/sleep")({
    component: RouteComponent,
    loader: async () => {
        const goals = await getSleepGoals();
        return { goals };
    },
    pendingComponent: LoadingScreen,
});

function LoadingScreen() {
    return <div>Loading...</div>;
}

function RouteComponent() {
    const context = Route.useRouteContext();
    const { goals } = Route.useLoaderData();
    const user = context.user;

    const form = useForm<SleepGoalInput>({
        defaultValues: {
            targetHours: 0,
            userId: user?.id,
        },
    });

    const router = useRouter();

    async function onSubmit(values: SleepGoalInput) {
        console.log("submitted", values);
        try {
            await createSleepGoal({ data: values }).then(() => {
                router.invalidate();
            });
            toast.success("Sleep goal added successfully");
            form.reset();
        } catch (err) {
            toast.error("Failed to add sleep goal");
            console.error(err);
        }
    }

    return (
        <div className="max-w-md mx-auto p-6">
            <h2 className="text-xl font-semibold mb-4">Add Sleep Goal</h2>
            <ul className="space-y-2">
                {goals.map((g) => (
                    <li key={g.sleepGoal.id} className="p-2 border rounded">
                        <p className="font-medium">{g?.member?.name}</p>
                        <p className="font-medium">{g?.sleepGoal?.targetHours} hours</p>
                    </li>
                ))}
            </ul>

            <Form {...form}>
                <form
                    action={createSleepGoal.url}
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
                        name="targetHours"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Target Hours</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.5"
                                        placeholder="e.g. 8"
                                        {...field}
                                        value={field.value ?? ""}
                                        onChange={(e) =>
                                            field.onChange(e.target.value ? parseFloat(e.target.value) : 0)
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full">
                        Add Sleep Goal
                    </Button>
                </form>
            </Form>
        </div>
    );
}
