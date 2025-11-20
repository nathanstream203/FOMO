import { Redirect } from "expo-router";
import { useAuthBootstrap } from "../src/hooks/useAuthBootstrap";
import LoadingScreen from "../src/components/LoadingScreen";

export default function Index() {
    
  const { loading, loggedIn } = useAuthBootstrap();

  if (loading) return  <LoadingScreen />; // from client/src/components/LoadingScreen

  if (loggedIn) return <Redirect href="/(tabs)" />;

  return <Redirect href="/(logon)/signin" />;
}