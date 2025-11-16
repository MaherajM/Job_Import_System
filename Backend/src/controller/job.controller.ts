import { Request, Response } from 'express';
import JobService from '../services/job.service';

class JobController {
  async getJobPaginatedController(req: Request, res: Response): Promise<void> {
    const { page = '1', limit = '10' } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

   let args = {
      page: pageNumber,
      limit: limitNumber,
   };

    try {
      const paginatedJobs = await JobService.getPaginatedJobsService(args);
      res.status(200).json(paginatedJobs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch paginated jobs' });
    }
  }

  async getJobController(req: Request, res: Response): Promise<void> {
    const { job_categories, job_types, search_region } = req.query;
    let apiUrl = 'https://jobicy.com/?feed=job_feed';

    const params = [];
    if (job_categories) params.push(`job_categories=${job_categories}`);

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
