import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ConsumptionData {
  value: number;
  timestamp: string;
}

const WEBSOCKET_URL = 'ws://192.168.1.62:8080'; // À adapter
const SimulateBillCard: React.FC = () => {
  const [displayedBill, setDisplayedBill] = useState<string | null>(null);
  const [fixedTimestamp, setFixedTimestamp] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const consumptionArray = useRef<ConsumptionData[]>([]);

  useEffect(() => {
    const socket = new WebSocket(WEBSOCKET_URL);

    socket.onopen = () => {
      console.log('✅ WebSocket connecté');
    };

    socket.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        const value = parseFloat(data['Consommation_totale(W)']);
        const timestamp: string = data.timestamp;

        if (!isNaN(value)) {
          const newEntry = { value, timestamp };
          consumptionArray.current.push(newEntry);
        }
      } catch (error) {
        console.error('❌ Erreur parsing WebSocket:', error);
      }
    };

    socket.onerror = (err) => {
      console.error('WebSocket erreur:', err.message);
    };

    return () => socket.close();
  }, []);

  function calculateCIEBillFromTotal(total: number): number {
    const kWh = (total / 100) * (5 / 3600); // Convertir W·s en kWh
    let cost = 0;

    if (kWh <= 100) {
      cost = kWh * 85;
    } else if (kWh <= 200) {
      cost = 100 * 85 + (kWh - 100) * 94;
    } else if (kWh <= 300) {
      cost = 100 * 85 + 100 * 94 + (kWh - 200) * 105;
    } else if (kWh <= 400) {
      cost = 100 * 85 + 100 * 94 + 100 * 105 + (kWh - 300) * 112;
    } else if (kWh <= 500) {
      cost = 100 * 85 + 100 * 94 + 100 * 105 + 100 * 112 + (kWh - 400) * 120;
    } else {
      cost = 100 * 85 + 100 * 94 + 100 * 105 + 100 * 112 + 100 * 120 + (kWh - 500) * 130;
    }

    const abonnement = 1000;
    const redevanceRTI = 1000;
    const tva = (cost + abonnement + redevanceRTI) * 0.18;
    const totalBill = cost + abonnement + redevanceRTI + tva;

    return Math.round(totalBill);
  }

  const handleSimulateBill = () => {
    const total = consumptionArray.current.reduce(
      (acc, item) => acc + item.value,
      0
    );

    const bill = calculateCIEBillFromTotal(total);
    setDisplayedBill(bill.toFixed(0)); // pas besoin de décimales FCFA

    // Fixer l'heure actuelle au moment du clic
    if (consumptionArray.current.length > 0) {
      const last = consumptionArray.current.at(-1);
      setFixedTimestamp(last?.timestamp ?? null);
    }

    setShowResult(true);
  };

  const handleOk = () => {
    setShowResult(false);
    setDisplayedBill(null);
    setFixedTimestamp(null);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>💡 Simulation de facture</Text>

      {!showResult && (
        <TouchableOpacity style={styles.orangeButton} onPress={handleSimulateBill}>
          <Text style={styles.orangeButtonText}>
            Voir le coût de ma facture actuellement
          </Text>
        </TouchableOpacity>
      )}

      {showResult && (
        <View style={styles.resultBox}>
          <Text style={styles.resultAmount}>{displayedBill} FCFA</Text>
          {fixedTimestamp && (
            <Text style={styles.timestamp}>
              à {new Date(fixedTimestamp).toLocaleTimeString()}
            </Text>
          )}
          <TouchableOpacity style={styles.okButton} onPress={handleOk}>
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default SimulateBillCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#111827',
  },
  orangeButton: {
    backgroundColor: '#F97316',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  orangeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultBox: {
    marginTop: 20,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    shadowColor: '#10B981',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  resultAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10B981',
    textAlign: 'center',
  },
  timestamp: {
    marginTop: 6,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  okButton: {
    marginTop: 14,
    backgroundColor: '#E5E7EB',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  okButtonText: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '500',
  },
});
