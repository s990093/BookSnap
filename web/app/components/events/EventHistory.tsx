"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEvents, deleteEvent } from "@/app/lib/api";
import { Event } from "@/app/types";
import { AnimatedCard } from "@/app/components/common/AnimatedCard";
import { Loading } from "@/app/components/common/Loading";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function EventHistory() {
  const queryClient = useQueryClient();

  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["events", "history"],
    queryFn: () => getEvents({ limit: 10 }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete event: " + (error as Error).message);
    },
  });

  const handleDelete = async (e: React.MouseEvent, eventId: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteMutation.mutateAsync(eventId);
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Recent Events</h2>
        <Link
          href="/events/create"
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center gap-2"
        >
          <FaCalendarAlt />
          New Event
        </Link>
      </div>

      <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {events?.map((event, index) => (
          <Link href={`/events/${event.id}`} key={event.id}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative group p-3"
            >
              <AnimatedCard delay={index * 0.1}>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold truncate flex-1">
                      {event.title}
                    </h3>
                    <div className="flex gap-2">
                      <Link
                        href={`/events/${event.id}`}
                        className="text-blue-500 hover:text-blue-600 p-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FaEdit size={16} />
                      </Link>
                      <button
                        onClick={(e) => handleDelete(e, event.id)}
                        className="text-red-500 hover:text-red-600 p-1"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-400 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="text-xs text-gray-500 space-y-1">
                    <p className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-blue-500" />
                      <span>{event.location}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <FaCalendarAlt className="text-green-500" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <FaClock className="text-yellow-500" />
                      <span>
                        {new Date(
                          `1970-01-01T${event.time}`
                        ).toLocaleTimeString()}
                      </span>
                    </p>
                  </div>
                </div>
              </AnimatedCard>
            </motion.div>
          </Link>
        ))}

        {events?.length === 0 && (
          <div className="text-center text-gray-500 py-8">No events found</div>
        )}
      </div>
    </div>
  );
}
