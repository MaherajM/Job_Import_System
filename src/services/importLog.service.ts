import { ImportLogsModel } from "../models/import_logs";

export const logImportStats = async (stats: {
  totalFetched: number;
  totalImported: number;
  newJobs: number;
  updatedJobs: number;
  failedJobs: { jobId: string; reason: string }[];
}) => {
  try {
    const logEntry = new ImportLogsModel({
      totalFetched: stats.totalFetched,
      totalImported: stats.totalImported,
      newJobs: stats.newJobs,
      updatedJobs: stats.updatedJobs,
      failedJobs: stats.failedJobs,
    });
    await logEntry.save();
    console.log('Import log saved successfully');
  } catch (error) {
    console.error('Error saving import log:', error);
  }
};