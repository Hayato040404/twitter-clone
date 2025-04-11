export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash?: string;
  isAdmin: boolean;
  isBanned?: boolean;
  followers: string[];
  following: string[];
  createdAt: Date;
}

export interface Tweet {
  id: string;
  userId: string;
  content: string;
  image?: string;
  likes: string[];
  retweets: string[];
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: "like" | "retweet" | "follow" | "dm" | "mention";
  fromUserId: string;
  tweetId?: string;
  createdAt: Date;
}
