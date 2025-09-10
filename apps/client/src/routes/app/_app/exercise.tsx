/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useRouter } from "@tanstack/react-router";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { MemberPicker } from "@/components/member-picker";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingScreen } from "~/components/loading-screen";
import { zodResolver } from "@hookform/resolvers/zod";
import { createExerciseGoal, deleteExercise, ExerciseGoalInput, exerciseSchema, getExerciseGoals } from "~/lib/db/queries";
import { format } from "date-fns";


const groupByMember = (data: any[]) => {
  const map = new Map<string, { member: any; exercises: any[] }>();

  data.forEach((item) => {
    const memberId = item.member.id;
    if (!map.has(memberId)) {
      map.set(memberId, { member: item.member, exercises: [] });
    }
    // Push the exerciseGoal directly
    map.get(memberId)!.exercises.push(item.exerciseGoal);
  });

  return Array.from(map.values());
};







export const Route = createFileRoute("/app/_app/exercise")({
  component: RouteComponent,
  loader: async () => {
    const goals = await getExerciseGoals();
    return { goals };
  },
  pendingComponent: LoadingScreen,
});



function RouteComponent() {
  const { goals } = Route.useLoaderData();


  return (
    <div className="p-6 w-full">
      <div className="flex w-full justify-between px-4 py-2 ">
        <div className="flex flex-col ">
          <div className="text-2xl font-bold">
            Add Exercise
          </div>
          <div>
            See and Set Your Exercise Routine
          </div>
        </div>

        <ExerciseForm />
      </div>
      <MemberExercisesGrid data={goals} />

    </div>
  );
}

export function MemberExercisesGrid({ data }: any) {
  const router = useRouter();

  const grouped = groupByMember(data);

  console.log("groupedId", grouped)

  return (
    <div className="flex flex-col gap-4 w-full">
      {grouped.map(({ member, exercises }) => (
        <Card key={member.id}>
          <CardHeader className="flex w-full justify-between">
            <div className="flex items-center gap-3">
              {member.imageUrl && (
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}

              <CardTitle>{member.name}</CardTitle>

            </div>
          </CardHeader>
          <CardContent className="w-full">
            <div className="space-y-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {exercises.map((exercise) => (
                <div
                  key={exercise?.id}
                  className="p-2 border rounded-md bg-muted flex flex-col gap-1 relative"
                >
                  <Button
                    onClick={async () => {
                      await deleteExercise({ data: { id: exercise.id } });
                      router.invalidate();
                    }}
                    className="absolute right-2 top-2"
                    variant="destructive"
                  >
                    Delete
                  </Button>
                  <div className="font-semibold">{exercise?.type || "No Type"}</div>
                  <div className="text-sm">
                    Target: {exercise?.target} {exercise?.unit || ""}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Created:{" "}
                    {exercise?.createdAt
                      ? format(new Date(exercise.createdAt), "dd MMM yyyy")
                      : "N/A"}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}




const ExerciseForm = () => {
  const context = Route.useRouteContext();
  const user = context.user;

  const form = useForm<ExerciseGoalInput>({
    defaultValues: {
      type: "",
      target: 0,
      unit: "",
      userId: user?.id,
    },
    resolver: zodResolver(exerciseSchema),

  });

  const router = useRouter();
  async function onSubmit(values: ExerciseGoalInput) {
    console.log("submitted", values);
    try {
      await createExerciseGoal({ data: values }).then(() => {
        router.invalidate();
      });
      toast.success("Exercise goal added successfully");
      form.reset();
    } catch (err) {
      toast.error("Failed to add exercise goal");
      console.error(err);
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Exercise</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Exercise</DialogTitle>
          <DialogDescription>
            Add Exercise for your members
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            action={createExerciseGoal.url}
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exercise Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field?.value ?? ''}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select exercise type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="steps">Steps</SelectItem>
                      <SelectItem value="running">Running</SelectItem>
                      <SelectItem value="cycling">Cycling</SelectItem>
                      <SelectItem value="swimming">Swimming</SelectItem>
                      <SelectItem value="yoga">Yoga</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="target"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 10000"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(e.target.value ? parseInt(e.target.value) : 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <Select onValueChange={field.onChange} value={field?.value ?? ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="steps">Steps</SelectItem>
                      <SelectItem value="km">Kilometers</SelectItem>
                      <SelectItem value="miles">Miles</SelectItem>
                      <SelectItem value="minutes">Minutes</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Add Exercise Goal
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>

  )
}


