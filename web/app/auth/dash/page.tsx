"use client"

import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        window.location.href = "/auth/login"; // Redirect if not logged in
        return;
      }

      try {
        const response = await axios.get("http://localhost:8000/api/auth/user/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        console.log(response)
      } catch (err) {
        localStorage.removeItem("authToken");
        
      }
    };

    fetchUser();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
    </div>
  );
}
