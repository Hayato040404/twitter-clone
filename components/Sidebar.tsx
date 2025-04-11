"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  HomeIcon,
  BellIcon,
  EnvelopeIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  const { data: session } = useSession();

  return (
    <div className="w-64 p-4 border-r border-gray-200 dark:border-gray-700 flex flex-col sm:w-20 sm:items-center">
      <div className="mb-6">
        <svg className="w-8 h-8 text-twitter" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"
          />
        </svg>
      </div>
      <nav className="flex-1 space-y-2">
        <Link
          href="/"
          className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full sm:justify-center"
        >
          <HomeIcon className="w-6 h-6 mr-2 sm:mr-0" />
          <span className="sm:hidden">Home</span>
        </Link>
        <Link
          href="/notifications"
          className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full sm:justify-center"
        >
          <BellIcon className="w-6 h-6 mr-2 sm:mr-0" />
          <span className="sm:hidden">Notifications</span>
        </Link>
        <Link
          href="/messages"
          className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full sm:justify-center"
        >
          <EnvelopeIcon className="w-6 h-6 mr-2 sm:mr-0" />
          <span className="sm:hidden">Messages</span>
        </Link>
        <Link
          href={`/profile/${session?.user.id}`}
          className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full sm:justify-center"
        >
          <UserIcon className="w-6 h-6 mr-2 sm:mr-0" />
          <span className="sm:hidden">Profile</span>
        </Link>
      </nav>
      {session ? (
        <div className="mt-4">
          <button
            onClick={() => signOut()}
            className="w-full bg-twitter text-white py-2 rounded-full hover:bg-blue-600 sm:text-sm"
          >
            <span className="sm:hidden">Sign Out</span>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          <Link href="/auth/signin">
            <button className="w-full bg-twitter text-white py-2 rounded-full hover:bg-blue-600 sm:text-sm">
              <span className="sm:hidden">Sign In</span>
              <span className="hidden sm:inline">Login</span>
            </button>
          </Link>
          <Link href="/auth/signup">
            <button className="w-full bg-gray-200 text-black py-2 rounded-full hover:bg-gray-300 sm:text-sm">
              <span className="sm:hidden">Sign Up</span>
              <span className="hidden sm:inline">Join</span>
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
