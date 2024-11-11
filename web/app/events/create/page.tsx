"use client";

import { Suspense } from "react";
import { Loading } from "@/app/components/common/Loading";
import EventForm from "@/app/components/forms/EventForm";
import EventHistory from "@/app/components/events/EventHistory";

export default function CreateEventPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Event</h1>
      <div className="flex gap-6">
        <div className="w-4/5">
          <Suspense fallback={<Loading />}>
            <EventForm />
          </Suspense>
        </div>
        <div className="w-1/5">
          <Suspense fallback={<Loading />}>
            <EventHistory />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
