import { useSession } from "next-auth/react";
import Link from "next/link";
import { Tweet } from "@/types";

export default function TweetCard({ tweet }: { tweet: Tweet }) {
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
    await fetch(`/api/tweet?tweetId=${tweet.id}`, { method: "DELETE" });
  };

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-start space-x-3">
        <div>
          <Link href={`/profile/${tweet.user.id}`}>
            <span className="font-bold">{tweet.user.username}</span>
            {tweet.user.isAdmin && (
              <span className="ml-2 text-blue-500">✔</span>
            )}
          </Link>
          <span className="text-gray-500 text-sm ml-2">
            {new Date(tweet.createdAt).toLocaleString()}
          </span>
        </div>
      </div>
      <p className="mt-2">{tweet.content}</p>
      {tweet.image && (
        <img
          src={tweet.image}
          alt="Tweet image"
          className="mt-2 max-w-full h-auto rounded-lg"
        />
      )}
      <div className="flex space-x-4 mt-2">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1 ${
            tweet.likes.includes(session?.user?.id ?? "")
              ? "text-red-500"
              : "text-gray-500"
          }`}
        >
          <span>❤️</span>
          <span>{tweet.likes.length}</span>
        </button>
        <button
          onClick={handleRetweet}
          className={`flex items-center space-x-1 ${
            tweet.retweets.includes(session?.user?.id ?? "")
              ? "text-green-500"
              : "text-gray-500"
          }`}
        >
          <span>🔄</span>
          <span>{tweet.retweets.length}</span>
        </button>
        {(tweet.userId === session?.user?.id || session?.user?.isAdmin) && (
          <button onClick={handleDelete} className="text-red-500">
            🗑️
          </button>
        )}
      </div>
    </div>
  );
}
