const WebSocket = require('ws');

// Adresse du serveur WebSocket
const SERVER_URL = 'ws://localhost:8080';

// Connexion au serveur
const ws = new WebSocket(SERVER_URL);

ws.on('open', () => {
  console.log('✅ Connecté au serveur WebSocket');
});

ws.on('message', (data) => {
  try {
    const message = JSON.parse(data);
    console.log(`📥 Reçu à ${new Date().toLocaleTimeString()}:`, message);
  } catch (error) {
    console.error('❌ Erreur de parsing JSON :', error);
  }
});

ws.on('close', () => {
  console.log('🔴 Déconnecté du serveur');
});

ws.on('error', (error) => {
  console.error('❗ Erreur WebSocket :', error.message);
});
