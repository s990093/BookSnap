"use client";

import { Event } from "@/app/types";
import { AnimatedCard } from "@/app/components/common/AnimatedCard";
import { Loading } from "@/app/components/common/Loading";

interface EventsListProps {
  events?: Event[];
  isLoading?: boolean;
}

export function EventsList({ events = [], isLoading }: EventsListProps) {
  if (isLoading) return <Loading />;

  if (!events?.length) {
    return (
      <div className="text-gray-400 text-center p-8">No upcoming events</div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
      {events.map((event, index) => (
        <AnimatedCard key={event.id} delay={index * 0.1}>
          <h3 className="text-lg font-semibold">{event.title}</h3>
          <p className="text-gray-400 mt-2">{event.description}</p>
          <div className="mt-4 text-sm">
            <p className="flex items-center gap-2">
              <span>📍</span>
              <span>{event.location}</span>
            </p>
            <p className="flex items-center gap-2 mt-1">
              <span>📅</span>
              <span>
                {new Date(event.date).toLocaleDateString()} at{" "}
                {new Date(`1970-01-01T${event.time}`).toLocaleTimeString()}
              </span>
            </p>
          </div>
        </AnimatedCard>
      ))}
    </div>
  );
}
