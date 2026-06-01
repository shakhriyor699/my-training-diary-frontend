"use client";

import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";

export function ToastProvider() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={2500}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      theme="dark"
      toastClassName="!rounded-2xl !border !border-white/8 !bg-[#090909] !text-white"
    />
  );
}
