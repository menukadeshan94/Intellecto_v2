// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Nunito } from "next/font/google";
import ContextProvider from "../../providers/ContextProvider";
import { ThemeProvider } from "../../context/themeContext";
import ClientLayout from "../../components/ClientLayout/ClientLayout";
// Remove Footer import - it's now handled in ClientLayout

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Intellecto - Test Your Knowledge",
  description: "Challenge yourself with our interactive quiz platform. Create, take, and share quizzes across various topics.",
  keywords: ["quiz", "trivia", "education", "learning", "test", "knowledge"],
  authors: [{ name: "Intellecto Web App Team" }],
  robots: "index, follow",
};

export const viewport = {
  width: "device-width",
  initialScale: 0.9,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={nunito.variable}>
      <head>
        {/* Font Awesome CDN - Consider replacing with React icons for better performance */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <ClerkProvider>
          <ThemeProvider>
            <ContextProvider>
              <ClientLayout>{children}</ClientLayout>
              {/* Footer removed from here - now handled conditionally in ClientLayout */}
            </ContextProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}