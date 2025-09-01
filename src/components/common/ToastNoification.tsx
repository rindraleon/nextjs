import React, { useEffect } from "react";

type ToastProps = {
  message: string;
  type: "success" | "error";
  onClose: () => void;
};

export default function ToastNotification({ message, type, onClose }: ToastProps) {
  // Fermer automatiquement après 5 secondes
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-12 right-6 z-50 px-4 py-8 rounded shadow-lg text-white ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      } cursor-pointer`}
      onClick={onClose}
    >
      {message}
    </div>
  );
}
