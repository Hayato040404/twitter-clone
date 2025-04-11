export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash?: string;
  isAdmin: boolean;
  isBanned: boolean;
  followers: string[];
  following: string[];
  createdAt: Date;
}

export interface Tweet {
  id: string;
  userId: string;
  user: User;
  content: string;
  image?: string; // image プロパティを追加（オプショナル）
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
  type: string;
  fromUser: User;
  createdAt: Date;
}
