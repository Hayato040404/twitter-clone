"use client";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import MessageChat from "@/components/MessageChat";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Messages() {
  const { data: session } = useSession();
  const { data: users } = useSWR("/api/users", fetcher);

  if (!session) {
    return <div>Please sign in to view messages.</div>;
  }

  return (
    <div className="py-6">
      <h1 className="text-xl font-bold mb-4">Messages</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1">
          <h2 className="text-lg font-semibold">Conversations</h2>
          {users?.map((user: any) => (
            <div
              key={user.id}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            >
              {user.username}
            </div>
          ))}
        </div>
        <div className="col-span-2">
          <MessageChat receiverId={users?.[0]?.id} />
        </div>
      </div>
    </div>
  );
}
