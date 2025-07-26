import { createContext, useEffect, useState } from "react";
import API from "../services/api";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // track session loading

  useEffect(() => {
    // Check for existing session on mount
    async function checkSession() {
      try {
        const res = await API.get("/check_session");
        setUser({ id: res.data.user_id });
      } catch (err) {
        setUser(null); // not logged in
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}
