import { Suspense } from "react";
import AuthHome from "@/components/AuthHome";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <AuthHome />
      </Suspense>
    </div>
  );
}
