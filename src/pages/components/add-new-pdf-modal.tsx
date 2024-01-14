import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import {
  DialogContent,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "~/components/ui/dialog";

export const AddNewPdfModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Upload</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Pictures</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="picture">Pictures</Label>
          <Input id="picture" multiple type="file" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Supported formats: .jpg, .png, .gif, etc. You can select multiple
            files.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
