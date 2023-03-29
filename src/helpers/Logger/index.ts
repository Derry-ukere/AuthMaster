import { LoggerFactory } from './LoggerFactory';

const Logger = LoggerFactory.configure({
  id: 'hc-vip-backend',
  level: 'all',
});

export { Logger };
