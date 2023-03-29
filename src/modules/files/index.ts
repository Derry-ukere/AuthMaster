import { USER_PERMS } from '@constants/permissions';
import { RoleTypes, Security } from '@middlewares/Security';
import express from 'express';
import { FilesController } from './FilesController';
import { validateGeneratePresignedUrl } from './validations';

const router = express.Router();

router.post(
  '/me/upload/generate-presigned-url',
  Security.requiresRolePermissions(RoleTypes.ROLE_USER, [USER_PERMS.FULL_LOGIN], false),
  validateGeneratePresignedUrl(),
  FilesController.generatePresignedUrl,
);

export default router;
