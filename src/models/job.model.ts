import { Schema, model } from 'mongoose';

interface IJobSchema {
  title: string;
  jobId: number;
  link: string;
  pubdate: string;
  guid: {
    isPermaLink: boolean;
    text: string;
  };
  description: string;
  content: string;
  media_content: {
    url: string;
    type: string;
  };
  location: string;
  job_type: string;
  company: string;
}

const JobSchema: Schema<IJobSchema> = new Schema(
  {
    title: { type: String },
    jobId: { type: Number },
    link: { type: String },
    pubdate: { type: String },
    guid: {
      isPermaLink: { type: Boolean },
      text: { type: String, unique: true },
    },
    description: { type: String },
    content: { type: String },
    media_content: {
      url: { type: String },
      type: { type: String },
    },
    location: { type: String },
    job_type: { type: String },
    company: { type: String },
  },
  { timestamps: true },
);

export const JobModel = model<IJobSchema>('Job', JobSchema);
