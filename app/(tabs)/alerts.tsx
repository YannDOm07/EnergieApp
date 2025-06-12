import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TriangleAlert as AlertTriangle, Zap, TrendingUp, Settings, Bell, BellOff, Clock, Target } from 'lucide-react-native';

export default function AlertsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [peakAlerts, setPeakAlerts] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [deviceAlerts, setDeviceAlerts] = useState(true);

  const alerts = [
    {
      id: 1,
      type: 'peak',
      title: 'Pic de consommation détecté',
      description: 'Climatiseur salon - 1.8 kWh/h depuis 14:30',
      time: '14:35',
      status: 'active',
      severity: 'high',
      device: 'Climatiseur salon',
      consumption: '1.8 kWh/h',
      suggestion: 'Réduire la température de 2°C pour économiser 25% d\'énergie'
    },
    {
      id: 2,
      type: 'budget',
      title: 'Budget quotidien dépassé',
      description: 'Vous avez utilisé 105% de votre budget journalier',
      time: '16:20',
      status: 'resolved',
      severity: 'medium',
      amount: '15,750 FCFA',
      suggestion: 'Évitez l\'utilisation d\'appareils énergivores ce soir'
    },
    {
      id: 3,
      type: 'device',
      title: 'Appareil anormal détecté',
      description: 'Réfrigérateur - Consommation inhabituelle',
      time: '12:15',
      status: 'investigating',
      severity: 'medium',
      device: 'Réfrigérateur cuisine',
      consumption: '0.8 kWh/h',
      suggestion: 'Vérifiez l\'étanchéité des joints et le thermostat'
    },
    {
      id: 4,
      type: 'prediction',
      title: 'Pic prévu ce soir',
      description: 'Consommation élevée prévue entre 19h-21h',
      time: 'Prédiction',
      status: 'upcoming',
      severity: 'low',
      prediction: '3.2 kWh/h estimés',
      suggestion: 'Différez l\'utilisation du lave-linge à demain matin'
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'peak':
        return TrendingUp;
      case 'budget':
        return Target;
      case 'device':
        return Zap;
      case 'prediction':
        return Clock;
      default:
        return AlertTriangle;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return '#DC2626';
      case 'medium':
        return '#EA580C';
      case 'low':
        return '#2563EB';
      default:
        return '#64748B';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: '#FEF2F2', text: '#DC2626' };
      case 'resolved':
        return { bg: '#F0FDF4', text: '#16A34A' };
      case 'investigating':
        return { bg: '#FEF3C7', text: '#D97706' };
      case 'upcoming':
        return { bg: '#EFF6FF', text: '#2563EB' };
      default:
        return { bg: '#F1F5F9', text: '#64748B' };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'resolved':
        return 'Résolu';
      case 'investigating':
        return 'En cours';
      case 'upcoming':
        return 'À venir';
      default:
        return 'Inconnu';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Alertes & Notifications</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color="#64748B" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Global Toggle */}
        <View style={styles.toggleCard}>
          <View style={styles.toggleContent}>
            <View style={styles.toggleIcon}>
              {notificationsEnabled ? (
                <Bell size={20} color="#2563EB" strokeWidth={2} />
              ) : (
                <BellOff size={20} color="#64748B" strokeWidth={2} />
              )}
            </View>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleTitle}>Notifications</Text>
              <Text style={styles.toggleDescription}>
                {notificationsEnabled ? 'Activées' : 'Désactivées'}
              </Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#E2E8F0', true: '#DBEAFE' }}
            thumbColor={notificationsEnabled ? '#2563EB' : '#94A3B8'}
          />
        </View>

        {/* Alert Settings */}
        <View style={styles.settingsCard}>
          <Text style={styles.cardTitle}>Types d'alertes</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <TrendingUp size={20} color="#DC2626" strokeWidth={2} />
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Pics de consommation</Text>
                <Text style={styles.settingDescription}>Quand la consommation dépasse le seuil</Text>
              </View>
            </View>
            <Switch
              value={peakAlerts}
              onValueChange={setPeakAlerts}
              trackColor={{ false: '#E2E8F0', true: '#DBEAFE' }}
              thumbColor={peakAlerts ? '#2563EB' : '#94A3B8'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Target size={20} color="#EA580C" strokeWidth={2} />
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Dépassement de budget</Text>
                <Text style={styles.settingDescription}>À 80% et 100% du budget fixé</Text>
              </View>
            </View>
            <Switch
              value={budgetAlerts}
              onValueChange={setBudgetAlerts}
              trackColor={{ false: '#E2E8F0', true: '#DBEAFE' }}
              thumbColor={budgetAlerts ? '#2563EB' : '#94A3B8'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Zap size={20} color="#10B981" strokeWidth={2} />
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Anomalies d'appareils</Text>
                <Text style={styles.settingDescription}>Comportement inhabituel détecté</Text>
              </View>
            </View>
            <Switch
              value={deviceAlerts}
              onValueChange={setDeviceAlerts}
              trackColor={{ false: '#E2E8F0', true: '#DBEAFE' }}
              thumbColor={deviceAlerts ? '#2563EB' : '#94A3B8'}
            />
          </View>
        </View>

        {/* Recent Alerts */}
        <View style={styles.alertsSection}>
          <Text style={styles.sectionTitle}>Alertes récentes</Text>
          
          {alerts.map((alert) => {
            const IconComponent = getAlertIcon(alert.type);
            const alertColor = getAlertColor(alert.severity);
            const statusColors = getStatusColor(alert.status);
            
            return (
              <View key={alert.id} style={styles.alertCard}>
                <View style={styles.alertHeader}>
                  <View style={styles.alertIconContainer}>
                    <View style={[styles.alertIcon, { backgroundColor: `${alertColor}15` }]}>
                      <IconComponent size={20} color={alertColor} strokeWidth={2} />
                    </View>
                    <View style={styles.alertInfo}>
                      <Text style={styles.alertTitle}>{alert.title}</Text>
                      <Text style={styles.alertDescription}>{alert.description}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.alertMeta}>
                    <Text style={styles.alertTime}>{alert.time}</Text>
                    <View style={[styles.alertStatus, { backgroundColor: statusColors.bg }]}>
                      <Text style={[styles.alertStatusText, { color: statusColors.text }]}>
                        {getStatusText(alert.status)}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Alert Details */}
                <View style={styles.alertDetails}>
                  {alert.device && (
                    <View style={styles.alertDetail}>
                      <Text style={styles.alertDetailLabel}>Appareil:</Text>
                      <Text style={styles.alertDetailValue}>{alert.device}</Text>
                    </View>
                  )}
                  
                  {alert.consumption && (
                    <View style={styles.alertDetail}>
                      <Text style={styles.alertDetailLabel}>Consommation:</Text>
                      <Text style={styles.alertDetailValue}>{alert.consumption}</Text>
                    </View>
                  )}
                  
                  {alert.amount && (
                    <View style={styles.alertDetail}>
                      <Text style={styles.alertDetailLabel}>Montant:</Text>
                      <Text style={styles.alertDetailValue}>{alert.amount}</Text>
                    </View>
                  )}
                  
                  {alert.prediction && (
                    <View style={styles.alertDetail}>
                      <Text style={styles.alertDetailLabel}>Prédiction:</Text>
                      <Text style={styles.alertDetailValue}>{alert.prediction}</Text>
                    </View>
                  )}
                </View>

                {/* Suggestion */}
                {alert.suggestion && (
                  <View style={styles.suggestionContainer}>
                    <Text style={styles.suggestionTitle}>💡 Recommandation</Text>
                    <Text style={styles.suggestionText}>{alert.suggestion}</Text>
                  </View>
                )}

                {/* Actions */}
                <View style={styles.alertActions}>
                  {alert.status === 'active' && (
                    <>
                      <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>Résoudre</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.actionButton, styles.secondaryAction]}>
                        <Text style={[styles.actionButtonText, styles.secondaryActionText]}>
                          Reporter
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                  
                  {alert.status === 'upcoming' && (
                    <TouchableOpacity style={styles.actionButton}>
                      <Text style={styles.actionButtonText}>Programmer alerte</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Smart Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Résumé intelligent</Text>
          
          <View style={styles.summaryStats}>
            <View style={styles.summaryStat}>
              <Text style={styles.summaryStatValue}>7</Text>
              <Text style={styles.summaryStatLabel}>Alertes cette semaine</Text>
            </View>
            <View style={styles.summaryStat}>
              <Text style={styles.summaryStatValue}>12,500</Text>
              <Text style={styles.summaryStatLabel}>FCFA économisés grâce aux alertes</Text>
            </View>
          </View>
          
          <View style={styles.summaryInsight}>
            <Text style={styles.summaryInsightTitle}>Analyse IA</Text>
            <Text style={styles.summaryInsightText}>
              Vos pics de consommation sont principalement liés à l'utilisation simultanée 
              du climatiseur et des appareils de cuisson entre 18h et 20h. 
              Décaler l'un d'eux pourrait vous faire économiser 15% sur votre facture.
            </Text>
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
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  toggleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  toggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '600',
    marginBottom: 2,
  },
  toggleDescription: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  settingsCard: {
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingInfo: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '600',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  alertsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#1E293B',
    fontWeight: '700',
    marginBottom: 16,
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  alertIconContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertInfo: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '600',
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    lineHeight: 20,
  },
  alertMeta: {
    alignItems: 'flex-end',
  },
  alertTime: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 6,
  },
  alertStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  alertStatusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  alertDetails: {
    marginBottom: 12,
  },
  alertDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  alertDetailLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  alertDetailValue: {
    fontSize: 12,
    color: '#1E293B',
    fontWeight: '600',
  },
  suggestionContainer: {
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  suggestionTitle: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '700',
    marginBottom: 4,
  },
  suggestionText: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '500',
    lineHeight: 16,
  },
  alertActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  secondaryAction: {
    backgroundColor: '#F1F5F9',
  },
  secondaryActionText: {
    color: '#64748B',
  },
  summaryCard: {
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
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryStat: {
    alignItems: 'center',
    flex: 0.48,
  },
  summaryStatValue: {
    fontSize: 24,
    color: '#1E293B',
    fontWeight: '800',
    marginBottom: 4,
  },
  summaryStatLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
  },
  summaryInsight: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
  },
  summaryInsightTitle: {
    fontSize: 14,
    color: '#1E40AF',
    fontWeight: '700',
    marginBottom: 8,
  },
  summaryInsightText: {
    fontSize: 14,
    color: '#1E40AF',
    fontWeight: '500',
    lineHeight: 20,
  },
});