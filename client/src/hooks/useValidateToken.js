// client/src/hooks/validateToken.js
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { clearAToken, verifyToken } from "../tokenStorage";
import { Alert } from "react-native";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";

export function useValidateToken() {
  const [isValid, setIsValid] = useState(false);
  const router = useRouter();
  console.log("useValidateToken called");

  useEffect(() => {
    let intervalId;
    async function checkToken() {
      try {
        const data = await verifyToken();
        if (!data.valid) {

          console.log(data.error);
          setIsValid(false);

          if (data.error === "Token expired") {
            console.error(data.error);
            Alert.alert(
              "Session Expired",
              "Your session has expired. Please sign in again.",
              [{
                  text: "OK",
                  onPress: async () => {
                    await clearAToken();
                    await signOut(auth);
                    router.replace("/(logon)/signin");
                  }}]);
          } else if (data.error === "Token invalid") {
            console.error(data.error);
            Alert.alert(
              "Invalid Token",
              "Your action is invalid. Please sign in again.",
              [{
                  text: "OK",
                  onPress: async () => {
                    await clearAToken();
                    await signOut(auth);
                    router.replace("/(logon)/signin");
                  }}]);
          } else {
            console.error("Unknown token verification error");
            Alert.alert(
              "Unknown token verification error",
              "An unexpected error occurred. Please sign in again.",
              [{
                  text: "OK",
                  onPress: async () => {
                    await clearAToken();
                    await signOut(auth);
                    router.replace("/(logon)/signin");
                  }}]);
          }
        } else {
          
          setIsValid(true); // Token is valid : setIsValid is a place holder, currently not used anywhere
        }
      } catch (error) {
        console.error("Error fetching token status:", error);
      }
    }; 

    checkToken();

    intervalId = setInterval(checkToken, 60 * 1000); // every 60 seconds

    return () => clearInterval(intervalId);

  }, []);

    return isValid;
}