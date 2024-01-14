import { type Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "sonner";
import { Menu } from "~/components/menu";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider session={session}>
        <div className="grid h-screen min-h-screen w-full overflow-hidden lg:grid-cols-[auto_1fr]">
          <Menu />
          <Component {...pageProps} />
        </div>
        <Toaster />
      </SessionProvider>
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
