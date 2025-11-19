import { Redirect } from "expo-router";
import { useAuthBootstrap } from "../src/hooks/useAuthBootstrap";

export default function Index() {
  const { loading, loggedIn } = useAuthBootstrap();

  if (loading) return null;

  if (loggedIn) return <Redirect href="/(tabs)" />;

  return <Redirect href="/(logon)/signin" />;
}