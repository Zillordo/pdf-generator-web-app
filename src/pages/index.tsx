import withAuth from "~/utils/withAuth";
import Image from "next/image";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "~/components/ui/table";
import {
  ComponentNoneIcon,
  ReloadIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { AddNewPdfModal } from "~/components/add-new-pdf-modal";

const Dashboard = () => {
  const { data, refetch } = api.file.getFiles.useQuery();
  const { mutateAsync, isLoading } = api.file.deleteFile.useMutation();

  return (
    <div>
      <div className="flex flex-col">
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
                {data?.length === 0 && (
                  <TableRow>
                    <TableCell className="py-8 text-center" colSpan={4}>
                      <div className="flex flex-col items-center gap-2">
                        <ComponentNoneIcon className="h-16 w-16 text-gray-400" />
                        <h3 className="text-lg font-semibold">No Data Found</h3>
                        <p className="text-gray-500">
                          We could not find any data. Try again later.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
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
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button>
                          <a href={file.path} download={file.name}>
                            Download
                          </a>
                        </Button>
                        <Button
                          onClick={async () => {
                            await mutateAsync({ id: file.id });
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
