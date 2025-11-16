import { Router } from 'express';
import ImportLogsController from '../controller/import_logs.controller';
const router = Router();

router.get('/logs/health', (req, res) => {
  res.send({
    status: 'Alive',
    timestamp: new Date().toISOString(),
    message: 'Job Import logs routes are healthy',
  });
});
router.get('/',  ImportLogsController.getImportLogs);

export default router;