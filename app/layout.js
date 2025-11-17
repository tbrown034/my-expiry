import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata = {
  title: "My Expiry",
  description: "Smart grocery management to reduce food waste",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className="font-sans antialiased min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-emerald-50 to-green-100"
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
