"use client";
import * as React from "react";

import { signIn } from "next-auth/react";

import { Button } from "~/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import Link from "next/link";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(50),
});

export type LoginInput = z.infer<typeof loginUserSchema>;

export default function Home() {
  const router = useRouter();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginInput) => {
    const res = await signIn("credentials", {
      callbackUrl: "/dashboard",
      redirect: false,
      ...values,
    });

    if (res?.ok) {
      router.push("/dashboard");
    } else {
      if (!res?.error) {
        console.error("Auth Error: ", res);
        return;
      }
      toast.error(res?.error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[350px] bg-slate-50 dark:bg-slate-900">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex gap-3">
              <Button type="submit">Login</Button>
              <Link href="/auth/sign-up">
                <Button variant="ghost">Sign Up</Button>
              </Link>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
