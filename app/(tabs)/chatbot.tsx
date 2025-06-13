import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';

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
  const [derniereDonnee, setDerniereDonnee] = useState<DonneeConso | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [discussions, setDiscussions] = useState<{ id: string; messages: string[] }[]>([]);
  const [currentDiscussionId, setCurrentDiscussionId] = useState<string | null>(null);

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
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
            disc.id === currentDiscussionId ? { ...disc, messages: updated } : disc
          )
        );
      }
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
      'consommation', 'conso', 'énergie', 'energie', 'dépense', 'depense',
      'utilisation', 'courant', 'puissance', 'watts', 'watt', 'électrique',
      'électricité', 'appareils', 'appareil', 'total', 'consomme', 'consomment',
      'consommé', 'consommée', 'ma conso', 'conso totale', 'total actuel', 'ma consommation'
    ];

    const motsClefsTemps = ['dernière', 'derniere', 'actuelle', 'maintenant', 'présente', 'actuel', 'en ce moment'];

    const questionConso = motsClefsConso.some(mot => question.includes(mot));
    const questionTemps = motsClefsTemps.some(mot => question.includes(mot));
    const questionParAppareil = question.includes('par appareil') || question.includes('chaque appareil');

    if (questionConso && questionParAppareil && derniereDonnee) {
      let reponse = '📊 Consommation par appareil :\n';
      for (const [appareil, valeur] of Object.entries(derniereDonnee)) {
        if (appareil !== 'Consommation_totale(W)' && appareil !== 'time_info' && typeof valeur === 'number') {
          reponse += `  - ${appareil} : ${valeur} W\n`;
        }
      }
      reponse += `📅 Relevé effectué le ${derniereDonnee.time_info?.timestamp}`;
      addMessageToDiscussion(reponse);
    }
    else if (questionConso && (questionTemps || question.includes('total'))) {
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
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {discussions.length > 0 && (
        <ScrollView horizontal style={styles.historyBar}>
          {discussions.map((d) => (
            <TouchableOpacity key={d.id} onPress={() => {
              setCurrentDiscussionId(d.id);
              setChat(d.messages);
            }} style={styles.historyButton}>
              <Text>💬 {new Date(parseInt(d.id)).toLocaleTimeString()}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={createNewDiscussion} style={styles.historyButton}>
            <Text>➕ Nouvelle</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      <ScrollView style={styles.chatContainer}>
        {chat.map((line, index) => (
          <View
            key={index}
            style={[styles.messageBubble, line.startsWith('👤') ? styles.userBubble : styles.botBubble]}
          >
            <Text style={styles.messageText}>{line}</Text>
          </View>
        ))}
      </ScrollView>

      {showSuggestions && (
        <View style={styles.suggestionsContainer}>
          {questionsSuggestions.map((q, idx) => (
            <TouchableOpacity key={idx} onPress={() => traiterQuestion(q)} style={styles.suggestionBtn}>
              <Text style={styles.suggestionText}>{q}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Posez une question..."
          value={message}
          onChangeText={setMessage}
          style={styles.input}
        />
        <Button title="Envoyer" onPress={() => traiterQuestion()} />
      </View>

      <View style={styles.suggestionToggle}>
        <Button
          title={showSuggestions ? 'Masquer les suggestions' : 'Afficher suggestions'}
          onPress={() => setShowSuggestions(!showSuggestions)}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatbotScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  historyBar: {
    flexDirection: 'row',
    backgroundColor: '#f3f3f3',
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  historyButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 12,
    marginVertical: 5,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: '#d1e7ff',
    alignSelf: 'flex-end',
  },
  botBubble: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginRight: 8,
  },
  suggestionsContainer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  suggestionBtn: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 8,
    borderRadius: 6,
  },
  suggestionText: {
    fontSize: 14,
  },
  suggestionToggle: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
});
