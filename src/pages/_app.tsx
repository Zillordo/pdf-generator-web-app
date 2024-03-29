import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "~/components/ui/sonner";
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
        <div className="grid h-screen w-screen overflow-hidden lg:grid-rows-[auto_1fr]">
          <Menu />
          <Component {...pageProps} />
        </div>
        <Toaster />
      </SessionProvider>
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
