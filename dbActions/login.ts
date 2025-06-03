"use server";
import axios from "axios";
import { cookies } from "next/headers";

const handleLogin = async (username: string, password: string) => {
  try {
    const response = await axios.post(
      `${process.env.url}auth/login`,
      { username, password },
      { withCredentials: true }
    );

    if (response.data.success) {
      const cookieStore = await cookies();

      cookieStore.set("token", response.data.token);
      return { success: true, message: "Login successful" };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return {
          success: false,
          message: error.response.data.message || "Login failed",
        };
      }
    }
    return { success: false, message: "An error occurred during login" };
  }
};

const handleLogout = async () => {
  try {
    const response = await axios.post(
      `${process.env.url}auth/logout`,
      {},
      { withCredentials: true }
    );

    if (response.data.success) {
      const cookieStore = await cookies();
      cookieStore.delete("token");
      return { success: true, message: "Logout successful" };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, message: "An error occurred during logout" };
  }
};

export { handleLogin, handleLogout };
