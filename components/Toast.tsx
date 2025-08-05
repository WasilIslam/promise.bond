"use client";

import { Toaster } from "react-hot-toast";

export default function Toast() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        className: "",
        duration: 4000,
        style: {
          background: "#ffffff",
          color: "#1f2937",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          padding: "16px",
          fontSize: "14px",
          fontWeight: "500",
          boxShadow:
            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
        success: {
          iconTheme: {
            primary: "#10b981",
            secondary: "#ffffff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
}
