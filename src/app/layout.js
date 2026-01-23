import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { GlobalProvider } from "@/context/GlobalContext";
import GlobalHeader from "@/components/GlobalHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "WeatherWise",
  description: "Advanced DevOps Assignment",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-slate-800`}>
        <Toaster position="top-center" />
        <GlobalProvider>
          <GlobalHeader />
          <main>
            {children}
          </main>
        </GlobalProvider>
      </body>
    </html>
  );
}