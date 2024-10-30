import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/nav";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Providers } from "@/providers";

const inter = Poppins({ weight: ["500", "600", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DecidingTIme",
  description: "The home to any and all polling questions.",
  openGraph: {
    images: [
      {
        url: "https://www.decidingtime.io/questions?setId=66b256a9a9f910ec375fb66c", // Replace with your image URL
        width: 1200, // Optional: specify width
        height: 630, // Optional: specify height
        alt: "Description of image", // Optional: provide alt text
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body
          className={cn(
            " flex flex-col gap-4 bg-gradient h-full",
            inter.className
          )}
        >
          <Providers>
            <Navbar session={session} />
            <Toaster position="top-center" />
            <main className=" flex-1 flex flex-col items-center justify-center ">
              {children}
            </main>
          </Providers>
          <div className="mt-[6rem] sm:mt-[7rem]">
            <Footer />
          </div>
        </body>
      </SessionProvider>
    </html>
  );
}
