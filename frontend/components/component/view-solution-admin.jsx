import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
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

export function SolutionAdmin({ username, email, image, accessToken, params }) {

  const [submissionData, setSubmissionData] = useState(null);
  const [solutionData, setSolutionData] = useState(null);
  const [submissionError, setSubmissionError] = useState(false);
  const [solutionError, setSolutionError] = useState(false);

  useEffect(() => {

    // Fetch submission data
    fetch(`${process.env.NEXT_PUBLIC_SUBMISSION_API}/user/submission/${params}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setSubmissionData(data[0]))
      .catch(() => setSubmissionError(true));

    // Fetch solution data
    fetch(`${process.env.NEXT_PUBLIC_SOLUTIONS_API}/user/solution/${params}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setSolutionData(data))
      .catch(() => setSolutionError(true));
  }, [accessToken]);

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
              <h1 className="text-4xl font-bold tracking-tighter">Solution Details</h1>
              <p className="mt-2 text-gray-500 dark:text-gray-400 text-lg">Review the details of your solution.</p>
            </div>
          </div>
          
        </div>
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-900 text-gray-50 p-6">
            <h2 className="text-2xl font-bold">Solution Details</h2>
          </div>
          <div className="p-6 grid gap-6">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold">Problem Parameters</h3>
                <div className="mt-2 grid gap-2">
                  <div className="flex justify-between">
                    <span>Locations File:</span>
                    <span>{submissionError ? "N/A" : submissionData?.fileContent?.Locations ? <div>
                      <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost">JSON file</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>JSON File</DialogTitle>
                        </DialogHeader>
                        <DialogContent>
                          <DialogDescription>
                            <pre className="text-sm max-h-96 overflow-auto">{JSON.stringify(submissionData.fileContent, null, 2)}</pre>
                          </DialogDescription>
                        </DialogContent>
                        <DialogFooter>
                          <Button size="sm" onClick={() => alert("Download JSON")}>Download</Button>
                          </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    </div> : "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Number of Vehicles:</span>
                    <span>{submissionError ? "N/A" : submissionData?.metadata?.v_number || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Depot:</span>
                    <span>{submissionError ? "N/A" : submissionData?.metadata?.depot || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Distance:</span>
                    <span>{submissionError ? "N/A" : submissionData?.metadata?.max_dist ? `${submissionData.metadata.max_dist}m` : "N/A"}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold">Solution Summary</h3>
                <div className="mt-2 grid gap-2">
                  <div className="flex justify-between">
                    <span>Objective:</span>
                    <span>{solutionError ? "N/A" : solutionData?.Objective || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Maximum Route Distance:</span>
                    <span>{solutionError ? "N/A" : solutionData?.max_route_distance ? `${solutionData.max_route_distance}m` : "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{solutionError ? "N/A" : solutionData?.Duration ? `${solutionData.Duration}ms` : "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Credits Used:</span>
                    <span>{solutionError ? "N/A" : solutionData?.CreditValue ? `${solutionData.CreditValue} credit(s)` : "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-4">
              <h3 className="text-lg font-bold">Vehicle Routes</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {solutionError
                  ? <div>N/A</div>
                  : Array.isArray(solutionData?.Routes) && solutionData.Routes.length > 0
                  ? solutionData.Routes.map((route) => (
                    <div key={route.vehicle} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <h4 className="text-base font-bold">Route for Vehicle {route.vehicle}</h4>
                      <div className="mt-2 grid gap-2">
                        <div className="flex items-center gap-2">
                          <TruckIcon className="w-6 h-6 text-gray-900 dark:text-gray-50" />
                          <span>{route.route.join(" -> ")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <RouteIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                          <span>Distance: {route.distance}m</span>
                        </div>
                      </div>
                    </div>
                  ))
                  : <div>No routes available</div>
                }
              </div>
            </div>
          </div>
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

function RouteIcon(props) {
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
      <circle cx="6" cy="19" r="3" />
      <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H20" />
      <polyline points="17 5 21 1 17 5" />
    </svg>
  );
}

function TruckIcon(props) {
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
      <path d="M1 3h15v13H1z" />
      <path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
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
