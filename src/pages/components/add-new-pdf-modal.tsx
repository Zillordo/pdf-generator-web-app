import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  DialogContent,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "~/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ControllerRenderProps, useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useCallback, useState, type ChangeEvent } from "react";
import { getBase64 } from "~/lib/utils";
import { Card, CardContent } from "~/components/ui/card";
import Image from "next/image";
import { api } from "~/utils/api";
import { toast } from "sonner";
import { ReloadIcon } from "@radix-ui/react-icons";

const schema = z.object({
  name: z.string().min(2).max(50),
  base64: z.string(),
});

type Input = z.infer<typeof schema>;

type Props = {
  onSuccessfulSubmit?: () => void;
};

export const AddNewPdfModal = ({ onSuccessfulSubmit }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { mutate, isLoading } = api.image.createPdf.useMutation({
    onSuccess: () => {
      toast.success("PDF has been successfully generated");
      resetDialog();
      setDialogOpen(false);
      onSuccessfulSubmit?.();
    },
    onError: (err) => {
      if (err?.data?.code === "CONFLICT") {
        toast.error(err.message, {
          description: "Please try again with a different name.",
        });
        return;
      }
      toast.error(err.message);
    },
  });

  const form = useForm<Input>({
    resolver: zodResolver(schema),
    defaultValues: {
      base64: undefined,
      name: "",
    },
  });
  const [image, setImage] = useState<{
    base64: string | ArrayBuffer | null;
    name: string;
  }>();

  const onFileChange = useCallback(
    async (
      event: ChangeEvent<HTMLInputElement>,
      field: ControllerRenderProps<Input, "base64">,
    ) => {
      if (event.target.files?.[0]) {
        const base64 = await getBase64(event.target.files[0]);
        const name = event.target.files[0].name;

        setImage({ base64, name });
        field.onChange(base64);
      }
    },
    [],
  );

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      resetDialog();
    }
  };

  const resetDialog = () => {
    form.reset();
    setImage(undefined);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary">Upload</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Picture</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit((v) => mutate(v))}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mb-4"></div>
              <FormField
                control={form.control}
                name="base64"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".jpg, .jpeg, .png"
                        name={field.name}
                        onChange={(e) => onFileChange(e, field)}
                      />
                    </FormControl>
                    <FormDescription>
                      Supported formats: .jpg, .jpeg, .png
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {image && (
                <Card className="mt-4 flex flex-col items-center justify-center p-4">
                  <CardContent>
                    <Image
                      alt="Preview"
                      width="200"
                      height="200"
                      className="aspect-square h-48 w-auto object-cover"
                      src={image.base64 as string}
                    />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {image.name}
                    </p>
                  </CardContent>
                </Card>
              )}

              <DialogFooter className="mt-4">
                <Button type="submit">
                  {isLoading && (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
