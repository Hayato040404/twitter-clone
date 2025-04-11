import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import Sidebar from "@/components/Sidebar";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Twitter Clone",
  description: "A Twitter clone built with Next.js",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionWrapper>
          <div className="flex min-h-screen bg-gray-100 dark:bg-black">
            {/* サイドバー */}
            <Sidebar />
            {/* メインコンテンツ */}
            <main className="flex-1 max-w-2xl mx-auto border-x border-gray-200 dark:border-gray-700">
              {children}
            </main>
            {/* 右サイドバー（フォロー候補など） */}
            <aside className="hidden lg:block w-80 p-4">
              <div className="sticky top-4">
                <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                  Who to follow
                </h2>
                {/* フォロー候補は後で実装 */}
              </div>
            </aside>
          </div>
        </SessionWrapper>
      </body>
    </html>
  );
}
