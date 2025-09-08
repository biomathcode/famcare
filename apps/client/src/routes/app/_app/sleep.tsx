import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
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
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api } from "~/lib/api";

import { MemberPicker } from "@/components/member-picker";
import { getMembers, getSleepGoals } from "~/lib/db/queries";
import { sleepGoal } from "~/lib/db/schema";
import z from "zod";

import { createInsertSchema } from "drizzle-zod";
import { parse } from "date-fns";
import { LoadingScreen } from "~/components/loading-screen";



function parseDateTimeLocal(value: string): Date {
    // input format from <input type="datetime-local"> is "yyyy-MM-dd'T'HH:mm"
    return parse(value, "yyyy-MM-dd'T'HH:mm", new Date());
}

export const sleepGoalSchema = createInsertSchema(sleepGoal, {
    wokeUp: z.string(),
    sleepTime: z.string()
})

export type SleepGoalFormData = z.infer<typeof sleepGoalSchema>;




export const createSleepGoal = createServerFn({
    method: "POST",
    response: "raw",
}) // no generics here
    .validator(sleepGoalSchema)
    .handler(async ({ data }) => {
        if (!data.userId) throw new Error("userId is required");

        console.log("data", data)
        const payload = {
            ...data,
            sleepTime: parseDateTimeLocal(data.sleepTime),
            wokeUp: parseDateTimeLocal(data.wokeUp),
        };
        return await api.sleepGoals.create(payload);
        ;
    });


//TODO: Add Woke up and Slept one Time, date and member and display to show the sleep cycle of each of the members
//TODO: Idea here to record sleep timing of each and every member for the member

//TODO: show radial chart for everyday of each of the members -> percentage of sleep complete for this members
//TODO:  





export const Route = createFileRoute("/app/_app/sleep")({
    component: RouteComponent,
    loader: async () => {
        const goals = await getSleepGoals();
        const members = await getMembers();
        return { goals, members };
    },
    pendingComponent: LoadingScreen,
});



function RouteComponent() {
    const context = Route.useRouteContext();
    const { goals, members } = Route.useLoaderData();
    const user = context.user;

    const form = useForm<SleepGoalFormData>({
        defaultValues: {
            userId: user?.id ?? "",
            memberId: "",
            sleepTime: "",
            wokeUp: "",
            note: "",
        },
        resolver: zodResolver(sleepGoalSchema),

    });

    const router = useRouter();
    const handleSubmit: SubmitHandler<SleepGoalFormData> = async (values) => {
        console.log("submitted", values);

        try {
            const payload = {
                ...values,

            };

            await createSleepGoal({ data: payload });
            router.invalidate();
            toast.success("Sleep goal added successfully");
            form.reset();
        } catch (err) {
            toast.error("Failed to add sleep goal");
            console.error(err);
        }
    };
    return (
        <div className="w-full p-6">
            <SleepLayout members={members} />

            <div>
                {
                    goals.map((goal) => (
                        <div key={goal.sleepGoal.id}>
                            {/* <div>{goal?.sleepGoal?.wokeUp}</div>
                            <div>{goal?.sleepGoal?.sleepTime}</div> */}

                            <div>{JSON.stringify(goal)}</div>
                        </div>
                    ))
                }
            </div>

            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Add Sleep Cycle</CardTitle>
                    <CardDescription>
                        Add your woke up time and sleep time
                    </CardDescription>

                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            action={createSleepGoal.url}
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
                                name="sleepTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sleep Time</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="datetime-local"
                                                placeholder="Select sleep time"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="wokeUp"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Wake Up Time</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="datetime-local"
                                                placeholder="Select wake up time"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="note"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Note (Optional)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Additional note"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <Button
                                disabled={form.formState.isSubmitting}
                                type="submit" className="w-full">
                                Add Sleep Cycle
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
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
                            return <div key={e} className="relative w-16  ">
                                {e}
                                <div className="absolute left-0 bottom-0   ">|
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



