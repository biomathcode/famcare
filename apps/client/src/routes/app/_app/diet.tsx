import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { diet } from "~/lib/db/schema";
import { api } from "~/lib/api";

import { MemberPicker } from "@/components/member-picker";



export const createDiet = createServerFn({
  method: "POST",
  response: "raw",
}).handler(async ({ data }) => {
  if (!data.userId) throw new Error("userId is required");
  await api.diets.create(data);
});

export const getDiets = createServerFn({ method: "GET" }).handler(async () => {
  const diets = await api.diets.findAll();
  return diets;
});

type DietInput = z.infer<typeof diet>;

export const Route = createFileRoute("/app/_app/diet")({
  component: RouteComponent,
  loader: async () => {
    const diets = await getDiets();
    return { diets };
  },
  pendingComponent: LoadingScreen,
});

function LoadingScreen() {
  return <div>Loading...</div>;
}

function RouteComponent() {
  const context = Route.useRouteContext();
  const { diets } = Route.useLoaderData();
  const user = context.user;

  const form = useForm<DietInput>({
    defaultValues: {
      mealType: "",
      description: "",
      calories: 0,
      userId: user?.id,
    },
  });

  const router = useRouter();

  async function onSubmit(values: DietInput) {
    console.log("submitted", values);
    try {
      await createDiet({ data: values }).then(() => {
        router.invalidate();
      });
      toast.success("Diet entry added successfully");
      form.reset();
    } catch (err) {
      toast.error("Failed to add diet entry");
      console.error(err);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Add Diet Entry</h2>
      <ul className="space-y-2">
        {diets.map((d) => (
          <li key={d.id} className="p-2 border rounded">
            <p className="font-medium">{d.mealType}</p>
            {d.description && <p className="text-sm">{d.description}</p>}
            {d.calories && (
              <p className="text-sm text-muted-foreground">
                Calories: {d.calories}
              </p>
            )}
          </li>
        ))}
      </ul>

      <Form {...form}>
        <form
          action={createDiet.url}
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
            name="mealType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meal Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select meal type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="What did you eat?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="calories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Calories</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g. 500"
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

          <Button type="submit" className="w-full">
            Add Diet Entry
          </Button>
        </form>
      </Form>
    </div>
  );
}
