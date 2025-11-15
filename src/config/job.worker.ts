import { Worker, Job } from 'bullmq';
import JobService from '../services/job.service';
import { jobQueue } from './jobqueue';
import config from './config';

export const jobWorker = new Worker(
  'job-queue',
  async (job: Job) => {
    try {
      const counts = await jobQueue.getJobCounts();
      const failed = await jobQueue.getFailed();
      //   console.log('📊 Current Job Counts:', counts);
      const reasons = failed.map((fj) => ({
        jobId: fj.id,
        reason: fj.failedReason,
      }));
      const reasonsSummary = failed
        .map((fj) => `- Failed Job ID: ${fj.id}, Reason: ${fj.failedReason}`)
        .join('\n');
      console.log('DEBUG MAIN', reasons, failed.length);
      //   console.log('👷 Worker Processing Job:', job.id);
      // console.log("Job Data:", job.data);
      console.log('Job Data full:', job.data);

      await new Promise((res) => setTimeout(res, 5000));

      console.log('✅ Job Completed:', job.id);

      if (job?.data?.data?.length > 0) {
        const result = await JobService.importJobs(job.data, counts);
        console.log('Import >>>>', result);

      } else {
        console.log('No jobs to import for job id:', job.id);
      }

      return { status: 'done' };
    } catch (error) {
      console.error('Error in job worker:', error);
      return {
        error: true,
        message: error.message,
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

jobWorker.on('completed', async (job) => {
  console.log('progress log while completed >>>>', job.id);
});

jobWorker.on('failed', (job, err) => {
  console.log('error log while failed', job?.data);
  console.error(`Worker: Job ${job?.id} failed`, err);
});
