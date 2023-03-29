import express, { Router } from 'express';
import notificationsModule from './notifications';
import usersModule from './users';
import jobsModule from './jobs';
import testsModule from './tests';

const router = express.Router();

// prettier-ignore
const moduleRoutes: { path: string; module: Router }[] = [
  {
    path: '/notifications',
    module: notificationsModule
  },
  {
    path: '/users',
    module: usersModule,
  },
  {
    path: '/jobs',
    module: jobsModule,
  },
  {
    path: '/testing',
    module: testsModule
  }
];

moduleRoutes.forEach(({ path, module }) => router.use(path, module));

export default router;
