import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle, Cross, LogOut, } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar'
import { Button } from "~/components/ui/button";
import { CardDescription, CardTitle, Card, CardContent, CardAction, CardFooter, CardHeader } from "~/components/ui/card";
import authClient from "~/lib/auth/auth-client"


export const Route = createFileRoute("/app/_app/settings")({
    head: () => ({
        meta: [
            {
                charSet: 'utf-8',
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            {
                title: 'Health Management - Settings',
            },
        ],
    }),
    component: RouteComponent,
});

function RouteComponent() {
    const {
        data: session,
        isPending, //loading state

    } = authClient.useSession() // Get user info from auth

    const nav = useNavigate()
    const [loading, setLoading] = useState(false);


    if (isPending) {
        return <div>Loading user profile...</div>;
    }

    if (!session) {
        return <div>You must be logged in to view this page.</div>;
    }

    const handleLogout = async () => {
        setLoading(true);

        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    nav({ to: '/' })
                },
            }
        });
        setLoading(false);
    };

    return (
        <div className="mx-auto w-full flex justify-center py-4 ">
            <div className="flexflex-col gap-2">
                <h1 className="py-4 text-2xl">
                    Settings
                </h1>


                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle>
                            {session.user.name}

                        </CardTitle>
                        <CardDescription>
                            {session.user.email}
                        </CardDescription>
                        <CardAction>
                            <Avatar>
                                <AvatarImage src={session?.user?.image || ' '} />
                                <AvatarFallback>SC</AvatarFallback>
                            </Avatar>

                        </CardAction>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">

                        <div className="flex justify-between items-center">
                            UserId:
                            <code className="text-sm">
                                {session.user.id}
                            </code>

                        </div>
                        <div className="flex gap-2 items-center ">
                            Email Verified:
                            {session.user.emailVerified ? <CheckCircle size={18} /> : <Cross size={18} />}
                        </div>
                        <div>
                            Current Session:
                        </div>
                        <div>
                            Session UserAgent:
                            {session.session.userAgent}
                        </div>
                        <div>
                            Session Expires:
                            {session.session.expiresAt.toDateString()}
                        </div>




                    </CardContent>
                    <CardFooter className="w-full">
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            className="w-full h-12 text-base font-medium hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-colors"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 mr-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Signing out...
                                </>
                            ) : (
                                <>
                                    <LogOut className="w-4 h-4 mr-3" />
                                    Sign out
                                </>
                            )}
                        </Button>

                    </CardFooter>
                </Card>
            </div>



        </div>
    );
}
