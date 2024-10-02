"use client";

import {useSession } from "next-auth/react";
import { GoogleLogin } from "@/components/component/google-login";
import { ViewSubmissionsAdmin } from "@/components/component/view-submissions-admin";

export default function Page() {
  const { status, data: session } = useSession();

  if (status === "authenticated") {
    return (
      <ViewSubmissionsAdmin
        username={session?.user?.name}
        email={session?.user?.email}
        image={session?.user?.image}
        accesstoken={session?.accessToken}
      />
    );
  } 
  else if (status === "loading") {
    return <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-950">
    <div className="w-16 h-16 border-4 border-white-500 border-t-transparent border-solid rounded-full animate-spin"></div>
</div>
  } 
  else {
    return <GoogleLogin />;
  }
}
