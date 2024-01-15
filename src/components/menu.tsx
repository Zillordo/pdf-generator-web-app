import { DashboardIcon, GearIcon, PersonIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { TehemeToggle } from "./theme-toggle";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";

export const Menu = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status !== "authenticated") {
    return <></>;
  }

  return (
    <div className="box-border flex h-[60px] w-full bg-gray-100/40 dark:bg-gray-800/40 lg:block">
      <div className="flex h-full items-center border-b">
        <div className="flex items-center gap-1 border-r px-3 sm:gap-3 sm:px-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex cursor-pointer items-center gap-2 font-semibold">
                <PersonIcon />
                <span className="flex flex-col gap-3">
                  {session?.user.name} {session?.user.surname}
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => async () => {
                  await signOut();
                  void router.push("/");
                }}
              >
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex flex-1 flex-row justify-between overflow-auto py-2">
          <nav className="flex items-center px-1 text-sm font-medium sm:px-4">
            <Link
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 sm:gap-3"
              href="/"
            >
              <DashboardIcon className="hidden h-4 w-4 sm:block" />
              Dashboard
            </Link>
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              href="/settings"
            >
              <GearIcon className="hidden h-4 w-4 sm:block" />
              Settings
            </Link>
          </nav>
          <div className="ml-auto mr-5 flex items-center">
            <TehemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};
