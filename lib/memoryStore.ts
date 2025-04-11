import { User, Tweet, Message, Notification } from "@/types";
import { hash } from "bcrypt";

// 管理者アカウントを初期化
const initializeStore = () => {
  const store = {
    users: new Map<string, User>(),
    tweets: new Map<string, Tweet>(),
    messages: new Map<string, Message>(),
    notifications: new Map<string, Notification>(),
  };

  // 管理者アカウント (Hal) を追加
  hash("hayato0429", 10).then((passwordHash) => {
    store.users.set("admin-hal", {
      id: "admin-hal",
      username: "Hal",
      email: "hal@example.com",
      passwordHash,
      isAdmin: true,
      isBanned: false,
      followers: [],
      following: [],
      createdAt: new Date(),
    });
  });

  return store;
};

export const memoryStore = initializeStore();
