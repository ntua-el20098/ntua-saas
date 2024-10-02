import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar"
import { Button } from "@/components/ui/button";
import { DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";

export function LogsPage({ username, email, image, accessToken }) {
  const [topCredits, setTopCredits] = useState([]);
  const [totalCredits, setTotalCredits] = useState({ totalCredits: 0 });
  const [topUsers, setTopUsers] = useState([]);
  const [monthlySubmissions, setMonthlySubmissions] = useState([]);
  const [totalSubmissions, setTotalSubmissions] = useState({ totalSubmissions: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topCreditsResponse = await fetch(`${process.env.NEXT_PUBLIC_CREDITS_API}/user/getTopCredits`, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const topCreditsData = await topCreditsResponse.json();
        console.log("Top credits data:", topCreditsData);
        setTopCredits(topCreditsData);

        const totalCreditsResponse = await fetch(`${process.env.NEXT_PUBLIC_CREDITS_API}/user/getTotalCredits`, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const totalCreditsData = await totalCreditsResponse.json();
        console.log("Total credits data:", totalCreditsData);
        setTotalCredits(totalCreditsData);

        const topUsersResponse = await fetch(`${process.env.NEXT_PUBLIC_SUBMISSION_API}/user/submissions/topusers`, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const topUsersData = await topUsersResponse.json();
        console.log("Top users data:", topUsersData);
        setTopUsers(topUsersData);

        const monthlySubmissionsResponse = await fetch(`${process.env.NEXT_PUBLIC_SUBMISSION_API}/user/submissions/monthly`, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const monthlySubmissionsData = await monthlySubmissionsResponse.json();
        console.log("Monthly submissions data:", monthlySubmissionsData);
        setMonthlySubmissions(monthlySubmissionsData);

        const totalSubmissionsResponse = await fetch(`${process.env.NEXT_PUBLIC_SUBMISSION_API}/user/submissions/total`, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const totalSubmissionsData = await totalSubmissionsResponse.json();
        console.log("Total submissions data:", totalSubmissionsData);
        setTotalSubmissions(totalSubmissionsData);
      } catch (error) {
        console.error("Error fetching data", error);
        setTopCredits([]);
        setTotalCredits({ totalCredits: 0 });
        setTopUsers([]);
        setMonthlySubmissions([]);
        setTotalSubmissions({ totalSubmissions: 0 });
      }
    };

    fetchData();
  }, [accessToken]);

  return (
    <main key="1" className="w-full min-h-screen bg-gray-100 dark:bg-gray-950 py-12">
      <div className="container mx-auto max-w-7xl px-4 mt-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
          <div className="fixed top-4 left-4 flex justify-between items-center bg-white dark:bg-gray-950 px-4 py-2 rounded-md shadow-md">
            <Link className="text-2xl font-bold" href="/">
              solveMyProblem
            </Link>
          </div>
            <div >
              <h1 className="text-4xl font-bold tracking-tighter">View Logs</h1>
              <p className="mt-2 text-gray-500 dark:text-gray-400 text-lg">
                Review the statistics and logs of solveMyProblem.
              </p>
            </div>
          </div>
          
        </div>
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-900 text-gray-50 p-6">
            <h2 className="text-2xl font-bold">Submission Statistics</h2>
          </div>
          <div className="p-6 grid gap-6">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold">Overall Statistics</h3>
                <div className="mt-2 grid gap-2">
                  <div className="flex justify-between">
                    <span>Total Submissions:</span>
                    <span>{totalSubmissions.totalSubmissions || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Credits Used:</span>
                    <span>{totalCredits.totalCredits || "N/A"}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold">Submission Trends</h3>
                <div className="mt-2">
                  <LineChart className="aspect-[16/9]" data={monthlySubmissions || "N/A"} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold">Top Users by Submissions</h3>
                <div className="mt-2">
                  <BarChart className="aspect-[16/9]" data={topUsers || "N/A"} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold">Top Users by Credits</h3>
                <div className="mt-2 grid gap-2">
                  {topCredits.map((user, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6 border">
                          <AvatarImage src="/placeholder-user.jpg" />
                          <AvatarFallback>{user.sub.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span>{user.sub}</span>
                      </div>
                      <span>{user.creditValue || "N/A"} credits</span>
                    </div>
                  ))}
                </div>
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
                  <p  className="text-sm text-gray-500 dark:text-gray-400 font-mono">Role: Admin</p>
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

function BarChart({ data, ...props }) {
  return (
    <div {...props}>
      <ResponsiveBar
        data={data.map(user => ({ name: user.sub, count: user.totalSubmissions }))}
        keys={["count"]}
        indexBy="name"
        margin={{ top: 0, right: 0, bottom: 40, left: 40 }}
        padding={0.3}
        colors={["#2563eb"]}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 4,
          tickPadding: 16,
        }}
        gridYValues={4}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        tooltipLabel={({ id }) => `${id}`}
        enableLabel={false}
        role="application"
        ariaLabel="A bar chart showing data"
      />
    </div>
  );
}

function LineChart({ data, ...props }) {
  return (
    <div {...props}>
      <ResponsiveLine
        data={[
          {
            id: "Submissions",
            data: data.map(sub => ({ x: sub.month, y: sub.count })),
          },
        ]}
        margin={{ top: 0, right: 0, bottom: 40, left: 40 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: false,
          reverse: false,
        }}
        enableSlices="x"
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 4,
          tickPadding: 16,
        }}
        gridYValues={4}
        enableArea={true}
        enablePoints={false}
        colors={["#2563eb"]}
        areaOpacity={0.1}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        enableCrosshair={false}
        role="application"
        ariaLabel="A line chart showing data"
      />
    </div>
  );
}

function PieChart({ data, ...props }) {
  return (
    <div {...props}>
      <ResponsivePie
        data={data.map((entry) => ({
          id: entry.submissionName,
          label: entry.submissionName,
          value: entry.submissionValue,
        }))}
        margin={{ top: 0, right: 0, bottom: 40, left: 0 }}
        innerRadius={0.7}
        padAngle={2}
        cornerRadius={4}
        activeOuterRadiusOffset={4}
        colors={["#2563eb", "#a5b4fc"]}
        borderWidth={1}
        borderColor="#ffffff"
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
        }}
        role="application"
        ariaLabel="A pie chart showing data"
      />
    </div>
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
