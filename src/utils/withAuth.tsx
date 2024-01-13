import { signIn, useSession } from "next-auth/react";

const withAuth = (WrappedComponent: React.ComponentType) => {
  const Wrapper: React.FC = (props) => {
    const { data: session } = useSession();

    // If user is not authenticated, redirect to login page
    if (!session) {
      void signIn();
      return null;
    }

    // If user is authenticated, render the wrapped component
    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
