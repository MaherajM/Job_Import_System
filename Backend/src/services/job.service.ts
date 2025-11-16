import axios from 'axios';
import { xmlToJson } from '../utils/xml.utils';
import { JobModel } from '../models/job.model';
import { ImportLogsModel } from '../models/import_logs';

interface Iargs {
  page: number;
  limit: number;
}

export const asyncForEach = async <T>(
  array: T[],
  callback: (item: T, index: number, array: T[]) => Promise<void>,
): Promise<void> => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

class JobService {
  async getPaginatedJobsService(args: Iargs): Promise<any> {
    try {
      const { page, limit } = args;
      const skip = (page - 1) * limit;
      const jobs = await JobModel.find().skip(skip).limit(limit).lean().exec();
      const totalJobs = await JobModel.countDocuments();
      return {
        message: 'Paginated jobs fetched successfully',
        jobs,
        totalPages: Math.ceil(totalJobs / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error('Error fetching paginated jobs:', error);
      throw new Error('Failed to fetch paginated jobs');
    }
  }

  async getJobServices(apiUrl: string): Promise<any> {
    try {
      const response = await axios.get(apiUrl);
      const jsonData = xmlToJson(response.data);
      const jobs = jsonData.rss.channel.item || [];
      console.log('jobs:LOGS ', jobs);

      const finalJobs = jobs.map((job: any) => ({
        title: job.title,
        jobId: job.id,
        link: job.link,
        pubDate: job.pubDate,
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

  async importJobs(jobs: any, counts: any) {
    try {
      let stats = {
        created: 0,
        updated: 0,
        processed: 0,
        failed: 0,
        total: jobs.data.length,
      };

      let failedJobs: any[] = [];

      await asyncForEach(jobs.data, async (job: any) => {

        console.log("Importing Job ID pubDate:", job);
          
        try {
          const existing = await JobModel.findOne({ 'guid.text': job.guid.text }).lean();

          await JobModel.findOneAndUpdate({ 'guid.text': job.guid.text }, job, {
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
          stats.failed += 1;
          failedJobs.push({
            jobId: job.jobId,
            reason: err.message,
          });
        }
      });

      console.log('DEBUG JOBS', {
        totalFetched: stats.total,
        totalImported: stats.created,
        failedCount: stats.failed,
        newJobs: stats.created,
        updatedJobs: stats.updated,
        feedURL: jobs.feedUrl,
      });

      return {
        message: 'Job created or updated successfully',
        feedURL: jobs.feedUrl,
        totalFetched: stats.total,
        totalImported: stats.processed,
        newJobs: stats.created,
        updatedJobs: stats.updated,
        failedCount: stats.failed,
        failedJobs: failedJobs,
        jobSummary: stats,
      };
    } catch (error) {
      console.error('Error creating or updating job:', error.message);
      return {
        error: true,
        bullWorkerError: {
          reason: error.message,
          stack: error.stack,
        },
      };
    }
  }
}

export default new JobService();
