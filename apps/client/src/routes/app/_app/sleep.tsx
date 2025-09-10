/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

import { LabelList, RadialBar, RadialBarChart } from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

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
import { formatDuration, intervalToDuration, parse, format, subMinutes, differenceInMinutes, isSameDay } from "date-fns";
import { LoadingScreen } from "~/components/loading-screen";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";



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
//TODO: show the sleep duration at he light of the startTime 

//TODO: Create a Widget to show and record the sleep cycles of members
//TODO: Radial Chart to show if members are meeting their targe sleeps 





export function ChartAreaInteractive({ data }) {
    const [timeRange, setTimeRange] = React.useState("90d")



    const newchartData = data.map((e) => {
        const duration = differenceInMinutes(
            e?.sleepGoal?.wokeUp,
            e?.sleepGoal?.sleepTime,

        )
        const newObject = {}

        newObject[e?.member?.name] = duration

        newObject['date'] = format(e?.sleepGoal?.sleepTime, 'yyyy-MM-dd')
        return newObject
    })

    const grouped = Object.values(
        newchartData.reduce((acc, item) => {
            const { date, ...nameDuration } = item;

            if (!acc[date]) {
                acc[date] = { date };
            }

            // Merge the name-duration into the grouped object
            Object.assign(acc[date], nameDuration);

            return acc;
        }, {})
    );

    grouped.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    const members = Array.from(new Set(data.map((e) => e?.member?.name)));

    console.log('newchartData', grouped)


    const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];

    const chartConfig = members.reduce((acc, name, index) => {
        acc[name] = {
            label: name,
            color: colors[index % colors.length], // Cycle colors if too many members
        };
        return acc;
    }, {} as Record<string, { label: string; color: string }>);







    return (
        <Card className="pt-0">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>Sleep Cycle</CardTitle>
                    <CardDescription>
                        Showing the sleep duration of each members
                    </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90d" className="rounded-lg">
                            Last 3 months
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            Last 30 days
                        </SelectItem>
                        <SelectItem value="7d" className="rounded-lg">
                            Last 7 days
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                ><></>
                    <AreaChart data={grouped}>
                        <defs>
                            {members.map((name, index) => (
                                <linearGradient key={name} id={`fill-${index}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={`var(--chart-${index + 1})`} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={`var(--chart-${index + 1})`} stopOpacity={0.1} />
                                </linearGradient>
                            ))}
                        </defs>

                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} />
                        <ChartTooltip
                            cursor={true}
                            content={
                                <ChartTooltipContent
                                    formatter={(value, name) => {
                                        const totalMinutes = Number(value) || 0;
                                        const hours = Math.floor(totalMinutes / 60);
                                        const minutes = totalMinutes % 60;
                                        return [name, ` ${hours}h ${minutes}m`,];
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        {members.map((name, index) => (
                            <Area
                                key={name}
                                dataKey={name}
                                type="natural"
                                fill={`url(#fill-${index})`}
                                stroke={`var(--chart-${index + 1})`}
                                stackId="a"
                            />
                        ))}

                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>


                </ChartContainer>
            </CardContent>
        </Card>
    )
}





export function ChartRadialLabel({ data }) {

    const members = Array.from(new Set(data.map((e) => e?.member?.name)));


    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const radialChartData = members.map((memberName, index) => {
        const sleepEntry = data.find(
            (e) =>
                e.member.name === memberName &&
                isSameDay(new Date(e.sleepGoal.sleepTime), today) // compare by sleepTime
        );

        console.log("sleepEntry", sleepEntry)

        const duration = sleepEntry
            ? differenceInMinutes(
                new Date(sleepEntry.sleepGoal.wokeUp),
                new Date(sleepEntry.sleepGoal.sleepTime)
            )
            : 0;

        const colorVar = `--chart-${index + 1}`;

        return {
            member: memberName,
            sleepDuration: duration, // duration in minutes
            fill: `var(${colorVar})`, // you can customize colors per member if needed
        };
    });

    console.log('radialChartData', radialChartData)

    const chartConfig: ChartConfig = radialChartData.reduce((acc, entry, index) => {
        const colorVar = `--chart-${index + 1}`; // var(--chart-1), var(--chart-2), etc.
        acc[entry.member] = {
            label: entry.member,
            color: `var(${colorVar})`,
        };
        return acc;
    }, {} as Record<string, { label: string; color: string }>);
    return (
        <Card className="flex flex-col w-md">
            <CardHeader className="items-center pb-0">
                <CardTitle>Sleep Cycle For Today</CardTitle>
                <CardDescription>Today - {format(new Date(), 'dd-MMM-yyyy')} </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <RadialBarChart
                        data={radialChartData}
                        startAngle={-90}
                        endAngle={380}
                        innerRadius={30}
                        outerRadius={110}
                    >
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel nameKey="member" />}
                        />
                        <RadialBar dataKey="sleepDuration" background>
                            <LabelList
                                position="insideStart"
                                dataKey="member"
                                className="fill-white capitalize mix-blend-luminosity"
                                fontSize={11}
                            />
                        </RadialBar>
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>

        </Card>
    )
}





export const Route = createFileRoute("/app/_app/sleep")({
    component: RouteComponent,
    loader: async () => {
        const goals = await getSleepGoals();

        return { goals };
    },
    pendingComponent: LoadingScreen,
});


function AddSleepDialog() {
    const context = Route.useRouteContext();
    const user = context.user;
    const router = useRouter();
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
        <Dialog>
            <DialogTrigger asChild>
                <Button>Add Sleep Cycle</Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Sleep Cycle</DialogTitle>
                    <DialogDescription>
                        Add your sleep and wake up times for today
                    </DialogDescription>
                </DialogHeader>
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
                                            value={field?.value ?? " "}
                                            onChange={field.onChange}
                                            onBlur={field.onBlur}
                                            name={field.name}
                                            ref={field.ref}
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
            </DialogContent>
        </Dialog>
    )
}



function RouteComponent() {
    const context = Route.useRouteContext();
    const { goals } = Route.useLoaderData();




    console.log("goals", goals)
    return (
        <div className="w-full p-6">
            {/* <SleepLayout members={members} /> */}


            <div className="w-full flex justify-between py-2 px-10 ">


                <SleepCycleSummary sleepGoalsData={goals} />
                <ChartRadialLabel data={goals} />
                <AddSleepDialog />


            </div>
            <ChartAreaInteractive data={goals} />

        </div>
    );
}


function SleepCycleSummary({ sleepGoalsData }) {
    const today = format(new Date(), "yyyy-MM-dd");

    // Extract all unique members
    const allMembers = Array.from(
        new Map(
            sleepGoalsData.map(({ member }) => [member.id, member])
        ).values()
    );

    // Members who recorded sleep today
    const membersWithSleepToday = sleepGoalsData
        .filter(({ sleepGoal }) =>
            format(new Date(sleepGoal.createdAt), "yyyy-MM-dd") === today
        )
        .map(({ member }) => member.id);

    return (
        <div className="space-y-6 p-4">
            <h2 className="text-xl font-semibold">Sleep Cycle Summary</h2>

            <div>
                <h3 className="font-medium text-green-600">✅ Recorded Today:</h3>
                {allMembers.filter(m => membersWithSleepToday.includes(m.id)).length === 0 ? (
                    <p>No sleep records found for today.</p>
                ) : (
                    <ul className="list-disc list-inside">
                        {allMembers
                            .filter((m) => membersWithSleepToday.includes(m.id))
                            .map((m) => (
                                <li key={m.id} className="flex items-center space-x-2">
                                    <img
                                        src={m.imageUrl}
                                        alt={m.name}
                                        className="h-8 w-8 rounded-full object-cover"
                                    />
                                    <span>{m.name}</span>
                                </li>
                            ))}
                    </ul>
                )}
            </div>

            <div>
                <h3 className="font-medium text-red-600">⚠️ Not Recorded Today:</h3>
                {allMembers.filter(m => !membersWithSleepToday.includes(m.id)).length === 0 ? (
                    <p>All members have recorded their sleep cycle today 🎉</p>
                ) : (
                    <ul className="list-disc list-inside">
                        {allMembers
                            .filter((m) => !membersWithSleepToday.includes(m.id))
                            .map((m) => (
                                <li key={m.id} className="flex items-center space-x-2">
                                    <img
                                        src={m.imageUrl}
                                        alt={m.name}
                                        className="h-8 w-8 rounded-full object-cover"
                                    />
                                    <span>{m.name}</span> — Please add today's sleep cycle
                                </li>
                            ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
