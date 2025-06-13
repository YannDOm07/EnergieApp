import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWebSocketConso } from '../../hooks/useWebSocketConso'; // Assure-toi que ce chemin est correct
import { Zap, TrendingUp, TrendingDown, CircleAlert as AlertCircle, Target, Phone } from 'lucide-react-native';

export default function HomeScreen() {
  const data = useWebSocketConso();
  const currentConsumption = data?.['Consommation_totale(W)'] || 0;
  const isRealTime = !!data;

  const [dailyBudget] = useState(15000); // FCFA
  const [currentSpent, setCurrentSpent] = useState(8750);

  const handleEmergencyCall = () => {
    const cieNumber = '20301010';
    if (Platform.OS !== 'web') {
      Linking.openURL(`tel:${cieNumber}`);
    } else {
      alert(`Numéro CIE: ${cieNumber}`);
    }
  };

  const budgetPercentage = (currentSpent / dailyBudget) * 100;
  const consumptionStatus = budgetPercentage > 80 ? 'danger' : budgetPercentage > 60 ? 'warning' : 'good';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bonjour,</Text>
            <Text style={styles.userName}>Marie Kouassi</Text>
          </View>
          <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyCall}>
            <Phone size={20} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Current Consumption Card */}
        <View style={styles.consumptionCard}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Zap size={24} color="#2563EB" strokeWidth={2} />
            </View>
            <View style={styles.realTimeIndicator}>
              <View style={[styles.dot, { backgroundColor: isRealTime ? '#10B981' : '#64748B' }]} />
              <Text style={styles.realTimeText}>
                {isRealTime ? 'Temps réel' : 'Hors ligne'}
              </Text>
            </View>
          </View>
          <Text style={styles.consumptionValue2}>Votre consommation :</Text>
          <Text style={styles.consumptionValue}>{(currentConsumption / 1000).toFixed(2)} kWh</Text>
          



          <View style={styles.consumptionDetails}>
            <View style={styles.detailItem}>
              <TrendingUp size={16} color="#10B981" strokeWidth={2} />
              <Text style={styles.detailText}>+12% vs hier</Text>
            </View>
            <View style={styles.detailItem}>
              <Target size={16} color="#2563EB" strokeWidth={2} />
              <Text style={styles.detailText}>Objectif: 20 kWh/jour</Text>
            </View>
          </View>
        </View>

        {/* Budget Progress Card */}
        <View style={styles.budgetCard}>
          <Text style={styles.cardTitle}>Budget Journalier</Text>

          <View style={styles.budgetHeader}>
            <Text style={styles.budgetAmount}>{currentSpent.toLocaleString()} FCFA</Text>
            <Text style={styles.budgetTotal}>/ {dailyBudget.toLocaleString()} FCFA</Text>
          </View>

          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${Math.min(budgetPercentage, 100)}%`,
                    backgroundColor:
                      consumptionStatus === 'danger'
                        ? '#DC2626'
                        : consumptionStatus === 'warning'
                        ? '#EA580C'
                        : '#10B981',
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{budgetPercentage.toFixed(0)}%</Text>
          </View>

          {budgetPercentage > 80 && (
            <View style={styles.warningContainer}>
              <AlertCircle size={16} color="#DC2626" strokeWidth={2} />
              <Text style={styles.warningText}>
                Attention ! Vous avez dépassé 80% de votre budget quotidien.
              </Text>
            </View>
          )}
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>157</Text>
            <Text style={styles.statLabel}>kWh ce mois</Text>
            <View style={styles.statTrend}>
              <TrendingDown size={12} color="#10B981" strokeWidth={2} />
              <Text style={styles.statTrendText}>-8%</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>42,350</Text>
            <Text style={styles.statLabel}>FCFA économisés</Text>
            <View style={styles.statTrend}>
              <TrendingUp size={12} color="#10B981" strokeWidth={2} />
              <Text style={styles.statTrendText}>+15%</Text>
            </View>
          </View>
        </View>

        {/* Smart Recommendations */}
        <View style={styles.recommendationsCard}>
          <Text style={styles.cardTitle}>Recommandations IA</Text>

          <View style={styles.recommendation}>
            <View style={styles.recommendationIcon}>
              <Zap size={16} color="#2563EB" strokeWidth={2} />
            </View>
            <View style={styles.recommendationContent}>
              <Text style={styles.recommendationText}>
                Éteignez votre climatiseur entre 22h et 6h pour économiser 2,500 FCFA par semaine.
              </Text>
              <Text style={styles.recommendationSavings}>Économie: 2,500 FCFA/semaine</Text>
            </View>
          </View>

          <View style={styles.recommendation}>
            <View style={styles.recommendationIcon}>
              <Target size={16} color="#059669" strokeWidth={2} />
            </View>
            <View style={styles.recommendationContent}>
              <Text style={styles.recommendationText}>
                Utilisez votre lave-linge en journée pour profiter des tarifs préférentiels.
              </Text>
              <Text style={styles.recommendationSavings}>Économie: 800 FCFA/mois</Text>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activityCard}>
          <Text style={styles.cardTitle}>Activité Récente</Text>

          <View style={styles.activityItem}>
            <View style={styles.activityTime}>
              <Text style={styles.activityTimeText}>14:30</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Pic de consommation détecté</Text>
              <Text style={styles.activityDescription}>Climatiseur salon - 1.8 kWh/h</Text>
            </View>
            <View style={[styles.activityStatus, { backgroundColor: '#FEF3C7' }]}>
              <Text style={[styles.activityStatusText, { color: '#92400E' }]}>Résolu</Text>
            </View>
          </View>

          <View style={styles.activityItem}>
            <View style={styles.activityTime}>
              <Text style={styles.activityTimeText}>12:15</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Objectif atteint</Text>
              <Text style={styles.activityDescription}>Budget matinal respecté</Text>
            </View>
            <View style={[styles.activityStatus, { backgroundColor: '#D1FAE5' }]}>
              <Text style={[styles.activityStatusText, { color: '#065F46' }]}>Succès</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  userName: {
    fontSize: 24,
    color: '#1E293B',
    fontWeight: '700',
    marginTop: 2,
  },
  emergencyButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  consumptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  realTimeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  realTimeText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  consumptionValue: {
    fontSize: 48,
    color: '#1E293B',
    fontWeight: '800',
    lineHeight: 56,
  },
  consumptionValue2: {
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '800',
    lineHeight: 56,
  },
  consumptionUnit: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 16,
  },
  consumptionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    marginLeft: 6,
  },
  budgetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    color: '#1E293B',
    fontWeight: '700',
    marginBottom: 16,
  },
  budgetHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  budgetAmount: {
    fontSize: 32,
    color: '#1E293B',
    fontWeight: '800',
  },
  budgetTotal: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
    marginLeft: 8,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    marginRight: 12,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  warningText: {
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flex: 0.48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statValue: {
    fontSize: 24,
    color: '#1E293B',
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 8,
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statTrendText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginLeft: 4,
  },
  recommendationsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  recommendation: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  recommendationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginBottom: 4,
    lineHeight: 20,
  },
  recommendationSavings: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityTime: {
    width: 50,
    marginRight: 12,
  },
  activityTimeText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  activityContent: {
    flex: 1,
    marginRight: 12,
  },
  activityTitle: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  activityStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activityStatusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});