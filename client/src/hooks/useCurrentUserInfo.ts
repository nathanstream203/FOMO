// useCurrentUserInfo.ts
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import { getUserByFirebaseId } from "../api/databaseOperations";
import { getAToken } from "../tokenStorage";

interface DatabaseUser {
  id: number;
  firebase_id: string;
  first_name: string;
  last_name: string;
}

export const useCurrentUserId = () => {
  const [user, loadingAuth] = useAuthState(auth);
  const [currentUserId, setCurrentUserId] = React.useState<number | null>(null); 
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (loadingAuth) {
      setIsLoading(true);
      return; 
    }

    const fetchUserId = async () => {
      // Check if user is logged in
      if (user?.uid) {
        setIsLoading(true);
        try {
          const JWT_token = await getAToken();
          // getUserByFirebaseId returns the user object from the database
          const dbUser: DatabaseUser | null = await getUserByFirebaseId(
            user.uid,
            JWT_token
          );

          if (dbUser && typeof dbUser.id === "number") {
            setCurrentUserId(dbUser.id);
          } else {
            console.warn("User ID not found in database for current user.");
            setCurrentUserId(null);
          }
        } catch (error) {
          console.error("Error fetching internal user ID:", error);
          setCurrentUserId(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        // User is logged out
        setCurrentUserId(null);
        setIsLoading(false);
      }
    };

    fetchUserId();
  }, [user, loadingAuth]); 

  return { currentUserId, isUserIdLoading: isLoading };
};

export function useCurrentFirstName() {
  const [user, loadingAuth] = useAuthState(auth);
  const [firstName, setFirstName] = React.useState("");
  const [loadingDb, setLoadingDb] = React.useState(false);

  React.useEffect(() => {
    // If user is logged in and Firebase has finished checking the login state
    if (user?.uid && !loadingAuth) {
      const fetchDbUser = async () => {
        setLoadingDb(true);
        try {
          // Fetch custom user data using the Firebase UID
          const storedToken = await getAToken();
          const userData: DatabaseUser = await getUserByFirebaseId(
            user.uid,
            storedToken // Pass the token here
          );
          setFirstName(userData.first_name);
        } catch (err) {
          console.error("Error fetching first name from DB:", err);
          setFirstName("User"); // Fallback name
        } finally {
          setLoadingDb(false);
        }
      };
      fetchDbUser();
    } else if (!user && !loadingAuth) {
      // User is logged out
      setFirstName("User");
      setLoadingDb(false);
    }
    // Handle the initial loading state (while loadingAuth is true)
    else if (loadingAuth) {
        setLoadingDb(true); // Treat auth loading as database loading until resolved
    }
  }, [user, loadingAuth]);

  // Return the fetched name, the Firebase UID, and a combined loading state
  return {
    currentUserFirstName: firstName,
    // Return the Firebase user ID to ensure it is available for DB operations
    currentUserId: user?.uid ?? null,
    loadingUser: loadingAuth || loadingDb,
  };
}