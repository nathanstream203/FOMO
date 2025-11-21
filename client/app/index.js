import { Redirect } from "expo-router";
import { useAuthBootstrap } from "../src/hooks/useAuthBootstrap";
import LoadingScreen from "../src/components/Loading";

export default function Index() {
    
  const { loading, loggedIn } = useAuthBootstrap();

  if (loading) return  <LoadingScreen />;

  if (loggedIn) return <Redirect href="/(tabs)" />;

  return <Redirect href="/(logon)/signin" />;
}