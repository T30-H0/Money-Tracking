"use client";

import { useCallback, useState } from "react";

export function useProfileSession(initialLoggedIn = true) {
  const [isLoggedIn, setIsLoggedIn] = useState(initialLoggedIn);

  const toggleSession = useCallback(() => {
    setIsLoggedIn((current) => !current);
  }, []);

  return {
    isLoggedIn,
    toggleSession,
  };
}
