"use client";

export const dynamic = "force-dynamic";

import TweetCard from "@/components/TweetCard";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const [tweets, setTweets] = useState([]);
  const [error, setError] = useState(null);
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const router = useRouter();

  // 未ログイン時にリダイレクト
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // ツイート取得
  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const res = await fetch("/api/tweet");
        if (!res.ok) {
          throw new Error("Failed to fetch tweets");
        }
        const data = await res.json();
        setTweets(data);
      } catch (err) {
        setError("Error loading tweets");
      }
    };
    if (status === "authenticated") {
      fetchTweets();
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/tweet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, image }),
      });
      if (!res.ok) {
        throw new Error("Failed to post tweet");
      }
      setContent("");
      setImage("");
      const updatedTweets = await fetch("/api/tweet").then((res) => res.json());
      setTweets(updatedTweets);
    } catch (err) {
      setError("Error posting tweet");
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {/* ヘッダー */}
      <header className="sticky top-0 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700 p-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Home</h1>
      </header>
      {/* ツイート投稿欄 */}
      {session && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening?"
              className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 resize-none"
              rows={3}
            />
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Image URL (optional)"
              className="w-full p-2 border rounded mt-2 dark:bg-gray-800 dark:border-gray-700"
            />
            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-full"
            >
              Tweet
            </button>
          </form>
        </div>
      )}
      {/* ツイート一覧 */}
      <div>
        {tweets.length === 0 ? (
          <p className="p-4 text-gray-500">No tweets yet.</p>
        ) : (
          tweets.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))
        )}
      </div>
    </div>
  );
}
