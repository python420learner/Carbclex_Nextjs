"use client"
import { Poppins } from "next/font/google";
import "./globals.css";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ActivityTracker from "./components/activityTracker";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "700"], // Add required weights
});

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
      >
        <ActivityTracker/>
        {children}
      </body>
    </html>
  );
}