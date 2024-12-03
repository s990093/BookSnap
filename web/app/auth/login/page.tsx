"use client"

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import Link from "next/link";
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
    <div className="fixed h-screen w-screen justify-center flex items-center">
      <div className="fixed h-5/6 w-2/6 bg-gray-400 border rounded-xl flex justify-center items-center">
        <div className="flex flex-col space-y-6 justify-center items-center">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-2 ">
            <div>
              <input 
                type="text"
                value = {username}
                placeholder="Username"
                onChange={(e)=> setUsername(e.target.value)}
                required
                className = "text-black rounded-md">     
              </input>
            </div>
            <div>
              <input 
                type = "text"
                value = {password}
                placeholder="Password"
                required
                onChange={(e) =>setPassword(e.target.value)}
                className="text-black rounded-md"
              >
              </input>
            </div>
          </form>
          <button className="rounded-lg bg-blue-400 w-4/6" type="submit" >
                login
          </button>
          <div className="flex space-x-2 flex-row justify-center items-center">
            <text className="text-black text-xs">Not yet have account</text>
            <div>
              <Link href="/auth/register"><text className="text-sm text-blue-600">register</text></Link>
            </div>
          </div>
        </div>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
LoginPage.getLayout = (page: React.ReactNode) => page;
