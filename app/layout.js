import { Syne, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "react-hot-toast";
import AuthListener from "@/components/auth-listener";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "wezgo | Premium Trip Planner",
  description: "Organize your next adventure with friends in a high-speed glassmorphism experience with wezgo.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${syne.variable} ${plusJakartaSans.variable} font-body antialiased min-h-screen flex flex-col`}>
        <AuthListener />
        <Toaster position="bottom-right" />
        <Navbar />
        <main className="flex-grow pt-24">
          {children}
        </main>
        <Footer />
        <div className="noise-overlay" />
      </body>
    </html>
  );
}