"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Moon, Loader2 } from "lucide-react";

interface AuthScreenProps {
  onAuth: (user: { id: string; nickname: string; token: string }) => void;
}

export default function AuthScreen({ onAuth }: AuthScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async (
    endpoint: string,
    nickname: string,
    password: string,
  ) => {
    setIsLoading(true);
    setError("");

    try {
      console.log(`Attempting ${endpoint} with:`, { nickname });

      const response = await fetch(
        `http://localhost:8088/api/auth/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nickname, password }),
        },
      );

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok && data.user && data.token) {
        console.log("Auth successful, storing token and calling onAuth");
        // Combine user data with token as expected by the frontend
        const userData = {
          id: data.user.id,
          nickname: data.user.nickname,
          token: data.token
        };
        onAuth(userData);
      } else {
        setError(data.message || "Authentication failed");
      }
    } catch (err) {
      console.error("Network error:", err);
      setError(
        "Network error. Please check if your backend is running on localhost:8088",
      );
    } finally {
      setIsLoading(false);
    }
  };



  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    isLogin: boolean,
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nickname = formData.get("nickname") as string;
    const password = formData.get("password") as string;

    if (!nickname || !password) {
      setError("Please fill in all fields");
      return;
    }

    handleAuth(isLogin ? "login" : "signup", nickname, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Moon className="h-12 w-12 text-indigo-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Wysa Sleep</CardTitle>
          <CardDescription>
            Your journey to better sleep starts here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form
                onSubmit={(e) => handleSubmit(e, true)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label
                    htmlFor="login-nickname"
                    className="text-sm font-medium"
                  >
                    Nickname
                  </label>
                  <Input
                    id="login-nickname"
                    name="nickname"
                    type="text"
                    placeholder="Enter your nickname"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="login-password"
                    className="text-sm font-medium"
                  >
                    Password
                  </label>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    {error}
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form
                onSubmit={(e) => handleSubmit(e, false)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label
                    htmlFor="signup-nickname"
                    className="text-sm font-medium"
                  >
                    Nickname
                  </label>
                  <Input
                    id="signup-nickname"
                    name="nickname"
                    type="text"
                    placeholder="Choose a nickname"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="signup-password"
                    className="text-sm font-medium"
                  >
                    Password
                  </label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    required
                  />
                </div>
                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    {error}
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
