import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { useRouter, useFocusEffect, Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useState } from "react";
import { useAuth } from "../src/hooks/useAuth";

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
      const confirmDelete = window.confirm(
        "You sure you want to delete this device?"
      );
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

  if (loading) return null;
  if (!user) return <Redirect href="/" />;

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.welcome}>Welcome {user.email}</Text>

        {/* 3 black cards */}
        <View style={styles.threeCards}>
          <View style={styles.blackCard}>
            <Text style={styles.cardTitle}>Card 1</Text>
          </View>
          <View style={styles.blackCard}>
            <Text style={styles.cardTitle}>Card 2</Text>
          </View>
          <View style={styles.blackCard}>
            <Text style={styles.cardTitle}>Card 3</Text>
          </View>
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
            <Text style={styles.empty}>No devices yet. Add one.</Text>
          ) : (
            <View style={styles.listWrap}>
              {devices.map((d) => (
                <View key={d.id} style={styles.deviceRow}>
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
                      style={styles.editBtn}
                      onPress={() =>
                        router.push({
                          pathname: "/devices",
                          params: { edit: d.id },
                        })
                      }
                    >
                      <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={styles.deleteBtn}
                      onPress={() => deleteDevice(d.id)}
                    >
                      <Text style={styles.deleteText}>Del</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20, paddingTop: 20, gap: 16 },

  welcome: { color: "#0F0F16", fontSize: 30, fontWeight: "600" },

  threeCards: { flexDirection: "row", gap: 10 },

  blackCard: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: 10,
    padding: 20,
    minHeight: 214,
    justifyContent: "center",
  },

  cardTitle: { color: "#fff", fontWeight: "800", fontSize: 14 },

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

  deviceMain: { flex: 1, paddingRight: 12 },

  deviceType: { color: "#020202", fontWeight: "600", fontSize: 18 },

  deviceName: { color: "#4e4e52", marginTop: 4, fontSize: 12 },

  actions: { flexDirection: "row", gap: 8 },

  editBtn: {
    backgroundColor: "#12121A",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },

  editText: { color: "#fff", fontWeight: "800", fontSize: 12 },

  deleteBtn: {
    backgroundColor: "#1F0000",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },

  deleteText: { color: "#ff4d4d", fontWeight: "800", fontSize: 12 },
});
