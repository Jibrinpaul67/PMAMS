import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Linking,
  ImageBackground,
} from "react-native";
import { useRouter, useFocusEffect, Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useState } from "react";
import { useAuth } from "../src/hooks/useAuth";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { logoutUser } from "../src/services/auth"; // ✅ added (adjust path if needed)

type Device = {
  id: string;
  deviceType: string;
  brand: string;
  serialNumber: string;
  imei?: string;
  deviceName: string;
  createdAt: number;
};

const STORAGE_KEY = "devices";
const MAX_DEVICES = 5;

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [menuOpen, setMenuOpen] = useState(false); 

  const loadDevices = useCallback(async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const list: Device[] = raw ? JSON.parse(raw) : [];
    list.sort((a, b) => b.createdAt - a.createdAt);
    setDevices(list);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDevices();
    }, [loadDevices])
  );

  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Error", "Cannot open this link");
    }
  };

  const handleLogout = async () => {
    try {
      setMenuOpen(false);
      await logoutUser(); // ✅ firebase signOut
      router.replace("/"); // ✅ back to login
    } catch (error: any) {
      Alert.alert("Logout failed", error?.message || "Something went wrong");
    }
  };

  const isFull = devices.length >= MAX_DEVICES;

  const handleAddDevice = () => {
    if (isFull) {
      if (Platform.OS === "web") {
        window.alert(`You can only register a maximum of ${MAX_DEVICES} devices.`);
      } else {
        Alert.alert("Limit Reached", `You can only register ${MAX_DEVICES} devices.`);
      }
      return;
    }

    router.push({
      pathname: "/devices",
      params: { add: "1" },
    });
  };

  const doDelete = async (id: string) => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const list: Device[] = raw ? JSON.parse(raw) : [];
    const updated = list.filter((d) => d.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    loadDevices();
  };

  const deleteDevice = (id: string) => {
    if (Platform.OS === "web") {
      const confirmDelete = window.confirm("You sure you want to delete this device?");
      if (confirmDelete) {
        doDelete(id);
      }
    } else {
      Alert.alert("Delete Device", "You sure you want to delete this device?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => doDelete(id),
        },
      ]);
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "Phone":
        return <Ionicons name="phone-portrait-outline" size={30} color="#20326e" />;
      case "Tablet":
        return <Ionicons name="tablet-portrait-outline" size={30} color="#20326e" />;
      case "Laptop":
        return <Ionicons name="laptop-outline" size={30} color="#20326e" />;
      case "Desktop PC":
        return <Ionicons name="desktop-outline" size={30} color="#20326e" />;
      case "Smart Watch":
        return <Ionicons name="watch-outline" size={30} color="#20326e" />;
      case "Game Console":
        return <Ionicons name="game-controller-outline" size={30} color="#20326e" />;
      case "Router / MiFi":
        return <MaterialCommunityIcons name="router-wireless" size={30} color="#20326e" />;
      case "VR Headset":
        return <MaterialCommunityIcons name="virtual-reality" size={30} color="#20326e" />;
      case "Headphones / Earbuds":
        return <Ionicons name="headset-outline" size={30} color="#20326e" />;
      case "Power Bank":
        return (
          <MaterialCommunityIcons name="battery-charging-outline" size={30} color="#20326e" />
        );
      case "External Hard Drive":
        return <MaterialCommunityIcons name="harddisk" size={30} color="#20326e" />;
      case "Flash Drive":
        return <MaterialCommunityIcons name="usb-flash-drive" size={30} color="#20326e" />;
      default:
        return <Ionicons name="cube-outline" size={30} color="#20326e" />;
    }
  };

  if (loading) return null;
  if (!user) return <Redirect href="/" />;

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ✅ Welcome + top-right menu */}
        <View style={styles.topRow}>
          <Text style={styles.welcome}>Welcome {user.email}</Text>

          <View style={styles.menuWrap}>
            <TouchableOpacity
              style={styles.menuBtn}
              activeOpacity={0.85}
              onPress={() => setMenuOpen((v) => !v)}
            >
              <Ionicons name="ellipsis-vertical" size={20} color="#0F0F16" />
            </TouchableOpacity>

            {menuOpen && (
              <View style={styles.dropdown}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  activeOpacity={0.85}
                  onPress={handleLogout}
                >
                  <Ionicons name="log-out-outline" size={18} color="#d11a2a" />
                  <Text style={styles.dropdownText}>Logout</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* 3 black cards */}
        <View style={styles.threeCards}>
          <TouchableOpacity
            style={styles.blackCard}
            activeOpacity={0.85}
            onPress={() =>
              openLink(
                "https://spyro-soft.com/blog/managed-services/what-is-software-maintenance-and-why-it-is-essential"
              )
            }
          >
            <ImageBackground
              source={require("../asset/essential.png")}
              style={styles.imageCard}
              imageStyle={styles.imageRadius}
              resizeMode="cover"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.blackCard}
            activeOpacity={0.85}
            onPress={() =>
              openLink("https://flairstech.com/blog/software-maintenance-services-problems")
            }
          >
            <ImageBackground
              source={require("../asset/top5.png")}
              style={styles.imageCard}
              imageStyle={styles.imageRadius}
              resizeMode="cover"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.blackCard}
            activeOpacity={0.85}
            onPress={() => openLink("https://arxiv.org/abs/2401.09275")}
          >
            <ImageBackground
              source={require("../asset/hotfix.png")}
              style={styles.imageCard}
              imageStyle={styles.imageRadius}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>

        {/* Devices Section */}
        <View style={styles.devicesBox}>
          <View style={styles.devicesHeader}>
            <Text style={styles.devicesTitle}>Devices</Text>

            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.addBtn, isFull && styles.addBtnDisabled]}
              onPress={handleAddDevice}
              disabled={isFull}
            >
              <Text style={[styles.addBtnText, isFull && styles.addBtnTextDisabled]}>
                {isFull ? `Max ${MAX_DEVICES} Reached` : "+ Add Device"}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.limitText}>
            {devices.length}/{MAX_DEVICES} devices registered
          </Text>

          {devices.length === 0 ? (
            <Text style={styles.empty}>No devices yet.</Text>
          ) : (
            <View style={styles.listWrap}>
              {devices.map((d) => (
                <View key={d.id} style={styles.deviceRow}>
                  <View style={styles.iconWrap}>{getDeviceIcon(d.deviceType)}</View>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.deviceMain}
                    onPress={() => router.push(`/devices/${d.id}`)}
                  >
                    <Text style={styles.deviceType}>{d.deviceType}</Text>
                    <Text style={styles.deviceName}>{d.deviceName}</Text>
                  </TouchableOpacity>

                  <View style={styles.actions}>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={styles.iconBtn}
                      onPress={() =>
                        router.push({
                          pathname: "/devices",
                          params: { edit: d.id },
                        })
                      }
                    >
                      <Ionicons name="pencil-outline" size={18} color="#000" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={styles.iconBtn}
                      onPress={() => deleteDevice(d.id)}
                    >
                      <Ionicons name="trash-outline" size={18} color="#d11a2a" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* ✅ Tap anywhere outside the dropdown to close it */}
      {menuOpen && (
        <TouchableOpacity
          activeOpacity={1}
          style={styles.backdrop}
          onPress={() => setMenuOpen(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20, paddingTop: 20, gap: 16 },

  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },

  welcome: { color: "#333377", fontSize: 26, fontWeight: "800", flex: 1 },

  menuWrap: { position: "relative" },

  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#f4f4f4",
    justifyContent: "center",
    alignItems: "center",
  },

  dropdown: {
    position: "absolute",
    top: 46,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
    paddingVertical: 6,
    minWidth: 140,
    zIndex: 50,
    elevation: 8,
  },

  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  dropdownText: { fontSize: 14, fontWeight: "700", color: "#0F0F16" },

  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  threeCards: { flexDirection: "row", gap: 10 },

  blackCard: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.85)",
  },

  devicesBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(43, 54, 80, 0.44)",
    gap: 12,
  },

  devicesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  devicesTitle: { color: "#0F0F16", fontSize: 24, fontWeight: "600" },

  addBtn: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 111,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#9ac9a4ff",
  },

  addBtnDisabled: { opacity: 0.45 },

  addBtnText: { color: "#0F0F16", fontSize: 14, fontWeight: "600" },

  addBtnTextDisabled: { color: "#7a7a7a" },

  limitText: { fontSize: 12, fontWeight: "600", color: "#6b6b6b" },

  empty: { color: "#A1A1AA", fontSize: 12 },

  listWrap: { gap: 10 },

  deviceRow: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(129, 108, 108, 0.29)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  deviceMain: { flex: 1, paddingRight: 12 },

  deviceType: { color: "#020202", fontWeight: "600", fontSize: 18 },

  deviceName: { color: "#4e4e52", marginTop: 4, fontSize: 12 },

  actions: { flexDirection: "row", gap: 8 },

  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#f4f4f4",
    justifyContent: "center",
    alignItems: "center",
  },

  imageCard: {
    width: "100%",
    height: 214,
    justifyContent: "flex-end",
  },

  imageRadius: {
    borderRadius: 10,
  },
});





