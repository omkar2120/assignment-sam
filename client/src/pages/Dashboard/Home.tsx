
import { useAuth } from "../../context/AuthContext";
import PageMeta from "../../components/common/PageMeta";
import { useState, useEffect } from "react";
import axios from "axios";
import { connectSocket, getSocket } from "../../utils/socket";
import toast from "react-hot-toast";

interface Notification {
  _id: string;
  message: string;
  priority: string;
  createdAt?: string;
}

export default function Home() {
  const { user, token } = useAuth();

  const [message, setMessage] = useState<string>("");
  const [priority, setPriority] = useState<string>("normal");
  const [notifications, setNotifications] = useState<Notification[]>([]);


  useEffect(() => {
    if (!user || !user?.id) {
      console.warn("⛔ user._id not available yet");
      return;
    }
  
    console.log("🟢 Connecting with userId:", user.id);
  
    let active = true;
  
    connectSocket(user?.id)
      .then((socket) => {
        if (!active) return;
  
        console.log("Socket initialized");
  
        socket.off("new_notification");
        socket.on("new_notification", (notification) => {
          console.log("Notification received:", notification);
          setNotifications((prev) => {
            const updated = [notification, ...prev];
            return updated.slice(0, 5); 
          });
  
          toast(`${notification.priority === "high" ? "High Priority" : "Notification"}: ${notification.message}`, {
            duration: 5000,
            style: {
              background: notification.priority === "high" ? "#dc2626" : "#2563eb",
              color: "#fff",
            },
          });
        });
      })
      .catch((err) => {
        console.error("❌ Socket failed to connect:", err);
      });
  
    return () => {
      active = false;
      const s = getSocket();
      if (s) s.off("new_notification");
    };
  }, [user?._id]);
  
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotifications(res.data);
      } catch (error) {
        console.error("❌ Error fetching notifications:", error);
      }
    };

    if (user?.role === "User") {
      fetchNotifications();
    }
  }, [user?.role, token]);

  // ✅ Create Notification Handler (Manager)
  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/notifications",
        { message, priority },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("✅ Notification sent!");
      setMessage("");
      setPriority("normal");
    } catch (err) {
      console.error("❌ Error creating notification:", err);
      toast.error("Failed to send notification");
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const sorted = res.data
          .sort((a: Notification, b: Notification) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
          .slice(0, 5); // ✅ Keep only the latest 5
        setNotifications(sorted);
      } catch (error) {
        console.error("❌ Error fetching notifications:", error);
      }
    };

    if (user?.role === "User") {
      fetchNotifications();
    }
  }, [user?.role, token]);

  return (
    <>
      <PageMeta
        title="Dashboard | TailAdmin"
        description="Welcome to your dashboard"
      />
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome, {user?.name || "Guest"} 👋
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-300">
          This is your dashboard. Here you can manage users, notifications, and
          system settings.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {/* Role Card */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
              Your Role
            </h2>
            <p className="text-gray-600 dark:text-gray-300">{user?.role}</p>
          </div>

          {/* Create Notification Form for Managers */}
          {user?.role === "Manager" && (
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
                Create Notification
              </h2>
              <form className="mt-2" onSubmit={handleCreateNotification}>
                <input
                  type="text"
                  placeholder="Notification message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full px-3 py-2 mb-2 border rounded"
                />
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 mb-2 border rounded"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Send Notification
                </button>
              </form>
            </div>
          )}

          {/* Notifications for Users */}
          {user?.role === "User" && (
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow col-span-full">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
                Notifications
              </h2>
              {notifications.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  No new notifications.
                </p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {notifications.map((n) => (
                    <li
                      key={n._id}
                      className={`p-3 rounded ${
                        n.priority === "high"
                          ? "bg-red-100 dark:bg-red-700"
                          : "bg-gray-100 dark:bg-gray-700"
                      }`}
                    >
                      <p className="text-gray-800 dark:text-white">
                        {n.message}{" "}
                        <span className="text-sm text-gray-500">
                          ({n.priority})
                        </span>
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
