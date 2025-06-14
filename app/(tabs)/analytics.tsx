import React, { useState, useEffect, useRef } from 'react';
import GraphiqueScreen from '../../components/graphique';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  ActivityIndicator,
  Animated,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { MotiView } from 'moti';
import axios from 'axios';

const { width, height } = Dimensions.get('window');
const API_URL = 'http://192.168.43.247:5000/predict';

interface PredictionResponse {
  success: boolean;
  prediction?: number;
  message?: string;
}

const AnalyticsScreen = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'prediction'>(
    'analytics'
  );
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleTabPress = (tab: 'analytics' | 'prediction') => {
    setActiveTab(tab);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await axios.get<PredictionResponse>(API_URL);
      if (response.data.success && response.data.prediction !== undefined) {
        setPrediction(response.data.prediction);
        setLastUpdate(new Date());

        // Animation de l'apparition du résultat
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        setError(response.data.message || 'Erreur inconnue');
      }
    } catch (e) {
      setError("Erreur de connexion à l'API");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const renderPredictionContent = () => {
    return (
      <Animated.View
        style={[
          styles.predictionContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={['#FF6B00', '#FF8800', '#FFA200']}
          style={styles.gradientContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handlePredict}
              colors={['#FF6B00']}
              tintColor="#FF6B00"
            />
          }
        >
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>Prédiction en Temps Réel</Text>
            <Text style={styles.headerSubtitle}>
              Anticipez votre consommation d'énergie
            </Text>
          </View>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handlePredict}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FF6B00', '#FF8800']}
              style={styles.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Animated.View
                style={[
                  styles.buttonContent,
                  loading && {
                    transform: [
                      {
                        scale: scaleAnim.interpolate({
                          inputRange: [0.95, 1.05],
                          outputRange: [0.98, 1.02],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="crystal-ball"
                  size={24}
                  color="#FFFFFF"
                  style={styles.icon}
                />
                <Text style={styles.buttonText}>
                  {loading ? 'Prédiction en cours...' : 'Lancer la prédiction'}
                </Text>
              </Animated.View>
            </LinearGradient>
          </TouchableOpacity>

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF6B00" />
              <Text style={styles.loadingText}>Analyse en cours...</Text>
              <Text style={styles.loadingSubtext}>
                Calcul de votre consommation future
              </Text>
            </View>
          )}

          {prediction !== null && !loading && (
            <View style={styles.resultBox}>
              <MaterialCommunityIcons
                name="lightning-bolt"
                size={48}
                color="#FF6B00"
                style={styles.resultIcon}
              />
              <Text style={styles.predictionTitle}>
                Consommation prévue dans 2 minutes
              </Text>
              <Text style={styles.predictionValue}>
                {prediction.toFixed(4)}
                <Text style={styles.unit}> kWh</Text>
              </Text>
              {lastUpdate && (
                <Text style={styles.predictionTime}>
                  Dernière mise à jour : {lastUpdate.toLocaleTimeString()}
                </Text>
              )}

              <View style={styles.separator} />

              <View style={styles.statsContainer}>
                <View style={styles.predictionStatItem}>
                  <Text style={styles.statText}>+5%</Text>
                  <Text style={styles.predictionStatLabel}>vs moyenne</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.predictionStatItem}>
                  <Text style={styles.statText}>Modérée</Text>
                  <Text style={styles.predictionStatLabel}>Tendance</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.refreshButton}
                onPress={handlePredict}
              >
                <MaterialCommunityIcons
                  name="refresh"
                  size={16}
                  color="#FF6B00"
                />
                <Text style={styles.refreshText}>Actualiser</Text>
              </TouchableOpacity>
            </View>
          )}

          {error && !loading && (
            <View style={styles.errorBox}>
              <MaterialCommunityIcons
                name="alert-circle"
                size={32}
                color="#FF6B00"
                style={styles.errorIcon}
              />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.tipsContainer}>
            <MaterialCommunityIcons
              name="lightbulb-on"
              size={24}
              color="#FF8800"
            />
            <Text style={styles.tipsText}>
              Conseil : Surveillez régulièrement votre consommation pour
              optimiser votre utilisation d'énergie.
            </Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Comment ça marche ?</Text>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons
                name="chart-line"
                size={24}
                color="#FF8800"
              />
              <Text style={styles.infoText}>
                Analyse en temps réel de votre consommation électrique
              </Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="brain" size={24} color="#FF8800" />
              <Text style={styles.infoText}>
                Utilisation d'algorithmes d'apprentissage automatique
              </Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons
                name="clock-fast"
                size={24}
                color="#FF8800"
              />
              <Text style={styles.infoText}>
                Prédiction précise pour les 2 prochaines minutes
              </Text>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    );
  };

  const renderAnalyticsContent = () => {
    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Analyses</Text>
          <View style={styles.headerIcon}>
            <MaterialCommunityIcons
              name="chart-line"
              size={24}
              color={Colors.primary}
            />
          </View>
        </View>

        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[styles.periodButton, styles.periodButtonActive]}
          >
            <Text
              style={[styles.periodButtonText, styles.periodButtonTextActive]}
            >
              Jour
            </Text>
          </TouchableOpacity>
         
        </View>

        <View style={styles.viewSelector}>
          <TouchableOpacity
            style={[styles.viewButton, styles.viewButtonActive]}
          >
            <MaterialCommunityIcons
              name="chart-line"
              size={20}
              color={Colors.textLight}
            />
            <Text style={[styles.viewButtonText, styles.viewButtonTextActive]}>
              Graphique
            </Text>
          </TouchableOpacity>
          
        </View>

        <View style={styles.contentCard}>
          <Text style={styles.cardTitle}>Consommation Journalière</Text>
          <View style={styles.graphPlaceholder}>
            <GraphiqueScreen/>
          </View>
        </View>

        <View style={styles.contentCard}>
          <Text style={styles.cardTitle}>Statistiques Clés</Text>
          <View style={styles.statsGrid}>
            <View style={styles.analyticsStatItem}>
              <MaterialCommunityIcons
                name="flash"
                size={24}
                color={Colors.primary}
              />
              <Text style={styles.statValue}>12.5 kWh</Text>
              <Text style={styles.analyticsStatLabel}>Pic de consommation</Text>
            </View>
            <View style={styles.analyticsStatItem}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={24}
                color={Colors.primary}
              />
              <Text style={styles.statValue}>14:30</Text>
              <Text style={styles.analyticsStatLabel}>Heure de pointe</Text>
            </View>
            <View style={styles.analyticsStatItem}>
              <MaterialCommunityIcons
                name="trending-down"
                size={24}
                color={Colors.success}
              />
              <Text style={styles.statValue}>3.2 kWh</Text>
              <Text style={styles.analyticsStatLabel}>Consommation min.</Text>
            </View>
            <View style={styles.analyticsStatItem}>
              <MaterialCommunityIcons
                name="cash"
                size={24}
                color={Colors.primary}
              />
              <Text style={styles.statValue}>4,500 FCFA</Text>
              <Text style={styles.analyticsStatLabel}>Coût estimé</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#FF6B00"
        translucent={true}
      />
      <View
        style={[
          styles.tabsContainer,
          Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight },
        ]}
      >
        <TouchableOpacity
          style={[styles.tab, activeTab === 'analytics' && styles.activeTab]}
          onPress={() => handleTabPress('analytics')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="chart-line"
            size={24}
            color={activeTab === 'analytics' ? '#FFFFFF' : '#FF6B00'}
            style={
              activeTab === 'analytics' && {
                textShadowColor: 'rgba(0, 0, 0, 0.1)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
              }
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'analytics' && styles.activeTabText,
            ]}
          >
            Analyses
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'prediction' && styles.activeTab]}
          onPress={() => handleTabPress('prediction')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="crystal-ball"
            size={24}
            color={activeTab === 'prediction' ? '#FFFFFF' : '#FF6B00'}
            style={
              activeTab === 'prediction' && {
                textShadowColor: 'rgba(0, 0, 0, 0.1)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
              }
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'prediction' && styles.activeTabText,
            ]}
          >
            Prédiction
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'prediction'
        ? renderPredictionContent()
        : renderAnalyticsContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  predictionContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 107, 0, 0.1)',
    elevation: 4,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 107, 0, 0.05)',
  },
  activeTab: {
    backgroundColor: '#FF6B00',
    elevation: 4,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  tabText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#FF6B00',
  },
  activeTabText: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  gradientContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height * 0.25,
  },
  buttonContainer: {
    width: '100%',
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    marginBottom: 24,
  },
  button: {
    flex: 1,
    padding: 2,
  },
  buttonContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  icon: {
    marginRight: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 24,
    borderRadius: 20,
    width: '100%',
  },
  loadingText: {
    color: '#FF6B00',
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  loadingSubtext: {
    color: '#FF8800',
    marginTop: 8,
    fontSize: 14,
    opacity: 0.8,
  },
  resultBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 24,
    borderRadius: 24,
    width: '100%',
    elevation: 8,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 0, 0.15)',
    marginBottom: 24,
  },
  resultIcon: {
    marginBottom: 16,
  },
  predictionTitle: {
    color: '#333',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  predictionValue: {
    color: '#FF6B00',
    fontSize: 52,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  unit: {
    fontSize: 24,
    fontWeight: '500',
    color: '#FF8800',
  },
  predictionTime: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.8,
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 107, 0, 0.1)',
    width: '100%',
    marginVertical: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  predictionStatItem: {
    alignItems: 'center',
    flex: 1,
    padding: 12,
    backgroundColor: 'rgba(255, 107, 0, 0.08)',
    borderRadius: 16,
    marginHorizontal: 8,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 107, 0, 0.1)',
    marginHorizontal: 20,
  },
  statText: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
    color: '#FF6B00',
  },
  predictionStatLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
    opacity: 0.9,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 0, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 20,
  },
  refreshText: {
    color: '#FF6B00',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 16,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B00',
    marginBottom: 24,
  },
  errorIcon: {
    marginRight: 12,
  },
  errorText: {
    color: '#FF6B00',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  tipsContainer: {
    backgroundColor: 'rgba(255, 251, 235, 0.95)',
    padding: 20,
    borderRadius: 20,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    shadowColor: '#FF8800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  tipsText: {
    color: '#92400E',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 24,
    borderRadius: 24,
    width: '100%',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 107, 0, 0.08)',
    padding: 16,
    borderRadius: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    marginHorizontal: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    //paddingHorizontal: 1,
    borderRadius: 8,
    alignItems: 'center',
    width : 50
  },
  periodButtonActive: {
    backgroundColor: Colors.primary,
  },
  periodButtonText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  periodButtonTextActive: {
    color: Colors.textLight,
  },
  viewSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginRight: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  viewButtonActive: {
    backgroundColor: Colors.primary,
  },
  viewButtonText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginLeft: 8,
  },
  viewButtonTextActive: {
    color: Colors.textLight,
  },
  contentCard: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    marginHorizontal: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: '700',
    marginBottom: 16,
  },
  graphPlaceholder: {
    height: 200,
    backgroundColor: `${Colors.primary}10`,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  analyticsStatItem: {
    width: '48%',
    backgroundColor: 'rgba(255, 107, 0, 0.08)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: '700',
    marginVertical: 8,
  },
  analyticsStatLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  headerFixed: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 12,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
    opacity: 0.9,
    marginTop: 8,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    color: '#333333',
    fontWeight: '800',
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentPadding: {
    height: 100,
  },
  headerSection: {
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
});

export default AnalyticsScreen;
