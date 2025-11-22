import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Inter, Caveat } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "My Expiry",
  description: "Smart grocery management to reduce food waste",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${caveat.variable} font-sans antialiased h-screen flex flex-col bg-slate-900 overflow-hidden`}
      >
        <Header />
        <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
