import { useEffect, useState, useRef } from 'react';

type TimeInfo = {
  timestamp?: string;
  date?: string;
  time?: string;
  day_name?: string;
  is_weekend?: boolean;
  moment_de_la_journee?: string;
};

type DeviceDataset = {
  [deviceName: string]: number;
};

type WebSocketData = {
  type: 'complete_dataset_update' | 'device_update';
  dataset_format?: DeviceDataset;
  active_devices_list?: DeviceDataset;
  'Consommation_totale(W)'?: number;
  time_info?: TimeInfo;
};

export function usePowerMonitoring(webSocketUri: string) {
  const [connectionStatus, setConnectionStatus] = useState<
    'connected' | 'disconnected'
  >('disconnected');
  const [totalConsumption, setTotalConsumption] = useState<number>(0);
  const [activeDevices, setActiveDevices] = useState<DeviceDataset>({});
  const [timeInfo, setTimeInfo] = useState<TimeInfo>({});
  const [datasetFormat, setDatasetFormat] = useState<DeviceDataset>({});
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!webSocketUri) return;

    const socket = new WebSocket(webSocketUri);
    socketRef.current = socket;

    socket.onopen = () => {
      setConnectionStatus('connected');
    };

    socket.onclose = () => {
      setConnectionStatus('disconnected');
      setActiveDevices({});
      setDatasetFormat({});
      setTotalConsumption(0);
    };

    socket.onerror = (err) => {
      console.error('WebSocket error', err);
      setConnectionStatus('disconnected');
    };

    socket.onmessage = (event) => {
      try {
        const data: WebSocketData = JSON.parse(event.data);

        setTotalConsumption(data['Consommation_totale(W)'] || 0);
        if (data.time_info) {
          setTimeInfo(data.time_info);
        }

        if (data.type === 'complete_dataset_update' && data.dataset_format) {
          const filtered = Object.fromEntries(
            Object.entries(data.dataset_format).filter(
              ([key, val]) =>
                ![
                  'timestamp',
                  'moment_de_la_journee',
                  'Consommation_totale(W)',
                ].includes(key) && val > 0
            )
          );
          setDatasetFormat(data.dataset_format);
          setActiveDevices(filtered);
        }

        if (data.type === 'device_update' && data.active_devices_list) {
          setActiveDevices(data.active_devices_list);
        }
      } catch (e) {
        console.error('Erreur de parsing WebSocket :', e);
      }
    };

    return () => {
      socket.close();
    };
  }, [webSocketUri]);

  return {
    connectionStatus,
    totalConsumption,
    activeDevices,
    datasetFormat,
    timeInfo,
  };
}
