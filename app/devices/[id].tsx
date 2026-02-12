import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

type Device = {
  id: string;
  deviceType: string;
  brand: string;
  serialNumber: string;
  imei?: string; // ✅ optional
  deviceName: string;
  createdAt: number;
};

const STORAGE_KEY = "devices";

export default function DeviceDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [device, setDevice] = useState<Device | null>(null);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const list: Device[] = raw ? JSON.parse(raw) : [];
      const found = list.find((d) => d.id === id) ?? null;
      setDevice(found);
    })();
  }, [id]);

  if (!device) {
    return (
      <View style={styles.page}>
        <Text style={styles.h1}>Device</Text>
        <Text style={styles.muted}>Device not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <Text style={styles.h1}>{device.deviceName}</Text>

      <View style={styles.card}>
        <Row label="Device Type" value={device.deviceType} />
        <Row label="Brand" value={device.brand} />
        <Row label="Serial Number" value={device.serialNumber} />
        {device.imei ? <Row label="IMEI" value={device.imei} /> : null}
      </View>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ gap: 4, marginBottom: 14 }}>
      <Text style={{ color: "#A1A1AA", fontSize: 12 }}>{label}</Text>
      <Text style={{ color: "#fff", fontSize: 16, fontWeight: "800" }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#0B0B0F", padding: 16, paddingTop: 50 },
  h1: { color: "#fff", fontSize: 26, fontWeight: "800", marginBottom: 12 },
  muted: { color: "#A1A1AA" },
  card: {
    backgroundColor: "#12121A",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
});
