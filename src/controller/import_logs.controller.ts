import ImportLogService from '../services/importLog.service';
import { Request, Response } from 'express';

class ImportLogsController {
  async getImportLogs(req: Request, res: Response) {
    try {
      const { page = '1', limit = '10' } = req.query;
      const pageNumber = parseInt(page as string, 10);
      const limitNumber = parseInt(limit as string, 10);

      let args = {
        page: pageNumber,
        limit: limitNumber,
      };

      const logs = await ImportLogService.getAllLogs(args);
      res.status(200).json(logs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch import logs' });
    }
  }

  async getLogsByFeed(req: Request, res: Response) {
    const { feedURL } = req.query;
    if (!feedURL || typeof feedURL !== 'string') {
      res.status(400).json({ error: 'feedURL query parameter is required' });
      return;
    }
    try {
      const logs = await ImportLogService.getLogsByFeed(feedURL);
      res.status(200).json(logs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch logs for the specified feed' });
    }
  }
}

export default new ImportLogsController();
