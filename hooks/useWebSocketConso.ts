import { useEffect, useState, useRef } from 'react';

type DonneeConso = {
  'Consommation_totale(W)': number;
  time_info: {
    timestamp: string;
    moment_de_la_journee: string;
  };
  [key: string]: any;
};

export function useWebSocketConso() {
  const [donnee, setDonnee] = useState<DonneeConso | null>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://192.168.43.254:8765/ws');

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setDonnee(data);
      } catch (err) {
        console.error('Erreur WebSocket:', err);
      }
    };

    ws.current.onerror = () => console.error('WebSocket error');
    ws.current.onclose = () => console.warn('WebSocket closed');

    return () => {
      ws.current?.close();
    };
  }, []);

  return donnee;
}
