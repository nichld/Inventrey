import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeSelector } from "@/components/theme-selector"; // Assuming this component exists or will be created
import { Toaster } from "@/components/ui/toaster"


// Define local fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Define metadata for the layout
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

// Root layout component

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full w-full">
      <Toaster />
        <SidebarProvider>
          <div className="flex h-full w-full"> {/* Full width and height for the container */}
            {/* Sidebar */}
            <AppSidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col w-full h-full"> {/* Ensure this div takes the full width */}
              <header className="sticky top-0 z-50 flex h-16 shrink-0 justify-between items-center gap-2 border-b px-4 bg-sidebar">
                {/* Sidebar Trigger */}
                <SidebarTrigger />

                {/* Theme Selector */}
                <ThemeSelector />
              </header>

              <main className="flex-1 p-4 w-full h-full"> {/* Ensure full width here */}
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}