import { useEffect } from 'react';
import { connectMqtt, disconnectMqtt } from '../lib/mqttClient';

export const useLiveTelemetry = () => {
  useEffect(() => {
    connectMqtt();
    return () => {
      disconnectMqtt();
    };
  }, []);
};
