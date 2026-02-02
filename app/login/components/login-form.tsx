"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  accountNumber: z.string().min(9, "Account number is invalid"),
  password: z.string().min(8, "Password is invalid"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { accountNumber: "", password: "" },
  });

  const onSubmit = (values: FormValues) => {
    console.log("Login submitted:", values);
  };

  return (
    <div className="flex min-h-screen w-1/2 flex-col items-center justify-center bg-[#f5f5f5] px-12">
      <div className="mb-20 w-full max-w-md">
        <div className="text-right">
          <h1 className="text-4xl font-bold text-[#5b7fff]">Plutus</h1>
          <p className="text-sm text-gray-500">Online Banking</p>
        </div>
      </div>

      <div className="w-full max-w-md">
        <h2 className="mb-8 text-3xl font-semibold text-gray-900">Log in</h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal text-gray-700">
                    Account number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1100 0000 0000 0000"
                      className="h-12 rounded-md border border-blue-300 bg-white px-4 text-gray-900 placeholder:text-gray-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal text-gray-700">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••••"
                      className="h-12 rounded-md border border-blue-300 bg-white px-4 text-gray-900"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="h-12 w-full rounded-md bg-black text-base font-medium text-white transition-colors hover:bg-gray-800"
            >
              Log in
            </Button>

            <div className="text-center">
              <Link 
                href="/forgot-password" 
                className="text-sm text-[#00bcd4] transition-colors hover:text-[#00acc1]"
              >
                Forgot your password?
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
