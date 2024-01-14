import { Button } from "~/components/ui/button";
import { LockClosedIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import withAuth from "~/utils/withAuth";

const NotAuthorized = () => {
  const router = useRouter();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800">
        <LockClosedIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
      </div>
      <h1 className="mt-6 text-3xl font-semibold text-gray-700 dark:text-gray-200">
        Not Authorized
      </h1>
      <p className="mt-2 text-center text-gray-500 dark:text-gray-400">
        You do not have the necessary permissions to access this content.
      </p>
      <Button
        onClick={() => void router.back()}
        className="mt-6"
        variant="outline"
      >
        Go Back
      </Button>
    </div>
  );
};

export default withAuth(NotAuthorized);
