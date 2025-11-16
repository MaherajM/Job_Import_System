import { Router } from 'express';
import JobRoutes from './job.routes';
import ImportLogsRoutes from './import_logs.routes';
const router = Router();

router.use('/jobs', JobRoutes);
router.use('/logs', ImportLogsRoutes);

export default router;
