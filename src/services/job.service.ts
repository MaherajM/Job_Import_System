import axios from 'axios';
import { xmlToJson } from '../utils/xml.utils';
import { JobModel } from '../models/job.model';

class JobService {
  async getJobServices(apiUrl: string): Promise<any> {
    try {
      const response = await axios.get(apiUrl);
      const jsonData = xmlToJson(response.data);
      console.log("Fetched Data:", response);
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
}

export default new JobService();
