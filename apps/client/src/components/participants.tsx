import { Button } from "~/components/ui/button";
import { RiMoreFill } from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import { getMembers } from "~/lib/db/queries";





export default function Participants() {

  const { data: members = [], isLoading, error } = useQuery({
    queryKey: ["members"],
    queryFn: getMembers,
  });
  return (
    <div className="flex -space-x-[0.45rem]">
      {
        members.map((member) => (
          <img
            key={member.id}
            className="ring-background rounded-full ring-1"
            src={member.imageUrl}
            width={24}
            height={24}
            alt="Avatar 01"
          />

        ))
      }

      <Button
        variant="outline"
        className="flex size-6 items-center justify-center rounded-full text-xs ring-1 ring-background border-transparent shadow-none text-muted-foreground/80 dark:bg-background dark:hover:bg-background dark:border-transparent"
        size="icon"
      >
        <RiMoreFill className="size-4" size={16} />
      </Button>
    </div>
  );
}
