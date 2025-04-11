export default function NotificationItem({ notification }: { notification: any }) {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      {notification.type === "like" && (
        <p>
          <span className="font-bold">{notification.fromUser.username}</span>{" "}
          liked your tweet
        </p>
      )}
      {notification.type === "retweet" && (
        <p>
          <span className="font-bold">{notification.fromUser.username}</span>{" "}
          retweeted your tweet
        </p>
      )}
      {notification.type === "follow" && (
        <p>
          <span className="font-bold">{notification.fromUser.username}</span>{" "}
          followed you
        </p>
      )}
      {notification.type === "dm" && (
        <p>
          New message from{" "}
          <span className="font-bold">{notification.fromUser.username}</span>
        </p>
      )}
      {notification.type === "mention" && (
        <p>
          <span className="font-bold">{notification.fromUser.username}</span>{" "}
          mentioned you
        </p>
      )}
      <span className="text-gray-500 text-sm">
        {new Date(notification.createdAt).toLocaleString()}
      </span>
    </div>
  );
}
