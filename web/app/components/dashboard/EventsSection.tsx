"use client";

import { useQuery } from "@tanstack/react-query";
import { eventsAPI } from "@/app/lib/api/index";
import { EventsList } from "./EventsList";
import { motion } from "framer-motion";

export function EventsSection() {
  const { data: events, isLoading } = useQuery({
    queryKey: ["events", "upcoming"],
    queryFn: () => eventsAPI.getEvents({ upcoming: true, limit: 5 }),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <EventsList events={events} isLoading={isLoading} />
    </motion.div>
  );
}
