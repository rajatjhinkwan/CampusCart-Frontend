import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar.jsx";
import NotificationsTabs from "./components/NotificationsTabs.jsx";
import NotificationsList from "./components/NotificationsList.jsx";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const accessToken = localStorage.getItem("accessToken");

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      console.log("Fetched notifications:", res.data);
      setNotifications(res.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (

    <>
    <Navbar/>
      <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: '10px', paddingTop: '100px', alignItems: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <NotificationsTabs notifications={notifications} />
        </div>
        <div style={{ width: "70vw" }}>
          <NotificationsList notifications={notifications} />
        </div>
      </div>
    </>
  );
}
