/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useRouter } from "@tanstack/react-router";


import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { LoadingScreen } from "~/components/loading-screen";

import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


import { deleteMedicine, getMedicines } from "~/lib/db/queries";
import { format } from "date-fns";
import { MedicineForm } from "~/components/forms/add-medicine-form";
import { MedicineScheduleForm } from "~/components/forms/add-medicine-schedule-form";







export const Route = createFileRoute("/app/_app/medicines")({
    component: RouteComponent,
    loader: async () => {
        const medicines = await getMedicines();
        return { medicines };
    },
    pendingComponent: LoadingScreen,
});




function RouteComponent() {
    const { medicines } = Route.useLoaderData();
    console.log(medicines)
    return (
        <div className=" p-6 w-full">
            <MemberMedicinesGrid data={medicines} />
        </div>
    );
}



const groupByMember = (data: any) => {
    const map = new Map();
    data.forEach((item) => {
        const memberId = item.member.id;
        if (!map.has(memberId)) {
            map.set(memberId, { member: item.member, medicines: [] });
        }
        map.get(memberId).medicines.push({
            medicine: item.medicine,
            schedule: item.medicineSchedule,
        });
    });
    return Array.from(map.values());
};




export function MemberMedicinesGrid({ data }: any) {
    const grouped = groupByMember(data);

    const router = useRouter()

    return (
        <div className="flex flex-col  gap-4 w-full">
            <div className="flex justify-between w-full px-4">
                <div className="flex flex-col ">
                    <div className="text-2xl font-bold">
                        Medicines
                    </div>
                    <div>
                        Add Medicines and its Schedule
                    </div>
                </div>
                <div className="flex gap-4 items-center">
                    <MedicineForm mode="dialog" />
                    <MedicineScheduleForm mode="dialog" />

                </div>
            </div>
            {grouped.map(({ member, medicines }) => (
                <Card key={member.id}>
                    <CardHeader className="flex w-full justify-between">
                        <div className="flex items-center gap-3">
                            <img
                                src={member?.imageUrl}
                                alt={member?.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <CardTitle>{member?.name}</CardTitle>
                        </div>
                        <CardAction className="flex gap-2">
                            <MedicineForm mode="dialog" />
                            <MedicineScheduleForm mode="dialog" />

                        </CardAction>
                    </CardHeader>
                    <CardContent className="w-full">
                        <div className="space-y-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {medicines?.map(({ medicine, schedule }) => (
                                <div
                                    key={medicine.id}
                                    className="p-2 border rounded-md bg-muted flex flex-col gap-1 relative"
                                >
                                    <Button
                                        onClick={async () => {
                                            await deleteMedicine({ data: { id: medicine.id } })
                                            router.invalidate()
                                        }}
                                        className="absolute right-2 top-2" variant="destructive">
                                        Delete
                                    </Button>
                                    <div className="font-semibold">{medicine.name || "No Name"}</div>
                                    {medicine?.description && <div className="text-sm">{medicine?.description}</div>}

                                    {schedule ? (
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            <Badge variant="secondary">
                                                {schedule?.frequency} ({schedule?.timesPerDay}x/day)
                                            </Badge>
                                            {schedule.recurrenceRule.daysOfWeek && (
                                                <Badge variant="outline">
                                                    Days: {schedule.recurrenceRule.daysOfWeek.join(", ")}
                                                </Badge>
                                            )}
                                            {schedule.recurrenceRule.customDates && (
                                                <Badge variant="outline">
                                                    Dates:{" "}
                                                    {schedule.recurrenceRule.customDates
                                                        .map((d: string) => format(new Date(d), "dd MMM"))
                                                        .join(", ")}
                                                </Badge>
                                            )}
                                            <Badge variant="outline">
                                                Dosage: {schedule.dosage} {schedule.unit}
                                            </Badge>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-muted-foreground mt-1">No schedule</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}