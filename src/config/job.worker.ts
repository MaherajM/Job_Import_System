import { Worker, Job } from 'bullmq';
import JobService from '../services/job.service';
import { jobQueue } from './jobqueue';
import config from './config';
import importLogService from '../services/importLog.service';

export const jobWorker = new Worker(
  'job-queue',
  async (job: Job) => {
    try {
      const counts = await jobQueue.getJobCounts();
      const failed = await jobQueue.getFailed();
      const reasons = failed.map((fj) => ({
        jobId: fj.id,
        reason: fj.failedReason,
      }));

      console.log('DEBUG MAIN', reasons, failed.length);

      await new Promise((res) => setTimeout(res, 5000));

      if (job?.data?.data?.length > 0) {
        const result = await JobService.importJobs(job.data, counts);
        console.log('Import >>>>', result);
        return result;
      } else {
        console.log('No jobs to import for job id:', job.id);
      }
    } catch (error) {
      console.error('Error in job worker:', error);
      return {
        feedURL: job.data.feedUrl,
        error: true,
        bullWorkerError: {
          reason: error.message,
          stack: error.stack,
        },
      };
    }
  },
  {
    concurrency: config.CONFIGURABLE_CONCURRENCY ? parseInt(config.CONFIGURABLE_CONCURRENCY) : 1,
    connection: {
      host: '127.0.0.1',
      port: 6379,
    },
  },
);

jobWorker.on('completed', async (job, result) => {
  console.log('progress log while completed >>>>', result);
  await importLogService.createImportLog(result);
});

jobWorker.on('failed', (job, err) => {
  console.log('error log while failed', job?.data);
  console.error(`Worker: Job ${job?.id} failed`, err);
});
