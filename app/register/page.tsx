"use client";

import { SignUpForm } from "@/components/auth-form/register";
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
          <CardTitle>Sign up</CardTitle>
          <CardDescription>Create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
          <div className="mt-6 text-center">
            <Link href={"/signin"}>
              {" "}
              <Button className="text-muted-foreground" variant="link">Already have an account? Sign In</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
