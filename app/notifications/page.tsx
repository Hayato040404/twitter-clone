"use client";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import NotificationItem from "@/components/NotificationItem";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Notifications() {
  const { data: session } = useSession();
  const { data: notifications } = useSWR(
    session ? "/api/notification" : null,
    fetcher
  );

  if (!session) {
    return <div>Please sign in to view notifications.</div>;
  }

  return (
    <div className="py-6">
      <h1 className="text-xl font-bold mb-4">Notifications</h1>
      {notifications?.map((n: any) => (
        <NotificationItem key={n.id} notification={n} />
      ))}
    </div>
  );
}
