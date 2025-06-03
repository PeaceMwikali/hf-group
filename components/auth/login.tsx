"use client";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { handleLogin } from "@/dbActions/login";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const submit = async () => {
    if (!username || username.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Username cannot be empty",
      });
      return;
    }
    if (!password || password.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Password cannot be empty",
      });
      return;
    }
    setIsLoading(true);
    try {
      const payload = {
        username: username,
        password: password,
      };
      const response = await handleLogin(payload.username, payload.password);

      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.message,
        });
        setUsername("");
        setPassword("");
        // Redirect to the home page after successful login
        router.push("/transactions");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.message,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred during login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-1/2 text-center">
      <input
        type="text"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="username"
        autoComplete="off"
        className="shadow-md border w-full h-10 px-3 py-2 text-orange-500 focus:outline-none focus:border-orange-500 mb-3 rounded"
      />
      <input
        type="password"
        name="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="off"
        className="shadow-md border w-full h-10 px-3 py-2 text-orange-500 focus:outline-none focus:border-orange-500 mb-3 rounded"
      />
      <button
        className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-lg focus:outline-none shadow"
        onClick={submit}
        disabled={isLoading}
      >
        Sign In
      </button>
    </div>
  );
}
