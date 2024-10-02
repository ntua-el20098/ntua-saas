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
import { stringify } from "postcss";

export function ViewSubmissions({ username, email, image, accesstoken }) {
  const [submissions, setSubmissions] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [solutionsLoading, setSolutionsLoading] = useState(false);
  const [submissionsError, setSubmissionsError] = useState(null);
  const [solutionsError, setSolutionsError] = useState(null);

  const { status, data: session } = useSession();
  const [creditValue, setCreditValue] = useState(0); // Add state for credit value

  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      fetch(`${process.env.NEXT_PUBLIC_CREDITS_API}/user/credits`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`, 
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setCreditValue(data.creditValue); // Set the credit value from the response
        })
        .catch((error) => {
          console.error("Error fetching credit value:", error);
        });
    }
  }, [status, session]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setSubmissionsLoading(true);
        const submissionsResponse = await fetch(`${process.env.NEXT_PUBLIC_SUBMISSION_API}/user/submissions`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accesstoken}`,
          },
        });
        const submissionsData = await submissionsResponse.json();
        setSubmissions(submissionsData);
        setSubmissionsLoading(false);
      } catch (error) {
        console.error("Error fetching submissions:", error);
        setSubmissionsError(error.message); // Set specific error message for submissions
        setSubmissionsLoading(false);
      }
    };

    const fetchSolutions = async () => {
      try {
        setSolutionsLoading(true);
        const solutionsResponse = await fetch(`${process.env.NEXT_PUBLIC_SOLUTIONS_API}/user/solutions`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accesstoken}`,
          },
        });
        const solutionsData = await solutionsResponse.json();
        setSolutions(solutionsData);
        setSolutionsLoading(false);
      } catch (error) {
        console.error("Error fetching solutions:", error);
        setSolutionsError(error.message); // Set specific error message for solutions
        setSolutionsLoading(false);
      }
    };

    fetchSubmissions();
    fetchSolutions();
  }, [accesstoken]);

  if (submissionsLoading || solutionsLoading) {
    return <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-950">
    <div className="w-16 h-16 border-4 border-white-500 border-t-transparent border-solid rounded-full animate-spin"></div>
</div>;
  }

  if (submissionsError && solutionsError) {
    return <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-950">Error loading submissions and solutions. Please try again later.</div>;
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
                <p className="mt-2 text-gray-500 dark:text-gray-400 text-lg">Review and manage your past submissions.</p>
              </div>
            </div>
            <Link
              className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
              href="/new-submission">
              Create New Submission
              <PlusIcon className="ml-2 h-4 w-4" />
            </Link>
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
                {solutions.map(solution => (
                  <TableRow key={solution.ProblemId}>
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
                        href={`/view-solution/${solution.ProblemId}`}>
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
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <CreditCardIcon className="h-4 w-4" />
                    <span>{creditValue} credits</span>
                  </div>
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
                <p className="mt-2 text-gray-500 dark:text-gray-400 text-lg">Review and manage your past submissions.</p>
              </div>
            </div>
            <Link
              className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
              href="/new-submission">
              Create New Submission
              <PlusIcon className="ml-2 h-4 w-4" />
            </Link>
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
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <CreditCardIcon className="h-4 w-4" />
                    <span>{creditValue} credits</span>
                  </div>
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

  // Create a mapping of solution IDs for quick lookup
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
    <main key="1" className="w-full min-h-screen bg-gray-100 dark:bg-gray-950 py-12">
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
              <p className="mt-2 text-gray-500 dark:text-gray-400 text-lg">Review and manage your past submissions.</p>
            </div>
          </div>
          <Link
            className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
            href="/new-submission">
            Create New Submission
            <PlusIcon className="ml-2 h-4 w-4" />
          </Link>
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
                  <TableCell><Dialog>  
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
                      </Dialog></TableCell>
                  <TableCell>{submission.metadata.v_number}</TableCell>
                  <TableCell>{submission.metadata.depot}</TableCell>
                  <TableCell>{submission.metadata.max_dist} km</TableCell>
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
                        href={`/view-solution/${submission.ProblemId}`}>
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
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <CreditCardIcon className="h-4 w-4" />
                  <span>{creditValue} credits</span>
                </div>
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
      strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
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
      strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}
