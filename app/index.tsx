import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { registerUser } from "../src/services/auth";

export default function Register() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [secure2, setSecure2] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
    try {
      setError("");
      setSuccess("");

      const cleanEmail = email.trim();

      if (!cleanEmail || !password || !confirmPassword) {
        setError("Please fill in all fields.");
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      await registerUser(cleanEmail, password);

      setSuccess(
        "Account created! Check your email to verify before logging in."
      );

      setTimeout(() => {
        router.replace("/login");
      }, 1500);
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already in use.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak.");
      } else {
        setError("Registration failed. Try again.");
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
          <Text style={styles.subtitle}>Create Account</Text>

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

          {/* Password */}
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Create Password"
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
              style={styles.eyeIcon}
            >
              <Ionicons
                name={secure ? "eye-off" : "eye"}
                size={22}
                color="#555"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Confirm Password"
              style={styles.passwordInput}
              secureTextEntry={secure2}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (error) setError("");
              }}
            />
            <TouchableOpacity
              onPress={() => setSecure2(!secure2)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={secure2 ? "eye-off" : "eye"}
                size={22}
                color="#555"
              />
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {success ? <Text style={styles.successText}>{success}</Text> : null}

          <TouchableOpacity style={styles.primaryBtn} onPress={handleRegister}>
            <Text style={styles.primaryText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => router.replace("/login")}
          >
            <Text style={styles.secondaryText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
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

  eyeIcon: {
    paddingHorizontal: 14,
  },

  errorText: {
    color: "#D32F2F",
    fontSize: 14,
    marginBottom: 12,
    alignSelf: "flex-start",
  },

  successText: {
    color: "#2E7D32",
    fontSize: 14,
    marginBottom: 12,
    alignSelf: "flex-start",
    fontWeight: "600",
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
