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