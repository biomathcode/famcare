import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { exerciseGoal } from "~/lib/db/schema";
import { api } from "~/lib/api";
import { LoadingScreen } from "~/components/loading-screen";

export const createExerciseGoal = createServerFn({
  method: "POST",
  response: "raw",
}).handler(async ({ data }) => {
  if (!data.userId) throw new Error("userId is required");
  await api.exerciseGoals.create(data);
});

export const getExerciseGoals = createServerFn({ method: "GET" }).handler(
  async () => {
    const goals = await api.exerciseGoals.findAll();
    return goals;
  }
);

type ExerciseGoalInput = z.infer<typeof exerciseGoal>;

export const Route = createFileRoute("/app/_app/exercise")({
  component: RouteComponent,
  loader: async () => {
    const goals = await getExerciseGoals();
    return { goals };
  },
  pendingComponent: LoadingScreen,
});



function RouteComponent() {
  const context = Route.useRouteContext();
  const { goals } = Route.useLoaderData();
  const user = context.user;

  const form = useForm<ExerciseGoalInput>({
    defaultValues: {
      type: "",
      target: 0,
      unit: "",
      userId: user?.id,
    },
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
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Add Exercise Goal</h2>
      <ul className="space-y-2">
        {goals.map((g) => (
          <li key={g.id} className="p-2 border rounded">
            <p className="font-medium">{g.type}</p>
            <p className="text-sm">
              Target: {g.target} {g.unit}
            </p>
          </li>
        ))}
      </ul>

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
                <Select onValueChange={field.onChange} value={field.value}>
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
                <Select onValueChange={field.onChange} value={field.value}>
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
    </div>
  );
}
