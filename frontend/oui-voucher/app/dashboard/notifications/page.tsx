"use client";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { getToken } from "@/app/controller/auth/auth";

// Notification interface
interface Notification {
  id: number;
  message: string;
  timestamp: string;
  user: number;
}

// Loading component
const Loading: React.FC = () => (
  <div className="text-center py-20">Loading...</div>
);

// Error component
const Error: React.FC = () => (
  <div className="text-center text-red-500 py-20">
    Error fetching notifications. Please try again later.
  </div>
);

export function Page() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    fetch("https://voucher.pythonanywhere.com/voucher/get-notifications/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Token ${getToken()}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setNotifications(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
        setIsError(true);
        setIsLoading(false);
      });
  };

  const handleDeleteNotification = (id: number) => {
    fetch(
      `https://voucher.pythonanywhere.com/voucher/get-notifications/?id=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Token ${getToken()}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw Error("Network response was not ok");
        }
        toast.success("Notification deleted successfully");
        fetchNotifications(); // Refresh notifications after deletion
      })
      .catch((error) => {
        console.error("Error deleting notification:", error);
        toast.error("Failed to delete notification");
      });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <div className="bg-white text-black dark:bg-gray-900 dark:text-white p-5 font-sans">
      <h1 className="text-blue-500 dark:text-blue-300 text-center text-2xl mb-5">
        Notifications
      </h1>
      <div>
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-3 mb-3"
          >
            <p className="m-0">{notification.message}</p>
            <span className="block mt-2 text-gray-600 dark:text-gray-400">
              {format(new Date(notification.timestamp), "yyyy-MM-dd HH:mm:ss")}
            </span>
            <button
              className="mt-2 bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
              onClick={() => handleDeleteNotification(notification.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <button className="w-full py-2 mt-5 bg-blue-500 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-900 transition-colors">
        Send Notification
      </button>
    </div>
  );
}

export default Page;
