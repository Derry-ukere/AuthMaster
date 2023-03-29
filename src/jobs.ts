import cron from 'cron';
import moment from 'moment';
import { ICronJob } from './interfaces/ICronJobs';

/* istanbul ignore next */
export const processCronJobs = (cronJobs: ICronJob[]) => {
  cronJobs.forEach(cronJob => {
    const cronTime = cronJob.cronTime;

    if (moment.isMoment(cronTime) && (<moment.Moment>cronTime).isBefore(new Date())) {
      return;
    }

    new cron.CronJob(cronJob.cronTime as any, () => cronJob.job()).start();
  });
};

/* istanbul ignore next */
export const initCronJobs = () => {
  // prettier-ignore
  const CronJobs: ICronJob[] = [
    // Register cron jobs here
  ];

  processCronJobs(CronJobs);
};
