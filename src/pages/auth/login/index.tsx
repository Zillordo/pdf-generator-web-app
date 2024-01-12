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

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(50),
});

export type LoginInput = z.infer<typeof loginUserSchema>;

export default function Home() {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginInput) => {
    void signIn("credentials", {}, values);
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
              <Link href="/signIn">
                <Button variant="ghost">Sign In</Button>
              </Link>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
