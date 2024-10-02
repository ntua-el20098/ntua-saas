import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Server } from "lucide-react";

export function HomeLanding({ email, image }) {
  const { status, data: session } = useSession();
  const [creditValue, setCreditValue] = useState(0);
  const [username, setUsername] = useState(session?.user?.name || 'Guest');
  const [newUsername, setNewUsername] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      fetchUserDetails();
      fetchCreditValue();
    }
  }, [status, session]);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_USER_MANAGEMENT_API}/userDetails`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      const data = await response.json();
      setUsername(data[0]?.name || session?.user?.name || 'N/A');
    } catch (error) {
      console.error("Error fetching user details:", error);
      setUsername(session?.user?.name || 'N/A');
    }
  };

  const fetchCreditValue = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_CREDITS_API}/user/credits`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch credit value');
      }

      const data = await response.json();
      setCreditValue(data.creditValue || 0);
    } catch (error) {
      console.error("Error fetching credit value:", error);
      setCreditValue(0);
    }
  };

  const handleUsernameChange = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_USER_MANAGEMENT_API}/changeName/${newUsername}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to change username');
      }

      setUsername(newUsername);
      setNewUsername('');
      setDialogOpen(false);
    } catch (error) {
      console.error("Error changing username:", error);
    }
  };

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
            href="/new-submission"
          >
            <PlusIcon className="mb-2 h-8 w-8 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-center">Create a new submission</span>
          </Link>
          <Link
            className="flex flex-col items-center justify-center rounded-lg bg-white p-6 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus-visible:ring-gray-300"
            href="/submissions"
          >
            <ListIcon className="mb-2 h-8 w-8 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-center">View all submissions</span>
          </Link>
          
          <Link
            className="flex flex-col items-center justify-center rounded-lg bg-white p-6 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus-visible:ring-gray-300"
            href="/buy-credits"
          >
            <CreditCardIcon className="mb-2 h-8 w-8 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium">Buy credits</span>
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
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <CreditCardIcon className="h-4 w-4" />
                  <span>{creditValue} credits</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="absolute bottom-4 right-4">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full" size="icon" variant="ghost">
              <EditIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              <span className="sr-only">Toggle edit menu</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input
                  id="username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleUsernameChange}>
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
function CreditCardIcon(props) {
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
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}

function ListIcon(props) {
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
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  );
}

function PlusIcon(props) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
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
  );
}

function EditIcon(props) {
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
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}
