import { Ban } from "lucide-react";
import React from "react";

export default function NotFound() {
  return (
    <section className="grid place-items-center min-h-screen">
      <div className="flex flex-col items-center">
        <div className="text-9xl font-bold items-center text-destructive">404</div>
        <div className="flex items-center gap-4 mt-4">
          <Ban className="w-4 h-4 text-destructive" />
          <p className="text-destructive">Not Found</p>
        </div>
      </div>
    </section>
  );
}
