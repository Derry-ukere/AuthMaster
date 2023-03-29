import express from 'express';
import { NotificationsController } from './NotificationsController';

const router = express.Router();

router.get('/email/preview', NotificationsController.previewEmailTemplate);

router.get('/email/ubsubscribe', NotificationsController.unsubscribeEmail);

export default router;
