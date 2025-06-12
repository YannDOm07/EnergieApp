import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Calendar, Zap, DollarSign, ChartBar as BarChart3, ChartPie as PieChart } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('semaine');
  const [selectedView, setSelectedView] = useState('consumption');

  const periods = [
    { id: 'jour', label: 'Jour' },
    { id: 'semaine', label: 'Semaine' },
    { id: 'mois', label: 'Mois' },
    { id: 'annee', label: 'Année' },
  ];

  const views = [
    { id: 'consumption', label: 'Consommation', icon: Zap },
    { id: 'cost', label: 'Coûts', icon: DollarSign },
  ];

  // Mock data for charts
  const weeklyData = [
    { day: 'Lun', consumption: 18, cost: 12500 },
    { day: 'Mar', consumption: 22, cost: 15800 },
    { day: 'Mer', consumption: 16, cost: 11200 },
    { day: 'Jeu', consumption: 24, cost: 17300 },
    { day: 'Ven', consumption: 19, cost: 13600 },
    { day: 'Sam', consumption: 28, cost: 21400 },
    { day: 'Dim', consumption: 25, cost: 18900 },
  ];

  const deviceUsage = [
    { name: 'Climatisation', percentage: 45, color: '#2563EB' },
    { name: 'Réfrigérateur', percentage: 20, color: '#10B981' },
    { name: 'Éclairage', percentage: 15, color: '#F59E0B' },
    { name: 'Électroménager', percentage: 12, color: '#8B5CF6' },
    { name: 'Autres', percentage: 8, color: '#64748B' },
  ];

  const renderBarChart = () => {
    const maxValue = Math.max(...weeklyData.map(d => selectedView === 'consumption' ? d.consumption : d.cost));
    
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>
          {selectedView === 'consumption' ? 'Consommation hebdomadaire (kWh)' : 'Coûts hebdomadaires (FCFA)'}
        </Text>
        
        <View style={styles.barChart}>
          {weeklyData.map((item, index) => {
            const value = selectedView === 'consumption' ? item.consumption : item.cost;
            const height = (value / maxValue) * 120;
            
            return (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: height,
                        backgroundColor: selectedView === 'consumption' ? '#2563EB' : '#10B981'
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.barLabel}>{item.day}</Text>
                <Text style={styles.barValue}>
                  {selectedView === 'consumption' 
                    ? `${value}kWh` 
                    : `${(value/1000).toFixed(1)}k`
                  }
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderPieChart = () => {
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Répartition par appareil</Text>
        
        <View style={styles.pieChartContainer}>
          <View style={styles.pieChart}>
            {deviceUsage.map((item, index) => (
              <View key={index} style={styles.pieSlice}>
                <View 
                  style={[
                    styles.pieSliceIndicator, 
                    { backgroundColor: item.color }
                  ]} 
                />
                <Text style={styles.pieSliceText}>{item.percentage}%</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.legend}>
            {deviceUsage.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View 
                  style={[
                    styles.legendColor, 
                    { backgroundColor: item.color }
                  ]} 
                />
                <Text style={styles.legendText}>{item.name}</Text>
                <Text style={styles.legendPercentage}>{item.percentage}%</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Analyses & Prédictions</Text>
          <View style={styles.headerIcon}>
            <BarChart3 size={24} color="#2563EB" strokeWidth={2} />
          </View>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.id}
              style={[
                styles.periodButton,
                selectedPeriod === period.id && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod(period.id)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period.id && styles.periodButtonTextActive
              ]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* View Selector */}
        <View style={styles.viewSelector}>
          {views.map((view) => {
            const IconComponent = view.icon;
            return (
              <TouchableOpacity
                key={view.id}
                style={[
                  styles.viewButton,
                  selectedView === view.id && styles.viewButtonActive
                ]}
                onPress={() => setSelectedView(view.id)}
              >
                <IconComponent 
                  size={20} 
                  color={selectedView === view.id ? '#FFFFFF' : '#64748B'} 
                  strokeWidth={2} 
                />
                <Text style={[
                  styles.viewButtonText,
                  selectedView === view.id && styles.viewButtonTextActive
                ]}>
                  {view.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>132</Text>
            <Text style={styles.metricLabel}>kWh ce mois</Text>
            <View style={styles.metricTrend}>
              <TrendingUp size={14} color="#10B981" strokeWidth={2} />
              <Text style={styles.metricTrendText}>-12% vs mois dernier</Text>
            </View>
          </View>
          
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>87,450</Text>
            <Text style={styles.metricLabel}>FCFA économisés</Text>
            <View style={styles.metricTrend}>
              <TrendingUp size={14} color="#10B981" strokeWidth={2} />
              <Text style={styles.metricTrendText}>+18% d'économies</Text>
            </View>
          </View>
        </View>

        {/* Bar Chart */}
        {renderBarChart()}

        {/* Device Usage Pie Chart */}
        {renderPieChart()}

        {/* AI Predictions */}
        <View style={styles.predictionsCard}>
          <Text style={styles.cardTitle}>Prédictions IA</Text>
          
          <View style={styles.prediction}>
            <View style={styles.predictionHeader}>
              <Text style={styles.predictionTitle}>Facture prévue ce mois</Text>
              <Text style={styles.predictionValue}>142,300 FCFA</Text>
            </View>
            <Text style={styles.predictionDetail}>
              Basée sur votre consommation actuelle, vous économiserez 15,700 FCFA par rapport au mois dernier.
            </Text>
            <View style={styles.predictionProgress}>
              <View style={styles.predictionProgressBar}>
                <View style={[styles.predictionProgressFill, { width: '68%' }]} />
              </View>
              <Text style={styles.predictionProgressText}>68% du budget mensuel</Text>
            </View>
          </View>
          
          <View style={styles.prediction}>
            <View style={styles.predictionHeader}>
              <Text style={styles.predictionTitle}>Pic prévu aujourd'hui</Text>
              <Text style={styles.predictionTime}>19h - 21h</Text>
            </View>
            <Text style={styles.predictionDetail}>
              Utilisation climatisation + cuisson. Consommation estimée: 3.2 kWh/h
            </Text>
            <TouchableOpacity style={styles.predictionAction}>
              <Text style={styles.predictionActionText}>Programmer une alerte</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Efficiency Score */}
        <View style={styles.efficiencyCard}>
          <Text style={styles.cardTitle}>Score d'Efficacité</Text>
          
          <View style={styles.scoreContainer}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreValue}>87</Text>
              <Text style={styles.scoreLabel}>/ 100</Text>
            </View>
            <View style={styles.scoreDetails}>
              <View style={styles.scoreItem}>
                <Text style={styles.scoreItemLabel}>Consommation optimisée</Text>
                <View style={styles.scoreBar}>
                  <View style={[styles.scoreBarFill, { width: '85%', backgroundColor: '#10B981' }]} />
                </View>
              </View>
              <View style={styles.scoreItem}>
                <Text style={styles.scoreItemLabel}>Respect du budget</Text>
                <View style={styles.scoreBar}>
                  <View style={[styles.scoreBarFill, { width: '92%', backgroundColor: '#10B981' }]} />
                </View>
              </View>
              <View style={styles.scoreItem}>
                <Text style={styles.scoreItemLabel}>Heures de pointe évitées</Text>
                <View style={styles.scoreBar}>
                  <View style={[styles.scoreBarFill, { width: '78%', backgroundColor: '#F59E0B' }]} />
                </View>
              </View>
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
  title: {
    fontSize: 28,
    color: '#1E293B',
    fontWeight: '800',
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#2563EB',
  },
  periodButtonText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  viewSelector: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  viewButtonActive: {
    backgroundColor: '#2563EB',
  },
  viewButtonText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    marginLeft: 8,
  },
  viewButtonTextActive: {
    color: '#FFFFFF',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
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
  metricValue: {
    fontSize: 24,
    color: '#1E293B',
    fontWeight: '800',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 8,
  },
  metricTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricTrendText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginLeft: 4,
  },
  chartContainer: {
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
  chartTitle: {
    fontSize: 18,
    color: '#1E293B',
    fontWeight: '700',
    marginBottom: 20,
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    height: 120,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: 24,
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 4,
  },
  barValue: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
  },
  pieChartContainer: {
    alignItems: 'center',
  },
  pieChart: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E2E8F0',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieSlice: {
    position: 'absolute',
  },
  pieSliceIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pieSliceText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  legend: {
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  legendText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  legendPercentage: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  predictionsCard: {
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
  prediction: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  predictionTitle: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '600',
  },
  predictionValue: {
    fontSize: 18,
    color: '#2563EB',
    fontWeight: '800',
  },
  predictionTime: {
    fontSize: 14,
    color: '#EA580C',
    fontWeight: '700',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  predictionDetail: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 12,
    lineHeight: 20,
  },
  predictionProgress: {
    marginBottom: 8,
  },
  predictionProgressBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    marginBottom: 6,
  },
  predictionProgressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 3,
  },
  predictionProgressText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  predictionAction: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  predictionActionText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
  },
  efficiencyCard: {
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
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  scoreValue: {
    fontSize: 24,
    color: '#2563EB',
    fontWeight: '800',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  scoreDetails: {
    flex: 1,
  },
  scoreItem: {
    marginBottom: 12,
  },
  scoreItemLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 4,
  },
  scoreBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});