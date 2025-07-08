"use client";

import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import AuthScreen from "@/components/auth-screen";
import AssessmentFlow from "@/components/assessment-flow";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [user, setUser] = useState<{
    id: string;
    nickname: string;
    token: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check localStorage for existing token on app load
  useEffect(() => {
    const checkStoredUser = () => {
      const storedUser = localStorage.getItem("wysa_user");
      console.log("Checking localStorage for stored user:", storedUser);
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log("Found stored user:", parsedUser);
          
          // Validate the user object has required properties
          if (parsedUser.id && parsedUser.nickname && parsedUser.token) {
            setUser(parsedUser);
          } else {
            console.error("Invalid user data in localStorage:", parsedUser);
            localStorage.removeItem("wysa_user");
          }
        } catch (error) {
          console.error("Error parsing stored user:", error);
          localStorage.removeItem("wysa_user");
        }
      }
      setIsLoading(false);
    };

    checkStoredUser();
  }, []);

  const handleAuth = (userData: {
    id: string;
    nickname: string;
    token: string;
  }) => {
    console.log("Storing user in localStorage:", userData);
    
    // Validate user data before storing
    if (!userData.id || !userData.nickname || !userData.token) {
      console.error("Invalid user data received:", userData);
      return;
    }

    try {
      localStorage.setItem("wysa_user", JSON.stringify(userData));
      setUser(userData);
      console.log("User successfully stored and state updated");
    } catch (error) {
      console.error("Error storing user in localStorage:", error);
    }
  };

  const handleLogout = () => {
    console.log("Logging out user");
    localStorage.removeItem("wysa_user");
    setUser(null);
  };

  if (isLoading) {
    return (
      <main
        className={`min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 ${inter.className} flex items-center justify-center`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main
      className={`min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 ${inter.className}`}
    >
      {!user ? (
        <AuthScreen onAuth={handleAuth} />
      ) : (
        <AssessmentFlow user={user} onLogout={handleLogout} />
      )}
    </main>
  );
}
