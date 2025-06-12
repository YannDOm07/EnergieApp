import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, MessageCircle, Bell, Shield, CreditCard, CircleHelp as HelpCircle, LogOut, CreditCard as Edit, Target, Zap } from 'lucide-react-native';

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [voiceAssistant, setVoiceAssistant] = useState(true);
  const [showChatbot, setShowChatbot] = useState(false);

  const user = {
    name: 'Marie Kouassi',
    email: 'marie.kouassi@email.com',
    phone: '+225 07 12 34 56 78',
    address: 'Cocody, Angré 8ème Tranche',
    accountNumber: 'CIE-1234567890',
    plan: 'Résidentiel Standard',
  };

  const stats = [
    { label: 'kWh économisés ce mois', value: '47.2', icon: Zap, color: '#10B981' },
    { label: 'Objectifs atteints', value: '23', icon: Target, color: '#2563EB' },
    { label: 'FCFA économisés', value: '87,450', icon: CreditCard, color: '#F59E0B' },
  ];

  const chatbotQuestions = [
    "Pourquoi ma facture est-elle élevée ce mois ?",
    "Comment réduire ma consommation d'énergie ?",
    "Quels sont les appareils qui consomment le plus ?",
    "Comment programmer mes alertes ?",
    "Que faire en cas de panne ?",
  ];

  const handleChatbotQuestion = (question: string) => {
    Alert.alert('Chatbot IA', `Vous avez demandé: "${question}"\n\nCette fonctionnalité sera bientôt disponible avec notre assistant IA avancé !`);
    setShowChatbot(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnexion', style: 'destructive', onPress: () => console.log('Logout') }
      ]
    );
  };

  if (showChatbot) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.chatbotContainer}>
          <View style={styles.chatbotHeader}>
            <View style={styles.chatbotAvatar}>
              <MessageCircle size={24} color="#FFFFFF" strokeWidth={2} />
            </View>
            <View style={styles.chatbotInfo}>
              <Text style={styles.chatbotTitle}>Assistant IA EnergieSmart</Text>
              <Text style={styles.chatbotSubtitle}>Comment puis-je vous aider aujourd'hui ?</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowChatbot(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.chatbotContent}>
            <Text style={styles.chatbotWelcome}>
              Bonjour Marie ! Je suis votre assistant IA pour la gestion d'énergie. 
              Voici quelques questions fréquentes :
            </Text>

            {chatbotQuestions.map((question, index) => (
              <TouchableOpacity
                key={index}
                style={styles.questionButton}
                onPress={() => handleChatbotQuestion(question)}
              >
                <Text style={styles.questionText}>{question}</Text>
              </TouchableOpacity>
            ))}

            <View style={styles.chatbotFeatures}>
              <Text style={styles.featuresTitle}>Je peux aussi :</Text>
              <View style={styles.featuresList}>
                <Text style={styles.featureItem}>🎤 Répondre à vos questions vocales</Text>
                <Text style={styles.featureItem}>📊 Analyser votre consommation</Text>
                <Text style={styles.featureItem}>💡 Donner des conseils personnalisés</Text>
                <Text style={styles.featureItem}>⚡ Détecter les anomalies</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Mon Profil</Text>
          <TouchableOpacity style={styles.editButton}>
            <Edit size={20} color="#2563EB" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.userAvatar}>
            <User size={32} color="#2563EB" strokeWidth={2} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.userPhone}>{user.phone}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <View key={index} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
                  <IconComponent size={20} color={stat.color} strokeWidth={2} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            );
          })}
        </View>

        {/* Account Info */}
        <View style={styles.accountCard}>
          <Text style={styles.cardTitle}>Informations du compte</Text>
          
          <View style={styles.accountItem}>
            <Text style={styles.accountLabel}>Numéro de compte CIE</Text>
            <Text style={styles.accountValue}>{user.accountNumber}</Text>
          </View>
          
          <View style={styles.accountItem}>
            <Text style={styles.accountLabel}>Type d'abonnement</Text>
            <Text style={styles.accountValue}>{user.plan}</Text>
          </View>
          
          <View style={styles.accountItem}>
            <Text style={styles.accountLabel}>Adresse</Text>
            <Text style={styles.accountValue}>{user.address}</Text>
          </View>
        </View>

        {/* Chatbot Card */}
        <TouchableOpacity
          style={styles.chatbotCard}
          onPress={() => setShowChatbot(true)}
        >
          <View style={styles.chatbotPreview}>
            <View style={styles.chatbotIcon}>
              <MessageCircle size={24} color="#2563EB" strokeWidth={2} />
            </View>
            <View style={styles.chatbotTextPreview}>
              <Text style={styles.chatbotPreviewTitle}>Assistant IA EnergieSmart</Text>
              <Text style={styles.chatbotPreviewDescription}>
                Posez vos questions sur votre consommation d'énergie
              </Text>
            </View>
          </View>
          <View style={styles.chatbotBadge}>
            <Text style={styles.chatbotBadgeText}>IA</Text>
          </View>
        </TouchableOpacity>

        {/* Settings */}
        <View style={styles.settingsCard}>
          <Text style={styles.cardTitle}>Paramètres</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Bell size={20} color="#64748B" strokeWidth={2} />
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Text style={styles.settingDescription}>Alertes et rappels</Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#E2E8F0', true: '#DBEAFE' }}
              thumbColor={notifications ? '#2563EB' : '#94A3B8'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <MessageCircle size={20} color="#64748B" strokeWidth={2} />
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Assistant vocal</Text>
                <Text style={styles.settingDescription}>Reconnaissance vocale</Text>
              </View>
            </View>
            <Switch
              value={voiceAssistant}
              onValueChange={setVoiceAssistant}
              trackColor={{ false: '#E2E8F0', true: '#DBEAFE' }}
              thumbColor={voiceAssistant ? '#2563EB' : '#94A3B8'}
            />
          </View>
        </View>

        {/* Menu Options */}
        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem}>
            <Settings size={20} color="#64748B" strokeWidth={2} />
            <Text style={styles.menuText}>Paramètres avancés</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Target size={20} color="#64748B" strokeWidth={2} />
            <Text style={styles.menuText}>Objectifs et budgets</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Shield size={20} color="#64748B" strokeWidth={2} />
            <Text style={styles.menuText}>Confidentialité et sécurité</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <HelpCircle size={20} color="#64748B" strokeWidth={2} />
            <Text style={styles.menuText}>Aide et support</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#DC2626" strokeWidth={2} />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>EnergieSmart v1.0.0</Text>
          <Text style={styles.appInfoText}>Développé pour la Côte d'Ivoire</Text>
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
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  userAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    color: '#1E293B',
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flex: 0.32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    color: '#1E293B',
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 14,
  },
  accountCard: {
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
  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  accountLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  accountValue: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
  },
  chatbotCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#E0E7FF',
  },
  chatbotPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chatbotIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chatbotTextPreview: {
    flex: 1,
  },
  chatbotPreviewTitle: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '700',
    marginBottom: 2,
  },
  chatbotPreviewDescription: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    lineHeight: 16,
  },
  chatbotBadge: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  chatbotBadgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  chatbotContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  chatbotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2563EB',
  },
  chatbotAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1D4ED8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chatbotInfo: {
    flex: 1,
  },
  chatbotTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 2,
  },
  chatbotSubtitle: {
    fontSize: 14,
    color: '#DBEAFE',
    fontWeight: '500',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1D4ED8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  chatbotContent: {
    flex: 1,
    padding: 20,
  },
  chatbotWelcome: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  questionButton: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  questionText: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
    lineHeight: 20,
  },
  chatbotFeatures: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
  },
  featuresTitle: {
    fontSize: 16,
    color: '#1E40AF',
    fontWeight: '700',
    marginBottom: 12,
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    fontSize: 14,
    color: '#1E40AF',
    fontWeight: '500',
    lineHeight: 20,
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
  menuCard: {
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  menuText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    marginLeft: 12,
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    fontSize: 16,
    color: '#DC2626',
    fontWeight: '600',
    marginLeft: 8,
  },
  appInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  appInfoText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 2,
  },
});