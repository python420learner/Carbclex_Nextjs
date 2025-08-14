"use client"
import { useEffect } from "react";
import { app } from '../firebase';
import { getAuth, signOut } from "firebase/auth";

export default function SessionChecker() {
  useEffect(() => {
    const auth = getAuth(app);
    let intervalId;

    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/check-session", {
          credentials: "include", // If your backend uses cookies for sessions
        });

        if (res.status === 401) {
          // Session expired, sign out Firebase user if logged in
          if (auth.currentUser) {
            await signOut(auth);
            alert("Your session expired. You have been logged out.");
          }
        }
        // If 200 OK or other codes, assume session active or user not logged in, do nothing
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };

    // Check immediately and then every 2 minutes (120000 ms)
    checkSession();
    intervalId = setInterval(checkSession, 120000);

    return () => clearInterval(intervalId);
  }, []);
}
