import Link from "next/link";
import { useState, useEffect } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
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

export function ViewUsersAdmin({ username, email, image, accessToken }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_USER_MANAGEMENT_API}/allUsers`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, [accessToken]);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setNewName(user.name);
  };
  //console.log('SDDNSJSDFHJSDHJ access token:', accessToken)
  console.log('sub:', selectedUser?.sub)
  const handleSaveChanges = () => {
    fetch(`${process.env.NEXT_PUBLIC_USER_MANAGEMENT_API}/admin/changeName/${newName}`, {
      method: "POST",
      headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      },
      body: JSON.stringify({ sub: selectedUser.sub }),
    })
    
      .then((res) => res.json())
      .then((data) => {
        // Update the user list with the new name
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === selectedUser._id ? { ...user, name: newName } : user
          )
        );
        setSelectedUser(null); // Close the dialog
      })
      .catch((error) => console.error("Error updating user name:", error));
  };

  return (
    <main key="1" className="w-full min-h-screen bg-gray-100 dark:bg-gray-950 py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex justify-between items-center mb-8">
        <div className="fixed top-4 left-4 flex justify-between items-center bg-white dark:bg-gray-950 px-4 py-2 rounded-md shadow-md">
          <Link className="text-2xl font-bold" href="/">
            solveMyProblem
          </Link>
        </div>
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-4xl mt-8 font-bold tracking-tighter">View All Users</h1>
                <p className="mt-2 text-gray-500 dark:text-gray-400 text-lg">Review and manage your registered users.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="border rounded-lg overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="ghost" onClick={() => handleEditClick(user)}>Edit Profile</Button>
                      </DialogTrigger>
                      {selectedUser && (
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
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="button" onClick={handleSaveChanges}>
                              Save changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      )}
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="fixed top-4 right-4">
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
                <p className="text-sm text-gray-500 dark:text-gray-400">Role: admin</p>
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
