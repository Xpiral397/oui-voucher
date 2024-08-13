"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { base } from "@/base";
import { getToken } from "@/app/controller/auth/auth";

export default function Register() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    // Extract the token from the URL
    const urlPath = window.location.href;
    const lastSlashIndex = urlPath?.lastIndexOf("/");
    const extractedToken = urlPath?.substring(lastSlashIndex + 1);
    setToken(extractedToken);
  }, [window.location.href]);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await axios.post(
        `${base}/accounts/register/`,
        {
          token,
          username,
          confirmPassword,
          password,
        },
        {
          headers: {
            Authorization: `Token ${getToken("Admin")}`,
          },
        }
      );

      toast.success("Account created successfully!");

      // Redirect to the login page after successful registration
      setTimeout(() => {
        router.push("/admin/auth/login");
      }, 2000); // Adjust the delay as needed
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        toast.error("Invalid link or registration failed");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-6">Complete Your Registration</h1>
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 p-2 w-full border border-gray-300 dark:border-gray-700 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 p-2 w-full border border-gray-300 dark:border-gray-700 rounded"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mb-4 p-2 w-full border border-gray-300 dark:border-gray-700 rounded"
        />
        <button
          onClick={handleRegister}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Register
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}
