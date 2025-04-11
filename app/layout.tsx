import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Twitter Clone",
  description: "A Twitter clone built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen flex">
        <SessionProvider>
          <Sidebar />
          <main className="flex-1 container">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
