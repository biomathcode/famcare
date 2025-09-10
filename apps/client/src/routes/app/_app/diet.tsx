/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent, CardAction } from "@/components/ui/card";
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
import { Badge } from '@/components/ui/badge'
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

import { MemberPicker } from "@/components/member-picker";
import { LoadingScreen } from "~/components/loading-screen";
import { createDiet, DietInput, getDiets, deleteDiet } from "~/lib/db/queries";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "~/components/ui/dialog";



export const Route = createFileRoute("/app/_app/diet")({
  component: RouteComponent,
  loader: async () => {
    const diets = await getDiets();
    return { diets };
  },
  pendingComponent: LoadingScreen,
});



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
    <div className="w-full p-6 flex flex-col gap-4">

      <div className="flex justify-between w-full px-4">
        <div className="flex flex-col ">
          <div className="text-2xl font-bold">
            Diet
          </div>
          <div>
            See and Set Your Diet Requirements
          </div>
        </div>


        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Diet</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Add Diet
              </DialogTitle>
              <DialogDescription>
                Add your Diet                            </DialogDescription>
            </DialogHeader>
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
                      <Select onValueChange={field.onChange} value={field?.value ?? " "}>
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
                        <Textarea placeholder="What did you eat?"

                          {...field}
                          value={field?.value ??
                            ""
                          }
                        />
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

          </DialogContent>
        </Dialog>
      </div>

      <MemberDietGrid data={diets} />


    </div>
  );
}



export function MemberDietGrid({ data }: { data: any[] }) {
  const router = useRouter();

  // Group diets by member
  const grouped = groupByMember(data);

  return (
    <div className="flex flex-col gap-4 w-full">
      {grouped.map(({ member, diets }) => (
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
            <CardAction>
              {/* Add button for adding diet if needed */}
            </CardAction>
          </CardHeader>
          <CardContent className="w-full">
            <div className="space-y-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {diets.map(({ diet }) => (
                <div
                  key={diet.id}
                  className="p-2 border rounded-md bg-muted flex flex-col gap-1 relative"
                >
                  <Button
                    onClick={async () => {
                      await deleteDiet({ data: { id: diet.id } });
                      router.invalidate();
                    }}
                    className="absolute right-2 top-2"
                    variant="destructive"
                  >
                    Delete
                  </Button>
                  <div className="font-semibold mt-4">{diet.mealType || "No Meal Type"}</div>
                  {diet.description && <div className="text-sm">{diet.description}</div>}
                  {diet.calories && (
                    <Badge variant="outline">{diet.calories} kcal</Badge>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Created:{" "}
                    {diet.createdAt
                      ? format(new Date(diet.createdAt), "dd MMM yyyy")
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

// JS function to group diets by member
const groupByMember = (data: any[]) => {
  const map = new Map<string, { member: any; diets: any[] }>();
  data.forEach((item) => {
    const memberId = item.member.id;
    if (!map.has(memberId)) {
      map.set(memberId, { member: item.member, diets: [] });
    }
    map.get(memberId)?.diets.push({ diet: item.diet });
  });
  return Array.from(map.values());
};