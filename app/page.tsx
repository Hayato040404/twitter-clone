"use client";

export const dynamic = "force-dynamic";

import TweetCard from "@/components/TweetCard";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [tweets, setTweets] = useState([]);
  const [error, setError] = useState(null);
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

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
    fetchTweets();
  }, []);

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
      // ツイートを再取得
      const updatedTweets = await fetch("/api/tweet").then((res) => res.json());
      setTweets(updatedTweets);
    } catch (err) {
      setError("Error posting tweet");
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Home</h1>
      {session && (
        <form onSubmit={handleSubmit} className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
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
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Tweet
          </button>
        </form>
      )}
      <div>
        {tweets.length === 0 ? (
          <p>No tweets yet.</p>
        ) : (
          tweets.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))
        )}
      </div>
    </div>
  );
}
