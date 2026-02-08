import { View, Text, TouchableOpacity } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "../src/hooks/useAuth";
import { logoutUser } from "../src/services/auth";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Redirect href="/login" />;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome 🎉</Text>
      <Text>{user.email}</Text>

      <TouchableOpacity onPress={logoutUser}>
        <Text style={{ marginTop: 20, color: "blue" }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
