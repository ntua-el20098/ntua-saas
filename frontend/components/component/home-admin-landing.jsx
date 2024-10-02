import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";

export function HomeAdminLanding({ username, email, image, role }) {
  return (
    <main
      key="1"
      className="flex min-h-[100dvh] flex-col items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-950 relative"
    >
      <div className="container mx-auto max-w-3xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">solveMyProblem</h1>
          <p className="mt-4 text-gray-500 dark:text-gray-400 md:text-xl">The ultimate problem-solving app.</p>
          
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Link
            className="flex flex-col items-center justify-center rounded-lg bg-white p-6 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus-visible:ring-gray-300"
            href="/view-all-users-admin"
          >
            <UsersIcon className="mb-2 h-8 w-8 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-center">View all users</span>
          </Link>
          <Link
            className="flex flex-col items-center justify-center rounded-lg bg-white p-6 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus-visible:ring-gray-300"
            href="/view-all-submissions-admin"
          >
            <ListIcon className="mb-2 h-8 w-8 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-center">View all submissions</span>
          </Link>
          
          <Link
            className="flex flex-col items-center justify-center rounded-lg bg-white p-6 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus-visible:ring-gray-300"
            href="/view-logs-admin"
          >
            <ClipboardIcon className="mb-2 h-8 w-8 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium">View Logs</span>
          </Link>
          <Link
            className="flex flex-col items-center justify-center rounded-lg bg-white p-6 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus-visible:ring-gray-300"
            href="/"
            onClick={() => signOut()}
          >
            <LogOutIcon className="mb-2 h-8 w-8 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium">Sign out</span>
          </Link>
        </div>
        <div className="text-center">
          
          <p className="mt-4 text-gray-500 dark:text-gray-400 md:text-xl">Admin Mode</p>
          
        </div>
      </div>
      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="rounded-full" size="icon" variant="ghost">
              <img
                alt="Avatar"
                className="rounded-full"
                height="48"
                src={image}
                style={{
                  aspectRatio: "48/48",
                  objectFit: "cover",
                }}
                width="48"
              />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col items-start space-y-2">
                <h4 className="text-lg font-medium">{username}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{email}</p>
                <p  className="text-sm text-gray-500 dark:text-gray-400 font-mono">Role: {role}</p>
                
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}> Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </main>
  );
}


function ListIcon(props) {
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
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>)
  );
}

function ClipboardIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      </svg>
    )
  }

  
function LogOutIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  )
}

function UsersIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  }

