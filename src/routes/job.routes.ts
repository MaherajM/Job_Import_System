import { Router } from 'express';
import JobController from '../controller/job.controller';

const router = Router();

router.get('/health', (req, res) => {
  res.send({
    status: 'Alive',
    timestamp: new Date().toISOString(),
    message: 'Job routes are healthy',
  });
});
router.get('/jobs', JobController.getJobController);

export default router;