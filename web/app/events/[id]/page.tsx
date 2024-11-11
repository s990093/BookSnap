"use client";

import { Suspense } from "react";
import { Loading } from "@/app/components/common/Loading";
import { ErrorMessage } from "@/app/components/common/ErrorMessage";
import { useQuery } from "@tanstack/react-query";
import { getEvent } from "@/app/lib/api";
import EventForm from "@/app/components/forms/EventForm";
import EventHistory from "@/app/components/events/EventHistory";

export default function EditEventPage({ params }: { params: { id: string } }) {
  const {
    data: event,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["event", params.id],
    queryFn: () => getEvent(parseInt(params.id)),
  });

  if (isLoading) return <Loading />;
  if (isError) return <ErrorMessage message={(error as Error).message} />;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Event</h1>
      <div className="flex gap-6">
        <div className="w-4/5">
          <Suspense fallback={<Loading />}>
            <EventForm initialData={event} />
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
