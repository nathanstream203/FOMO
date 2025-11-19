// client/app/hooks/useAuthBootstrap.js
// Hook to bootstrap authentication state on app launch - checks for valid refresh token
// Maintains loading and loggedIn state across app relaunching.
import { useEffect, useState } from "react";
import { getRefreshToken, saveTokens, clearTokens } from "../../src/tokenStorage";
import BASE_URL from "../../src/_base_url";

export function useAuthBootstrap() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  console.log("useAuthBootstrap called");

  useEffect(() => {
    async function init() {
      console.log("Bootstrapping auth state");
      const refreshToken = await getRefreshToken();
      if (!refreshToken) {
        setLoading(false);
        setLoggedIn(false);
        return;
      }

      try {
        console.log("Attempting token refresh");
        const res = await fetch(`${BASE_URL}/session/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        if (!res.ok) throw new Error("Invalid refresh token");
        console.log("Token refresh successful");

        const { accessToken, refreshToken: newRefresh } = await res.json();
        await saveTokens(accessToken, newRefresh || refreshToken);
        console.log("Tokens saved");

        setLoggedIn(true);
      } catch {
        console.log("Token refresh failed, clearing tokens");
        await clearTokens();
        setLoggedIn(false);
      }
      
      setLoading(false);
    }

    init();
  }, []);

  return { loading, loggedIn };
}