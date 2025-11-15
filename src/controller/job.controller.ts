import { Request, Response } from 'express';
import JobService from '../services/job.service';

class JobController {
  async getJobController(req: Request, res: Response): Promise<void> {
    const { job_categories, job_types, search_region } = req.query;
    let apiUrl = 'https://jobicy.com/?feed=job_feed';
    // let apiUrl = 'https://www.higheredjobs.com/rss/articleFeed.cfm';

    const params = [];
    if (job_categories) params.push(`job_categories=${job_categories}`);
    // if (job_types) params.push(`job_types=${job_types}`);
    // if (search_region) params.push(`search_region=${search_region}`);

    if (!apiUrl) {
      res.status(400).json({ error: 'apiUrl query parameter is required' });
      return;
    }
    try {
      const jobServices = await JobService.getJobServices(apiUrl);
      res.status(200).json(jobServices);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch job services' });
    }
  }
}

export default new JobController();
