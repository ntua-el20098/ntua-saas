import { useEffect, useState } from "react";
import Link from "next/link";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu";
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



export function ViewSubmissionsAdmin({ username, email, image, accesstoken }) {
  const [submissions, setSubmissions] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [users, setUsers] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [solutionsLoading, setSolutionsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [submissionsError, setSubmissionsError] = useState(null);
  const [solutionsError, setSolutionsError] = useState(null);
  const [usersError, setUsersError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setSubmissionsLoading(false);
        const submissionsResponse = await fetch(`${process.env.NEXT_PUBLIC_SUBMISSION_API}/allSubmissions`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accesstoken}`,
          },
        });
        const submissionsData = await submissionsResponse.json();
        console.log("Submissions data:", submissionsData)
        setSubmissions(submissionsData);
        setSubmissionsLoading(false);
      } catch (error) {
        console.error("Error fetching submissions:", error);
        setSubmissionsError(error.message);
        setSubmissionsLoading(false);
      }
    };

    const fetchSolutions = async () => {
      try {
        setSolutionsLoading(false);
        const solutionsResponse = await fetch(`${process.env.NEXT_PUBLIC_SOLUTIONS_API}/allSolutions`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accesstoken}`,
          },
        });
        const solutionsData = await solutionsResponse.json();
        console.log("Solution data:", solutionsData);
        setSolutions(solutionsData);
        setSolutionsLoading(false);
      } catch (error) {
        console.error("Error fetching solutions:", error);
        setSolutionsError(error.message);
        setSolutionsLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        setUsersLoading(false);
        const usersResponse = await fetch(`${process.env.NEXT_PUBLIC_USER_MANAGEMENT_API}/allUsers`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accesstoken}`,
            "Content-Type": "application/json"
            },
        });
        const usersData = await usersResponse.json();
        console.log("User data:", usersData);
        setUsers(usersData);
        setUsersLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsersError(error.message);
        setUsersLoading(false);
      }
    };

    fetchSubmissions();
    fetchSolutions();
    fetchUsers();
  }, [accesstoken]);

  if (submissionsLoading || solutionsLoading || usersLoading) {
    return <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-950">
    <div className="w-16 h-16 border-4 border-white-500 border-t-transparent border-solid rounded-full animate-spin"></div>
</div>;
  }

  if (submissionsError && solutionsError && usersError) {
    return <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-950">
    <div className="w-16 h-16 border-4 border-white-500 border-t-transparent border-solid rounded-full animate-spin"></div>
</div>;
  }

  if (submissionsError) {
    return (
      <main className="w-full min-h-screen bg-gray-100 dark:bg-gray-950 py-12">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="fixed top-4 left-4 flex justify-between items-center bg-white dark:bg-gray-950 px-4 py-2 rounded-md shadow-md">
            <Link className="text-2xl font-bold" href="/">
              solveMyProblem
            </Link>
          </div>
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-4xl mt-8 font-bold tracking-tighter">View All Submissions</h1>
                <p className="mt-2 text-gray-500 dark:text-gray-400 text-lg">Review and manage user's submissions.</p>
              </div>
            </div>
            
          </div>
          <div className="border rounded-lg overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Solver Model</TableHead>
                  <TableHead>JSON File</TableHead>
                  <TableHead>Vehicle Number</TableHead>
                  <TableHead>Starting Location</TableHead>
                  <TableHead>Max Distance</TableHead>
                  <TableHead>Submitted On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Solution</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {solutions.map(solution => (
                  <TableRow key={solution.ProblemId}>
                    <TableCell>{users.find(user => user.sub === solution.sub)?.name || "Unknown"}</TableCell>
                    <TableCell>N/A</TableCell>
                    <TableCell>N/A</TableCell>
                    <TableCell>N/A</TableCell>
                    <TableCell>N/A</TableCell>
                    <TableCell>N/A</TableCell>
                    <TableCell>{new Date(solution.receivedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge
                        className="text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/50"
                        variant="warning"
                      >
                        Only Solution
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link
                        className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                        href={`/view-solution-admin/${solution.ProblemId}`}>
                        View Solution
                      </Link>
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

  if (solutionsError) {
    return (
      <main className="w-full min-h-screen bg-gray-100 dark:bg-gray-950 py-12">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="fixed top-4 left-4 flex justify-between items-center bg-white dark:bg-gray-950 px-4 py-2 rounded-md shadow-md">
            <Link className="text-2xl font-bold" href="/">
              solveMyProblem
            </Link>
          </div>
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-4xl mt-8 font-bold tracking-tighter">View All Submissions</h1>
                <p className="mt-2 text-gray-500 dark:text-gray-400 text-lg">Review and manage user's submissions.</p>
              </div>
            </div>
            
          </div>
          <div className="border rounded-lg overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Solver Model</TableHead>
                  <TableHead>JSON File</TableHead>
                  <TableHead>Vehicle Number</TableHead>
                  <TableHead>Starting Location</TableHead>
                  <TableHead>Max Distance</TableHead>
                  <TableHead>Submitted On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Solution</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map(submission => (
                  <TableRow key={submission.ProblemId}>
                  <TableCell>{submission.metadata.solver_name}</TableCell>
                  <TableCell>
                    <Dialog>  
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">View JSON</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>JSON File</DialogTitle>
                        </DialogHeader>
                        <DialogContent>
                        <DialogDescription>
                            <Label>JSON File</Label>
                            <pre className="text-sm max-h-96 overflow-auto">{JSON.stringify(submission.fileContent, null, 2)}</pre>
                          </DialogDescription>
                        </DialogContent>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>{submission.metadata.v_number}</TableCell>
                  <TableCell>{submission.metadata.depot}</TableCell>
                  <TableCell>{submission.metadata.max_dist} km</TableCell>
                  <TableCell>{new Date(submission.receivedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge
                      className="text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/50"
                      variant="warning"
                    >
                      Not available
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button disabled size="sm" variant="outline">
                      View Solution
                    </Button>
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

  const solutionIds = solutions.map(solution => solution.ProblemId);

  
  // Function to determine status based on solution existence
  const getStatus = (submission) => {
    if (solutionIds.includes(submission.ProblemId)) {
      return "Completed";
    } else {
      return "Pending";
    }
  };

  return (
    <main className="w-full min-h-screen bg-gray-100 dark:bg-gray-950 py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="fixed top-4 left-4 flex justify-between items-center bg-white dark:bg-gray-950 px-4 py-2 rounded-md shadow-md">
          <Link className="text-2xl font-bold" href="/">
            solveMyProblem
          </Link>
        </div>
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-4xl mt-8 font-bold tracking-tighter">View All Submissions</h1>
              <p className="mt-2 text-gray-500 dark:text-gray-400 text-lg">Review and manage user's submissions.</p>
            </div>
          </div>
          
        </div>
        <div className="border rounded-lg overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Solver Model</TableHead>
                <TableHead>JSON File</TableHead>
                <TableHead>Vehicle Number</TableHead>
                <TableHead>Starting Location</TableHead>
                <TableHead>Max Distance</TableHead>
                <TableHead>Submitted On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Solution</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map(submission => (
                <TableRow key={submission.ProblemId}>
                  <TableCell>{users.find(user => user.sub === submission.metadata.sub)?.name || "Unknown"}</TableCell>
                  <TableCell>{submission.metadata.solver_name}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost">View JSON</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle><Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost">View JSON</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>JSON File</DialogTitle>
                        </DialogHeader>
                        <DialogContent>
                          <DialogDescription>
                            <div className="text-sm max-h-96 overflow-auto">{JSON.stringify(submission.fileContent, null, 2)}</div>
                          </DialogDescription>
                        </DialogContent>
                        <DialogFooter>
                          <Button size="sm" onClick={() => alert("Download JSON")}>Download</Button>
                          </DialogFooter>
                      </DialogContent>
                    </Dialog></DialogTitle>
                        </DialogHeader>
                        <DialogContent>
                          <DialogDescription>
                            <pre className="text-sm max-h-96 overflow-auto">{JSON.stringify(submission.fileContent, null, 2)}</pre>
                          </DialogDescription>
                        </DialogContent>
                        <DialogFooter>
                          <Button size="sm" onClick={() => alert("Download JSON")}>Download</Button>
                          </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    </TableCell>
                  <TableCell>{submission.metadata.v_number}</TableCell>
                  <TableCell>{submission.metadata.depot}</TableCell>
                  <TableCell>{submission.metadata.max_dist}</TableCell>
                  <TableCell>{new Date(submission.receivedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        getStatus(submission) === "Completed"
                          ? "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/50"
                          : "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/50"
                      }
                      variant={
                        getStatus(submission) === "Completed"
                          ? "success"
                          : "warning"
                      }
                    >
                      {getStatus(submission)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                  {getStatus(submission) === "Completed" && (
                      <Link
                        className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                        href={`/view-solution-admin/${submission.ProblemId}`}>
                        View Solution
                      </Link>
                    )}
                    {getStatus(submission) === "Pending" && (
                        <Button disabled size="sm" variant="outline">
                          View Solution
                        </Button>
                      )}
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