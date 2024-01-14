import withAuth from "~/utils/withAuth";
import Image from "next/image";
import { Input } from "~/components/ui/input";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "~/components/ui/table";
import {
  MagnifyingGlassIcon,
  ReloadIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { AddNewPdfModal } from "./components/add-new-pdf-modal";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";

const Dashboard = () => {
  const { data: session } = useSession();
  const { data, refetch } = api.image.getImagesByUserId.useQuery(
    {
      userId: session?.user.id ?? "",
    },
    { enabled: !!session?.user?.id },
  );
  const { mutate, isLoading } = api.image.deleteFile.useMutation();

  return (
    <div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 lg:h-[60px]">
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  className="w-full appearance-none bg-white pl-8 shadow-none dark:bg-gray-950 md:w-2/3 lg:w-1/3"
                  placeholder="Search products..."
                  type="search"
                />
              </div>
            </form>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">PDFs</h1>
            <div className="ml-auto">
              <AddNewPdfModal onSuccessfulSubmit={refetch} />
            </div>
          </div>
          <div className="rounded-lg border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead className="max-w-[150px]">Name</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="hidden md:table-cell"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>
                      <Image
                        alt="Product image"
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={file.base64Preview}
                        width="64"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{file.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {file.date.toLocaleDateString()}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center justify-end gap-2">
                        <Button>
                          <a href={file.path} download={file.name}>
                            Download
                          </a>
                        </Button>
                        <Button
                          onClick={async () => {
                            mutate({ id: file.id });
                            await refetch();
                          }}
                          variant="destructive"
                          size="icon"
                        >
                          {isLoading ? (
                            <ReloadIcon className="animate-spin" />
                          ) : (
                            <TrashIcon />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default withAuth(Dashboard);
