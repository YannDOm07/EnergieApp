import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const questionsSuggestions = [
  'Quelle est ma dernière consommation ?',
  'Quelle est la conso par appareil ?',
  'Ma conso totale actuelle ?',
  'Quel est le total actuel ?',
];

type DonneeConso = {
  'Consommation_totale(W)': number;
  time_info: {
    timestamp: string;
    moment_de_la_journee: string;
  };
  [key: string]: any;
};

const ChatbotScreen: React.FC = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<string[]>([]);
  const [derniereDonnee, setDerniereDonnee] = useState<DonneeConso | null>(
    null
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [discussions, setDiscussions] = useState<
    { id: string; messages: string[] }[]
  >([]);
  const [currentDiscussionId, setCurrentDiscussionId] = useState<string | null>(
    null
  );
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const ws = useRef<WebSocket | null>(null);

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

    ws.current = new WebSocket('ws://192.168.43.254:8765');

    ws.current.onopen = () => {
      addMessageToDiscussion('🟢');
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setDerniereDonnee(data);
      } catch {
        addMessageToDiscussion('❌ Erreur lors de la réception de la donnée');
      }
    };

    ws.current.onerror = () => {
      addMessageToDiscussion('🚫 Erreur de connexion WebSocket');
    };

    ws.current.onclose = () => {
      addMessageToDiscussion('🔌 WebSocket déconnecté');
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const addMessageToDiscussion = (text: string) => {
    setChat((prev) => {
      const updated = [...prev, text];
      if (currentDiscussionId) {
        setDiscussions((prevDiscussions) =>
          prevDiscussions.map((disc) =>
            disc.id === currentDiscussionId
              ? { ...disc, messages: updated }
              : disc
          )
        );
      }
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      return updated;
    });
  };

  const createNewDiscussion = () => {
    const newId = Date.now().toString();
    setCurrentDiscussionId(newId);
    setChat([]);
    setDiscussions((prev) => [...prev, { id: newId, messages: [] }]);
  };

  const traiterQuestion = (customMessage?: string) => {
    const question = (customMessage || message).toLowerCase().trim();
    addMessageToDiscussion(`👤 Vous : ${customMessage || message}`);
    setMessage('');
    setShowSuggestions(false);

    const motsClefsConso = [
      'consommation',
      'conso',
      'énergie',
      'energie',
      'dépense',
      'depense',
      'utilisation',
      'courant',
      'puissance',
      'watts',
      'watt',
      'électrique',
      'électricité',
      'appareils',
      'appareil',
      'total',
      'consomme',
      'consomment',
      'consommé',
      'consommée',
      'ma conso',
      'conso totale',
      'total actuel',
      'ma consommation',
    ];

    const motsClefsTemps = [
      'dernière',
      'derniere',
      'actuelle',
      'maintenant',
      'présente',
      'actuel',
      'en ce moment',
    ];

    const questionConso = motsClefsConso.some((mot) => question.includes(mot));
    const questionTemps = motsClefsTemps.some((mot) => question.includes(mot));
    const questionParAppareil =
      question.includes('par appareil') || question.includes('chaque appareil');

    if (questionConso && questionParAppareil && derniereDonnee) {
      let reponse = '📊 Consommation par appareil :\n';
      for (const [appareil, valeur] of Object.entries(derniereDonnee)) {
        if (
          appareil !== 'Consommation_totale(W)' &&
          appareil !== 'time_info' &&
          typeof valeur === 'number'
        ) {
          reponse += `  - ${appareil} : ${valeur} W\n`;
        }
      }
      reponse += `📅 Relevé effectué le ${derniereDonnee.time_info?.timestamp}`;
      addMessageToDiscussion(reponse);
    } else if (questionConso && (questionTemps || question.includes('total'))) {
      if (derniereDonnee) {
        let reponse = '⚡ Consommation totale actuelle :\n';
        reponse += `📅 Date/heure : ${derniereDonnee.time_info?.timestamp}\n`;
        reponse += `⚡ Total : ${derniereDonnee['Consommation_totale(W)']} W`;
        addMessageToDiscussion(reponse);
      } else {
        addMessageToDiscussion('🤖 Aucune donnée reçue pour le moment.');
      }
    } else {
      addMessageToDiscussion("🤖 Je n'ai pas compris.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#FF6B00"
        translucent={true}
      />
      <LinearGradient
        colors={['#FF6B00', '#FF8800', '#FFA200']}
        style={[
          styles.gradientHeader,
          Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight },
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>Assistant Énergétique</Text>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {discussions.length > 0 && (
          <ScrollView
            horizontal
            style={styles.historyBar}
            showsHorizontalScrollIndicator={false}
          >
            {discussions.map((d) => (
              <TouchableOpacity
                key={d.id}
                onPress={() => {
                  setCurrentDiscussionId(d.id);
                  setChat(d.messages);
                }}
                style={[
                  styles.historyButton,
                  currentDiscussionId === d.id && styles.historyButtonActive,
                ]}
              >
                <MaterialCommunityIcons name="chat" size={20} color="#FF6B00" />
                <Text style={styles.historyButtonText}>
                  {new Date(parseInt(d.id)).toLocaleTimeString()}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={createNewDiscussion}
              style={styles.newChatButton}
            >
              <MaterialCommunityIcons
                name="plus-circle"
                size={20}
                color="#fff"
              />
              <Text style={styles.newChatButtonText}>Nouvelle</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        <ScrollView
          ref={scrollViewRef}
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {chat.map((line, index) => (
            <Animated.View
              key={index}
              style={[
                styles.messageBubble,
                line.startsWith('👤') ? styles.userBubble : styles.botBubble,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  line.startsWith('👤')
                    ? styles.userMessageText
                    : styles.botMessageText,
                ]}
              >
                {line}
              </Text>
            </Animated.View>
          ))}
        </ScrollView>

        {showSuggestions && (
          <View style={styles.suggestionsContainer}>
            {questionsSuggestions.map((q, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => traiterQuestion(q)}
                style={styles.suggestionBtn}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['rgba(255, 107, 0, 0.1)', 'rgba(255, 136, 0, 0.1)']}
                  style={styles.suggestionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.suggestionText}>{q}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Posez une question..."
            placeholderTextColor="#999"
            value={message}
            onChangeText={setMessage}
            style={styles.input}
          />
          <TouchableOpacity
            onPress={() => traiterQuestion()}
            style={styles.sendButton}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="send" size={24} color="#FF6B00" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.suggestionToggle}
          onPress={() => setShowSuggestions(!showSuggestions)}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name={showSuggestions ? 'chevron-down' : 'chevron-up'}
            size={24}
            color="#FF6B00"
          />
          <Text style={styles.suggestionToggleText}>
            {showSuggestions
              ? 'Masquer les suggestions'
              : 'Afficher suggestions'}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FF6B00',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gradientHeader: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    paddingBottom: 32,
  },
  historyBar: {
    backgroundColor: '#fff',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 107, 0, 0.1)',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 0, 0.1)',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
  },
  historyButtonActive: {
    backgroundColor: 'rgba(255, 107, 0, 0.2)',
    borderWidth: 1,
    borderColor: '#FF6B00',
  },
  historyButtonText: {
    marginLeft: 8,
    color: '#FF6B00',
    fontWeight: '600',
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B00',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
  },
  newChatButtonText: {
    marginLeft: 8,
    color: '#fff',
    fontWeight: '600',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginVertical: 6,
    maxWidth: '85%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userBubble: {
    backgroundColor: '#FF6B00',
    alignSelf: 'flex-end',
    borderTopRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#f8f9fa',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#fff',
  },
  botMessageText: {
    color: '#1a1a1a',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 107, 0, 0.1)',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    fontSize: 16,
    color: '#1a1a1a',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 107, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionsContainer: {
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: 'rgba(255, 107, 0, 0.1)',
  },
  suggestionBtn: {
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  suggestionGradient: {
    padding: 12,
  },
  suggestionText: {
    fontSize: 15,
    color: '#FF6B00',
    fontWeight: '500',
  },
  suggestionToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: 'rgba(255, 107, 0, 0.1)',
  },
  suggestionToggleText: {
    marginLeft: 8,
    color: '#FF6B00',
    fontSize: 15,
    fontWeight: '500',
  },
});

export default ChatbotScreen;
