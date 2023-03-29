import moment from 'moment';

export interface ICronJob {
  cronTime: string | Date | moment.Moment;
  description?: string;
  job(): void;
}
