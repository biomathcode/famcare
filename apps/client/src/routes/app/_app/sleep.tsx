import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Label } from '@/components/ui/label'
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
import { getMembers, getSleepGoals } from "~/lib/db/queries";


export const createSleepGoal = createServerFn({
    method: "POST",
    response: "raw",
}).handler(async ({ data }) => {
    if (!data.userId) throw new Error("userId is required");
    await api.sleepGoals.create(data);
});



//TODO: Add Woke up and Slept one Time, date and member and display to show the sleep cycle of each of the members
//TODO: Idea here to record sleep timing of each and every member for the member

//TODO: show radial chart for everyday of each of the members -> percentage of sleep complete for this members
//TODO:  

type SleepGoalInput = z.infer<typeof sleepGoal>;

export const Route = createFileRoute("/app/_app/sleep")({
    component: RouteComponent,
    loader: async () => {
        const goals = await getSleepGoals();
        const members = await getMembers();
        return { goals, members };
    },
    pendingComponent: LoadingScreen,
});

function LoadingScreen() {
    return <div>Loading...</div>;
}

function RouteComponent() {
    const context = Route.useRouteContext();
    const { goals, members } = Route.useLoaderData();
    const user = context.user;

    const form = useForm<SleepGoalInput>({
        defaultValues: {
            targetHours: 0,
            userId: user?.id,
            wakeUpTime: '',
            bedTime: '',
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
        <div className="w-full p-6">

            <SleepLayout members={members} />

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


const SleepLayout = ({ members }) => {

    const timeline = ['12am', "1am", "2am", "4am", "3am", "5am", "6am", "7am", "8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", '11pm']


    return (
        <div className="relative w-full  max-w-fit ">
            <div className="flex w-full gap-2">
                <div className="sticky top-0 flex w-[100px]  flex-col ">
                    <div className="h-10">
                    </div>
                    <div className="h-10">
                        Members
                    </div>

                    {
                        members.map((member) =>

                            <div key={member.id} className="flex ">
                                <div className="flex gap-2 items-center ">
                                    <img
                                        src={member.imageUrl}
                                        className=" rounded-full w-10 h-10 "
                                    />

                                </div>




                            </div>
                        )
                    }
                </div>
                <div className="flex w-full flex-col relative overflow-y-auto">
                    <div className="flex h-10 w-full">
                        {
                            ['8 Sep'].map((e) => <div key={e} className=" w-[3072px] translate-x-2 ">
                                {e}
                            </div>

                            )
                        }
                    </div>
                    <div className="flex h-10 ">
                        {timeline.map((e) => {
                            return <div key={e} className="relative w-16 text-center ">
                                {e}
                                <div className="absolute left-1/2 bottom-0 translate-x-1/2  ">|
                                </div>
                            </div>
                        })}
                    </div>
                    <div className="absolute left-3/24 top-20 w-4/24 h-4 translate-y-1/2 rounded-md bg-neutral-800">

                    </div>
                </div>



            </div>



        </div>
    )
}