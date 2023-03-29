import express from 'express';
import { USER_PERMS } from '@constants/permissions';
import { RoleTypes, Security } from '@middlewares/Security';
import { JobsController } from './JobsController';
import { validateJobcreation, validateJobupdate } from './validations';

const router = express.Router();

router.post('/create', validateJobcreation(), Security.requiresRolePermissions(RoleTypes.ROLE_USER, [USER_PERMS.FULL_LOGIN]), JobsController.createJob);

router.get('/all', Security.requiresRolePermissions(RoleTypes.ROLE_USER, [USER_PERMS.FULL_LOGIN]), JobsController.getAllJob);

router.get('/all/:id', Security.requiresRolePermissions(RoleTypes.ROLE_USER, [USER_PERMS.FULL_LOGIN]), JobsController.getJobById);

router.post('/all/:id', Security.requiresRolePermissions(RoleTypes.ROLE_USER, [USER_PERMS.FULL_LOGIN]), JobsController.publishJobById);

router.patch('/all/:id', validateJobupdate(), Security.requiresRolePermissions(RoleTypes.ROLE_USER, [USER_PERMS.FULL_LOGIN]), JobsController.updateJob);

router.delete('/all/:id', Security.requiresRolePermissions(RoleTypes.ROLE_USER, [USER_PERMS.FULL_LOGIN]), JobsController.deleteJob);

export default router;
