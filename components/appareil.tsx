import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { usePowerMonitoring } from '@/hooks/usePowerMonitoring';

export default function MonitoringScreen() {
  const { connectionStatus, totalConsumption, activeDevices, timeInfo } =
    usePowerMonitoring('ws://192.168.43.254:8765');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.consumptionValue2}>Appareils Actifs :</Text>
      {Object.entries(activeDevices)
        .filter(([name, power]) => {
          const lower = name.toLowerCase();
          return (
            !lower.includes('volt') &&
            !lower.includes('tension') &&
            typeof power === 'number'
          );
        })
        .map(([name, power]) => (
          <Text key={name} style={styles.deviceItem}>
            {name} :{' '}
            <Text style={styles.value}>{(power / 1000 * 5 / 3600).toFixed(4)} kWh</Text>
          </Text>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    marginTop: 16,
    marginBottom: 6,
    fontWeight: '600',
  },
  consumptionValue2: {
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '800',
    lineHeight: 56,
    //marginRight : 25
  },
  deviceItem: {
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 4,
  },
  value: {
    fontWeight: 'bold',
    color: '#333',
  },
});
