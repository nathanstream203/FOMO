// client/app/hooks/useAuthBootstrap.js
import { useEffect, useState } from "react";
import { clearAToken, getAToken, verifyToken } from "../../src/tokenStorage";

export function useAuthBootstrap() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  console.log("useAuthBootstrap called");

  useEffect(() => {
    async function init() {
      console.log("Bootstrapping auth state");
      const accessToken = await getAToken();
      console.log("Retrieved access token from storage");

      if (!accessToken) {
        setLoading(false);
        setLoggedIn(false);
        return;
      } else {

        const data = await verifyToken();
        if (!data.valid) {
          if (data.error === "Token expired") {
            console.error(data.error);
          } else if (data.error === "Token invalid") {
            console.error(data.error);
          } else {
            console.error("Unknown token verification error");
          }

          clearAToken();
        }

        setLoggedIn(data.valid);
        setLoading(false);
        return;
      }
    }

    init();
  }, []);

  return { loading, loggedIn };
}