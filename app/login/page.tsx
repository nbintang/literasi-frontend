"use client";

import { SignInForm } from "@/components/auth-form/login";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function SigninPage() {


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
        <SignInForm />
          <div className="mt-6 text-center">
            <Link href={"/signup"}>
              {" "}
              <Button className="text-muted-foreground" variant="link">
                Don&apos;t have an account? Sign Up
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
