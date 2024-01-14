import { DashboardIcon, GearIcon, PersonIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { TehemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export const Menu = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status !== "authenticated") {
    return <></>;
  }

  return (
    <div className="w-[280px] border-r bg-gray-100/40 dark:bg-gray-800/40 lg:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link className="flex items-center gap-2 font-semibold" href="/">
            <PersonIcon />
            <span className="flex flex-col gap-3">
              {session?.user.name} {session?.user.surname}
            </span>
          </Link>

          <div className="ml-auto">
            <TehemeToggle />
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              href="/"
            >
              <DashboardIcon className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              href="/settings"
            >
              <GearIcon className="h-4 w-4" />
              Settings
            </Link>
          </nav>
          <Button
            className="mx-3 mb-4"
            variant="ghost"
            onClick={async () => {
              await signOut();
              void router.push("/");
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};
