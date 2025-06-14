import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  TextInput,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

type MaterialCommunityIconName = keyof typeof MaterialCommunityIcons.glyphMap;

interface ReportType {
  id: string;
  title: string;
  description: string;
  icon: MaterialCommunityIconName;
  color: string;
  urgent: boolean;
}

const reportTypes: ReportType[] = [
  {
    id: 'outage',
    title: 'Panne de courant',
    description: "Signaler une coupure d'électricité",
    icon: 'flash',
    color: '#FF6B00',
    urgent: true,
  },
  {
    id: 'billing',
    title: 'Problème de facturation',
    description: 'Multiplicateur anormal ou erreur de facture',
    icon: 'file-document',
    color: '#FF8800',
    urgent: false,
  },
  {
    id: 'technical',
    title: 'Problème technique',
    description: 'Compteur défaillant ou installation',
    icon: 'alert',
    color: '#2563EB',
    urgent: false,
  },
  {
    id: 'emergency',
    title: 'Urgence électrique',
    description: 'Situation dangereuse nécessitant intervention',
    icon: 'alert-octagon',
    color: '#DC2626',
    urgent: true,
  },
];

export default function ReportsScreen() {
  const [selectedReportType, setSelectedReportType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [showForm, setShowForm] = useState(false);

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
      [
        {
          text: 'OK',
          onPress: () => {
            setShowForm(false);
            setSelectedReportType('');
            setDescription('');
            setLocation('');
          },
        },
      ]
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
    const selectedType = reportTypes.find(
      (type) => type.id === selectedReportType
    );
    const IconComponent = selectedType?.icon || 'file-document';

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
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
              <LinearGradient
                colors={['#FF6B00', '#FF8800']}
                style={styles.gradientBackground}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.gradientOverlay} />
              </LinearGradient>

              <View style={styles.selectedTypeContent}>
                <LinearGradient
                  colors={[
                    `${selectedType.color}20`,
                    `${selectedType.color}10`,
                  ]}
                  style={styles.typeIcon}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <MaterialCommunityIcons
                    name={selectedType.icon}
                    size={28}
                    color={selectedType.color}
                  />
                </LinearGradient>
                <View style={styles.selectedTypeInfo}>
                  <Text style={styles.selectedTypeTitle}>
                    {selectedType.title}
                  </Text>
                  <Text style={styles.selectedTypeDescription}>
                    {selectedType.description}
                  </Text>
                </View>
                {selectedType.urgent && (
                  <View style={styles.urgentBadge}>
                    <Text style={styles.urgentText}>URGENT</Text>
                  </View>
                )}
              </View>
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
                placeholderTextColor={`${Colors.text}50`}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Localisation</Text>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="Quartier, rue, point de repère..."
                placeholderTextColor={`${Colors.text}50`}
              />
            </View>

            <View style={styles.formInfo}>
              <MaterialCommunityIcons
                name="map-marker"
                size={20}
                color={Colors.primary}
              />
              <Text style={styles.formInfoText}>
                Votre position GPS sera automatiquement incluse pour localiser
                précisément le problème.
              </Text>
            </View>
          </View>

          {/* Emergency Contact */}
          {selectedType?.urgent && (
            <View style={styles.emergencyCard}>
              <View style={styles.emergencyHeader}>
                <MaterialCommunityIcons
                  name="alert-octagon"
                  size={24}
                  color="#FF6B00"
                />
                <Text style={styles.emergencyTitle}>Situation d'urgence ?</Text>
              </View>
              <Text style={styles.emergencyDescription}>
                En cas de danger immédiat, contactez directement la CIE.
              </Text>
              <TouchableOpacity style={styles.emergencyButton}>
                <MaterialCommunityIcons
                  name="phone"
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.emergencyButtonText}>
                  Appeler la CIE - Urgence
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleReportSubmit}
          >
            <MaterialCommunityIcons name="send" size={24} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>Envoyer le signalement</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Signalements CIE</Text>
          <TouchableOpacity
  style={styles.emergencyCallButton}
  onPress={() => {
    Linking.openURL('tel:20301010');
  }}
>
  <MaterialCommunityIcons name="phone" size={24} color="#FFFFFF" />
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
                  <LinearGradient
                    colors={[`${type.color}15`, `${type.color}05`]}
                    style={styles.reportTypeIcon}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <MaterialCommunityIcons
                      name={IconComponent}
                      size={28}
                      color={type.color}
                    />
                  </LinearGradient>
                  <Text style={styles.reportTypeTitle}>{type.title}</Text>
                  <Text style={styles.reportTypeDescription}>
                    {type.description}
                  </Text>
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
                    <MaterialCommunityIcons
                      name="map-marker"
                      size={20}
                      color="#64748B"
                    />
                    <Text style={styles.outageArea}>{outage.area}</Text>
                    <View
                      style={[
                        styles.outageStatus,
                        { backgroundColor: statusColors.bg },
                      ]}
                    >
                      <Text
                        style={[
                          styles.outageStatusText,
                          { color: statusColors.text },
                        ]}
                      >
                        {getStatusText(outage.status)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.outageDetails}>
                    <Text style={styles.outageReports}>
                      {outage.reports} signalements
                    </Text>
                    <Text style={styles.outageTime}>
                      ETA: {outage.estimatedFix}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}

          <TouchableOpacity style={styles.viewMapButton}>
            <MaterialCommunityIcons
              name="map-search"
              size={20}
              color={Colors.primary}
            />
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
                    <Text style={styles.reportDescription}>
                      {report.description}
                    </Text>
                  </View>

                  <View style={styles.reportMeta}>
                    <Text style={styles.reportTime}>{report.time}</Text>
                    <View
                      style={[
                        styles.reportStatus,
                        { backgroundColor: statusColors.bg },
                      ]}
                    >
                      <Text
                        style={[
                          styles.reportStatusText,
                          { color: statusColors.text },
                        ]}
                      >
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
            <View style={[styles.contactIcon, { backgroundColor: '#FEF2F2' }]}>
              <MaterialCommunityIcons
                name="phone-alert"
                size={24}
                color="#FF6B00"
              />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Urgences</Text>
              <Text style={styles.contactNumber}>20 30 10 10</Text>
            </View>
            <Text style={styles.contactBadge}>24h/24</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem}>
            <View style={[styles.contactIcon, { backgroundColor: '#EFF6FF' }]}>
              <MaterialCommunityIcons name="phone" size={24} color="#2563EB" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Service client</Text>
              <Text style={styles.contactNumber}>20 30 40 00</Text>
            </View>
            <Text style={styles.contactBadge}>8h-17h</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem}>
            <View style={[styles.contactIcon, { backgroundColor: '#F0FDF4' }]}>
              <MaterialCommunityIcons
                name="file-document"
                size={24}
                color="#059669"
              />
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
    backgroundColor: Colors.background,
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
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    color: Colors.text,
    fontWeight: '800',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: `${Colors.primary}15`,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  emergencyCallButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  quickReportsCard: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    color: Colors.text,
    fontWeight: '700',
    marginBottom: 20,
  },
  reportTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  reportTypeCard: {
    width: '48%',
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  reportTypeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  reportTypeTitle: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  reportTypeDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 18,
  },
  urgentIndicator: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 12,
  },
  urgentIndicatorText: {
    fontSize: 10,
    color: Colors.background,
    fontWeight: '700',
  },
  selectedTypeCard: {
    position: 'relative',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  selectedTypeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  typeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    backgroundColor: '#FFFFFF',
  },
  selectedTypeInfo: {
    flex: 1,
  },
  selectedTypeTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  selectedTypeDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    lineHeight: 20,
    opacity: 0.9,
  },
  urgentBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  urgentText: {
    fontSize: 12,
    color: '#FF6B00',
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  formTitle: {
    fontSize: 20,
    color: Colors.text,
    fontWeight: '700',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.backgroundSecondary,
  },
  textArea: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    minHeight: 120,
    backgroundColor: Colors.backgroundSecondary,
    textAlignVertical: 'top',
  },
  formInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.primary}15`,
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  formInfoText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  emergencyCard: {
    backgroundColor: '#FFF5F5',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B00',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  emergencyTitle: {
    fontSize: 18,
    color: '#FF6B00',
    fontWeight: '700',
    marginLeft: 12,
  },
  emergencyDescription: {
    fontSize: 14,
    color: '#FF6B00',
    fontWeight: '500',
    marginBottom: 16,
    lineHeight: 22,
    opacity: 0.9,
  },
  emergencyButton: {
    backgroundColor: '#FF6B00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emergencyButtonText: {
    fontSize: 16,
    color: Colors.background,
    fontWeight: '700',
    marginLeft: 12,
  },
  submitButton: {
    backgroundColor: '#FF6B00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonText: {
    fontSize: 18,
    color: Colors.background,
    fontWeight: '700',
    marginLeft: 12,
  },
  outageMapCard: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  outageItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: `${Colors.border}50`,
  },
  outageInfo: {
    flex: 1,
  },
  outageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  outageArea: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
  },
  outageStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  outageStatusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  outageDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 32,
  },
  outageReports: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  outageTime: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  viewMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${Colors.primary}15`,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 16,
  },
  viewMapButtonText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: 12,
  },
  recentReportsCard: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  reportItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: `${Colors.border}50`,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  reportInfo: {
    flex: 1,
    marginRight: 16,
  },
  reportTitle: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: 6,
  },
  reportDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
    lineHeight: 20,
  },
  reportMeta: {
    alignItems: 'flex-end',
  },
  reportTime: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: 6,
  },
  reportStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  reportStatusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  reportCrowd: {
    backgroundColor: `${Colors.success}15`,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  reportCrowdText: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '600',
  },
  contactsCard: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: `${Colors.border}50`,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactNumber: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  contactBadge: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '700',
    backgroundColor: `${Colors.success}15`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
});
