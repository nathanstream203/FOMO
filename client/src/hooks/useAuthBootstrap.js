// client/app/hooks/useAuthBootstrap.js
// Hook to bootstrap authentication state on app launch - checks for valid refresh token
// Maintains loading and loggedIn state across app relaunching.
import { useEffect, useState } from "react";
import { getAToken } from "../../src/tokenStorage";

export function useAuthBootstrap() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  console.log("useAuthBootstrap called");

  useEffect(() => {
    async function init() {
      console.log("Bootstrapping auth state");
      const accessToken = await getAToken();
      console.log("Retrieved access token from storage:", accessToken);

      if (!accessToken) {
        setLoading(false);
        setLoggedIn(false);
        return;
      } else {
        setLoggedIn(true);
        setLoading(false);
        return;
      }
    }

    init();
  }, []);

  return { loading, loggedIn };
}