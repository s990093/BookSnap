"use client"

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/api/auth/login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: "testuser2",
            password: "password123",
        })})
        
        const data = await response.json()
        console.log(data)
        localStorage.setItem("authToken", "TEST");

      // Store the token
        Cookies.set("authToken",data.access, {
          expires: 7, // Expires in 7 days
          secure: true, // Only send over HTTPS
          sameSite: "Strict", // Prevent CSRF
        });  
        Cookies.set("authTokenRefresh",data.refresh, {
          expires: 7, // Expires in 7 days
          secure: true, // Only send over HTTPS
          sameSite: "Strict", // Prevent CSRF
        });  
      router.push("/"); // Redirect after login
    }  catch(err) {
      console.log(err)
    }
  };

  return (
    <div className="fixed h-screen w-screen">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} >
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="bg-black"
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-black"
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
LoginPage.getLayout = (page: React.ReactNode) => page;
