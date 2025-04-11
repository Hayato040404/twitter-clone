"use client";
import { useSession } from "next-auth/react";

export default function UserProfile({ user }: { user: any }) {
  const { data: session } = useSession();

  const handleFollow = async () => {
    await fetch("/api/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUserId: user.id }),
    });
  };

  const handleBan = async () => {
    if (
      confirm(
        `Are you sure you want to ${user.isBanned ? "unban" : "ban"} this user?`
      )
    ) {
      await fetch("/api/admin/ban-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, ban: !user.isBanned }),
      });
    }
  };

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        <img
          src={`https://via.placeholder.com/80?text=${user.username[0]}`}
          alt="Avatar"
          className="w-20 h-20 rounded-full"
        />
        <div>
          <div className="flex items-center space-x-1">
            <h1 className="text-xl font-bold">{user.username}</h1>
            {user.isAdmin && (
              <svg className="w-5 h-5 text-twitter" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l8.1-8.1 1.4 1.4L9 16.2z"
                />
              </svg>
            )}
            {user.isBanned && (
              <span className="text-red-500 text-sm">[Banned]</span>
            )}
          </div>
          <p className="text-gray-500">@{user.username}</p>
          <p className="mt-2">
            <span className="font-bold">{user.following.length}</span> Following
            <span className="ml-4 font-bold">{user.followers.length}</span>{" "}
            Followers
          </p>
        </div>
      </div>
      {session?.user.id !== user.id && (
        <div className="mt-4 flex space-x-2">
          <button
            onClick={handleFollow}
            className="bg-twitter text-white px-4 py-2 rounded-full hover:bg-blue-600"
          >
            Follow
          </button>
          {session?.user.isAdmin && (
            <button
              onClick={handleBan}
              className={`px-4 py-2 rounded-full ${
                user.isBanned ? "bg-green-500" : "bg-red-500"
              } text-white hover:opacity-80`}
            >
              {user.isBanned ? "Unban" : "Ban"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
