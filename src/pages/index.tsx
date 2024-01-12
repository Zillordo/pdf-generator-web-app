import { signIn } from "next-auth/react";
import Head from "next/head";

export default function Home() {
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
                onClick={() => void signIn()}
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
