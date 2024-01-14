import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  Form,
} from "~/components/ui/form";
import { UserRole } from "~/lib/constants";
import withAuth from "~/utils/withAuth";
import * as z from "zod";
import { api } from "~/utils/api";

export const settingsSchema = z.object({
  numberOfFilesAllowed: z.string().min(1),
});

export type SettingsInput = z.infer<typeof settingsSchema>;

const Settings = () => {
  const { data: settings, refetch } = api.settings.getByUserId.useQuery();
  const { mutateAsync: create } = api.settings.create.useMutation();
  const { mutateAsync: update } = api.settings.update.useMutation();

  const form = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema),
  });

  const onSubmit = async (values: SettingsInput) => {
    if (!settings) {
      await create({
        numberOfFilesAllowed: Number(values.numberOfFilesAllowed),
      });
      await refetch();
      return;
    } else {
      await update({
        numberOfFilesAllowed: Number(values.numberOfFilesAllowed),
        id: settings.id,
      });
      await refetch();
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl items-center justify-center gap-6">
      <Card className="max-w-md">
        <CardHeader>
          <CardDescription>
            Set the maximum number of files to be uploaded. Currently:{" "}
            {settings?.allowedNumberOfFiles ?? "unset"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="numberOfFilesAllowed"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Number of Files Allowed"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CardFooter className="pt-6">
                <Button type="submit">Save Changes</Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default withAuth(Settings, UserRole.Admin);
