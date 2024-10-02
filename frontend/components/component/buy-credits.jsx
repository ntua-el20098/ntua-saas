import { useState, useEffect } from "react";
import {
  CardTitle,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function BuyCredits({ username, email, creditNumber, image, accesstoken }) {
  const [creditsToBuy, setCreditsToBuy] = useState(100); // Initialize slider value
  const [currentCredits, setCurrentCredits] = useState(creditNumber); // State for current credits
  const [fetchError, setFetchError] = useState(false); // State to track fetch errors
  console.log(accesstoken)

  // Fetch current credits
  useEffect(() => {
    const fetchCurrentCredits = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_CREDITS_API}/user/credits`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accesstoken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch credits");
        }

        const result = await response.json();
        setCurrentCredits(result.creditValue); // Update state with fetched credits
        setFetchError(false); // Reset error state if fetch succeeds
        console.log("Current credits:", result.creditValue);
      } catch (error) {
        setFetchError(true); // Set error state if fetch fails
        console.error("Error fetching current credits:", error);
      }
    };

    fetchCurrentCredits();
  }, [accesstoken]);

  const handleSliderChange = (value) => {
    setCreditsToBuy(value[0]); // Update slider value
  };

  const handleConfirmPurchase = async () => {
    try {
      console.log("Credits sent:", creditsToBuy);
      const response = await fetch(`${process.env.NEXT_PUBLIC_CREDITS_API}/user/add/credits/${creditsToBuy}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accesstoken}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      console.log("Server response:", result);

      // Redirect to home page
      //window.location.href = "/";
      window.location.href = "/buy-credits";
    } catch (error) {
      console.error("Error during purchase:", error);
    }
  };

  return (
    <main
      key="1"
      className="flex min-h-[100dvh] flex-col items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-950"
    >
      <div className="fixed top-4 left-4 flex justify-between items-center bg-white dark:bg-gray-950 px-4 py-2 rounded-md shadow-md">
        <Link className="text-2xl font-bold" href="/">
          solveMyProblem
        </Link>
      </div>
      <div className="container mx-auto max-w-3xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Buy Credits
          </h1>
          <p className="mt-4 text-gray-500 dark:text-gray-400 md:text-xl">
            Top up your account to keep solving problems.
          </p>
        </div>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Credits</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className={`text-4xl font-bold ${currentCredits <= 0 ? 'text-red-500' : ''}`}>
                <span>{fetchError ? "N/A" : currentCredits}</span> {/* Display current credits or "N/A" */}
                <span className="ml-2 text-2xl font-normal text-gray-500 dark:text-gray-400">
                  credits
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Top Up Your Credits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Credits to buy</span>
                <span className="text-2xl font-bold">{creditsToBuy}</span> {/* Display slider value */}
              </div>
              <Slider
                aria-label="Credits to buy"
                defaultValue={[100]}
                max={500}
                min={1}
                step={1}
                onValueChange={handleSliderChange} // Call handleSliderChange on slider change
              />
              <Button
                className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                onClick={handleConfirmPurchase}
                disabled={fetchError || currentCredits === undefined} // Disable button if current credits unavailable or if fetch error
              >
                Confirm Purchase
              </Button>
            </CardContent>
          </Card>
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
                  <span>{fetchError ? "N/A" : currentCredits} credits</span>
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
