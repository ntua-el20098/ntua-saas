import Link from "next/link";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select";
import { DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion"; 
import { useEffect } from "react";

export function NewSubmission({ username, email, creditNumber, image, accesstoken }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    solverModel: "",
    jsonFile: null,
    isJsonFileValid: false,
    vehicleNumber: "",
    startingLocation: "",
    maxDistance: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track form submission
  const [submissionError, setSubmissionError] = useState(null); // State to track submission error

  const handleSolverModelChange = (value) => {
    setFormData({
      ...formData,
      solverModel: value
    });
  };

  const handleJsonFileChange = (e) => {
    const file = e.target.files[0];
    const isValidJsonFile = file && file.name.endsWith(".json");

    setFormData({
      ...formData,
      jsonFile: file,
      isJsonFileValid: isValidJsonFile
    });
  };

  const handleVehicleNumberChange = (e) => {
    setFormData({
      ...formData,
      vehicleNumber: e.target.value
    });
  };

  const handleStartingLocationChange = (e) => {
    setFormData({
      ...formData,
      startingLocation: e.target.value
    });
  };

  const handleMaxDistanceChange = (e) => {
    setFormData({
      ...formData,
      maxDistance: e.target.value
    });
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const [currentCredits, setCurrentCredits] = useState(creditNumber);
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

        const result = await response.json();
        setCurrentCredits(result.creditValue);
      } catch (error) {
        console.error("Error fetching current credits:", error);
      }
    };

    fetchCurrentCredits();
  }, [accesstoken]);

  const submitForm = async () => {
    setIsSubmitting(true); // Start form submission
    setSubmissionError(null); // Reset any previous submission error

    const formDataToSend = new FormData();
    formDataToSend.append("solver_name", formData.solverModel);
    formDataToSend.append("file", formData.jsonFile);
    formDataToSend.append("v_number", formData.vehicleNumber);
    formDataToSend.append("depot", formData.startingLocation);
    formDataToSend.append("max_dist", formData.maxDistance);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_UPLOADING_API}/upload/file`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accesstoken}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        console.log("Submission successful!");
        window.location.href = "/";
      } else {
        console.error("Submission failed!");
        setSubmissionError("Submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionError("Error submitting form. Please try again.");
    } finally {
      setIsSubmitting(false); // End form submission
    }
  };

  const nextVariants1 = {
    initial: { opacity: 0, y: step === 1 ? 50 : 100 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -100 },
  };

  const nextVariants = {
    initial: { opacity: 0, y: step === 1 ? -50 : 100 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -100 },
  };

  const backVariants = {
    initial: { opacity: 0, y: step === 3 ? 50 : -100 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: step === 3 ? -50 : 0 },
  };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-950">
      <div className="fixed top-4 left-4 flex justify-between items-center bg-white dark:bg-gray-950 px-4 py-2 rounded-md shadow-md">
        <Link className="text-2xl font-bold" href="/">
          solveMyProblem
        </Link>
      </div>
      <div className="space-y-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={nextVariants1}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Select Solver Model</h1>
                <p className="mt-4 mb-4 text-gray-500 dark:text-gray-400 md:text-xl">
                  Choose the solver model you would like to use.
                </p>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="solver-model">Solver Model</Label>
                  <Select id="solver-model" onValueChange={handleSolverModelChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select solver model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vrpSolver">VRP Solver</SelectItem>
                      <SelectItem value="model-b">Model B</SelectItem>
                      <SelectItem value="model-c">Model C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={handleNextStep} disabled={!formData.solverModel}>
                  Next
                </Button>
              </div>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="step2"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={step === 2 ? nextVariants : backVariants}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Fill Parameters</h1>
                <p className="mt-4 mb-4 text-gray-500 dark:text-gray-400 md:text-xl">
                  Enter the required parameters for your submission.
                </p>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="json-file">JSON File</Label>
                    <Input id="json-file" type="file" onChange={handleJsonFileChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicle-number">Vehicle Number</Label>
                    <Input id="vehicle-number" type="number" value={formData.vehicleNumber} onChange={handleVehicleNumberChange} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="starting-location">Starting Location</Label>
                    <Input id="starting-location" type="number" value={formData.startingLocation} onChange={handleStartingLocationChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-distance">Maximum Distance Per Vehicle</Label>
                    <Input id="max-distance" type="number" value={formData.maxDistance} onChange={handleMaxDistanceChange} />
                  </div>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <Button onClick={handlePreviousStep} variants={backVariants}>Back</Button>
                  <Button 
                    className="w-full" 
                    onClick={handleNextStep} 
                    disabled={!formData.isJsonFileValid || !formData.vehicleNumber || !formData.startingLocation || !formData.maxDistance}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div
              key="step3"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={nextVariants}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Submit Submission</h1>
                <p className="mt-4 mb-4 text-gray-500 dark:text-gray-400 md:text-xl">
                  Review your submission and click submit.
                </p>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Solver Model:</p>
                    <p className="font-medium">{formData.solverModel}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">JSON File:</p>
                    <p className="font-medium">{formData.jsonFile ? formData.jsonFile.name : ''}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Vehicle Number: </p>
                    <p className="font-medium">{formData.vehicleNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Starting Location:</p>
                    <p className="font-medium">{formData.startingLocation}</p>
                  </div>
                  <div>
                    <p className={`text-gray-500 dark:text-gray-400 ${currentCredits <= 0 ? 'text-red-500' : ''}`}>Maximum Distance:</p>
                    <p className="font-medium">{formData.maxDistance}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4"></div>
              </div>
              <div className="flex justify-between items-center gap-4">
                <Button onClick={handlePreviousStep} variants={backVariants}>Back</Button>
                <div className={`flex items-center bg-gray-100 px-4 py-2 rounded-md dark:bg-gray-800 ${currentCredits <= 0 ? 'text-red-500' : ''}`}>
                  <span className="text-gray-500 dark:text-gray-400 mr-4">Credits:</span>
                  <span className="font-medium">{currentCredits}</span>
                </div>
                <Button 
                  className="w-full" 
                  onClick={submitForm} 
                  type="button" 
                  disabled={isSubmitting || submissionError || currentCredits <= 0}
                  title={currentCredits <= 0 ? "Add more credits to submit" : ""}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
                {submissionError && (
                  <p className="text-red-500 dark:text-red-400 text-sm">{submissionError}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
                  <span>{currentCredits} credits</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}> Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
