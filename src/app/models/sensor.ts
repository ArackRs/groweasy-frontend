import {Config} from './config';

export interface Sensor {
  id: number;
  type: string;
  status: string;
  deviceId: number;
  config: Config;
}
