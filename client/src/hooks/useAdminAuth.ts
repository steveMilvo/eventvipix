import { useState, useEffect } from "react";

interface AdminUser {
  id: number;
  username: string;
  email: string;
}

export function useAdminAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const storedSessionId = localStorage.getItem("adminSessionId");
    const storedUser = localStorage.getItem("adminUser");
    
    if (storedSessionId && storedUser) {
      setSessionId(storedSessionId);
      setAdminUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("adminSessionId");
    localStorage.removeItem("adminUser");
    setSessionId(null);
    setAdminUser(null);
    setIsLoggedIn(false);
  };

  return {
    isLoggedIn,
    adminUser,
    sessionId,
    logout
  };
}