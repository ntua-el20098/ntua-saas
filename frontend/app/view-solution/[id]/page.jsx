"use client";

import { useSession } from "next-auth/react";
import { GoogleLogin } from "@/components/component/google-login";
import { Solution } from "@/components/component/solution";
import { useParams } from 'next/navigation'

export default function Page() {
  const { status, data: session } = useSession();
  const params = useParams();
  const problemId = params.id;
  //console.log('params:', params)

  if (status === "authenticated") {
    return (
      <Solution
        username={session?.user?.name}
        email={session?.user?.email}
        creditNumber={100}
        image={session?.user?.image}
        accessToken={session?.accessToken}
        params = {problemId}
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
