import { Ban } from "lucide-react";
import React from "react";

export default function NotFound() {
  return (
    <section className="grid place-items-center">
      <div className="flex flex-col items-center">
        <div className="text-9xl font-bold items-center">404</div>
        <div className="flex items-center gap-4 mt-4">
          <p>Not Found</p>
          <Ban className="w-6 h-6" />
        </div>
      </div>
    </section>
  );
}
