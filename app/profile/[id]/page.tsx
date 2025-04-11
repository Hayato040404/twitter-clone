"use client";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import TweetCard from "@/components/TweetCard";
import UserProfile from "@/components/UserProfile";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Profile({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const { data: user } = useSWR(`/api/users/${params.id}`, fetcher);
  const { data: tweets } = useSWR(`/api/users/${params.id}/tweets`, fetcher);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="py-6">
      <UserProfile user={user} />
      <h2 className="text-lg font-semibold mt-6">Tweets</h2>
      {tweets?.map((tweet: any) => (
        <TweetCard key={tweet.id} tweet={tweet} />
      ))}
    </div>
  );
}
