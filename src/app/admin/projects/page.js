import { Suspense } from "react";
import ProjectDetailClient from "@/app/components/projectDetailClient";

export default function ProjectDetailsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <ProjectDetailClient />
    </Suspense>
  );
}
