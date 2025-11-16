import { Router } from 'express';
import JobController from '../controller/job.controller';

const router = Router();

router.get('/health', (req, res) => {
  res.send({
    status: 'Alive',
    timestamp: new Date().toISOString(),
    message: 'Job fd routes are healthy',
  });
});
router.get('/', JobController.getJobPaginatedController);

export default router;