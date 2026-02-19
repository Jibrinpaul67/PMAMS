import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

type Device = {
  id: string;
  deviceType: string;
  brand: string;
  serialNumber: string;
  imei?: string;
  deviceName: string;
  createdAt: number;
  Warranty: string;
  Model: string;
  Info: string;
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
        <Row label="Warranty Coverage" value={device.Warranty} />
        <Row label="Device Model" value={device.Model} />
        <Row label="Device Information" value={device.Info} />
      </View>
      
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.labelCol}>
        <Text style={styles.rowLabel}>{label}:</Text>
      </View>

      <View style={styles.valueCol}>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff", padding: 16, paddingTop: 50 },
  h1: { color: "#000", fontSize: 30, fontWeight: "700", marginBottom: 12 },
  muted: { color: "#A1A1AA" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(187, 178, 178, 0.4)",
  },

  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },

  labelCol: {
    width: 180, 
  },

  rowLabel: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },

  valueCol: {
    flex: 1,
  },

  rowValue: {
    color: "#6b6b6b",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
  },
});
