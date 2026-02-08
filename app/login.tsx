import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { useState } from "react";
import { useRouter, Redirect } from "expo-router";
import { loginUser } from "../src/services/auth";
import { useAuth } from "../src/hooks/useAuth";

export default function Login() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [secure, setSecure] = useState(true); // 👈 controls hide/show

  if (loading) return null;
  if (user) return <Redirect href="/home" />;

  const handleLogin = async () => {
    try {
      setError("");

      if (!email.trim() || !password) {
        setError("Please enter your email and password.");
        return;
      }

      await loginUser(email.trim(), password);
      router.replace("/home");
    } catch (err: any) {
      console.log("Login error:", err?.code, err?.message);

      if (err.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else if (err.code === "auth/invalid-credential") {
        setError("Incorrect email or password.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many attempts. Try again later.");
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <ImageBackground
      source={require("../asset/mac.jpg")}
      resizeMode="cover"
      style={styles.page}
      imageStyle={styles.bgImage}
    >
      <View style={styles.overlay} />

      <View style={styles.center}>
        <View style={styles.card}>
          <Text style={styles.title}>PocketAsset</Text>
          <Text style={styles.subtitle}>Sign In</Text>

          <TextInput
            placeholder="Enter Email"
            style={styles.input}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError("");
            }}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          {/* PASSWORD INPUT WITH TOGGLE */}
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Enter Password"
              style={styles.passwordInput}
              secureTextEntry={secure}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (error) setError("");
              }}
            />

            <TouchableOpacity
              onPress={() => setSecure(!secure)}
              style={styles.toggle}
            >
              <Text style={styles.toggleText}>
                {secure ? "Show" : "Hide"}
              </Text>
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin}>
            <Text style={styles.primaryText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => router.replace("/")}
          >
            <Text style={styles.secondaryText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },

    bgImage: {
    transform: [{ scale: 2.2 }, { translateX: 0 }, { translateY: 0 }],
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 50,
  },

  card: {
    width: "100%",
    maxWidth: 800,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.75,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    zIndex: 2,
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 40,
  },

  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 16,
  },

  passwordInput: {
    flex: 1,
    padding: 14,
  },

  toggle: {
    paddingHorizontal: 14,
  },

  toggleText: {
    color: "#0A1E4A",
    fontWeight: "600",
  },

  errorText: {
    color: "#D32F2F",
    fontSize: 14,
    marginBottom: 12,
    marginTop: -8,
    alignSelf: "flex-start",
    fontWeight: "500",
  },

  primaryBtn: {
    backgroundColor: "#0A1E4A",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },

  primaryText: {
    color: "#fff",
    fontWeight: "600",
  },

  secondaryBtn: {
    backgroundColor: "#0D4FB8",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },

  secondaryText: {
    color: "#fff",
    fontWeight: "600",
  },
});
