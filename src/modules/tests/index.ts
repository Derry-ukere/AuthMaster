import { USER_PERMS } from '@constants/permissions';
import { RoleTypes, Security } from '@middlewares/Security';
import express from 'express';
import { TestController } from './TestsController';
import { validateTestcreation } from './validations';

const router = express.Router();

router.post('/create', validateTestcreation(), Security.requiresRolePermissions(RoleTypes.ROLE_USER, [USER_PERMS.FULL_LOGIN]), TestController.createTest);
router.get('/tests', Security.requiresRolePermissions(RoleTypes.ROLE_USER, [USER_PERMS.FULL_LOGIN]), TestController.getAllTests);
router.get('/tests/:id/results', Security.requiresRolePermissions(RoleTypes.ROLE_USER, [USER_PERMS.FULL_LOGIN]), TestController.getTestResult);
router.get('/tests/attach', Security.requiresRolePermissions(RoleTypes.ROLE_USER, [USER_PERMS.FULL_LOGIN]), TestController.getAttachTests);
router.post('/tests/attach', Security.requiresRolePermissions(RoleTypes.ROLE_USER, [USER_PERMS.FULL_LOGIN]), TestController.attachTest);
router.get('/tests/scheduled/details', Security.requiresRolePermissions(RoleTypes.ROLE_USER, [USER_PERMS.FULL_LOGIN]), TestController.getScheduledTest);
router.post('/tests/:id/start', Security.requiresRolePermissions(RoleTypes.ROLE_USER, [USER_PERMS.FULL_LOGIN]), TestController.startTest);
router.post('/tests/:id/end', Security.requiresRolePermissions(RoleTypes.ROLE_USER, [USER_PERMS.FULL_LOGIN]), TestController.endTest);
router.post('/tests/results/:id/progress', Security.requiresRolePermissions(RoleTypes.ROLE_USER, [USER_PERMS.FULL_LOGIN]), TestController.restartTest);
router.post('/proctor', Security.requiresRolePermissions(RoleTypes.ROLE_USER, [USER_PERMS.FULL_LOGIN]), TestController.addProctor);

export default router;
