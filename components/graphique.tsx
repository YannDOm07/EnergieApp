import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart, XAxis, YAxis, Grid } from 'react-native-svg-charts';
import * as scale from 'd3-scale';

interface ConsumptionPoint {
  value: number;
  timestamp: string;
}

const WEBSOCKET_URL = 'ws://192.168.1.62:8080';
const VISIBLE_COUNT = 7;

export default function GraphiqueScreen() {
  const [graphData, setGraphData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const dataBuffer = useRef<ConsumptionPoint[]>([]);

  const containerWidth = Dimensions.get('window').width * 0.9; // par ex. 90% de l’écran
  const graphWidth = containerWidth - 50; // laisse de l’espace pour YAxis (~50px)

  useEffect(() => {
    const socket = new WebSocket(WEBSOCKET_URL);

    socket.onopen = () => {
      console.log('✅ WebSocket connecté');
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const value = parseFloat(data['Consommation_totale(W)']);
        const timestamp = data.timestamp;

        if (!isNaN(value)) {
          dataBuffer.current.push({ value, timestamp });

          setGraphData(prev => [...prev, value]);
          setLabels(prev => {
            const formatted = new Date(timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });
            return [...prev, formatted];
          });
        }
      } catch (err) {
        console.error('Erreur WebSocket:', err);
      }
    };

    socket.onerror = (e) => {
      console.error('WebSocket error:', e.message);
    };

    return () => socket.close();
  }, []);

  const latestGraphData = graphData.slice(-VISIBLE_COUNT);
  const latestLabels = labels.slice(-VISIBLE_COUNT);

  return (
    <View style={[styles.container, { width: containerWidth }]}>
      <Text style={styles.title}></Text>
      {latestGraphData.length > 0 ? (
        <View style={{ flexDirection: 'row', height: 150 }}>
          <YAxis
            data={latestGraphData}
            contentInset={{ top: 4, bottom: 4 }}
            svg={{ fontSize: 9, fill: 'black' }}
            numberOfTicks={5}
            style={{ marginRight: -4 }}
          />
          <View>
            <BarChart
              style={{ height: 120, width: graphWidth }}
              data={latestGraphData}
              svg={{ fill: '#2563EB' }}
              contentInset={{ top: 4, bottom: 4 }}
              spacingInner={0.3}
              spacingOuter={0.2}
              gridMin={0}
            >
              <Grid direction={Grid.Direction.HORIZONTAL} />
            </BarChart>
            <XAxis
              style={{ height: 30 }}
              data={latestLabels}
              scale={scale.scaleBand}
              formatLabel={(_, index) => latestLabels[index]}
              svg={{ fontSize: 7, fill: 'black' }}
              contentInset={{ left: 10, right: 10 }}
            />
          </View>
        </View>
      ) : (
        <Text style={styles.loadingText}>En attente de données...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
    backgroundColor: 'transparent', // si tu veux hériter du graphPlaceholder
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
    color: '#1F2937',
  },
  loadingText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 13,
  },
});
