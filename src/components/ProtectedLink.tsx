import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { type MouseEventHandler, type ComponentProps } from "react";
import { toast } from "sonner";

type Props = ComponentProps<typeof Link>;

export const ProtectedLink = ({ onClick, ...rest }: Props) => {
  const { data: session } = useSession();

  const handleClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (!session) {
      e.preventDefault();
      toast.error("Access Denied", {
        description: "Please log in first.",
        action: {
          label: "Log In",
          onClick: () => void signIn(),
        },
      });
      onClick?.(e);
    }
  };
  return <Link {...rest} onClick={handleClick}></Link>;
};
