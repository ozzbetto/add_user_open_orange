import { Router } from 'express';
import {
  getRemissions,
  getRemissionById,
  createRemission,
  updateRemission,
  deleteRemission,
  downloadRemissionPDF,
} from '../controllers/remission.controller.js';

const router = Router();

router.get('/', getRemissions);
router.get('/:id', getRemissionById);
router.post('/', createRemission);
router.put('/:id', updateRemission);
router.delete('/:id', deleteRemission);
router.get('/:id/pdf', downloadRemissionPDF);

export default router;
