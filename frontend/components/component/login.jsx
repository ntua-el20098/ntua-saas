"use client";

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter, Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { signIn } from "next-auth/react";

export function Login() {
  return (
    (<div
      className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-950">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center mb-10 justify-center">
          <MountainIcon className="h-8 w-8 text-gray-900 dark:text-gray-50" />
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-50">solveMyProblem</span>
        </div>
        <Card>
          <CardContent className="space-y-4">
            <div className="space-y-8">
              <div className="space-y-2 mt-6">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="Enter your username" type="text" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  className="text-sm text-gray-500 hover:underline dark:text-gray-400"
                  href="#">
                  Forgot password?
                </Link>
              </div>
              <Input id="password" placeholder="Enter your password" type="password" />
            </div>
            <Button className="w-full" type="submit">
              Log In
            </Button>
          </CardContent>
          <CardFooter className="text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?
            <Link
              className="font-medium text-gray-900 hover:underline dark:text-gray-50"
              href="#">
              Register
            </Link>
          </CardFooter>
        </Card>
        <div className="flex items-center justify-center space-x-2">
          <Separator className="w-full" orientation="horizontal" />
          <span className="px-2 text-sm font-medium text-gray-500 dark:text-gray-400">Or</span>
          <Separator className="w-full" orientation="horizontal" />
        </div>
        <Button onClick={() => signIn("google")} className="w-full" variant="outline">
          <ChromeIcon className="mr-2 h-5 w-5" />
          Continue with Google
        </Button>
      </div>
    </div>)
  );
}

function ChromeIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>)
  );
}


function MountainIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>)
  );
}
