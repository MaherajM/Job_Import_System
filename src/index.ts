import logger from './lib/logger';

import * as DBUtils from './lib/db.utils';
import * as ServerUtils from './utils/server.utils';
import config from './config/config';

import { jobCron } from "./cron/job.cron";
import "./config/job.worker";

void (async () => {
  await DBUtils.connect();

  jobCron();

  ServerUtils.createServer()
    .then((app) => {
      const PORT = config.PORT || 5050;
      app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
      });
    })
    .catch((error) => {
      logger.error('Error starting server:', error);
      process.exit(1);
    });
})();


// import { jobQueue } from "./config/jobqueue";

// async function runPOC() {
//   console.log("🚀 Adding job to queue...");

//   jobQueue.add("fetch-job", {
//     msg: "Hello from BullMQ!",
//     timestamp: new Date().toISOString(),
//   });

//   jobQueue.add("fetch-job-2", {
//     msg: "Hello from BullMQ!-2",
//     timestamp: new Date().toISOString(),
//   });

//   console.log("📥 Job added!");
// }

// runPOC();