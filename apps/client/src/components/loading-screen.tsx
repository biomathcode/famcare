import { Skeleton } from "./ui/skeleton";

export function LoadingScreen() {
    return (
        <div className="w-full p-6 flex flex-col gap-4">
            <div className="flex justify-between w-full px-4">
                <div className="flex flex-col gap-4 ">
                    <div className="text-2xl font-bold">
                        <Skeleton className="h-4 w-[250px] animate-pulse" />

                    </div>
                    <div>
                        <Skeleton className="h-4 w-[200px] animate-pulse" />
                    </div>
                </div>
                <Skeleton className="h-4 w-[250px] animate-pulse" />

            </div>
            <div className="flex w-full flex-wrap gap-4 mt-20">


                {Array.from({ length: 10 }).map((_, inx) => (
                    <div key={inx} className="flex flex-col space-y-3">
                        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}