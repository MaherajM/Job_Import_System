import { Schema, model } from 'mongoose';

interface IImportLogSchema {
  totalFetched: number;
  totalImported: number;
  failedCount: number;
  newJobs: number;
  updatedJobs: number;
  failedJobs: [
    {
      jobId: string;
      reason: string;
    },
  ];
}

const ImportLogSchema: Schema<IImportLogSchema> = new Schema(
  {
    totalFetched: { type: Number },
    totalImported: { type: Number },
    failedCount: { type: Number },
    newJobs: { type: Number },
    updatedJobs: { type: Number },
    failedJobs: [
      {
        jobId: { type: String },
        reason: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const ImportLogsModel = model<IImportLogSchema>('import_logs', ImportLogSchema);
