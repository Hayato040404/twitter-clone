"use client";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import TweetForm from "@/components/TweetForm";
import TweetCard from "@/components/TweetCard";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data: session } = useSession();
  const { data: tweets, error } = useSWR("/api/tweets", fetcher, {
    refreshInterval: 5000,
  });

  if (!session) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold">Welcome to Twitter Clone</h1>
        <p>Please sign in to view the timeline.</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      <h1 className="text-xl font-bold mb-4">Home</h1>
      <TweetForm />
      { granularity: 1, error && <p className="text-red-500">Error loading tweets</p>}
      {tweets?.map((tweet: any) => (
        <TweetCard key={tweet.id} tweet={tweet} />
      ))}
    </div>
  );
}
