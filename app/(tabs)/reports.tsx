import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FileText, Zap, TriangleAlert as AlertTriangle, MapPin, Phone, Send, Clock, CircleCheck as CheckCircle } from 'lucide-react-native';

export default function ReportsScreen() {
  const [selectedReportType, setSelectedReportType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [showForm, setShowForm] = useState(false);

  const reportTypes = [
    {
      id: 'outage',
      title: 'Panne de courant',
      description: 'Signaler une coupure d\'électricité',
      icon: Zap,
      color: '#DC2626',
      urgent: true,
    },
    {
      id: 'billing',
      title: 'Problème de facturation',
      description: 'Multiplicateur anormal ou erreur de facture',
      icon: FileText,
      color: '#EA580C',
      urgent: false,
    },
    {
      id: 'technical',
      title: 'Problème technique',
      description: 'Compteur défaillant ou installation',
      icon: AlertTriangle,
      color: '#2563EB',
      urgent: false,
    },
    {
      id: 'emergency',
      title: 'Urgence électrique',
      description: 'Situation dangereuse nécessitant intervention',
      icon: AlertTriangle,
      color: '#DC2626',
      urgent: true,
    },
  ];

  const recentReports = [
    {
      id: 1,
      type: 'outage',
      title: 'Panne secteur Cocody',
      description: 'Coupure depuis 14h30 - Quartier Angré',
      status: 'investigating',
      time: '15:45',
      reporterCount: 47,
    },
    {
      id: 2,
      type: 'billing',
      title: 'Multiplicateur anormal',
      description: 'Facture x3 par rapport au mois dernier',
      status: 'resolved',
      time: '12:30',
      reporterCount: 1,
    },
    {
      id: 3,
      type: 'technical',
      title: 'Compteur défaillant',
      description: 'Affichage erroné - Plateau',
      status: 'pending',
      time: '09:15',
      reporterCount: 3,
    },
  ];

  const outageMaps = [
    {
      area: 'Cocody - Angré',
      reports: 47,
      status: 'investigating',
      estimatedFix: '18:00',
    },
    {
      area: 'Yopougon - Niangon',
      reports: 23,
      status: 'resolved',
      estimatedFix: 'Résolu',
    },
    {
      area: 'Plateau - Centre',
      reports: 8,
      status: 'pending',
      estimatedFix: 'En attente',
    },
  ];

  const handleReportSubmit = () => {
    if (!selectedReportType || !description) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    Alert.alert(
      'Signalement envoyé',
      'Votre signalement a été transmis à la CIE. Vous recevrez une confirmation par SMS.',
      [{ text: 'OK', onPress: () => {
        setShowForm(false);
        setSelectedReportType('');
        setDescription('');
        setLocation('');
      }}]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'investigating':
        return { bg: '#FEF3C7', text: '#D97706' };
      case 'resolved':
        return { bg: '#F0FDF4', text: '#16A34A' };
      case 'pending':
        return { bg: '#EFF6FF', text: '#2563EB' };
      default:
        return { bg: '#F1F5F9', text: '#64748B' };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'investigating':
        return 'En cours';
      case 'resolved':
        return 'Résolu';
      case 'pending':
        return 'En attente';
      default:
        return 'Inconnu';
    }
  };

  if (showForm) {
    const selectedType = reportTypes.find(type => type.id === selectedReportType);
    const IconComponent = selectedType?.icon || FileText;

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setShowForm(false)}
            >
              <Text style={styles.backButtonText}>← Retour</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Nouveau signalement</Text>
          </View>

          {/* Selected Type */}
          {selectedType && (
            <View style={styles.selectedTypeCard}>
              <View style={[styles.typeIcon, { backgroundColor: `${selectedType.color}15` }]}>
                <IconComponent size={24} color={selectedType.color} strokeWidth={2} />
              </View>
              <View style={styles.selectedTypeInfo}>
                <Text style={styles.selectedTypeTitle}>{selectedType.title}</Text>
                <Text style={styles.selectedTypeDescription}>{selectedType.description}</Text>
              </View>
              {selectedType.urgent && (
                <View style={styles.urgentBadge}>
                  <Text style={styles.urgentText}>URGENT</Text>
                </View>
              )}
            </View>
          )}

          {/* Form */}
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Détails du signalement</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={styles.textArea}
                value={description}
                onChangeText={setDescription}
                placeholder="Décrivez en détail le problème rencontré..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Localisation</Text>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="Quartier, rue, point de repère..."
              />
            </View>

            <View style={styles.formInfo}>
              <MapPin size={16} color="#64748B" strokeWidth={2} />
              <Text style={styles.formInfoText}>
                Votre position GPS sera automatiquement incluse pour localiser précisément le problème.
              </Text>
            </View>
          </View>

          {/* Emergency Contact */}
          {selectedType?.urgent && (
            <View style={styles.emergencyCard}>
              <View style={styles.emergencyHeader}>
                <AlertTriangle size={20} color="#DC2626" strokeWidth={2} />
                <Text style={styles.emergencyTitle}>Situation d'urgence ?</Text>
              </View>
              <Text style={styles.emergencyDescription}>
                En cas de danger immédiat, contactez directement la CIE.
              </Text>
              <TouchableOpacity style={styles.emergencyButton}>
                <Phone size={16} color="#FFFFFF" strokeWidth={2} />
                <Text style={styles.emergencyButtonText}>Appeler la CIE - Urgence</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleReportSubmit}>
            <Send size={20} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.submitButtonText}>Envoyer le signalement</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Signalements CIE</Text>
          <TouchableOpacity style={styles.emergencyCallButton}>
            <Phone size={20} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Quick Report Types */}
        <View style={styles.quickReportsCard}>
          <Text style={styles.cardTitle}>Que souhaitez-vous signaler ?</Text>
          
          <View style={styles.reportTypesGrid}>
            {reportTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <TouchableOpacity
                  key={type.id}
                  style={styles.reportTypeCard}
                  onPress={() => {
                    setSelectedReportType(type.id);
                    setShowForm(true);
                  }}
                >
                  <View style={[styles.reportTypeIcon, { backgroundColor: `${type.color}15` }]}>
                    <IconComponent size={24} color={type.color} strokeWidth={2} />
                  </View>
                  <Text style={styles.reportTypeTitle}>{type.title}</Text>
                  <Text style={styles.reportTypeDescription}>{type.description}</Text>
                  {type.urgent && (
                    <View style={styles.urgentIndicator}>
                      <Text style={styles.urgentIndicatorText}>URGENT</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Outage Map */}
        <View style={styles.outageMapCard}>
          <Text style={styles.cardTitle}>Carte des pannes signalées</Text>
          
          {outageMaps.map((outage, index) => {
            const statusColors = getStatusColor(outage.status);
            return (
              <View key={index} style={styles.outageItem}>
                <View style={styles.outageInfo}>
                  <View style={styles.outageHeader}>
                    <MapPin size={16} color="#64748B" strokeWidth={2} />
                    <Text style={styles.outageArea}>{outage.area}</Text>
                    <View style={[styles.outageStatus, { backgroundColor: statusColors.bg }]}>
                      <Text style={[styles.outageStatusText, { color: statusColors.text }]}>
                        {getStatusText(outage.status)}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.outageDetails}>
                    <Text style={styles.outageReports}>{outage.reports} signalements</Text>
                    <Text style={styles.outageTime}>ETA: {outage.estimatedFix}</Text>
                  </View>
                </View>
              </View>
            );
          })}
          
          <TouchableOpacity style={styles.viewMapButton}>
            <MapPin size={16} color="#2563EB" strokeWidth={2} />
            <Text style={styles.viewMapButtonText}>Voir la carte complète</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Reports */}
        <View style={styles.recentReportsCard}>
          <Text style={styles.cardTitle}>Vos signalements récents</Text>
          
          {recentReports.map((report) => {
            const statusColors = getStatusColor(report.status);
            return (
              <View key={report.id} style={styles.reportItem}>
                <View style={styles.reportHeader}>
                  <View style={styles.reportInfo}>
                    <Text style={styles.reportTitle}>{report.title}</Text>
                    <Text style={styles.reportDescription}>{report.description}</Text>
                  </View>
                  
                  <View style={styles.reportMeta}>
                    <Text style={styles.reportTime}>{report.time}</Text>
                    <View style={[styles.reportStatus, { backgroundColor: statusColors.bg }]}>
                      <Text style={[styles.reportStatusText, { color: statusColors.text }]}>
                        {getStatusText(report.status)}
                      </Text>
                    </View>
                  </View>
                </View>
                
                {report.reporterCount > 1 && (
                  <View style={styles.reportCrowd}>
                    <Text style={styles.reportCrowdText}>
                      {report.reporterCount} personnes ont signalé ce problème
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* CIE Contacts */}
        <View style={styles.contactsCard}>
          <Text style={styles.cardTitle}>Contacts CIE</Text>
          
          <TouchableOpacity style={styles.contactItem}>
            <View style={styles.contactIcon}>
              <Phone size={20} color="#DC2626" strokeWidth={2} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Urgences</Text>
              <Text style={styles.contactNumber}>20 30 10 10</Text>
            </View>
            <Text style={styles.contactBadge}>24h/24</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactItem}>
            <View style={styles.contactIcon}>
              <Phone size={20} color="#2563EB" strokeWidth={2} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Service client</Text>
              <Text style={styles.contactNumber}>20 30 40 00</Text>
            </View>
            <Text style={styles.contactBadge}>8h-17h</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactItem}>
            <View style={styles.contactIcon}>
              <FileText size={20} color="#059669" strokeWidth={2} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Réclamations</Text>
              <Text style={styles.contactNumber}>20 30 50 00</Text>
            </View>
            <Text style={styles.contactBadge}>8h-16h</Text>
          </TouchableOpacity>
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
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
  },
  emergencyCallButton: {
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
  quickReportsCard: {
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
  reportTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  reportTypeCard: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reportTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportTypeTitle: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  reportTypeDescription: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 16,
  },
  urgentIndicator: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 8,
  },
  urgentIndicatorText: {
    fontSize: 8,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  selectedTypeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  selectedTypeInfo: {
    flex: 1,
  },
  selectedTypeTitle: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '700',
    marginBottom: 2,
  },
  selectedTypeDescription: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  urgentBadge: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  urgentText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  formCard: {
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
  formTitle: {
    fontSize: 18,
    color: '#1E293B',
    fontWeight: '700',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1F2937',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1F2937',
    minHeight: 100,
  },
  formInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  formInfoText: {
    fontSize: 12,
    color: '#075985',
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  emergencyCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  emergencyTitle: {
    fontSize: 16,
    color: '#DC2626',
    fontWeight: '700',
    marginLeft: 8,
  },
  emergencyDescription: {
    fontSize: 14,
    color: '#991B1B',
    fontWeight: '500',
    marginBottom: 12,
    lineHeight: 20,
  },
  emergencyButton: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  emergencyButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 20,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: 8,
  },
  outageMapCard: {
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
  outageItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  outageInfo: {
    flex: 1,
  },
  outageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  outageArea: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  outageStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  outageStatusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  outageDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 24,
  },
  outageReports: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  outageTime: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  viewMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  viewMapButtonText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
    marginLeft: 8,
  },
  recentReportsCard: {
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
  reportItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reportInfo: {
    flex: 1,
    marginRight: 12,
  },
  reportTitle: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
    marginBottom: 4,
  },
  reportDescription: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    lineHeight: 16,
  },
  reportMeta: {
    alignItems: 'flex-end',
  },
  reportTime: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 4,
  },
  reportStatus: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  reportStatusText: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  reportCrowd: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  reportCrowdText: {
    fontSize: 11,
    color: '#166534',
    fontWeight: '600',
  },
  contactsCard: {
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
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
    marginBottom: 2,
  },
  contactNumber: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  contactBadge: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '700',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
});