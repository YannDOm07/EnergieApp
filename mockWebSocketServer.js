const WebSocket = require('ws');

// Port du serveur WebSocket
const PORT = 8080;

// Création du serveur WebSocket
const wss = new WebSocket.Server({ port: PORT });

console.log(`✅ Serveur WebSocket démarré sur ws://localhost:${PORT}`);

wss.on('connection', (ws) => {
  console.log('🟢 Client connecté');

  // Envoi d’un message toutes les 5 secondes
  const interval = setInterval(() => {
    const consommation = (Math.random() * 1000 + 100).toFixed(2); // consommation entre 100W et 1100W
    const timestamp = new Date().toISOString();

    const message = {
      timestamp,
      "Consommation_totale(W)": parseFloat(consommation),
    };

    const messageStr = JSON.stringify(message);

    ws.send(messageStr); // Envoie au client
    console.log(`📤 Envoyé à ${new Date().toLocaleTimeString()}: ${messageStr}`); // Affichage console
  }, 5000);

  ws.on('close', () => {
    console.log('🔴 Client déconnecté');
    clearInterval(interval);
  });
});
