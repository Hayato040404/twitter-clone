"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function TweetForm() {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    const res = await fetch("/api/tweet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (res.ok) {
      setContent("");
    } else {
      setError("Failed to post tweet");
    }
  };

  if (!session) return null;

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening?"
        className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring focus:ring-twitter resize-none"
        maxLength={280}
      />
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm text-gray-500">{content.length}/280</span>
        <button
          type="submit"
          className="bg-twitter text-white px-4 py-2 rounded-full hover:bg-blue-600 disabled:bg-gray-400"
          disabled={!content}
        >
          Tweet
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}
