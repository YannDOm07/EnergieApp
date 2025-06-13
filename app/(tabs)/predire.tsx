import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';

const API_URL = 'http://192.168.43.247:5000/predict'; // Remplace par l'IP locale de ton PC

const PredictionScreen: React.FC = () => {
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await axios.get(API_URL);
      if (response.data.success) {
        setPrediction(parseFloat(response.data.prediction));
      } else {
        setError(response.data.message || 'Erreur inconnue');
      }
    } catch (e) {
      setError('Erreur de connexion à l’API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handlePredict} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Chargement...' : '🔮 Prédire ma consommation'}
        </Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#4A90E2" style={{ marginTop: 20 }} />}

      {prediction !== null && !loading && (
        <View style={styles.resultBox}>
          <Text style={styles.predictionText}>
            🔋 Consommation estimée dans 2 minutes :{" "}
            <Text style={{ fontWeight: 'bold' }}>{prediction.toFixed(2)} W</Text>
          </Text>
        </View>
      )}

      {error && !loading && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f4f4f4',
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultBox: {
    marginTop: 30,
    backgroundColor: '#d4edda',
    padding: 16,
    borderRadius: 12,
  },
  predictionText: {
    color: '#155724',
    fontSize: 16,
  },
  errorBox: {
    marginTop: 30,
    backgroundColor: '#f8d7da',
    padding: 16,
    borderRadius: 12,
  },
  errorText: {
    color: '#721c24',
    fontSize: 16,
  },
});

export default PredictionScreen;
