import cron from 'node-cron';
import JobService from '../services/job.service';
import { jobQueue } from '../config/jobqueue';

const feeds = [
  'https://jobicy.com/?feed=job_feed',
  'https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time',
  'https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france',
  'https://jobicy.com/?feed=job_feed&job_categories=design-multimedia',
  'https://jobicy.com/?feed=job_feed&job_categories=data-science',
  'https://jobicy.com/?feed=job_feed&job_categories=copywriting',
  'https://jobicy.com/?feed=job_feed&job_categories=business',
  'https://jobicy.com/?feed=job_feed&job_categories=management',
];

export const jobCron = () => {
  cron.schedule('0 * * * *', async () => {
    console.log('Job cron started at', new Date().toISOString());
    for (const feedUrl of feeds) {
      try {
        const jobServices = await JobService.getJobServices(feedUrl);
        jobQueue.add('job-' + feedUrl, {
          feedUrl: feedUrl,
          msg: 'Hello from BullMQ!' + feedUrl,
          timestamp: new Date().toISOString(),
          data: jobServices.jobs,
        });
      } catch (error) {
        console.error(`Error processing feed`, error);
      }
    }
  });
};
