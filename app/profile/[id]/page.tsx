"use client";

export const dynamic = "force-dynamic";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import TweetCard from "@/components/TweetCard";
import Link from "next/link";

export default function Profile({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [tweets, setTweets] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`/api/user?userId=${params.id}`);
      const data = await res.json();
      setUser(data);
    };
    const fetchTweets = async () => {
      const res = await fetch(`/api/tweet?userId=${params.id}`);
      const data = await res.json();
      setTweets(data);
    };
    if (status === "authenticated") {
      fetchUser();
      fetchTweets();
    }
  }, [params.id, status]);

  const handleFollow = async () => {
    await fetch("/api/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUserId: params.id }),
    });
    const res = await fetch(`/api/user?userId=${params.id}`);
    const updatedUser = await res.json();
    setUser(updatedUser);
  };

  const handleUnfollow = async () => {
    await fetch("/api/follow", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUserId: params.id }),
    });
    const res = await fetch(`/api/user?userId=${params.id}`);
    const updatedUser = await res.json();
    setUser(updatedUser);
  };

  if (status === "loading" || !user) {
    return <div>Loading...</div>;
  }

  const isFollowing = user.followers.includes(session?.user?.id);

  return (
    <div>
      <header className="sticky top-0 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700 p-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{user.username}</h1>
      </header>
      <div className="p-4">
        {/* プロフィール情報 */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full" />
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {user.username}
              {user.isAdmin && <span className="ml-2 text-blue-500">✔</span>}
            </h2>
            <p className="text-gray-500">@{user.email.split("@")[0]}</p>
          </div>
        </div>
        <div className="mt-4 flex space-x-4">
          <Link href={`/profile/${params.id}/followers`}>
            <span className="text-gray-900 dark:text-white">
              <strong>{user.followers.length}</strong> Followers
            </span>
          </Link>
          <Link href={`/profile/${params.id}/following`}>
            <span className="text-gray-900 dark:text-white">
              <strong>{user.following.length}</strong> Following
            </span>
          </Link>
        </div>
        {session?.user?.id !== params.id && (
          <button
            onClick={isFollowing ? handleUnfollow : handleFollow}
            className={`mt-4 px-4 py-2 rounded-full ${
              isFollowing
                ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>
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
