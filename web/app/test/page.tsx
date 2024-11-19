"use client"
import axios from 'axios';
import Cookies from "js-cookie";
import { useState } from 'react';


const sendMessage = async (token, userId, content) => {
    const response = await axios.post(
      `http://127.0.0.1:8000/api/chat/messages/${userId}/`,
      { content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  };

export default function Testpage(){
    const [msg,setMsg] = useState("")
    const [token,setToken] = useState(Cookies.get("authToken"))
    const refreshToken = Cookies.get("authTokenRefresh")
    const fetchMessages = async (e) => {
      try{
            const response = await fetch('http://127.0.0.1:8000/api/chats/messages/', {
                method: "get",
                headers: {
                     "Authorization": `Bearer ${token}` ,
                     'Content-Type': 'application/json',
                },
                })
            console.log(await response.json())
        } catch (error) {
            console.log(error)
        }
    
    };
    const sendMessage = async (userId, content) => {
        try{
        const response = await fetch(
          `http://127.0.0.1:8000/api/chats/messages/2/`, {
            method:"post",
            headers: {
                "Authorization": `Bearer ${token}` ,
                "Content-Type": 'application/json',
            },
            body: JSON.stringify({content:"test" })
          }
        )
        console.log(await response.json())
        } catch (error) {
            console.log(error)
        }

      };
      const getMessage = async (userId, content) => {
        try{
        const response = await fetch(
          `http://127.0.0.1:8000/api/chats/messages/2/`, {
            method:"get",
            headers: {
                "Authorization": `Bearer ${token}` ,
                "Content-Type": 'application/json',
            }
          }
        )
        console.log(await response.json())
        } catch (error) {
            console.log(error)
        }

      };
      const refreshAccessToken = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/auth/refresh/', {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
          });
      
          if (!response.ok) {
            throw new Error('Failed to refresh access token');
          }
          
          const data = await response.json();
          setToken(data.access)
          console.log(data)
        } catch (error) {
          console.error('Error refreshing access token:', error.message);
          return null;
        }
      };
    return(
        <div>
            <div>
                <input className='bg-black' value={msg} onChange={(e)=>setMsg(e.target.value)}/>
                <button onClick={fetchMessages}>send</button>
            </div>
            <div>
                <input className='bg-black' value={msg} onChange={(e)=>setMsg(e.target.value)}/>
                <button onClick={sendMessage}>send</button>
            </div>
            <div>
                <button onClick={getMessage}>send</button>
            </div>
            <div>
                <button onClick={refreshAccessToken}>send</button>
            </div>
        </div>
    )
}