import type { Metadata, Viewport } from "next";
import { Outfit, Russo_One } from "next/font/google";
import "./globals.css";

import MyContextProvider from "@/lib/MyContextProvider";
import SessionProviderForNextAuth from "@/nextAuth/SessionProviderForNextAuth";
import ReduxStoreProvider from "@/redux/ReduxStoreProvider";
import { Toaster } from "sonner";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "800"],
  variable: "--font-outfit",
  display: "swap",
});
// Stand-in for Sakana (not on Google Fonts). To use Sakana: swap for next/font/local and set variable "--font-sakana".
const russo = Russo_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sakana",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nitro Energy Drink — Zero sugar, high intensity",
  description:
    "Nitro zero-sugar energy drink. Five high-intensity flavours, made since 2002.",
};
export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${russo.variable}`}>
      <body
        suppressHydrationWarning={true}
      >
        <MyContextProvider>
          <SessionProviderForNextAuth>
            <ReduxStoreProvider>
              <Toaster />
              {children}
            </ReduxStoreProvider>
          </SessionProviderForNextAuth>
        </MyContextProvider>
      </body>
    </html>
  );
}
