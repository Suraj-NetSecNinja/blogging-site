import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prose — Where Ideas Find Voice",
  description: "A place for thoughtful writing and curious readers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#1C1C1A",
                color: "#FAFAF8",
                fontFamily: "var(--font-dm-sans)",
                fontSize: "0.9rem",
                borderRadius: "4px",
                padding: "12px 18px",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
