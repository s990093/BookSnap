"use client"
import { useState } from "react"



export default function Register(){
    const [username , setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [email,setemail] = useState("");

    const handleSubmit = async(e) => {

        try {
            const res = await fetch("https://localhost:8000/api/auth/register",{
                headers:{
                    "content-Type" : "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password:password
                })
            })
            const data = await res.json()

        } catch(err) {

    }
    
    
    
    
    return(
        <div className="fixed h-screen justify-center flex items-center">
            <div className="fixed h-5/6 w-2/6 bg-gray-400 border rounded-xl flex justify-center">
                <div className="flex flex-col space-y-6 justify-center items-center">

                </div>

            </div>
        </div>
    )
}
