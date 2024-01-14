import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { UserRole } from "~/lib/constants";

const withAuth = (
  WrappedComponent: React.ComponentType,
  onlyForRole?: UserRole,
) => {
  const Wrapper: React.FC = (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") {
      return <></>;
    }

    if (
      onlyForRole &&
      status === "authenticated" &&
      session?.user.role !== UserRole.Admin
    ) {
      void router.replace("/not-authorized");
      return <></>;
    }

    // If user is not authenticated, redirect to login page
    if (status !== "authenticated") {
      void signIn();
      return <></>;
    }

    // If user is authenticated, render the wrapped component
    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
