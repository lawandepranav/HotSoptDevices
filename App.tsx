// src/screens/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { PermissionsAndroid, Platform } from 'react-native';
import WifiManager from "react-native-wifi-reborn";

const HomeScreen = () => {
  const [deviceIp, setDeviceIp] = useState<string | null>(null);
  const [connectedDevices, setConnectedDevices] = useState<string[]>([]);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_WIFI_STATE,
          PermissionsAndroid.PERMISSIONS.CHANGE_WIFI_STATE,
        ]);
        if (
          granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] !== 'granted' ||
          granted[PermissionsAndroid.PERMISSIONS.ACCESS_WIFI_STATE] !== 'granted'
        ) {
          Alert.alert('Permission Error', 'Required permissions not granted.');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const fetchDeviceIp = async () => {
    try {
      const ip = await WifiManager.getIP();
      setDeviceIp(ip);
    } catch (error) {
      console.error("Failed to fetch IP:", error);
    }
  };

  const scanConnectedDevices = async () => {
    try {
      // Replace with your native module for hotspot clients
      // const clients = await NativeModules.HotspotManager.getConnectedDevices();
      const clients = ["192.168.0.2", "192.168.0.3"]; // Mocked data for now
      setConnectedDevices(clients);
    } catch (error) {
      console.error("Failed to fetch connected devices:", error);
    }
  };

  useEffect(() => {
    requestPermissions();
    fetchDeviceIp();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hotspot Manager</Text>
      <Text>Device IP: {deviceIp || "Fetching..."}</Text>
      <Button title="Scan Connected Devices" onPress={scanConnectedDevices} />
      <FlatList
        data={connectedDevices}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item }) => <Text style={styles.device}>{item}</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  device: { padding: 10, borderBottomWidth: 1 },
});

export default HomeScreen;
