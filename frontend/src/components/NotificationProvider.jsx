import React, { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext(null);

export const useNotification = () => {
  return useContext(NotificationContext);
};

let idCounter = 1;

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const remove = useCallback((id) => {
    setNotifications((s) => s.filter((n) => n.id !== id));
  }, []);

  const startClose = useCallback((id, delay = 300) => {
    setNotifications((s) => s.map((n) => (n.id === id ? { ...n, closing: true } : n)));
    setTimeout(() => remove(id), delay);
  }, [remove]);

  const push = useCallback((type, message, timeout = 4000) => {
    const id = idCounter++;
    const note = { id, type, message, closing: false, entering: true };
    setNotifications((s) => [...s, note]);

    // trigger enter animation on next tick
    setTimeout(() => {
      setNotifications((s) => s.map((n) => (n.id === id ? { ...n, entering: false } : n)));
    }, 20);

    if (timeout > 0) {
      // start closing slightly before final removal to allow exit animation
      setTimeout(() => startClose(id), timeout - 300);
    }
  }, [startClose]);

  const api = {
    success: (msg, t) => push("success", msg, t),
    error: (msg, t) => push("error", msg, t),
    info: (msg, t) => push("info", msg, t),
  };

  return (
    <NotificationContext.Provider value={api}>
      {children}

      <div style={{ position: "fixed", top: 16, right: 16, zIndex: 9999 }}>
        {notifications.map((n) => {
          const bg = n.type === "success" ? "#16a34a" : n.type === "error" ? "#dc2626" : "#2563eb";
          // entering: start off-screen (right) and transparent; then translate to 0
          const transform = n.entering ? "translateX(100%)" : n.closing ? "translateX(100%)" : "translateX(0)";
          const opacity = n.entering ? 0 : n.closing ? 0 : 1;

          return (
            <div
              key={n.id}
              onClick={() => startClose(n.id)}
              style={{
                marginBottom: 8,
                padding: "10px 14px",
                borderRadius: 8,
                color: "#fff",
                minWidth: 240,
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                background: bg,
                cursor: "pointer",
                transform,
                opacity,
                transition: "transform 300ms cubic-bezier(.2,.8,.2,1), opacity 300ms ease",
              }}
            >
              {n.message}
            </div>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
}

export default NotificationProvider;
