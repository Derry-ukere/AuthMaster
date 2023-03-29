import cors from 'cors';
import express from 'express';
import { handleRouteError } from '@handlers/RouteHandlers';
import combinedModuleRoutes from '@modules/index';

const router: express.Router = express.Router();

router.use(cors());

router.use('/health', (req, res) => {
  res.send({ status: 'OK' });
});

router.use(combinedModuleRoutes);

router.use(handleRouteError);

export default router;
