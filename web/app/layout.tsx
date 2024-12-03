import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { Navbar } from "./components/layout/Navbar";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import ClientWrapper from "./components/common/Clientwarpper";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Blog Dashboard",
  description: "Blog management dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-gray-900 text-white min-h-screen`}
      >
        <Providers>
          <div className="flex flex-col min-h-screen">
            <ClientWrapper>
              <main className="flex-1">{children}</main>
            </ClientWrapper>
          </div>
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
