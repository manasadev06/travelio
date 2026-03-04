import { useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-toast">
      <div
        className={`flex items-center gap-3 px-6 py-3 rounded-2xl backdrop-blur-md border shadow-xl
        transition-all duration-300
        ${
          type === "success"
            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
            : "bg-red-50 border-red-200 text-red-700 shadow-red-200/50"
        }`}
      >
        <div
          className={`p-1 rounded-full ${
            type === "success" ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {type === "success" ? (
            <CheckCircle size={20} />
          ) : (
            <XCircle size={20} />
          )}
        </div>

        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
}