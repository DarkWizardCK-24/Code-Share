import { Montserrat, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/AuthContext";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400"],
  display: "swap",
});

export const metadata = {
  title: "CodeShare — Instant Code Sharing for Developers",
  description:
    "Paste your code, pick a language, and get a shareable link instantly. Real syntax highlighting and file downloads.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%231F6FEB'/><path d='M30 35L15 50L30 65' stroke='white' stroke-width='8' stroke-linecap='round' stroke-linejoin='round' fill='none'/><path d='M70 35L85 50L70 65' stroke='white' stroke-width='8' stroke-linecap='round' stroke-linejoin='round' fill='none'/><path d='M58 25L42 75' stroke='rgba(255,255,255,0.6)' stroke-width='7' stroke-linecap='round'/></svg>",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${jetbrains.variable}`}>
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <AuthProvider>
          <Navbar />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
