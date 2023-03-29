import { NotificationsBridgeService } from './notifications/BridgeService';
import { FilesBridgeService } from './files/BridgeService';

export const ServiceBridge = {
  notifications: NotificationsBridgeService,
  files: FilesBridgeService,
};
