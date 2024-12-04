import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { Navbar } from "./components/layout/Navbar";
import { Toaster } from "react-hot-toast";
import { headers } from "next/headers";
import { AuthProvider } from "./contexts/AuthContext";
import "./globals.css";

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
  const headersList = headers();
  const currentUrl = headersList.get("x-url") || "";
  const isLoginPage = currentUrl.includes("/login");
  console.log(isLoginPage);

  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-gray-900 text-white min-h-screen`}
      >
        <AuthProvider>
          <Providers>
            <div className="flex flex-col min-h-screen">
              {!isLoginPage && <Navbar />}
              <main className="flex-1">{children}</main>
            </div>
            <Toaster position="top-right" />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
