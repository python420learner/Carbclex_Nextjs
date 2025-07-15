'use client'
import { Suspense } from "react";
import ProjectDetailClient from "../../components/projectDetailClient";

export default function page() {
  console.log("i am working in the project Description")
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <ProjectDetailClient/>
    </Suspense>
  );
}