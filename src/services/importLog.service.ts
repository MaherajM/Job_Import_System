import { IImportLogSchema, ImportLogsModel } from '../models/import_logs';

interface Iargs {
  page: number;
  limit: number;
}
class ImportLogService {
  async createImportLog(logData: IImportLogSchema) {
    try {
      const importLog = await ImportLogsModel.create(logData);
      return importLog;
    } catch (error) {
      throw new Error('Failed to save import log');
    }
  }
  async getAllLogs(args: Iargs) {
    try {
      const { page, limit } = args;
      const skip = (page - 1) * limit;

      const fetchLogs = await ImportLogsModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
      const totalLogs = await ImportLogsModel.countDocuments();

      return {
        message: 'Import logs fetched successfully',
        logs: fetchLogs,
        page,
        limit,
        total: totalLogs,
        totalPages: Math.ceil(totalLogs / limit),
      };
    } catch (error: any) {
      console.error('Error fetching import logs:', error.message);
      throw new Error('Could not fetch import logs');
    }
  }

  async getLogsByFeed(feedURL: string) {
    try {
      return await ImportLogsModel.find({ feedURL }).sort({ createdAt: -1 });
    } catch (error: any) {
      throw new Error('Could not fetch logs for feed');
    }
  }
}
export default new ImportLogService();
