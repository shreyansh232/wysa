"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Moon,
  Clock,
  Sun,
  Bed,
  Trophy,
  ArrowRight,
  LogOut,
} from "lucide-react";

interface User {
  id: string;
  nickname: string;
  token: string;
}

interface AssessmentFlowProps {
  user: User;
  onLogout: () => void;
}

interface Assessment {
  id: string;
  userId: string;
  sleepStruggleDuration?: string;
  bedTime?: string;
  wakeTime?: string;
  sleepHours?: number;
  score?: number;
  status: string;
}

// Utility function to get token from localStorage
const getStoredToken = (): string | null => {
  const storedUser = localStorage.getItem("wysa_user");
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      console.log("Retrieved user from localStorage:", parsedUser);
      return parsedUser.token;
    } catch (error) {
      console.error("Error parsing stored user:", error);
      localStorage.removeItem("wysa_user");
      return null;
    }
  }
  return null;
};

// Utility function to make authenticated API calls
const makeAuthenticatedRequest = async (
  url: string,
  options: RequestInit = {},
) => {
  const token = getStoredToken();

  if (!token) {
    console.error("No authentication token found");
    throw new Error("No authentication token found");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  console.log("Making authenticated request to:", url);
  console.log("Headers:", headers);

  return fetch(url, {
    ...options,
    headers,
  });
};

export default function AssessmentFlow({
  user,
  onLogout,
}: AssessmentFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    "Sleep Struggle",
    "Bed Time",
    "Wake Time",
    "Sleep Hours",
    "Results",
  ];

  useEffect(() => {
    startAssessment();
  }, []);

  const startAssessment = async () => {
    setIsLoading(true);
    try {
      console.log("Starting assessment for user:", user.id);



      const response = await makeAuthenticatedRequest(
        "http://localhost:8088/api/assessment/start",
        {
          method: "POST",
          body: JSON.stringify({ userId: user.id }),
        },
      );

      console.log("Start assessment response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Start assessment error response:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("Start assessment response data:", data);

      if (data.success) {
        setAssessment(data.data);
      } else {
        console.error("Failed to start assessment:", data.message);
        if (response.status === 401) {
          alert("Session expired. Please login again.");
          onLogout();
        }
      }
    } catch (error: any) {
      console.error("Failed to start assessment:", error);
      if (error.message.includes("authentication")) {
        alert("Authentication error. Please login again.");
        onLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateAssessment = async (updateType: string, value: any) => {
    if (!assessment) return;

    setIsLoading(true);
    try {
      console.log("Updating assessment:", { updateType, value });



      const body: any = {
        id: assessment.id,
        updateType,
      };

      switch (updateType) {
        case "Sleep Struggle":
          body.sleepStruggleDuration = value;
          break;
        case "Bed Time":
          body.bedTime = value;
          break;
        case "Wake Time":
          body.wakeTime = value;
          break;
        case "Sleep Hours":
          body.sleepHours = value;
          break;
      }

      const response = await makeAuthenticatedRequest(
        "http://localhost:8088/api/assessment/update",
        {
          method: "PATCH",
          body: JSON.stringify(body),
        },
      );

      console.log("Update assessment response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Update assessment error response:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("Update assessment response data:", data);

      if (data.success) {
        setAssessment(data.data);
        setCurrentStep(currentStep + 1);
      } else {
        console.error("Failed to update assessment:", data.message);
        if (response.status === 401) {
          alert("Session expired. Please login again.");
          onLogout();
        }
      }
    } catch (error: any) {
      console.error("Failed to update assessment:", error);
      if (error.message.includes("authentication")) {
        alert("Authentication error. Please login again.");
        onLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const completeAssessment = async () => {
    if (!assessment) return;

    setIsLoading(true);
    try {
      console.log("Completing assessment");



      const response = await makeAuthenticatedRequest(
        "http://localhost:8088/api/assessment/complete",
        {
          method: "POST",
          body: JSON.stringify({ id: assessment.id }),
        },
      );

      console.log("Complete assessment response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Complete assessment error response:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("Complete assessment response data:", data);

      if (data.success) {
        setAssessment(data.data);
        setCurrentStep(4); // Results step
      } else {
        console.error("Failed to complete assessment:", data.message);
        if (response.status === 401) {
          alert("Session expired. Please login again.");
          onLogout();
        }
      }
    } catch (error: any) {
      console.error("Failed to complete assessment:", error);
      if (error.message.includes("authentication")) {
        alert("Authentication error. Please login again.");
        onLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <SleepStruggleStep
            onNext={(value) => updateAssessment("Sleep Struggle", value)}
            isLoading={isLoading}
          />
        );
      case 1:
        return (
          <BedTimeStep
            onNext={(value) => updateAssessment("Bed Time", value)}
            isLoading={isLoading}
          />
        );
      case 2:
        return (
          <WakeTimeStep
            onNext={(value) => updateAssessment("Wake Time", value)}
            isLoading={isLoading}
          />
        );
      case 3:
        return (
          <SleepHoursStep
            onNext={(value) => updateAssessment("Sleep Hours", value)}
            onComplete={completeAssessment}
            isLoading={isLoading}
          />
        );
      case 4:
        return (
          <ResultsStep
            assessment={assessment}
            user={user}
            onLogout={onLogout}
          />
        );
      default:
        return null;
    }
  };

  if (!assessment && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Moon className="h-12 w-12 text-indigo-600 animate-pulse mx-auto mb-4" />
          <p className="text-lg">Starting your sleep assessment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Logout button */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            Welcome, <span className="font-medium">{user.nickname}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-gray-600 hover:text-gray-800"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>

        {currentStep < 4 && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>
                Step {currentStep + 1} of {steps.length - 1}
              </span>
              <span>
                {Math.round(((currentStep + 1) / (steps.length - 1)) * 100)}%
              </span>
            </div>
            <Progress
              value={((currentStep + 1) / (steps.length - 1)) * 100}
              className="h-2"
            />
          </div>
        )}
        {renderStep()}
      </div>
    </div>
  );
}

function SleepStruggleStep({
  onNext,
  isLoading,
}: {
  onNext: (value: string) => void;
  isLoading: boolean;
}) {
  const options = [
    { value: "less_than_month", label: "Less than a month" },
    { value: "1_3_months", label: "1-3 months" },
    { value: "3_6_months", label: "3-6 months" },
    { value: "more_than_6_months", label: "More than 6 months" },
  ];

  return (
    <Card>
      <CardHeader className="text-center">
        <Moon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
        <CardTitle>How long have you been struggling with sleep?</CardTitle>
        <CardDescription>
          This helps us understand your sleep patterns better
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {options.map((option) => (
          <Button
            key={option.value}
            variant="outline"
            className="w-full justify-start h-auto p-4 text-left bg-transparent"
            onClick={() => onNext(option.value)}
            disabled={isLoading}
          >
            {option.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

function BedTimeStep({
  onNext,
  isLoading,
}: {
  onNext: (value: string) => void;
  isLoading: boolean;
}) {
  const [time, setTime] = useState("22:00");

  return (
    <Card>
      <CardHeader className="text-center">
        <Bed className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
        <CardTitle>What time do you usually go to bed?</CardTitle>
        <CardDescription>Select your typical bedtime</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="bedtime" className="text-sm font-medium">
            Bedtime
          </label>
          <input
            id="bedtime"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md text-lg text-center"
          />
        </div>
        <Button
          onClick={() => onNext(time + ":00")}
          className="w-full"
          disabled={isLoading}
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

function WakeTimeStep({
  onNext,
  isLoading,
}: {
  onNext: (value: string) => void;
  isLoading: boolean;
}) {
  const [time, setTime] = useState("07:00");

  return (
    <Card>
      <CardHeader className="text-center">
        <Sun className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <CardTitle>What time do you usually wake up?</CardTitle>
        <CardDescription>Select your typical wake-up time</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="waketime" className="text-sm font-medium">
            Wake-up time
          </label>
          <input
            id="waketime"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md text-lg text-center"
          />
        </div>
        <Button
          onClick={() => onNext(time + ":00")}
          className="w-full"
          disabled={isLoading}
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

function SleepHoursStep({
  onNext,
  onComplete,
  isLoading,
}: {
  onNext: (value: number) => void;
  onComplete: () => void;
  isLoading: boolean;
}) {
  const [hours, setHours] = useState(7);

  const handleContinue = async () => {
    await onNext(hours);
    onComplete();
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <Clock className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
        <CardTitle>How many hours of sleep do you typically get?</CardTitle>
        <CardDescription>
          Move the slider to select your average sleep duration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-4xl font-bold text-indigo-600">{hours}</span>
            <span className="text-xl text-gray-600 ml-1">hours</span>
          </div>
          <input
            type="range"
            min="3"
            max="12"
            value={hours}
            onChange={(e) => setHours(Number.parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>3h</span>
            <span>12h</span>
          </div>
        </div>
        <Button
          onClick={handleContinue}
          className="w-full"
          disabled={isLoading}
        >
          Complete Assessment <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

function ResultsStep({
  assessment,
  user,
  onLogout,
}: {
  assessment: Assessment | null;
  user: User;
  onLogout: () => void;
}) {
  if (!assessment?.score) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Moon className="h-12 w-12 text-indigo-600 animate-pulse mx-auto mb-4" />
          <p>Calculating your sleep score...</p>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return "Excellent! Your sleep habits are on track.";
    if (score >= 60) return "Good progress! There's room for improvement.";
    return "Let's work together to improve your sleep quality.";
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <CardTitle>Your Sleep Assessment Results</CardTitle>
        <CardDescription>
          Hi {user.nickname}! Here's your personalized sleep score
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <div>
          <div
            className={`text-6xl font-bold ${getScoreColor(assessment.score)}`}
          >
            {assessment.score}
          </div>
          <div className="text-gray-600 text-lg">out of 100</div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-700">{getScoreMessage(assessment.score)}</p>
        </div>

        <div className="space-y-3 text-left">
          <div className="flex justify-between">
            <span className="text-gray-600">Sleep Duration:</span>
            <span className="font-medium">{assessment.sleepHours} hours</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Bedtime:</span>
            <span className="font-medium">
              {assessment.bedTime?.slice(0, 5)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Wake Time:</span>
            <span className="font-medium">
              {assessment.wakeTime?.slice(0, 5)}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Button className="w-full" onClick={() => window.location.reload()}>
            Take Assessment Again
          </Button>
          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={onLogout}
          >
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
