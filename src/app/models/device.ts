import {Sensor} from './sensor';

export interface Device {
  id: number;
  macAddress: string;
  status: string;
  location: string;
  sensors: Sensor[];
  selected?: boolean;
}
