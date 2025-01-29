import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';
import { getMessage, sendMassage } from '../controllers/message.controller.js';

const router = express.Router();

router.route('/send/:id').post(isAuthenticated, sendMassage);
router.route('/all/:id').get(isAuthenticated, getMessage);

export default router;
