import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/context/ToastContext";
import { cookies } from "next/headers";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Phenom - Intelligence Suite",
  description: "Aplikasi cerdas untuk menganalisis data statistik dengan fenomena internet terbaru di berbagai sektor",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  }
};

import { Lexend } from "next/font/google";
import MainLayout from "@/components/MainLayout";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-lexend",
});

import { LoadingProvider } from "@/context/LoadingContext";
import GlobalLoading from "@/components/GlobalLoading";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const session = cookieStore.get('user_session');
  const user = session ? JSON.parse(session.value) : null;

  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${lexend.className} min-h-screen bg-[#f8faf9] text-slate-800 antialiased`}>
        <LoadingProvider>
          <GlobalLoading />
          <ToastProvider>
            <MainLayout user={user}>
              {children}
            </MainLayout>
          </ToastProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
