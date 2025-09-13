import { createFileRoute, useRouter } from "@tanstack/react-router";


import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"

import { toast } from "sonner";
import { format } from "date-fns"
import { Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { deleteMember, getMembers, memberFormData, } from "~/lib/db/queries";
import { LoadingScreen } from "~/components/loading-screen";
import { AddMemberForm } from "~/components/forms/add-member-form";



export const Route = createFileRoute("/app/_app/members")({
    component: RouteComponent,
    loader: async () => {
        const members = await getMembers();
        return { members };
    },
    pendingComponent: LoadingScreen,
});





function RouteComponent() {
    const { members } = Route.useLoaderData();


    const router = useRouter();



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
                members={members as memberFormData[]}
                handleDelete={handleDelete}

            />

            <AddMemberForm />

        </div>
    );
}










export function MembersCards({ members, handleDelete }: { members: memberFormData[], handleDelete: (id: string) => void }) {

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
                                onClick={() => handleDelete(member.id || '')}
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


