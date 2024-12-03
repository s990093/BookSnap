"use client";

import { Suspense, useState } from "react";
import { QuickActionsSection } from "./components/dashboard/QuickActionsSection";
import { RecentPostsSection } from "./components/dashboard/RecentPostsSection";
import { EventsSection } from "./components/dashboard/EventsSection";
import { Navbar } from "./components/layout/Navbar";
import Cookies from 'js-cookie'

const LoadingFallback = () => (
  <div className="h-96 bg-gray-800 rounded-lg animate-pulse" /> 
);

export default function DashboardPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Suspense fallback={<LoadingFallback />}>
            <RecentPostsSection />
          </Suspense>
        </div>

        <div className="lg:col-span-1">
          <Suspense fallback={<LoadingFallback />}>
            <QuickActionsSection />
            <EventsSection />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
