import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { toast } from "sonner";
import { ProtectedLink } from "~/components/ProtectedLink";

export default function Home() {
  const session = useSession();

  return (
    <>
      <Head>
        <title>Cool People</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center justify-center gap-4">
              <button
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                onClick={() => {
                  if (session.status === "authenticated") {
                    void signOut();
                  } else {
                    void signIn();
                  }
                }}
              >
                {session.status === "authenticated" ? "Log Out" : "Log In"}
              </button>
              <ProtectedLink href="/dashboard">Dashboard</ProtectedLink>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
