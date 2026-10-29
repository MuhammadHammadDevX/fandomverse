import React, { createContext, useContext, useState, useRef } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ message: "", show: false });
  const timerRef = useRef(null);

  const showToast = (message) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message, show: true });
    timerRef.current = setTimeout(() => {
      setToast({ message: "", show: false });
    }, 2500);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.show && (
        <div id="toast" className="toast show">
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
