"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { HeartIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

export default function TweetCard({ tweet }: { tweet: any }) {
  const { data: session } = useSession();

  const handleLike = async () => {
    await fetch("/api/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tweetId: tweet.id }),
    });
  };

  const handleRetweet = async () => {
    await fetch("/api/retweet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tweetId: tweet.id }),
    });
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this tweet?")) {
      await fetch("/api/admin/delete-tweet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tweetId: tweet.id }),
      });
    }
  };

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex space-x-3">
        <img
          src={`https://via.placeholder.com/48?text=${tweet.user.username[0]}`}
          alt="Avatar"
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-1">
            <Link href={`/profile/${tweet.user.id}`}>
              <span className="font-bold hover:underline">
                {tweet.user.username}
              </span>
            </Link>
            {tweet.user.isAdmin && (
              <svg className="w-4 h-4 text-twitter" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l8.1-8.1 1.4 1.4L9 16.2z"
                />
              </svg>
            )}
            <span className="text-gray-500 text-sm">
              {new Date(tweet.createdAt).toLocaleString()}
            </span>
          </div>
          <p className="mt-1">{tweet.content}</p>
          <div className="flex space-x-4 mt-2">
            <button
              onClick={handleLike}
              className="flex items-center space-x-1 text-gray-500 hover:text-red-500"
            >
              <HeartIcon className="w-5 h-5" />
              <span>{tweet.likes.length}</span>
            </button>
            <button
              onClick={handleRetweet}
              className="flex items-center space-x-1 text-gray-500 hover:text-green-500"
            >
              <ArrowPathIcon className="w-5 h-5" />
              <span>{tweet.retweets.length}</span>
            </button>
            {session?.user.isAdmin && (
              <button
                onClick={handleDelete}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
