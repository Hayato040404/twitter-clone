"use client";
import TweetForm from "@/components/TweetForm";
import TweetCard from "@/components/TweetCard";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function HomePage() {
  const { data: tweets, error } = useSWR("/api/tweets", fetcher, {
    refreshInterval: 1000, // 1秒ごとに更新（granularity の代わり）
  });

  return (
    <div className="py-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Home</h1>
      <TweetForm />
      {error && <p className="text-red-500">Error loading tweets</p>}
      {tweets?.map((tweet: any) => (
        <TweetCard key={tweet.id} tweet={tweet} />
      ))}
    </div>
  );
}
