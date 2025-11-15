import axios from 'axios';
import { xmlToJson } from '../utils/xml.utils';
import { JobModel } from '../models/job.model';
import { ImportLogsModel } from '../models/import_logs';

export const asyncForEach = async <T>(
  array: T[],
  callback: (item: T, index: number, array: T[]) => Promise<void>,
): Promise<void> => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

class JobService {
  async getJobServices(apiUrl: string): Promise<any> {
    try {
      const response = await axios.get(apiUrl);
      const jsonData = xmlToJson(response.data);
      const jobs = jsonData.rss.channel.item || [];
      const finalJobs = jobs.map((job: any) => ({
        title: job.title,
        jobId: job.id,
        link: job.link,
        pubdate: job.pubdate,
        guid: {
          isPermaLink: job.guid['@_isPermaLink'],
          text: job.guid['#text'],
        },
        description: job.description,
        content: job['content:encoded'],
        media_content: {
          url: job['media:content'] ? job['media:content']['@_url'] : null,
          type: job['media:content'] ? job['media:content']['@_medium'] : null,
        },
        location: job['job_listing:location'],
        job_type: job['job_listing:job_type'],
        company: job['job_listing:company'],
      }));
      return {
        message: 'Job services fetched successfully',
        jobs: finalJobs,
      };
    } catch (error) {
      console.error('Error fetching job services:', error);
      throw error;
    }
  }

  async createOrUpdateJob(job: any) {
    try {
      const update = await JobModel.findOneAndUpdate({ 'guid.text': job.guid.text }, job, {
        upsert: true,
        new: true,
      })
        .lean()
        .exec();

      console.log('Job created or updated:', update);
      return {
        message: 'Job created or updated successfully',
        job: update,
      };
    } catch (error) {
      console.error('Error creating or updating job:', error);
    }
  }

  async importJobs(jobs: any, counts: any) {
    try {
      let stats = {
        created: 0,
        updated: 0,
        processed: 0,
        failed: 0,
        total: jobs.data.length,
      };

      // await ImportLogsModel.create({
      //   totalFetched: stats.total,
      //   totalImported: stats.processed,
      //   newJobs: stats.created,
      //   updatedJobs: stats.updated,
      //   failedCount: stats.failed,
      //   // failedJobs: stats.failed,
      // });

      console.log('DEBUG JOBS', jobs.url);

      await asyncForEach(jobs.data, async (job: any) => {
        try {
          const existing = await JobModel.findOne({ 'guid.text': job.guid.text }).lean();

          const update = await JobModel.findOneAndUpdate({ 'guid.text': job.guid.text }, job, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
          })
            .lean()
            .exec();

          if (existing) {
            stats.updated += 1;
          } else {
            stats.created += 1;
          }
          stats.processed += 1;
        } catch (err) {
          console.error('Error processing job:', err);
        }
      });

      return {
        message: 'Job created or updated successfully',
        jobSummary: stats,
      };
    } catch (error) {
      console.error('Error creating or updating job:', error.message);
    }
  }
}

export default new JobService();
