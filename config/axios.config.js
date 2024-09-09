"use client";
import axios from "axios";
import { signOut } from "next-auth/react";

const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api"; // Change this if using a diffe // Change this if using a different backend API
// console.log(process.env.NEXT_PUBLIC_API_URL, "1224")
export const api = axios.create({
  baseURL,
});

let AxiosCreator;

if (typeof window !== "undefined") {
  AxiosCreator = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  AxiosCreator.interceptors.request.use((config) => {
    // config.headers["ngrok-skip-browser-warning"] = true;
    config.headers["Authorization"] =
      "Bearer " + (localStorage?.getItem("token") || "");
    return config;
  });

  AxiosCreator.interceptors.response.use(
    (res) => {
      return res;
    },
    // (err) => {
    //   if (err?.response?.status === 401 || err?.response?.status === 403) {
    //     // console.log("401 err : ", err);
    //     window.location.href = "/";
    //   }

    //   throw err?.response;
    // }
    (err) => {
      if (err?.response?.status === 401) {
        // console.log("401 err : ", err);
        // err?.response?.status === 403
        localStorage?.removeItem("token");
        signOut({ redirect: false }).catch(() => { });
      }

      throw err?.response;
    }
  );
}

export default AxiosCreator;
