"use client";

import { Login } from "@/components/component/login";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { GoogleLogin } from "@/components/component/google-login";
import { HomeLanding } from "@/components/component/home-landing";
import { HomeAdminLanding } from "@/components/component/home-admin-landing"; 

export default function Home() {
  
  const { status, data: session } = useSession();
  //console.log('access token:', session?.accessToken)
  if (status === "authenticated") {
    if (session?.user?.role === "admin") {
      return (
        <HomeAdminLanding
          username={session?.user?.name}
          email={session?.user?.email}
          image={session?.user?.image}
          role={session?.user?.role}
        />
      );
    }
    return (
      <HomeLanding
        username={session?.user?.name}
        email={session?.user?.email}
        image={session?.user?.image}
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
