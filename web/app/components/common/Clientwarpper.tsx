"use client"; // Client Component

import { usePathname } from "next/navigation";
import { Navbar } from "../layout/Navbar";
export default function ClientWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    if (pathname.startsWith("/auth/login")) {
        return <>{children}</>; // Render without layout
    }

    return (
        <>
            <Navbar/>
            {children}
        </>
    );
}